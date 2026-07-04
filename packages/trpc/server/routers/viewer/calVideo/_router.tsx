import authedProcedure from "../../../procedures/authedProcedure";
import { dentalComplianceGateMiddleware } from "../../../middlewares/dentalComplianceGateMiddleware";
import { router } from "../../../trpc";
import { ZGetCalVideoRecordingsInputSchema } from "./getCalVideoRecordings.schema";
import { ZGetDownloadLinkOfCalVideoRecordingsInputSchema } from "./getDownloadLinkOfCalVideoRecordings.schema";
import { ZGetMeetingInformationInputSchema } from "./getMeetingInformation.schema";

const dentalGatedProcedure = authedProcedure.use(dentalComplianceGateMiddleware as never);

type CalVideoRouterHandlerCache = {
  getCalVideoRecordings?: typeof import("./getCalVideoRecordings.handler").getCalVideoRecordingsHandler;
  getDownloadLinkOfCalVideoRecordings?: typeof import("./getDownloadLinkOfCalVideoRecordings.handler").getDownloadLinkOfCalVideoRecordingsHandler;
  getMeetingInformation?: typeof import("./getMeetingInformation.handler").getMeetingInformationHandler;
};

export const calVideoRouter = router({
  getCalVideoRecordings: dentalGatedProcedure
    .input(ZGetCalVideoRecordingsInputSchema)
    .query(async ({ ctx, input }) => {
      const { getCalVideoRecordingsHandler } = await import("./getCalVideoRecordings.handler");

      return getCalVideoRecordingsHandler({ ctx, input });
    }),

  getDownloadLinkOfCalVideoRecordings: dentalGatedProcedure
    .input(ZGetDownloadLinkOfCalVideoRecordingsInputSchema)
    .query(async ({ ctx, input }) => {
      const { getDownloadLinkOfCalVideoRecordingsHandler } = await import(
        "./getDownloadLinkOfCalVideoRecordings.handler"
      );

      return getDownloadLinkOfCalVideoRecordingsHandler({ ctx, input });
    }),

  getMeetingInformation: dentalGatedProcedure
    .input(ZGetMeetingInformationInputSchema)
    .query(async ({ ctx, input }) => {
      const { getMeetingInformationHandler } = await import("./getMeetingInformation.handler");

      return getMeetingInformationHandler({ ctx, input });
    }),
});
