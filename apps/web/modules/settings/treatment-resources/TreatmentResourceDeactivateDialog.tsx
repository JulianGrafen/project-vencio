import { Button } from "@calcom/ui/components/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "@calcom/ui/components/dialog";

import type { TreatmentResourcesSettingsState } from "./useTreatmentResourcesSettings";

type TreatmentResourceDeactivateDialogProps = {
  teamId: number;
  settings: TreatmentResourcesSettingsState;
};

export function TreatmentResourceDeactivateDialog({
  teamId,
  settings,
}: TreatmentResourceDeactivateDialogProps) {
  return (
    <Dialog
      open={Boolean(settings.deactivateTarget)}
      onOpenChange={(open) => !open && settings.setDeactivateTarget(null)}>
      <DialogContent type="confirmation" title="Ressource deaktivieren?">
        <DialogHeader title="Ressource deaktivieren?" />
        <p className="text-subtle text-sm">
          {settings.deactivateTarget?.name} wird für neue Buchungen ausgeblendet. Bestehende Termine bleiben
          unverändert.
        </p>
        <DialogFooter>
          <DialogClose color="secondary">Abbrechen</DialogClose>
          <Button
            color="destructive"
            loading={settings.deactivateMutation.isPending}
            onClick={() => {
              if (!settings.deactivateTarget) return;
              settings.deactivateMutation.mutate({ teamId, resourceId: settings.deactivateTarget.id });
            }}>
            Deaktivieren
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
