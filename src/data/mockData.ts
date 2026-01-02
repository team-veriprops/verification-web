export interface Property {
  id: string;
  type: "land" | "building";
  location: string;
  status: "verified" | "flagged" | "pending";
  riskScore: number;
  claimedSize?: number;
  surveyDocSize?: number;
  satelliteEstimate?: number;
  claimedFloors?: number;
  foundFloors?: number;
  approvedPlan?: boolean;
  dispute: boolean;
  ownerVerified: boolean;
  verifiedDate: string;
}

export const mockProperties: Property[] = [
  {
    id: "VP-2024-001",
    type: "land",
    location: "Lekki Phase 1, Lagos",
    status: "verified",
    riskScore: 0.12,
    claimedSize: 600,
    surveyDocSize: 580,
    satelliteEstimate: 590,
    dispute: false,
    ownerVerified: true,
    verifiedDate: "Dec 15, 2024",
  },
  {
    id: "VP-2024-002",
    type: "building",
    location: "Victoria Island, Lagos",
    status: "verified",
    riskScore: 0.08,
    claimedFloors: 2,
    foundFloors: 2,
    approvedPlan: true,
    dispute: false,
    ownerVerified: true,
    verifiedDate: "Dec 18, 2024",
  },
  {
    id: "VP-2024-003",
    type: "land",
    location: "Ajah, Lagos",
    status: "flagged",
    riskScore: 0.87,
    claimedSize: 450,
    surveyDocSize: undefined,
    satelliteEstimate: 320,
    dispute: true,
    ownerVerified: false,
    verifiedDate: "Dec 20, 2024",
  },
  {
    id: "VP-2024-004",
    type: "land",
    location: "Ikoyi, Lagos",
    status: "verified",
    riskScore: 0.05,
    claimedSize: 1200,
    surveyDocSize: 1195,
    satelliteEstimate: 1198,
    dispute: false,
    ownerVerified: true,
    verifiedDate: "Dec 22, 2024",
  },
];

export interface PricingTier {
  name: string;
  price: number;
  description: string;
  features: string[];
  popular?: boolean;
}

export const pricingTiers: PricingTier[] = [
  {
    name: "Basic",
    price: 35000,
    description: "Essential verification for personal buyers",
    features: [
      "Registry ownership check",
      "Basic document review",
      "Property status report",
      "Email support",
    ],
  },
  {
    name: "Standard",
    price: 75000,
    description: "Comprehensive verification for serious buyers",
    features: [
      "Everything in Basic",
      "Survey plan validation",
      "Satellite size comparison",
      "Dispute history check",
      "Phone & email support",
      "Digital verification badge",
    ],
    popular: true,
  },
  {
    name: "Premium",
    price: 150000,
    description: "Full due diligence for high-value transactions",
    features: [
      "Everything in Standard",
      "On-site GPS inspection",
      "Legal document analysis",
      "Owner identity verification",
      "Priority 24/7 support",
      "Physical verification report",
      "Veriprops Verified Stamp",
    ],
  },
];

export interface Testimonial {
  id: string;
  name: string;
  location: string;
  role: string;
  content: string;
  avatar: string;
}

export const testimonials: Testimonial[] = [
  {
    id: "1",
    name: "Adebayo Ogundimu",
    location: "Lagos",
    role: "First-time Buyer",
    content: "I almost paid ₦45M for a land in Lekki that had ownership disputes. Veriprops flagged it before I made the mistake. They literally saved my life savings.",
    avatar: "AO",
  },
  {
    id: "2",
    name: "Chioma Nwachukwu",
    location: "Abuja",
    role: "Real Estate Investor",
    content: "Now I verify every property before acquisition. The detailed reports give me confidence that what I'm buying is exactly what the seller claims. No more sleepless nights.",
    avatar: "CN",
  },
  {
    id: "3",
    name: "Emeka Obi",
    location: "Port Harcourt",
    role: "Property Developer",
    content: "The satellite size comparison caught a 130sqm discrepancy on a plot I was about to buy. That's ₦8M in land I would have lost. Worth every kobo.",
    avatar: "EO",
  },
  {
    id: "4",
    name: "Funke Adeyemi",
    location: "Ibadan",
    role: "Diaspora Buyer",
    content: "Buying property from abroad was terrifying until I found Veriprops. They verified everything for me and sent proof of inspection. Finally, transparency in Nigerian real estate.",
    avatar: "FA",
  },
];

export interface TrustBadge {
  icon: string;
  label: string;
  description: string;
}

export const trustBadges: TrustBadge[] = [
  {
    icon: "shield-check",
    label: "Registry Ownership Checked",
    description: "We verify ownership directly with land registries",
  },
  {
    icon: "file-check",
    label: "Survey Plan Validated",
    description: "Survey documents cross-checked with official records",
  },
  {
    icon: "map-pin",
    label: "GPS Inspection Proof",
    description: "Physical coordinates verified on-ground",
  },
  {
    icon: "check-circle",
    label: "No Dispute Found",
    description: "Property cleared of legal disputes",
  },
  {
    icon: "award",
    label: "Veriprops Verified Stamp",
    description: "Our seal of complete verification",
  },
];