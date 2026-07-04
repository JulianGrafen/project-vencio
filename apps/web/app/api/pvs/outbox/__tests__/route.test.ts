import { describe, expect, it, vi, beforeEach } from "vitest";

const mockPollPending = vi.fn(async () => ({ jobs: [{ id: "job-1" }] }));
const mockAcknowledgeCompleted = vi.fn(async () => ({ outboxId: "job-1", status: "COMPLETED" }));
const mockAcknowledgeFailed = vi.fn(async () => ({ outboxId: "job-1", status: "PENDING" }));

vi.mock("app/api/defaultResponderForAppDir", () => ({
  defaultResponderForAppDir: vi.fn((handler) => handler),
}));

vi.mock("@calcom/lib/dental/pvs/pvs-connector-api-handler", () => ({
  handlePvsConnectorPost: vi.fn(
    async (_prisma, _request, _schema, handler: (body: Record<string, unknown>) => unknown) => {
      const result = await handler({ teamId: 42, limit: 5, outboxId: "job-1", status: "COMPLETED", externalId: "PVS-123" });
      return new Response(JSON.stringify(result), { status: 200 });
    }
  ),
}));

vi.mock("@calcom/lib/dental/pvs/pvs-outbox.service", () => ({
  PvsOutboxService: class MockPvsOutboxService {
    pollPending = mockPollPending;
    acknowledgeCompleted = mockAcknowledgeCompleted;
    acknowledgeFailed = mockAcknowledgeFailed;
  },
  PvsOutboxNotFoundError: class PvsOutboxNotFoundError extends Error {
    statusCode = 404;
  },
}));

vi.mock("@calcom/prisma", () => ({ prisma: {} }));

describe("/api/pvs/outbox/poll", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns polled jobs via shared connector handler", async () => {
    const { POST } = await import("../poll/route");
    const request = new Request("http://localhost/api/pvs/outbox/poll", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: "Bearer test" },
      body: JSON.stringify({ teamId: 42, limit: 5 }),
    });

    const response = await POST(request as never, { params: Promise.resolve({}) });
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.jobs).toHaveLength(1);
  });
});

describe("/api/pvs/outbox/ack", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("acknowledges completed jobs via shared connector handler", async () => {
    const { POST } = await import("../ack/route");
    const request = new Request("http://localhost/api/pvs/outbox/ack", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: "Bearer test" },
      body: JSON.stringify({
        teamId: 42,
        outboxId: "job-1",
        status: "COMPLETED",
        externalId: "PVS-123",
      }),
    });

    const response = await POST(request as never, { params: Promise.resolve({}) });
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.status).toBe("COMPLETED");
  });
});
