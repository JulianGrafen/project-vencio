import type { RecallTemplateContext } from "./constants";
import { RECALL_TEMPLATE_VARIABLES } from "./constants";

/**
 * Replaces [PatientenName], [TerminLink], [PraxisName], [OptOutLink] in recall templates.
 */
export function renderRecallTemplate(template: string, context: RecallTemplateContext): string {
  return template
    .replaceAll(RECALL_TEMPLATE_VARIABLES.PATIENT_NAME, context.patientName)
    .replaceAll(RECALL_TEMPLATE_VARIABLES.BOOKING_LINK, context.bookingLink)
    .replaceAll(RECALL_TEMPLATE_VARIABLES.PRACTICE_NAME, context.practiceName)
    .replaceAll(RECALL_TEMPLATE_VARIABLES.OPT_OUT_LINK, context.optOutLink);
}
