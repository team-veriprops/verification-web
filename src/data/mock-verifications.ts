import {
  QueryVerificationDetailDto,
} from "@components/portal/verifications/details/models";
import {
  QueryVerificationDto,
  VerificationStatus,
} from "@components/portal/verifications/models";
import { faker } from "@faker-js/faker";
import { Money, TransactionCurrency, PropertyType, MeasurementUnit } from "types/models";


export const stateCityMap: { state: string; grouping_city: string; cities: string[] }[] = [
  { state: "Lagos", grouping_city: "Lagos", cities: ["Ikeja", "Lekki", "Victoria Island", "Surulere", "Yaba"],},
  { state: "Abuja", grouping_city: "Abuja", cities: ["Garki", "Maitama", "Wuse", "Asokoro"] },
  { state: "Oyo", grouping_city: "Ibadan", cities: ["Ibadan", "Ogbomosho", "Oyo Town"] },
  { state: "Rivers", grouping_city: "Port Harcourt", cities: ["Port Harcourt", "Obio-Akpor"] },
  { state: "Enugu", grouping_city: "Enugu", cities: ["Enugu", "Nsukka"] },
  { state: "Delta", grouping_city: "Asaba", cities: ["Cable Point", "GRA", "Cable Point", "Bonsaac Layout", "Okpanam"] },
];

export function getRandomStateCity() {
  const stateEntry = faker.helpers.arrayElement(stateCityMap);
  const city = faker.helpers.arrayElement(stateEntry.cities);
  return { state: stateEntry.state, grouping_city:stateEntry.grouping_city, city };
}

export async function generateVerification(): Promise<QueryVerificationDto> {
  const { state, grouping_city, city } = getRandomStateCity();

  return {
    id: faker.string.uuid(),
    ref_id: `VRP-2026-00${faker.number.int({ min: 1000, max: 9000 })}`,
    property_type: faker.helpers.arrayElement([
      PropertyType.LAND,
      PropertyType.STRUCTURE
    ]),
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
    status: faker.helpers.arrayElement([
      VerificationStatus.PENDING,
      VerificationStatus.VERIFIED,
      VerificationStatus.FLAGGED,
      VerificationStatus.CANCELLED,
    ]),
    owner_fullname: `${faker.person.firstName()} ${faker.person.lastName()}`,
    risk_score: faker.number.int({ min: 10, max: 100 }),

    property_title: faker.company.catchPhrase(),
    property_description: faker.lorem.sentence(),
    property_plot_size: {
      value: faker.number.int({ min: 200, max: 1000 }),
      unit: MeasurementUnit.SQM,
    },
    property_estimated_price: Money.from({
      value: faker.number.int({ min: 20000, max: 500000 }),
      currency: TransactionCurrency.NGN,
    }),
    paid: faker.helpers.arrayElement([false, true]),

    documents: faker.helpers.arrayElements([
      { 
        name: "Certificate of Occupancy", 
        status: faker.helpers.arrayElement([
          VerificationStatus.PENDING,
          VerificationStatus.VERIFIED,
          VerificationStatus.FLAGGED,
          VerificationStatus.CANCELLED,
        ]), 
        verified_date: faker.date.past().toISOString(),
      },
      { 
        name: "Survey Plan", 
        status: faker.helpers.arrayElement([
          VerificationStatus.PENDING,
          VerificationStatus.VERIFIED,
          VerificationStatus.FLAGGED,
          VerificationStatus.CANCELLED,
        ]), 
        verified_date: faker.date.past().toISOString(),
      },
      { 
        name: "Deed of Assignment", 
        status: faker.helpers.arrayElement([
          VerificationStatus.PENDING,
          VerificationStatus.VERIFIED,
          VerificationStatus.FLAGGED,
          VerificationStatus.CANCELLED,
        ]), 
        verified_date: faker.date.past().toISOString(),
      },
      { 
        name: "Governor's Consent", 
        status: faker.helpers.arrayElement([
          VerificationStatus.PENDING,
          VerificationStatus.VERIFIED,
          VerificationStatus.FLAGGED,
          VerificationStatus.CANCELLED,
        ]), 
        verified_date: faker.date.past().toISOString(),
      },
    ]),

    date_created: faker.date.past().toISOString(),
    date_completed: faker.date.past().toISOString(),
  };
}


export async function generateVerificationDetail(
  ref_id: string,
): Promise<QueryVerificationDetailDto> {
  return {
    id: faker.string.uuid(),
    ref_id: ref_id,
    title_status: "Clean Title - Certificate of Occupancy",
    encumbrances: faker.helpers.arrayElements([
      "Government acquisition pending review",
      "Pending litigation", 
      "Disputed ownership",
    ]),
    timeline: faker.helpers.arrayElements([
      { 
        date: faker.date.past().toISOString(), 
        event: "Verification Submitted", 
        description: "Request received and payment confirmed",
      },
      { 
        date: faker.date.past().toISOString(), 
        event: "Document Review Started", 
        description: "Legal team began document analysis", 
      },
      { 
        date: faker.date.past().toISOString(), 
        event: "Field Survey Scheduled", 
        description: "Land surveyor assigned for GPS mapping", 
      },
      { 
        date: faker.date.past().toISOString(), 
        event: "Registry Check Complete", 
        description: "Ownership verified at Lagos Land Registry", 
      },
      { 
        date: faker.date.past().toISOString(), 
        event: "Verification Complete", 
        description: "Property verified with low risk score", 
      }
    ]),
    date_created: faker.date.past().toISOString(),
  };
}


export let verifications: QueryVerificationDto[] = [];
export const verificationDetails: QueryVerificationDetailDto[] = [];

async function initData() {
  // only generate once
  if (verifications.length === 0) {
    verifications = await Promise.all(
      Array.from({ length: 20 }, () => generateVerification())
    );
  }

  if (verificationDetails.length === 0) {
    for (const verification of verifications) {
      const this_details = await generateVerificationDetail(verification.id!);

      verificationDetails.push(this_details);
    }
  }

}

// Kick off immediately
initData();
