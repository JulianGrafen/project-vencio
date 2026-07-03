import { beforeEach, describe, expect, it, vi } from "vitest";

const sendMock = vi.fn();

import { AwsKmsKeyManagementService } from "./aws-kms";

describe("aws-kms", () => {
  beforeEach(() => {
    sendMock.mockReset();
    process.env.AWS_KMS_KEY_ARN = "arn:aws:kms:eu-central-1:123456789:key/test-key";
  });

  it("wraps DEK via KMS Encrypt", async () => {
    const dek = Buffer.alloc(32, 7);
    sendMock.mockResolvedValueOnce({
      CiphertextBlob: Buffer.from("cipher"),
    });

    const kms = new AwsKmsKeyManagementService({
      client: { send: sendMock } as never,
    });
    const wrapped = await kms.wrapDek(dek, 5);

    expect(wrapped.startsWith("kms-aws:v1:5:")).toBe(true);
    expect(sendMock).toHaveBeenCalledTimes(1);
  });

  it("unwraps DEK via KMS Decrypt with tenant binding", async () => {
    const dek = Buffer.alloc(32, 3);
    sendMock.mockResolvedValueOnce({
      CiphertextBlob: Buffer.from("cipher"),
    });

    const kms = new AwsKmsKeyManagementService({
      client: { send: sendMock } as never,
    });
    const wrapped = await kms.wrapDek(dek, 9);

    sendMock.mockResolvedValueOnce({
      Plaintext: dek,
    });

    const unwrapped = await kms.unwrapDek(wrapped, 9);
    expect(unwrapped.equals(dek)).toBe(true);
    expect(sendMock).toHaveBeenCalledTimes(2);
  });

  it("rejects tenant mismatch", async () => {
    sendMock.mockResolvedValueOnce({
      CiphertextBlob: Buffer.from("cipher"),
    });

    const kms = new AwsKmsKeyManagementService({
      client: { send: sendMock } as never,
    });
    const wrapped = await kms.wrapDek(Buffer.alloc(32, 1), 4);

    await expect(kms.unwrapDek(wrapped, 5)).rejects.toThrow(/tenant binding mismatch/);
  });
});
