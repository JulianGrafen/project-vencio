import { describe, expect, it, vi } from "vitest";

import { RecallHistoryStatus } from "@calcom/prisma/enums";

import { RecallOptOutService } from "./recall-opt-out.service";

const VALID_TOKEN = "550e8400-e29b-41d4-a716-446655440000";

describe("RecallOptOutService", () => {
  it("disables recall for patient by token", async () => {
    const update = vi.fn(async () => ({}));
    const prisma = {
      recallHistory: {
        findUnique: vi.fn(async () => ({
          teamId: 1,
          patient: { id: "pat-1", name: "Max", recallEnabled: true },
        })),
      },
      $transaction: vi.fn(async (fn: (tx: { smartFillPatient: { update: typeof update } }) => Promise<unknown>) =>
        fn({ smartFillPatient: { update } })
      ),
    };

    const service = new RecallOptOutService(prisma as never);
    const result = await service.optOutByToken(VALID_TOKEN);

    expect(result).toEqual({ success: true, patientName: "Max" });
    expect(update).toHaveBeenCalledWith({
      where: { id: "pat-1" },
      data: { recallEnabled: false },
    });
  });

  it("rejects invalid tokens", async () => {
    const prisma = {
      recallHistory: { findUnique: vi.fn(async () => null) },
    };

    const service = new RecallOptOutService(prisma as never);
    const result = await service.optOutByToken("bad");

    expect(result).toEqual({ success: false, reason: "invalid_token" });
  });
});

describe("RecallMailerService audit log", () => {
  it("creates PENDING then SENT history on successful email", async () => {
    const { RecallMailerService } = await import("./recall-mailer.service");

    const create = vi.fn().mockResolvedValueOnce({ id: "hist-1" });
    const update = vi.fn(async () => ({}));

    const prisma = {
      recallSettings: {
        findUnique: vi.fn(async () => null),
        create: vi.fn(async () => ({
          teamId: 1,
          enabled: true,
          intervalMonths: 6,
          toleranceDays: 3,
          bookingSlug: "prophylaxe",
          practiceName: "Test Praxis",
          emailSubject: "Recall [PatientenName]",
          emailHtmlTemplate: "Hallo [PatientenName]",
          emailTextTemplate: null,
          smsEnabled: false,
          smsTemplate: null,
          team: { name: "Test", slug: "test" },
          eventType: null,
        })),
      },
      team: { findUnique: vi.fn(async () => ({ name: "Test" })) },
      recallHistory: { create, update },
    };

    const emailTransport = {
      send: vi.fn(async () => ({ messageId: "msg-1" })),
    };

    const service = new RecallMailerService(prisma as never, emailTransport);
    const result = await service.sendRecall({
      patientId: "pat-1",
      teamId: 1,
      name: "Anna",
      email: "anna@test.de",
      phoneNumber: "+49170",
      lastVisitAt: new Date("2026-01-04"),
      recallDueDate: new Date("2026-07-04"),
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data[0].status).toBe(RecallHistoryStatus.SENT);
    }
    expect(create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ status: RecallHistoryStatus.PENDING }),
      })
    );
    expect(update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ status: RecallHistoryStatus.SENT }),
      })
    );
  });

  it("returns error and marks history FAILED when email transport fails", async () => {
    const { RecallMailerService } = await import("./recall-mailer.service");

    const create = vi.fn().mockResolvedValueOnce({ id: "hist-fail" });
    const update = vi.fn(async () => ({}));

    const prisma = {
      recallSettings: {
        findUnique: vi.fn(async () => ({
          teamId: 1,
          enabled: true,
          intervalMonths: 6,
          toleranceDays: 3,
          bookingSlug: "prophylaxe",
          practiceName: "Test Praxis",
          emailSubject: "Recall",
          emailHtmlTemplate: "Hallo",
          emailTextTemplate: null,
          smsEnabled: false,
          smsTemplate: null,
          team: { name: "Test", slug: "test" },
          eventType: null,
        })),
      },
      recallHistory: { create, update },
    };

    const emailTransport = {
      send: vi.fn(async () => {
        throw new Error("SMTP timeout");
      }),
    };

    const service = new RecallMailerService(prisma as never, emailTransport);
    const result = await service.sendRecall({
      patientId: "pat-1",
      teamId: 1,
      name: "Anna",
      email: "anna@test.de",
      phoneNumber: "+49170",
      lastVisitAt: new Date("2026-01-04"),
      recallDueDate: new Date("2026-07-04"),
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toContain("SMTP timeout");
    }
    expect(update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ status: RecallHistoryStatus.FAILED }),
      })
    );
  });
});
