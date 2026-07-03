import authedProcedure from "./authedProcedure";
import { dentalTenantContextMiddleware } from "../middlewares/dentalTenantContextMiddleware";

/** Authed procedure with dental tenant encryption context when enabled. */
const dentalAuthedProcedure = authedProcedure.use(
  dentalTenantContextMiddleware as unknown as Parameters<typeof authedProcedure.use>[0]
);

export default dentalAuthedProcedure;
