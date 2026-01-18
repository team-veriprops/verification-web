import { QueryTaskDto, VerifierRole, TaskAvailabilityStatus, TaskStatus } from "@components/portal/tasks/models";
import { faker } from "@faker-js/faker";
import { getRandomStateCity } from "./mock-verifications";
import { MeasurementUnit } from "types/models";
import { getActiveAuditor } from "./mock-users";

export async function generateTask(
  verifier_id: string
): Promise<QueryTaskDto> {
  const { state, grouping_city, city } = getRandomStateCity();
  return {
    id: faker.string.uuid(),
    property_parcel_id: `PARC-${faker.number.int({ min: 200, max: 1000 })}`,
    property_id: faker.string.uuid(),
    property_title: faker.company.buzzPhrase(),
    plot_size: {
      value: faker.number.int({ min: 200, max: 1000 }),
      unit: MeasurementUnit.SQM,
    },
    location: {
      address: faker.location.streetAddress(),
      country: "Nigeria",
      state,
      grouping_city,
      city,
      area: faker.word.noun(),
      coordinates: {
        lat: Number(faker.location.latitude()),
        lng: Number(faker.location.longitude()),
      },
    },

    verifier_id: verifier_id || faker.string.uuid(),
    role_required: faker.helpers.arrayElement([
      VerifierRole.FIELD_AGENT,
      VerifierRole.LAWYER,
      VerifierRole.REGISTRY,
      VerifierRole.SURVEYOR,
    ]),
    verification_focus: faker.helpers.arrayElements([
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
    required_response: faker.helpers.arrayElements([
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
    provided_response: [],
    status: faker.helpers.arrayElement([
      TaskStatus.ACCEPTED,
      TaskStatus.ASSIGNED,
      TaskStatus.COMPLETED,
      TaskStatus.DECLINED,
      TaskStatus.IN_PROGRESS,
      TaskStatus.OVERDUE,
      TaskStatus.SUBMITTED,
    ]),
    availability_status: faker.helpers.arrayElement([
      TaskAvailabilityStatus.ACCEPTED,
      TaskAvailabilityStatus.DECLINED,
      TaskAvailabilityStatus.PENDING,
    ]),
    date_assigned: faker.date.past().toISOString(),
    date_due: faker.date.past().toISOString(),
    // sla_progress: number;
    // sla_hours: number;
    // progress?: number;
    notes: faker.helpers.arrayElements(
      await Promise.all(Array.from({ length: 4 }, () => faker.lorem.sentence()))
    ),
    qualified_verifier_ids: faker.helpers.arrayElements(
      await Promise.all(Array.from({ length: 4 }, () => faker.string.uuid()))
    ),
    date_created: faker.date.past().toISOString(),
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
        generateTask(activeAuditor?.verifier_id ?? "")
      )
    );

    tasks.push(...thisTasks);
  }
}

// Kick off immediately
initData();
