import { AwsKmsKeyManagementService } from "./aws-kms";
import { LocalEnvelopeKeyManagementService } from "./local-envelope-kms";
import type { KeyManagementService } from "../types";

export { AwsKmsKeyManagementService } from "./aws-kms";
export { LocalEnvelopeKeyManagementService, generateAndWrapPracticeDek } from "./local-envelope-kms";

export function createKeyManagementService(): KeyManagementService {
  const provider = process.env.DENTAL_KMS_PROVIDER ?? "local-envelope";

  switch (provider) {
    case "local-envelope":
      return new LocalEnvelopeKeyManagementService();
    case "aws-kms":
      return new AwsKmsKeyManagementService();
    default:
      throw new Error(`Unsupported DENTAL_KMS_PROVIDER: ${provider}`);
  }
}
