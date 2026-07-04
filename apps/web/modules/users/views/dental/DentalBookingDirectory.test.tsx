import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import type { MedicalEventTypeItem } from "./MedicalEventTypeList";
import { DentalBookingDirectory } from "./DentalBookingDirectory";

const EVENT_TYPES: MedicalEventTypeItem[] = [
  {
    id: 1,
    slug: "prophylaxe",
    title: "Professionelle Zahnreinigung",
    length: 45,
    medicalProfile: {
      category: "PROPHYLAXE",
      allowedInsuranceTypes: [],
      displayOrder: 0,
      isEmergency: false,
    },
  },
  {
    id: 2,
    slug: "bleaching",
    title: "Bleaching",
    length: 60,
    medicalProfile: {
      category: "SONSTIGES",
      allowedInsuranceTypes: ["PRIVAT", "SELBSTZAHLER"],
      displayOrder: 0,
      isEmergency: false,
    },
  },
];

function renderDirectory(query: Record<string, string> = {}) {
  return render(<DentalBookingDirectory username="praxis" eventTypes={EVENT_TYPES} query={query} />);
}

describe("DentalBookingDirectory", () => {
  it("requires an insurance selection before showing treatments", () => {
    renderDirectory();

    expect(screen.getByTestId("triage-hint")).toBeTruthy();
    expect(screen.queryByTestId("medical-event-types")).toBeNull();
  });

  it("shows grouped treatments after selecting an insurance type", () => {
    renderDirectory();

    fireEvent.click(screen.getByTestId("insurance-option-privat"));

    expect(screen.getByTestId("medical-event-types")).toBeTruthy();
    expect(screen.getByText("Professionelle Zahnreinigung")).toBeTruthy();
    expect(screen.getByText("Bleaching")).toBeTruthy();
  });

  it("hides treatments excluded for statutory insurance", () => {
    renderDirectory();

    fireEvent.click(screen.getByTestId("insurance-option-gesetzlich"));

    expect(screen.getByText("Professionelle Zahnreinigung")).toBeTruthy();
    expect(screen.queryByText("Bleaching")).toBeNull();
  });

  it("preselects insurance from the deep-link query param", () => {
    renderDirectory({ insuranceType: "GESETZLICH" });

    expect(screen.queryByTestId("triage-hint")).toBeNull();
    expect(screen.getByTestId("medical-event-types")).toBeTruthy();
  });

  it("forwards the insurance selection into booking links", () => {
    renderDirectory({ insuranceType: "PRIVAT" });

    const links = screen.getAllByTestId("medical-event-type-link");

    expect(links[0].getAttribute("href")).toContain("insuranceType=PRIVAT");
    expect(links[0].getAttribute("href")).toContain("/praxis/prophylaxe");
  });
});
