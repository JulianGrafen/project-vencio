import authedProcedure from "./authedProcedure";
import { dentalTenantContextMiddleware } from "../middlewares/dentalTenantContextMiddleware";
import { dentalTwoFactorMiddleware } from "../middlewares/dentalTwoFactorMiddleware";

type AuthedProcedure = typeof authedProcedure;

const withDentalComplianceMiddleware = (procedure: AuthedProcedure) =>
  procedure
    .use(dentalTwoFactorMiddleware as unknown as Parameters<AuthedProcedure["use"]>[0])
    .use(dentalTenantContextMiddleware as unknown as Parameters<AuthedProcedure["use"]>[0]);

/** Authed procedure with dental 2FA gate + tenant encryption context when enabled. */
const dentalAuthedProcedure = withDentalComplianceMiddleware(authedProcedure);

/** Semantic alias for admin mutations — same middleware stack as dentalAuthedProcedure. */
export const dentalAdminProcedure = dentalAuthedProcedure;

export default dentalAuthedProcedure;
