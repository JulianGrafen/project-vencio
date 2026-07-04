import { randomUUID } from "node:crypto";

import type { PrismaClient } from "@calcom/prisma";
import { RecallChannel, RecallHistoryStatus } from "@calcom/prisma/enums";

import { createDentalLogger } from "../resilience/dental-logger";
import { retryWithBackoffResult } from "../resilience/retry-with-backoff";
import type { Result } from "../resilience/result";
import { err, ok } from "../resilience/result";
import { createSmsService } from "../smart-fill/sms/mock-sms-service";
import type { SmsService } from "../smart-fill/sms/sms-service.interface";
import type { RecallCandidate } from "./recall-candidate.service";
import { ZRecallCandidate } from "./recall.schemas";
import { createRecallEmailTransport } from "./mock-recall-email-transport";
import type { RecallEmailTransport } from "./recall-email-transport.interface";
import { RecallSettingsService } from "./recall-settings.service";
import { renderRecallTemplate } from "./recall-template-renderer";

export type RecallMailerResult = {
  historyId: string;
  status: RecallHistoryStatus;
  channel: RecallChannel;
};

type TemplateContext = {
  patientName: string;
  bookingLink: string;
  practiceName: string;
  optOutLink: string;
};

/**
 * Sends recall outreach (email + optional SMS) and writes RecallHistory audit rows.
 * Uses guard clauses, Zod validation, retry on external sends, and atomic status updates.
 */
export class RecallMailerService {
  private readonly settingsService: RecallSettingsService;
  private readonly log = createDentalLogger({ module: "recall-mailer" });

  constructor(
    private readonly prisma: PrismaClient,
    private readonly emailTransport: RecallEmailTransport = createRecallEmailTransport(),
    private readonly smsService: SmsService = createSmsService()
  ) {
    this.settingsService = new RecallSettingsService(prisma);
  }

  async sendRecall(candidate: RecallCandidate): Promise<Result<RecallMailerResult[], string>> {
    const parsed = ZRecallCandidate.safeParse(candidate);
    if (!parsed.success) {
      this.log.warn("Invalid recall candidate", { issues: parsed.error.flatten() });
      return err(`Invalid recall candidate: ${parsed.error.message}`);
    }

    const validCandidate = parsed.data;

    if (!validCandidate.email?.trim()) {
      return err("Patient email is required for recall");
    }

    try {
      const settings = await this.settingsService.getOrCreateForTeam(validCandidate.teamId);
      const results: RecallMailerResult[] = [];

      const optOutToken = randomUUID();
      const templateContext: TemplateContext = {
        patientName: validCandidate.name,
        bookingLink: this.settingsService.buildBookingLink(settings),
        practiceName: settings.practiceName ?? settings.team.name ?? "Ihre Praxis",
        optOutLink: this.settingsService.buildOptOutLink(optOutToken),
      };

      const emailResult = await this.sendEmailRecall(validCandidate, settings, templateContext, optOutToken);
      if (!emailResult.success) {
        return emailResult;
      }
      results.push(emailResult.data);

      if (settings.smsEnabled && settings.smsTemplate?.trim()) {
        const smsResult = await this.sendSmsRecall(validCandidate, settings, templateContext);
        if (smsResult.success) {
          results.push(smsResult.data);
        } else {
          this.log.warn("SMS recall failed after email succeeded", {
            teamId: validCandidate.teamId,
            patientId: validCandidate.patientId,
            error: smsResult.error,
          });
        }
      }

      return ok(results);
    } catch (error) {
      this.log.error("sendRecall failed", error, {
        teamId: validCandidate.teamId,
        patientId: validCandidate.patientId,
      });
      return err(error instanceof Error ? error.message : String(error));
    }
  }

  private async sendEmailRecall(
    candidate: RecallCandidate,
    settings: Awaited<ReturnType<RecallSettingsService["getOrCreateForTeam"]>>,
    templateContext: TemplateContext,
    optOutToken: string
  ): Promise<Result<RecallMailerResult, string>> {
    let historyId: string;

    try {
      const history = await this.prisma.recallHistory.create({
        data: {
          teamId: candidate.teamId,
          patientId: candidate.patientId,
          channel: RecallChannel.EMAIL,
          status: RecallHistoryStatus.PENDING,
          recallDueDate: candidate.recallDueDate,
          optOutToken,
        },
      });
      historyId = history.id;
    } catch (error) {
      this.log.error("Failed to create recall history row", error, {
        teamId: candidate.teamId,
        patientId: candidate.patientId,
      });
      return err("Failed to persist recall history");
    }

    const subject = renderRecallTemplate(settings.emailSubject, templateContext);
    const html = renderRecallTemplate(settings.emailHtmlTemplate, templateContext);
    const text = renderRecallTemplate(settings.emailTextTemplate ?? "", templateContext);

    const sendResult = await retryWithBackoffResult(
      () =>
        this.emailTransport.send({
          to: candidate.email,
          subject,
          html,
          text: text || undefined,
        }),
      { maxAttempts: 3, label: "recall-email", baseDelayMs: 1000 }
    );

    if (!sendResult.success) {
      await this.markHistoryFailed(historyId, sendResult.error);
      return err(sendResult.error);
    }

    await this.markHistorySent(historyId);
    return ok({
      historyId,
      status: RecallHistoryStatus.SENT,
      channel: RecallChannel.EMAIL,
    });
  }

  private async sendSmsRecall(
    candidate: RecallCandidate,
    settings: Awaited<ReturnType<RecallSettingsService["getOrCreateForTeam"]>>,
    templateContext: TemplateContext
  ): Promise<Result<RecallMailerResult, string>> {
    if (!candidate.phoneNumber?.trim()) {
      return err("Patient phone number is required for SMS recall");
    }

    let historyId: string;

    try {
      const history = await this.prisma.recallHistory.create({
        data: {
          teamId: candidate.teamId,
          patientId: candidate.patientId,
          channel: RecallChannel.SMS,
          status: RecallHistoryStatus.PENDING,
          recallDueDate: candidate.recallDueDate,
        },
      });
      historyId = history.id;
    } catch {
      return err("Failed to persist SMS recall history");
    }

    const body = renderRecallTemplate(settings.smsTemplate ?? "", templateContext);

    const sendResult = await retryWithBackoffResult(
      () =>
        this.smsService.send({
          to: candidate.phoneNumber,
          body,
          teamId: candidate.teamId,
          metadata: { recallHistoryId: historyId, patientId: candidate.patientId },
        }),
      { maxAttempts: 3, label: "recall-sms", baseDelayMs: 1000 }
    );

    if (!sendResult.success) {
      await this.markHistoryFailed(historyId, sendResult.error);
      return err(sendResult.error);
    }

    await this.markHistorySent(historyId);
    return ok({
      historyId,
      status: RecallHistoryStatus.SENT,
      channel: RecallChannel.SMS,
    });
  }

  private async markHistorySent(historyId: string): Promise<void> {
    await this.prisma.recallHistory.update({
      where: { id: historyId },
      data: { status: RecallHistoryStatus.SENT, sentAt: new Date(), error: null },
    });
  }

  private async markHistoryFailed(historyId: string, message: string): Promise<void> {
    await this.prisma.recallHistory.update({
      where: { id: historyId },
      data: { status: RecallHistoryStatus.FAILED, error: message.slice(0, 2000) },
    });
  }
}
