import { WEBAPP_URL } from "@calcom/lib/constants";
import type { PrismaClient } from "@calcom/prisma";

import {
  DEFAULT_RECALL_EMAIL_HTML,
  DEFAULT_RECALL_EMAIL_SUBJECT,
  DEFAULT_RECALL_EMAIL_TEXT,
  DEFAULT_RECALL_SMS_TEMPLATE,
} from "./recall-default-templates";

export class RecallSettingsService {
  constructor(private readonly prisma: PrismaClient) {}

  async getOrCreateForTeam(teamId: number) {
    const existing = await this.prisma.recallSettings.findUnique({
      where: { teamId },
      include: { team: { select: { name: true, slug: true } }, eventType: { select: { slug: true } } },
    });

    if (existing) {
      return existing;
    }

    const team = await this.prisma.team.findUnique({
      where: { id: teamId },
      select: { name: true },
    });

    return this.prisma.recallSettings.create({
      data: {
        teamId,
        practiceName: team?.name ?? "Ihre Zahnarztpraxis",
        emailSubject: DEFAULT_RECALL_EMAIL_SUBJECT.replace("[PraxisName]", team?.name ?? "Ihre Praxis"),
        emailHtmlTemplate: DEFAULT_RECALL_EMAIL_HTML,
        emailTextTemplate: DEFAULT_RECALL_EMAIL_TEXT,
        smsTemplate: DEFAULT_RECALL_SMS_TEMPLATE,
      },
      include: { team: { select: { name: true, slug: true } }, eventType: { select: { slug: true } } },
    });
  }

  buildBookingLink(settings: {
    bookingSlug: string | null;
    eventType: { slug: string } | null;
    team: { slug: string | null };
  }): string {
    const base = WEBAPP_URL.replace(/\/$/, "");

    if (settings.bookingSlug) {
      return `${base}/${settings.bookingSlug}`;
    }

    if (settings.eventType?.slug && settings.team.slug) {
      return `${base}/team/${settings.team.slug}/${settings.eventType.slug}`;
    }

    if (settings.team.slug) {
      return `${base}/team/${settings.team.slug}`;
    }

    return base;
  }

  buildOptOutLink(token: string): string {
    const base = WEBAPP_URL.replace(/\/$/, "");
    return `${base}/api/recall/opt-out?token=${encodeURIComponent(token)}`;
  }
}
