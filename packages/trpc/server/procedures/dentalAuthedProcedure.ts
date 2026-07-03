import authedProcedure from "./authedProcedure";
import { dentalTenantContextMiddleware } from "../middlewares/dentalTenantContextMiddleware";

/** Authed procedure with dental tenant encryption context when enabled. */
const dentalAuthedProcedure = authedProcedure.use(dentalTenantContextMiddleware);

export default dentalAuthedProcedure;
