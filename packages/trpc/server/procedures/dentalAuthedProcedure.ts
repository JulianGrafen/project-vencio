import authedProcedure from "./authedProcedure";
import { dentalTenantContextMiddleware } from "../middlewares/dentalTenantContextMiddleware";
import { dentalTwoFactorMiddleware } from "../middlewares/dentalTwoFactorMiddleware";

/** Authed procedure with dental tenant encryption context when enabled. */
const dentalAuthedProcedure = authedProcedure.use(
  dentalTenantContextMiddleware as unknown as Parameters<typeof authedProcedure.use>[0]
);

/** Dental admin mutations — tenant context + mandatory 2FA for practice OWNER/ADMIN. */
export const dentalAdminProcedure = authedProcedure
  .use(dentalTwoFactorMiddleware as unknown as Parameters<typeof authedProcedure.use>[0])
  .use(dentalTenantContextMiddleware as unknown as Parameters<typeof authedProcedure.use>[0]);

export default dentalAuthedProcedure;
