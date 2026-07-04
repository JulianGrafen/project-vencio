import { Button } from "@calcom/ui/components/button";
import { Label, TextField } from "@calcom/ui/components/form";
import { SettingsToggle } from "@calcom/ui/components/form";

import { dentalDesign } from "~/settings/dental/dental-design";
import { DentalCard, DentalHelpText, DentalSectionHeader } from "~/settings/dental/dental-ui";

import type { SmartFillPatientPoolState } from "./useSmartFillPatientPool";

type SmartFillPatientFormProps = {
  pool: SmartFillPatientPoolState;
};

export function SmartFillPatientForm({ pool }: SmartFillPatientFormProps) {
  return (
    <DentalCard variant="accent" padding="lg">
      <form
        className="space-y-6"
        onSubmit={(event) => {
          event.preventDefault();
          pool.submitCreate();
        }}>
        <DentalSectionHeader
          title="Neuen Patienten anlegen"
          description="E-Mail für Nachrücktermine (Smart-Fill) und Recall-Erinnerungen."
        />

        <div className={dentalDesign.formGrid}>
          <div>
            <Label htmlFor="sf-name">Name</Label>
            <TextField
              id="sf-name"
              required
              value={pool.name}
              onChange={(e) => pool.setName(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="sf-email">E-Mail</Label>
            <TextField
              id="sf-email"
              type="email"
              required
              value={pool.email}
              onChange={(e) => pool.setEmail(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="sf-phone">Telefon (optional, Recall-SMS)</Label>
            <TextField
              id="sf-phone"
              value={pool.phoneNumber}
              onChange={(e) => pool.setPhoneNumber(e.target.value)}
              placeholder="+49 170 …"
            />
          </div>
          <div>
            <Label htmlFor="sf-priority">Priorität</Label>
            <TextField
              id="sf-priority"
              type="number"
              min={0}
              max={1000}
              value={pool.priorityScore}
              onChange={(e) => pool.setPriorityScore(e.target.value)}
            />
            <DentalHelpText>Höhere Werte = bevorzugt bei freien Terminen (0 = normal)</DentalHelpText>
          </div>
        </div>

        <div className="space-y-3 rounded-lg border border-subtle bg-default/80 p-4">
          <SettingsToggle
            title="Smart-Fill Warteliste"
            description="E-Mail-Einladung bei kurzfristig freigewordenen Terminen (Nachrücktermine)"
            checked={pool.waitlistEnabled}
            onCheckedChange={pool.setWaitlistEnabled}
          />
          <SettingsToggle
            title="Recall aktiv"
            description="Prophylaxe-Erinnerung nach konfiguriertem Intervall"
            checked={pool.recallEnabled}
            onCheckedChange={pool.setRecallEnabled}
          />
        </div>

        <Button type="submit" loading={pool.createMutation.isPending}>
          Patient speichern
        </Button>
      </form>
    </DentalCard>
  );
}
