import { beforeEach, describe, expect, it, vi } from "vitest";

const mockEncryptModelWriteData = vi.fn(async (_prisma, _resolver, model, data) => ({
  ...data,
  [`${model}-encrypted`]: true,
}));

vi.mock("./model-crypto", () => ({
  encryptModelWriteData: (...args: unknown[]) => mockEncryptModelWriteData(...args),
}));

import { encryptNestedWrites } from "./nested-writes";

describe("nested-writes", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("encrypts attendees.createMany.data rows", async () => {
    const result = await encryptNestedWrites({} as never, {} as never, {
      title: "Kontrolle",
      attendees: {
        createMany: {
          data: [{ email: "a@example.com", name: "A" }],
        },
      },
    });

    const attendee = (result.attendees as { createMany: { data: Record<string, unknown>[] } }).createMany
      .data[0];

    expect(attendee["Attendee-encrypted"]).toBe(true);
    expect(mockEncryptModelWriteData).toHaveBeenCalledWith(
      expect.anything(),
      expect.anything(),
      "Attendee",
      expect.objectContaining({ email: "a@example.com" })
    );
  });

  it("leaves unrelated fields unchanged", async () => {
    const result = await encryptNestedWrites({} as never, {} as never, {
      title: "Kontrolle",
    });

    expect(result).toEqual({ title: "Kontrolle" });
    expect(mockEncryptModelWriteData).not.toHaveBeenCalled();
  });
});
