import { QueryTaskDto, VerifierRole, TaskAvailabilityStatus, TaskStatus } from "@components/portal/tasks/models";
import { faker } from "@faker-js/faker";
import { getRandomStateCity } from "./mock-verifications";
import { MeasurementUnit } from "types/models";
import { getActiveAuditor } from "./mock-users";

export async function generateTask(
  verifierId: string
): Promise<QueryTaskDto> {
  const { state, groupingCity, city } = getRandomStateCity();
  return {
    id: faker.string.uuid(),
    property_parcel_id: `PARC-${faker.number.int({ min: 200, max: 1000 })}`,
    property_id: faker.string.uuid(),
    propertyTitle: faker.company.buzzPhrase(),
    plotSize: {
      value: faker.number.int({ min: 200, max: 1000 }),
      unit: MeasurementUnit.SQM,
    },
    location: {
      address: faker.location.streetAddress(),
      country: "Nigeria",
      state,
      groupingCity,
      city,
      area: faker.word.noun(),
      coordinates: {
        lat: Number(faker.location.latitude()),
        lng: Number(faker.location.longitude()),
      },
    },

    verifierId: verifierId || faker.string.uuid(),
    roleRequired: faker.helpers.arrayElement([
      VerifierRole.FIELD_AGENT,
      VerifierRole.LAWYER,
      VerifierRole.REGISTRY,
      VerifierRole.SURVEYOR,
    ]),
    verificationFocus: faker.helpers.arrayElements([
      "Title chain check",
      "Encumbrance search",
      "Land use compliance",
      "Deed verification",
      "Registry compliance",
      "Ownership history",
      "Legal disputes check",
      "Deed of assignment",
      "Power of attorney check",

      "Boundary verification",
      "Coordinate match to plan",
      "Land measurement",
      "GPS coordinates",
      "Boundary markers",
      "Area calculation",
      "Boundary walk",
      "Perimeter measurement",
      "Encroachment check",
      "Setback verification",

      "Physical inspection",
      "Structure verification",
      "Building condition",
      "Access road check",
      "Occupancy status",
      "Infrastructure check",
      "Perimeter fence",
      "Gate security",
      "Neighborhood assessment",
      "Environmental check",

      "Registry extract verification",
      "Official records",
      "Title registration status",
      "Stamp verification",
      "Official seal verification",
      "Records match",
      "Land use classification",
      "Registry compliance",
    ]),
    requiredResponse: faker.helpers.arrayElements([
      {
        key: "title_document",
        title: "Title document",
        type: "pdf"
      },
      {
        key: "legal_opinion",
        title: "Legal Opinion",
        type: "pdf"
      },
      {
        key: "survey_plan",
        title: "Survey Plan",
        type: "pdf"
      },
      {
        key: "boundary_photos",
        title: "Boundary Photos",
        type: "image"
      },
      {
        key: "arial_view",
        title: "Arial View",
        type: "video"
      },
      {
        key: "witness_form",
        title: "Witness Form",
        type: "pdf"
      },
      {
        key: "registry_extract",
        title: "Registry Extract",
        type: "pdf"
      },
    ]),
    providedResponse: [],
    status: faker.helpers.arrayElement([
      TaskStatus.ACCEPTED,
      TaskStatus.ASSIGNED,
      TaskStatus.COMPLETED,
      TaskStatus.DECLINED,
      TaskStatus.IN_PROGRESS,
      TaskStatus.OVERDUE,
      TaskStatus.SUBMITTED,
    ]),
    availabilityStatus: faker.helpers.arrayElement([
      TaskAvailabilityStatus.ACCEPTED,
      TaskAvailabilityStatus.DECLINED,
      TaskAvailabilityStatus.PENDING,
    ]),
    dateAssigned: faker.date.past().toISOString(),
    dateDue: faker.date.past().toISOString(),
    // sla_progress: number;
    // sla_hours: number;
    // progress?: number;
    notes: faker.helpers.arrayElements(
      await Promise.all(Array.from({ length: 4 }, () => faker.lorem.sentence()))
    ),
    qualifiedVerifierIds: faker.helpers.arrayElements(
      await Promise.all(Array.from({ length: 4 }, () => faker.string.uuid()))
    ),
    dateCreated: faker.date.past().toISOString(),
  };
}

export const tasks: QueryTaskDto[] = [];

async function initData() {
  // only generate once
  const activeAuditor = await getActiveAuditor();

  if (tasks.length === 0) {

    // Verifier Tasks
    const thisTasks = await Promise.all(
      Array.from({ length: 30 }, () =>
        generateTask(activeAuditor?.verifierId ?? "")
      )
    );

    tasks.push(...thisTasks);
  }
}

// Kick off immediately
initData();
