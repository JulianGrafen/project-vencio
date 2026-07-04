import { trpc } from "@calcom/trpc/react";
import { showToast } from "@calcom/ui/components/toast";
import { useState } from "react";

export function useSmartFillPatientPool(teamId: number, enabled: boolean) {
  const utils = trpc.useUtils();

  const [showAddForm, setShowAddForm] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [waitlistEnabled, setWaitlistEnabled] = useState(true);
  const [recallEnabled, setRecallEnabled] = useState(true);
  const [priorityScore, setPriorityScore] = useState("0");
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);

  const { data: patients, isLoading } = trpc.viewer.smartFill.listPatients.useQuery(
    { teamId },
    { enabled }
  );

  const createMutation = trpc.viewer.smartFill.createPatient.useMutation({
    onSuccess: async () => {
      setName("");
      setEmail("");
      setPhoneNumber("");
      setPriorityScore("0");
      setShowAddForm(false);
      showToast("Patient hinzugefügt", "success");
      await utils.viewer.smartFill.listPatients.invalidate({ teamId });
      await utils.viewer.recall.pending.invalidate({ teamId });
    },
    onError: (error) => showToast(error.message || "Speichern fehlgeschlagen", "error"),
  });

  const updateMutation = trpc.viewer.smartFill.updatePatient.useMutation({
    onSuccess: async () => {
      showToast("Patient aktualisiert", "success");
      await utils.viewer.smartFill.listPatients.invalidate({ teamId });
      await utils.viewer.recall.pending.invalidate({ teamId });
    },
    onError: (error) => showToast(error.message || "Aktualisierung fehlgeschlagen", "error"),
  });

  const deleteMutation = trpc.viewer.smartFill.deletePatient.useMutation({
    onSuccess: async () => {
      setDeleteTarget(null);
      showToast("Patient entfernt", "success");
      await utils.viewer.smartFill.listPatients.invalidate({ teamId });
    },
    onError: (error) => showToast(error.message || "Löschen fehlgeschlagen", "error"),
  });

  const resetForm = () => {
    setName("");
    setEmail("");
    setPhoneNumber("");
    setPriorityScore("0");
  };

  const submitCreate = () => {
    createMutation.mutate({
      teamId,
      name,
      email,
      phoneNumber,
      waitlistEnabled,
      recallEnabled,
      priorityScore: Number(priorityScore) || 0,
    });
  };

  return {
    patients,
    isLoading,
    showAddForm,
    setShowAddForm,
    name,
    setName,
    email,
    setEmail,
    phoneNumber,
    setPhoneNumber,
    waitlistEnabled,
    setWaitlistEnabled,
    recallEnabled,
    setRecallEnabled,
    priorityScore,
    setPriorityScore,
    deleteTarget,
    setDeleteTarget,
    createMutation,
    updateMutation,
    deleteMutation,
    resetForm,
    submitCreate,
  };
}

export type SmartFillPatientPoolState = ReturnType<typeof useSmartFillPatientPool>;
