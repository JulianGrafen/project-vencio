import { beforeEach, describe, expect, it, vi } from "vitest";

import { decryptKyselyBookings } from "./decrypt-kysely-bookings";

const mockDecrypt = vi.fn(async (_resolver, model, record) => {
  if (model === "Booking") {
    return { ...record, description: "decrypted-description" };
  }
  if (model === "Attendee") {
    return { ...record, email: "decrypted@example.com" };
  }
  return record;
});

vi.mock("../encryption/model-crypto", () => ({
  decryptModelReadResult: (...args: unknown[]) => mockDecrypt(...args),
}));

vi.mock("../encryption/key-resolver", () => ({
  getPracticeKeyResolver: vi.fn(() => ({})),
}));

vi.mock("./run-with-dental-context", () => ({
  runWithDentalPracticeContext: (_params: unknown, handler: () => Promise<unknown>) => handler(),
}));

describe("decryptKyselyBookings", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    delete process.env.DENTAL_ENCRYPTION_ENABLED;
  });

  it("returns bookings unchanged when encryption is disabled", async () => {
    const bookings = [
      {
        id: 1,
        description: "enc:v1:1:...",
        eventType: { teamId: 42 },
        attendees: [{ id: 1, email: "enc:v1:1:..." }],
      },
    ];

    const result = await decryptKyselyBookings(bookings);
    expect(result).toEqual(bookings);
    expect(mockDecrypt).not.toHaveBeenCalled();
  });

  it("decrypts booking and attendee fields when encryption is enabled", async () => {
    process.env.DENTAL_ENCRYPTION_ENABLED = "true";

    const bookings = [
      {
        id: 1,
        description: "enc:v1:42:...",
        eventType: { teamId: 42 },
        attendees: [{ id: 1, email: "enc:v1:42:..." }],
      },
    ];

    const result = await decryptKyselyBookings(bookings);
    expect(result[0].description).toBe("decrypted-description");
    expect(result[0].attendees[0].email).toBe("decrypted@example.com");
    expect(mockDecrypt).toHaveBeenCalledTimes(2);
  });
});
