import { randomUUID } from "node:crypto";

import type { PrismaClient } from "@calcom/prisma";
import { RecallChannel, RecallHistoryStatus } from "@calcom/prisma/enums";

import { createSmsService } from "../smart-fill/sms/mock-sms-service";
import type { SmsService } from "../smart-fill/sms/sms-service.interface";
import type { RecallCandidate } from "./recall-candidate.service";
import { createRecallEmailTransport } from "./mock-recall-email-transport";
import type { RecallEmailTransport } from "./recall-email-transport.interface";
import { RecallSettingsService } from "./recall-settings.service";
import { renderRecallTemplate } from "./recall-template-renderer";

export type RecallMailerResult = {
  historyId: string;
  status: RecallHistoryStatus;
  channel: RecallChannel;
};

/**
 * Sends recall outreach (email + optional SMS) and writes RecallHistory audit rows.
 */
export class RecallMailerService {
  private readonly settingsService: RecallSettingsService;

  constructor(
    private readonly prisma: PrismaClient,
    private readonly emailTransport: RecallEmailTransport = createRecallEmailTransport(),
    private readonly smsService: SmsService = createSmsService()
  ) {
    this.settingsService = new RecallSettingsService(prisma);
  }

  async sendRecall(candidate: RecallCandidate): Promise<RecallMailerResult[]> {
    const settings = await this.settingsService.getOrCreateForTeam(candidate.teamId);
    const results: RecallMailerResult[] = [];

    const optOutToken = randomUUID();
    const templateContext = {
      patientName: candidate.name,
      bookingLink: this.settingsService.buildBookingLink(settings),
      practiceName: settings.practiceName ?? settings.team.name,
      optOutLink: this.settingsService.buildOptOutLink(optOutToken),
    };

    const emailResult = await this.sendEmailRecall(candidate, settings, templateContext, optOutToken);
    results.push(emailResult);

    if (settings.smsEnabled && settings.smsTemplate) {
      const smsResult = await this.sendSmsRecall(candidate, settings, templateContext);
      results.push(smsResult);
    }

    return results;
  }

  private async sendEmailRecall(
    candidate: RecallCandidate,
    settings: Awaited<ReturnType<RecallSettingsService["getOrCreateForTeam"]>>,
    templateContext: {
      patientName: string;
      bookingLink: string;
      practiceName: string;
      optOutLink: string;
    },
    optOutToken: string
  ): Promise<RecallMailerResult> {
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

    try {
      const subject = renderRecallTemplate(settings.emailSubject, templateContext);
      const html = renderRecallTemplate(settings.emailHtmlTemplate, templateContext);
      const text = renderRecallTemplate(settings.emailTextTemplate ?? "", templateContext);

      await this.emailTransport.send({
        to: candidate.email,
        subject,
        html,
        text: text || undefined,
      });

      await this.prisma.recallHistory.update({
        where: { id: history.id },
        data: { status: RecallHistoryStatus.SENT, sentAt: new Date(), error: null },
      });

      return { historyId: history.id, status: RecallHistoryStatus.SENT, channel: RecallChannel.EMAIL };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      await this.prisma.recallHistory.update({
        where: { id: history.id },
        data: { status: RecallHistoryStatus.FAILED, error: message },
      });
      return { historyId: history.id, status: RecallHistoryStatus.FAILED, channel: RecallChannel.EMAIL };
    }
  }

  private async sendSmsRecall(
    candidate: RecallCandidate,
    settings: Awaited<ReturnType<RecallSettingsService["getOrCreateForTeam"]>>,
    templateContext: {
      patientName: string;
      bookingLink: string;
      practiceName: string;
      optOutLink: string;
    }
  ): Promise<RecallMailerResult> {
    const history = await this.prisma.recallHistory.create({
      data: {
        teamId: candidate.teamId,
        patientId: candidate.patientId,
        channel: RecallChannel.SMS,
        status: RecallHistoryStatus.PENDING,
        recallDueDate: candidate.recallDueDate,
      },
    });

    try {
      const body = renderRecallTemplate(settings.smsTemplate ?? "", templateContext);
      await this.smsService.send({
        to: candidate.phoneNumber,
        body,
        teamId: candidate.teamId,
        metadata: { recallHistoryId: history.id, patientId: candidate.patientId },
      });

      await this.prisma.recallHistory.update({
        where: { id: history.id },
        data: { status: RecallHistoryStatus.SENT, sentAt: new Date(), error: null },
      });

      return { historyId: history.id, status: RecallHistoryStatus.SENT, channel: RecallChannel.SMS };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      await this.prisma.recallHistory.update({
        where: { id: history.id },
        data: { status: RecallHistoryStatus.FAILED, error: message },
      });
      return { historyId: history.id, status: RecallHistoryStatus.FAILED, channel: RecallChannel.SMS };
    }
  }
}
