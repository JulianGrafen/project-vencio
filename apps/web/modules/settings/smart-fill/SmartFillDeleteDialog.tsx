import { Button } from "@calcom/ui/components/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "@calcom/ui/components/dialog";

import type { SmartFillPatientPoolState } from "./useSmartFillPatientPool";

type SmartFillDeleteDialogProps = {
  teamId: number;
  pool: SmartFillPatientPoolState;
};

export function SmartFillDeleteDialog({ teamId, pool }: SmartFillDeleteDialogProps) {
  return (
    <Dialog open={Boolean(pool.deleteTarget)} onOpenChange={(open) => !open && pool.setDeleteTarget(null)}>
      <DialogContent type="confirmation" title="Patient entfernen?">
        <DialogHeader title="Patient entfernen?" />
        <p className="text-subtle text-sm">
          {pool.deleteTarget?.name} wird aus Warteliste und Recall entfernt. Diese Aktion kann nicht
          rückgängig gemacht werden.
        </p>
        <DialogFooter>
          <DialogClose color="secondary">Abbrechen</DialogClose>
          <Button
            color="destructive"
            loading={pool.deleteMutation.isPending}
            onClick={() => {
              if (!pool.deleteTarget) return;
              pool.deleteMutation.mutate({ teamId, patientId: pool.deleteTarget.id });
            }}>
            Entfernen
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
