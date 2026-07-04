import {
  RECALL_DEFAULT_INTERVAL_MONTHS,
  RECALL_DEFAULT_TOLERANCE_DAYS,
  RECALL_TEMPLATE_VARIABLES,
} from "@calcom/lib/dental/recall/constants";
import { trpc } from "@calcom/trpc/react";
import { Button } from "@calcom/ui/components/button";
import { Label, TextArea, TextField } from "@calcom/ui/components/form";
import { SettingsToggle } from "@calcom/ui/components/form";
import { SkeletonText } from "@calcom/ui/components/skeleton";
import { showToast } from "@calcom/ui/components/toast";
import { useEffect, useState } from "react";

import { DentalCard, DentalHelpText, DentalSectionHeader } from "~/settings/dental/dental-ui";

export type RecallSettingsFormData = {
  enabled: boolean;
  intervalMonths: number;
  toleranceDays: number;
  smsEnabled: boolean;
  practiceName: string;
  bookingSlug: string | null;
  emailSubject: string;
  emailHtmlTemplate: string;
  emailTextTemplate: string | null;
  smsTemplate: string | null;
};

type RecallSettingsFormProps = {
  teamId: number;
  settings: RecallSettingsFormData;
  isLoading: boolean;
};

export function RecallSettingsForm({ teamId, settings, isLoading }: RecallSettingsFormProps) {
  const utils = trpc.useUtils();
  const [form, setForm] = useState(settings);

  useEffect(() => {
    setForm(settings);
  }, [settings]);

  const updateMutation = trpc.viewer.recall.updateSettings.useMutation({
    onSuccess: async () => {
      showToast("Recall-Einstellungen gespeichert", "success");
      await utils.viewer.recall.getSettings.invalidate({ teamId });
      await utils.viewer.recall.pending.invalidate({ teamId });
    },
    onError: (error) => showToast(error.message || "Speichern fehlgeschlagen", "error"),
  });

  const save = (patch: Partial<RecallSettingsFormData>) => {
    const next = { ...form, ...patch };
    setForm(next);
    updateMutation.mutate({
      teamId,
      enabled: next.enabled,
      intervalMonths: next.intervalMonths,
      toleranceDays: next.toleranceDays,
      smsEnabled: next.smsEnabled,
      practiceName: next.practiceName,
      bookingSlug: next.bookingSlug,
      emailSubject: next.emailSubject,
      emailHtmlTemplate: next.emailHtmlTemplate,
      emailTextTemplate: next.emailTextTemplate,
      smsTemplate: next.smsTemplate,
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        <SkeletonText className="h-10 w-full" />
        <SkeletonText className="h-10 w-full" />
      </div>
    );
  }

  return (
    <form
      className="space-y-6"
      onSubmit={(event) => {
        event.preventDefault();
        save({});
      }}>
      <SettingsToggle
        title="Recall aktiv"
        description="Täglicher Versand an fällige Patienten aus dem Smart-Fill-Pool"
        checked={form.enabled}
        onCheckedChange={(checked) => save({ enabled: checked })}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="recall-interval">Intervall (Monate)</Label>
          <TextField
            id="recall-interval"
            type="number"
            min={1}
            max={24}
            value={String(form.intervalMonths ?? RECALL_DEFAULT_INTERVAL_MONTHS)}
            onChange={(event) => save({ intervalMonths: Number(event.target.value) })}
          />
        </div>
        <div>
          <Label htmlFor="recall-tolerance">Toleranzfenster (Tage)</Label>
          <TextField
            id="recall-tolerance"
            type="number"
            min={0}
            max={14}
            value={String(form.toleranceDays ?? RECALL_DEFAULT_TOLERANCE_DAYS)}
            onChange={(event) => save({ toleranceDays: Number(event.target.value) })}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="recall-practice-name">Praxisname in E-Mails</Label>
        <TextField
          id="recall-practice-name"
          value={form.practiceName}
          onChange={(event) => setForm((prev) => ({ ...prev, practiceName: event.target.value }))}
          onBlur={() => save({ practiceName: form.practiceName })}
        />
      </div>

      <div>
        <Label htmlFor="recall-booking-slug">Buchungslink (Slug-Pfad)</Label>
        <TextField
          id="recall-booking-slug"
          placeholder="z.B. team-slug/prophylaxe oder benutzername/termin"
          value={form.bookingSlug ?? ""}
          onChange={(event) =>
            setForm((prev) => ({
              ...prev,
              bookingSlug: event.target.value.trim() ? event.target.value.trim() : null,
            }))
          }
          onBlur={() => save({ bookingSlug: form.bookingSlug })}
        />
        <DentalHelpText>
          Wird als {RECALL_TEMPLATE_VARIABLES.BOOKING_LINK} in E-Mail und SMS eingesetzt
        </DentalHelpText>
      </div>

      <div>
        <Label htmlFor="recall-email-subject">E-Mail Betreff</Label>
        <TextField
          id="recall-email-subject"
          value={form.emailSubject}
          onChange={(event) => setForm((prev) => ({ ...prev, emailSubject: event.target.value }))}
          onBlur={() => save({ emailSubject: form.emailSubject })}
        />
      </div>

      <div>
        <Label htmlFor="recall-email-html">E-Mail HTML-Vorlage</Label>
        <TextArea
          id="recall-email-html"
          rows={8}
          value={form.emailHtmlTemplate}
          onChange={(event) => setForm((prev) => ({ ...prev, emailHtmlTemplate: event.target.value }))}
        />
        <DentalHelpText>
          Platzhalter: {RECALL_TEMPLATE_VARIABLES.PATIENT_NAME}, {RECALL_TEMPLATE_VARIABLES.BOOKING_LINK},{" "}
          {RECALL_TEMPLATE_VARIABLES.PRACTICE_NAME}, {RECALL_TEMPLATE_VARIABLES.OPT_OUT_LINK}
        </DentalHelpText>
      </div>

      <SettingsToggle
        title="SMS zusätzlich zur E-Mail"
        description="Kurze SMS-Erinnerung, wenn Telefonnummer hinterlegt ist"
        checked={form.smsEnabled}
        onCheckedChange={(checked) => save({ smsEnabled: checked })}
      />

      {form.smsEnabled ? (
        <div>
          <Label htmlFor="recall-sms-template">SMS-Vorlage</Label>
          <TextArea
            id="recall-sms-template"
            rows={3}
            value={form.smsTemplate ?? ""}
            onChange={(event) =>
              setForm((prev) => ({
                ...prev,
                smsTemplate: event.target.value.trim() ? event.target.value : null,
              }))
            }
            onBlur={() => save({ smsTemplate: form.smsTemplate })}
          />
        </div>
      ) : null}

      <Button type="submit" loading={updateMutation.isPending}>
        Einstellungen speichern
      </Button>
    </form>
  );
}
