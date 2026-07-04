const PVS_OPERATION_LABELS: Record<string, string> = {
  CREATE_APPOINTMENT: "CREATE",
  UPDATE_APPOINTMENT: "UPDATE",
  CANCEL_APPOINTMENT: "CANCEL",
};

export function formatPvsOperationLabel(operation: string): string {
  return PVS_OPERATION_LABELS[operation] ?? operation.replace("_APPOINTMENT", "");
}
