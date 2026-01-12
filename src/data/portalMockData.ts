export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string | null;
  address: string;
}

export interface VerificationDocument {
  name: string;
  status: "verified" | "pending" | "flagged";
  verifiedDate?: string;
}

export interface TimelineEvent {
  date: string;
  event: string;
  description: string;
}

export interface Verification {
  id: string;
  propertyId: string;
  type: "land" | "residential" | "commercial";
  location: string;
  status: "pending" | "verified" | "flagged";
  riskScore: number;
  submittedDate: string;
  completedDate?: string;
  owner: string;
  titleStatus: string;
  size: string;
  coordinates: string;
  encumbrances: string[];
  documents: VerificationDocument[];
  timeline: TimelineEvent[];
}

export interface TaskChecklistItem {
  item: string;
  completed: boolean;
}

export interface TaskNote {
  author: string;
  date: string;
  content: string;
}

export interface Assignee {
  name: string;
  phone: string;
  email: string;
}

export type TaskRole = "land_surveyor" | "property_lawyer" | "registry_staff" | "field_agent";
export type TaskStatus = "pending" | "in_progress" | "completed" | "blocked";
export type TaskPriority = "high" | "medium" | "low";

export interface Task {
  id: string;
  title: string;
  verificationId: string;
  propertyLocation: string;
  role: TaskRole;
  assignee: Assignee | null;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string;
  createdAt: string;
  updatedAt: string;
  description: string;
  checklist: TaskChecklistItem[];
  notes: TaskNote[];
}

export type DisputeType = "ownership" | "boundary" | "title" | "encumbrance";
export type DisputeStatus = "active" | "under_review" | "resolved";

export interface DisputeParty {
  name: string;
  role: string;
  contact?: string;
}

export interface DisputeEvidence {
  name: string;
  uploadedAt: string;
  size: string;
  type: string;
}

export interface Dispute {
  id: string;
  title: string;
  verificationId: string;
  propertyLocation: string;
  type: DisputeType;
  status: DisputeStatus;
  filedDate: string;
  lastActivity: string;
  parties: {
    claimant: DisputeParty;
    respondent: DisputeParty;
    thirdParties: DisputeParty[];
  };
  description: string;
  evidence: DisputeEvidence[];
  timeline: TimelineEvent[];
  resolution: {
    outcome: string;
    decision: string;
    date: string;
    recommendations: string[];
  } | null;
}

export interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: string;
  read: boolean;
}
export interface Conversation {
  id: string;
  title: string;
  verificationId: string;
  agent: {
    name: string;
    role: string;
    avatar: string | null;
  };
  status: "active" | "resolved" | "pending";
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  messages: Message[];
}

export interface Payment {
  id: string;
  invoiceId: string;
  date: string;
  description: string;
  amount: number;
  status: "paid" | "pending" | "overdue";
  verificationId: string;
}

export type NotificationType = "report" | "message" | "invoice" | "task" | "dispute";

export interface Notification {
  id: number;
  type: NotificationType;
  title: string;
  message: string;
  time: string;
  read: boolean;
  link: string;
}

export interface FAQ {
  id: number;
  question: string;
  answer: string;
}

// Mock User
export const mockUser: User = {
  id: "usr_001",
  name: "Adebayo Johnson",
  email: "adebayo@example.com",
  phone: "+234 803 456 7890",
  avatar: null,
  address: "12 Admiralty Way, Lekki Phase 1, Lagos"
};

// Mock Verifications
export const mockVerifications: Verification[] = [
  {
    id: "VRP-2024-001",
    propertyId: "LAG-LK-00234",
    type: "land",
    location: "Plot 15, Lekki Phase 2, Lagos",
    status: "verified",
    riskScore: 12,
    submittedDate: "2024-01-15",
    completedDate: "2024-01-18",
    owner: "Chief Adewale Ogundimu",
    titleStatus: "Clean Title - Certificate of Occupancy",
    size: "950 sqm",
    coordinates: "6.4541° N, 3.4707° E",
    encumbrances: [],
    documents: [
      { name: "Certificate of Occupancy", status: "verified", verifiedDate: "2024-01-17" },
      { name: "Survey Plan", status: "verified", verifiedDate: "2024-01-17" },
      { name: "Deed of Assignment", status: "verified", verifiedDate: "2024-01-18" },
      { name: "Governor's Consent", status: "verified", verifiedDate: "2024-01-18" }
    ],
    timeline: [
      { date: "2024-01-15", event: "Verification Submitted", description: "Request received and payment confirmed" },
      { date: "2024-01-15", event: "Document Review Started", description: "Legal team began document analysis" },
      { date: "2024-01-16", event: "Field Survey Scheduled", description: "Land surveyor assigned for GPS mapping" },
      { date: "2024-01-17", event: "Registry Check Complete", description: "Ownership verified at Lagos Land Registry" },
      { date: "2024-01-18", event: "Verification Complete", description: "Property verified with low risk score" }
    ]
  },
  {
    id: "VRP-2024-002",
    propertyId: "LAG-VI-00891",
    type: "residential",
    location: "14 Adeola Odeku Street, Victoria Island, Lagos",
    status: "verified",
    riskScore: 8,
    submittedDate: "2024-01-20",
    completedDate: "2024-01-25",
    owner: "Mrs. Folake Adeniyi",
    titleStatus: "Clean Title - Registered Conveyance",
    size: "450 sqm",
    coordinates: "6.4281° N, 3.4219° E",
    encumbrances: [],
    documents: [
      { name: "Registered Conveyance", status: "verified", verifiedDate: "2024-01-24" },
      { name: "Survey Plan", status: "verified", verifiedDate: "2024-01-23" },
      { name: "Building Approval", status: "verified", verifiedDate: "2024-01-24" },
      { name: "Tax Clearance", status: "verified", verifiedDate: "2024-01-25" }
    ],
    timeline: [
      { date: "2024-01-20", event: "Verification Submitted", description: "Premium verification package selected" },
      { date: "2024-01-21", event: "Document Review Started", description: "All documents received and under review" },
      { date: "2024-01-23", event: "Physical Inspection", description: "Field agent completed site visit" },
      { date: "2024-01-25", event: "Verification Complete", description: "Property verified successfully" }
    ]
  },
  {
    id: "VRP-2024-003",
    propertyId: "LAG-AJ-00156",
    type: "land",
    location: "Scheme 2, Block 5, Ajah, Lagos",
    status: "flagged",
    riskScore: 78,
    submittedDate: "2024-01-22",
    completedDate: "2024-01-28",
    owner: "Unknown - Disputed",
    titleStatus: "Disputed - Multiple Claimants",
    size: "1,200 sqm",
    coordinates: "6.4698° N, 3.5852° E",
    encumbrances: ["Pending litigation", "Disputed ownership"],
    documents: [
      { name: "Survey Plan (Seller)", status: "flagged", verifiedDate: "2024-01-26" },
      { name: "Receipt of Purchase", status: "pending" },
      { name: "Family Agreement", status: "flagged", verifiedDate: "2024-01-27" }
    ],
    timeline: [
      { date: "2024-01-22", event: "Verification Submitted", description: "Request received" },
      { date: "2024-01-24", event: "Red Flags Detected", description: "Inconsistent ownership records found" },
      { date: "2024-01-26", event: "Investigation Escalated", description: "Property lawyer assigned for deep review" },
      { date: "2024-01-28", event: "Flagged - High Risk", description: "Multiple ownership claims discovered" }
    ]
  },
  {
    id: "VRP-2024-004",
    propertyId: "LAG-IK-00432",
    type: "commercial",
    location: "45 Allen Avenue, Ikeja, Lagos",
    status: "pending",
    riskScore: 0,
    submittedDate: "2024-02-01",
    owner: "Pending Verification",
    titleStatus: "Under Review",
    size: "2,500 sqm",
    coordinates: "6.5954° N, 3.3464° E",
    encumbrances: [],
    documents: [
      { name: "Certificate of Occupancy", status: "pending" },
      { name: "Survey Plan", status: "pending" },
      { name: "Building Plans", status: "pending" }
    ],
    timeline: [
      { date: "2024-02-01", event: "Verification Submitted", description: "Enterprise package selected" },
      { date: "2024-02-01", event: "Payment Confirmed", description: "₦150,000 payment received" }
    ]
  },
  {
    id: "VRP-2024-005",
    propertyId: "ABJ-MA-00789",
    type: "residential",
    location: "Plot 234, Maitama District, Abuja",
    status: "pending",
    riskScore: 0,
    submittedDate: "2024-02-03",
    owner: "Pending Verification",
    titleStatus: "Under Review",
    size: "800 sqm",
    coordinates: "9.0827° N, 7.4934° E",
    encumbrances: [],
    documents: [
      { name: "Right of Occupancy", status: "pending" },
      { name: "Approved Building Plan", status: "pending" }
    ],
    timeline: [
      { date: "2024-02-03", event: "Verification Submitted", description: "Standard package selected" }
    ]
  },
  {
    id: "VRP-2024-006",
    propertyId: "LAG-EP-00567",
    type: "land",
    location: "Epe Expressway, Epe, Lagos",
    status: "verified",
    riskScore: 25,
    submittedDate: "2024-01-10",
    completedDate: "2024-01-14",
    owner: "Alhaji Musa Ibrahim",
    titleStatus: "Excision in Progress",
    size: "5 Acres",
    coordinates: "6.5833° N, 3.9833° E",
    encumbrances: ["Government acquisition pending review"],
    documents: [
      { name: "Excision Document", status: "verified", verifiedDate: "2024-01-13" },
      { name: "Survey Plan", status: "verified", verifiedDate: "2024-01-12" },
      { name: "Gazette Publication", status: "verified", verifiedDate: "2024-01-14" }
    ],
    timeline: [
      { date: "2024-01-10", event: "Verification Submitted", description: "Large land parcel verification" },
      { date: "2024-01-12", event: "Survey Completed", description: "GPS coordinates confirmed" },
      { date: "2024-01-14", event: "Verification Complete", description: "Moderate risk - excision pending" }
    ]
  }
];

// Mock Tasks
export const mockTasks: Task[] = [
  {
    id: "TSK-001",
    title: "GPS Boundary Survey",
    verificationId: "VRP-2024-001",
    propertyLocation: "Plot 15, Lekki Phase 2, Lagos",
    role: "land_surveyor",
    assignee: { name: "Engr. Kunle Adeyemi", phone: "+234 801 234 5678", email: "kunle@surveys.ng" },
    status: "completed",
    priority: "high",
    dueDate: "2024-01-17",
    createdAt: "2024-01-15",
    updatedAt: "2024-01-17",
    description: "Conduct GPS boundary survey and verify plot dimensions match the survey plan. Document all corner beacons and boundary markers.",
    checklist: [
      { item: "Measure all plot boundaries", completed: true },
      { item: "Record GPS coordinates of corners", completed: true },
      { item: "Photo documentation of beacons", completed: true },
      { item: "Compare with existing survey plan", completed: true },
      { item: "Submit survey report", completed: true }
    ],
    notes: [
      { author: "Engr. Kunle Adeyemi", date: "2024-01-16", content: "Site access granted. Beginning measurements." },
      { author: "Engr. Kunle Adeyemi", date: "2024-01-17", content: "All boundaries confirmed. Dimensions match survey plan exactly." }
    ]
  },
  {
    id: "TSK-002",
    title: "Title Document Review",
    verificationId: "VRP-2024-003",
    propertyLocation: "Scheme 2, Block 5, Ajah, Lagos",
    role: "property_lawyer",
    assignee: { name: "Barr. Chioma Eze", phone: "+234 802 345 6789", email: "chioma@legalservices.ng" },
    status: "in_progress",
    priority: "high",
    dueDate: "2024-01-30",
    createdAt: "2024-01-24",
    updatedAt: "2024-01-28",
    description: "Review all title documents for authenticity. Verify ownership chain and identify any encumbrances or disputes.",
    checklist: [
      { item: "Review deed of assignment", completed: true },
      { item: "Verify seller's title", completed: true },
      { item: "Check for existing litigation", completed: true },
      { item: "Search at land registry", completed: false },
      { item: "Prepare legal opinion", completed: false }
    ],
    notes: [
      { author: "Barr. Chioma Eze", date: "2024-01-26", content: "Found inconsistencies in the family agreement document." },
      { author: "Barr. Chioma Eze", date: "2024-01-28", content: "Multiple parties claiming ownership. Recommending dispute escalation." }
    ]
  },
  {
    id: "TSK-003",
    title: "Land Registry Search",
    verificationId: "VRP-2024-004",
    propertyLocation: "45 Allen Avenue, Ikeja, Lagos",
    role: "registry_staff",
    assignee: { name: "Mr. Tunde Bakare", phone: "+234 803 456 7890", email: "tunde@registry.gov.ng" },
    status: "pending",
    priority: "medium",
    dueDate: "2024-02-05",
    createdAt: "2024-02-01",
    updatedAt: "2024-02-01",
    description: "Conduct comprehensive search at Lagos State Land Registry. Verify C of O status and check for any registered encumbrances.",
    checklist: [
      { item: "Search property register", completed: false },
      { item: "Verify C of O authenticity", completed: false },
      { item: "Check encumbrance register", completed: false },
      { item: "Obtain certified true copy", completed: false },
      { item: "Submit registry report", completed: false }
    ],
    notes: []
  },
  {
    id: "TSK-004",
    title: "Physical Site Inspection",
    verificationId: "VRP-2024-005",
    propertyLocation: "Plot 234, Maitama District, Abuja",
    role: "field_agent",
    assignee: { name: "Mr. Ibrahim Mohammed", phone: "+234 804 567 8901", email: "ibrahim@veriprops.ng" },
    status: "pending",
    priority: "medium",
    dueDate: "2024-02-07",
    createdAt: "2024-02-03",
    updatedAt: "2024-02-03",
    description: "Conduct physical inspection of the property. Document current state, occupancy status, and take comprehensive photos.",
    checklist: [
      { item: "Visit property location", completed: false },
      { item: "Document current occupancy", completed: false },
      { item: "Take photos (exterior/interior)", completed: false },
      { item: "Interview neighbors", completed: false },
      { item: "Verify physical address", completed: false },
      { item: "Submit inspection report", completed: false }
    ],
    notes: []
  },
  {
    id: "TSK-005",
    title: "Survey Plan Verification",
    verificationId: "VRP-2024-006",
    propertyLocation: "Epe Expressway, Epe, Lagos",
    role: "land_surveyor",
    assignee: { name: "Engr. Kunle Adeyemi", phone: "+234 801 234 5678", email: "kunle@surveys.ng" },
    status: "completed",
    priority: "high",
    dueDate: "2024-01-12",
    createdAt: "2024-01-10",
    updatedAt: "2024-01-12",
    description: "Verify survey plan against actual land boundaries. This is a large parcel requiring extensive boundary mapping.",
    checklist: [
      { item: "Review existing survey plan", completed: true },
      { item: "Conduct field survey", completed: true },
      { item: "Map all 5 acres", completed: true },
      { item: "Document access roads", completed: true },
      { item: "Submit final report", completed: true }
    ],
    notes: [
      { author: "Engr. Kunle Adeyemi", date: "2024-01-12", content: "Survey complete. Boundaries match plan. Noted government acquisition markers on eastern edge." }
    ]
  },
  {
    id: "TSK-006",
    title: "Ownership Chain Analysis",
    verificationId: "VRP-2024-001",
    propertyLocation: "Plot 15, Lekki Phase 2, Lagos",
    role: "property_lawyer",
    assignee: { name: "Barr. Femi Okonkwo", phone: "+234 805 678 9012", email: "femi@lawfirm.ng" },
    status: "completed",
    priority: "medium",
    dueDate: "2024-01-18",
    createdAt: "2024-01-15",
    updatedAt: "2024-01-18",
    description: "Trace complete ownership history from original allocation to current owner. Verify all transfers were properly executed.",
    checklist: [
      { item: "Obtain ownership history", completed: true },
      { item: "Verify each transfer", completed: true },
      { item: "Check governor's consents", completed: true },
      { item: "Confirm current ownership", completed: true },
      { item: "Prepare chain report", completed: true }
    ],
    notes: [
      { author: "Barr. Femi Okonkwo", date: "2024-01-18", content: "Clean ownership chain. All transfers properly documented with appropriate consents." }
    ]
  },
  {
    id: "TSK-007",
    title: "Building Approval Verification",
    verificationId: "VRP-2024-002",
    propertyLocation: "14 Adeola Odeku Street, Victoria Island, Lagos",
    role: "registry_staff",
    assignee: { name: "Mrs. Ngozi Obi", phone: "+234 806 789 0123", email: "ngozi@lasppda.gov.ng" },
    status: "completed",
    priority: "low",
    dueDate: "2024-01-24",
    createdAt: "2024-01-21",
    updatedAt: "2024-01-24",
    description: "Verify building approval status at LASPPDA. Confirm structure matches approved plans.",
    checklist: [
      { item: "Search approval records", completed: true },
      { item: "Verify approval certificate", completed: true },
      { item: "Check building plans", completed: true },
      { item: "Confirm compliance", completed: true }
    ],
    notes: [
      { author: "Mrs. Ngozi Obi", date: "2024-01-24", content: "Building approval verified. Structure compliant with approved plans." }
    ]
  },
  {
    id: "TSK-008",
    title: "Neighbor Boundary Confirmation",
    verificationId: "VRP-2024-003",
    propertyLocation: "Scheme 2, Block 5, Ajah, Lagos",
    role: "field_agent",
    assignee: null,
    status: "blocked",
    priority: "high",
    dueDate: "2024-01-29",
    createdAt: "2024-01-26",
    updatedAt: "2024-01-29",
    description: "Interview neighboring property owners to confirm boundaries and identify any ongoing disputes.",
    checklist: [
      { item: "Identify adjacent owners", completed: true },
      { item: "Schedule interviews", completed: false },
      { item: "Document boundary agreements", completed: false },
      { item: "Report findings", completed: false }
    ],
    notes: [
      { author: "System", date: "2024-01-29", content: "Task blocked: Property under active dispute. Awaiting legal guidance before proceeding with neighbor interviews." }
    ]
  }
];

// Mock Disputes
export const mockDisputes: Dispute[] = [
  {
    id: "DSP-001",
    title: "Ownership Contestation - Plot 23 Ajah",
    verificationId: "VRP-2024-003",
    propertyLocation: "Scheme 2, Block 5, Ajah, Lagos",
    type: "ownership",
    status: "active",
    filedDate: "2024-01-28",
    lastActivity: "2024-02-02",
    parties: {
      claimant: { name: "Adebayo Johnson", role: "Buyer", contact: "+234 803 456 7890" },
      respondent: { name: "Chief Emeka Okafor", role: "Seller", contact: "+234 807 890 1234" },
      thirdParties: [
        { name: "Okafor Family Union", role: "Family Representatives" }
      ]
    },
    description: "During verification, registry records showed a different registered owner than the seller. The Okafor family claims the property was sold without proper family consent. Multiple individuals now claim rightful ownership of the property.",
    evidence: [
      { name: "Original Survey Plan.pdf", uploadedAt: "2024-01-28", size: "2.4 MB", type: "Survey Document" },
      { name: "Seller ID Document.pdf", uploadedAt: "2024-01-28", size: "1.1 MB", type: "Identity Document" },
      { name: "Family Meeting Minutes.pdf", uploadedAt: "2024-01-30", size: "850 KB", type: "Family Document" },
      { name: "Registry Search Result.pdf", uploadedAt: "2024-02-01", size: "1.8 MB", type: "Official Record" }
    ],
    timeline: [
      { date: "2024-01-28", event: "Dispute Filed", description: "Ownership discrepancy flagged during verification" },
      { date: "2024-01-29", event: "Investigation Started", description: "Case assigned to legal review team" },
      { date: "2024-01-30", event: "Evidence Submitted", description: "Seller provided family meeting minutes" },
      { date: "2024-02-01", event: "Registry Search Complete", description: "Official records obtained from Land Registry" },
      { date: "2024-02-02", event: "Third Party Identified", description: "Okafor Family Union submitted counterclaim" }
    ],
    resolution: null
  },
  {
    id: "DSP-002",
    title: "Boundary Encroachment Dispute",
    verificationId: "VRP-2024-006",
    propertyLocation: "Epe Expressway, Epe, Lagos",
    type: "boundary",
    status: "under_review",
    filedDate: "2024-01-14",
    lastActivity: "2024-01-25",
    parties: {
      claimant: { name: "Alhaji Musa Ibrahim", role: "Property Owner", contact: "+234 808 901 2345" },
      respondent: { name: "Lagos State Government", role: "Acquiring Authority" },
      thirdParties: []
    },
    description: "Government acquisition markers found on the eastern boundary encroach into privately owned land. The acquisition gazette appears to cover a larger area than originally communicated to the landowner.",
    evidence: [
      { name: "Excision Document.pdf", uploadedAt: "2024-01-14", size: "3.2 MB", type: "Title Document" },
      { name: "GPS Survey Report.pdf", uploadedAt: "2024-01-14", size: "4.5 MB", type: "Survey Document" },
      { name: "Government Gazette.pdf", uploadedAt: "2024-01-20", size: "1.2 MB", type: "Official Record" }
    ],
    timeline: [
      { date: "2024-01-14", event: "Dispute Filed", description: "Boundary discrepancy identified during survey" },
      { date: "2024-01-18", event: "Government Response Requested", description: "Official inquiry sent to Ministry of Lands" },
      { date: "2024-01-25", event: "Under Review", description: "Awaiting response from government authorities" }
    ],
    resolution: null
  },
  {
    id: "DSP-003",
    title: "Title Document Authenticity",
    verificationId: "VRP-2024-002",
    propertyLocation: "14 Adeola Odeku Street, Victoria Island, Lagos",
    type: "title",
    status: "resolved",
    filedDate: "2024-01-22",
    lastActivity: "2024-01-24",
    parties: {
      claimant: { name: "Mrs. Folake Adeniyi", role: "Property Owner", contact: "+234 809 012 3456" },
      respondent: { name: "Unknown", role: "Alleged Forger" },
      thirdParties: []
    },
    description: "Initial registry search returned a different document number than the seller's conveyance. Investigation revealed a clerical error at the registry, not fraud.",
    evidence: [
      { name: "Original Conveyance.pdf", uploadedAt: "2024-01-22", size: "2.1 MB", type: "Title Document" },
      { name: "Registry Correction Letter.pdf", uploadedAt: "2024-01-24", size: "450 KB", type: "Official Record" }
    ],
    timeline: [
      { date: "2024-01-22", event: "Dispute Filed", description: "Document number mismatch detected" },
      { date: "2024-01-23", event: "Registry Investigation", description: "Physical verification at Land Registry" },
      { date: "2024-01-24", event: "Resolved - Clerical Error", description: "Registry confirmed error and issued correction" }
    ],
    resolution: {
      outcome: "Resolved - No Fraud",
      decision: "The document number discrepancy was caused by a clerical error during registry data entry. The title document is authentic and properly registered.",
      date: "2024-01-24",
      recommendations: [
        "Proceed with property transaction",
        "Keep registry correction letter with title documents",
        "No further action required"
      ]
    }
  },
  {
    id: "DSP-004",
    title: "Undisclosed Mortgage Lien",
    verificationId: "VRP-2024-001",
    propertyLocation: "Plot 15, Lekki Phase 2, Lagos",
    type: "encumbrance",
    status: "resolved",
    filedDate: "2024-01-16",
    lastActivity: "2024-01-17",
    parties: {
      claimant: { name: "Adebayo Johnson", role: "Buyer", contact: "+234 803 456 7890" },
      respondent: { name: "Chief Adewale Ogundimu", role: "Seller", contact: "+234 810 123 4567" },
      thirdParties: [
        { name: "First Bank of Nigeria", role: "Lien Holder" }
      ]
    },
    description: "Registry search revealed an existing mortgage in favor of First Bank. The seller had failed to disclose this encumbrance during initial negotiations.",
    evidence: [
      { name: "Mortgage Deed.pdf", uploadedAt: "2024-01-16", size: "1.8 MB", type: "Legal Document" },
      { name: "Bank Clearance Letter.pdf", uploadedAt: "2024-01-17", size: "520 KB", type: "Bank Document" }
    ],
    timeline: [
      { date: "2024-01-16", event: "Encumbrance Discovered", description: "Mortgage lien found during registry search" },
      { date: "2024-01-16", event: "Seller Notified", description: "Seller informed of undisclosed encumbrance" },
      { date: "2024-01-17", event: "Mortgage Cleared", description: "Seller provided bank clearance and deed release" }
    ],
    resolution: {
      outcome: "Resolved - Encumbrance Cleared",
      decision: "The seller has fully repaid the mortgage facility and obtained a release deed from First Bank. The property is now free of encumbrances.",
      date: "2024-01-17",
      recommendations: [
        "Verify release deed registration at Land Registry",
        "Include clearance documents in transaction file",
        "Proceed with purchase after confirmation"
      ]
    }
  }
];

// Mock Conversations
export const mockConversations: Conversation[] = [
  {
    id: "chat-001",
    title: "VRP-2024-001 - Lekki Plot Verification",
    verificationId: "VRP-2024-001",
    agent: { name: "Sarah Okonkwo", role: "Senior Verification Officer", avatar: null },
    status: "resolved",
    lastMessage: "Your verification is complete. The property has been verified with a low risk score.",
    lastMessageTime: "2024-01-18 14:30",
    unreadCount: 0,
    messages: [
      { id: "m1", senderId: "agent", content: "Hello! I've been assigned to handle your verification request for VRP-2024-001. I'll keep you updated on the progress.", timestamp: "2024-01-15 09:00", read: true },
      { id: "m2", senderId: "user", content: "Thank you! How long does the verification usually take?", timestamp: "2024-01-15 09:15", read: true },
      { id: "m3", senderId: "agent", content: "For the Premium package, we typically complete within 3-5 business days. I'll update you at each milestone.", timestamp: "2024-01-15 09:20", read: true },
      { id: "m4", senderId: "agent", content: "Update: Document review is complete. Our surveyor will visit the site tomorrow.", timestamp: "2024-01-16 16:00", read: true },
      { id: "m5", senderId: "user", content: "Great, thanks for the update!", timestamp: "2024-01-16 16:30", read: true },
      { id: "m6", senderId: "agent", content: "Your verification is complete. The property has been verified with a low risk score. You can download the full report from your dashboard.", timestamp: "2024-01-18 14:30", read: true }
    ]
  },
  {
    id: "chat-002",
    title: "VRP-2024-003 - Ajah Land Dispute",
    verificationId: "VRP-2024-003",
    agent: { name: "Emeka Nwosu", role: "Legal Specialist", avatar: null },
    status: "active",
    lastMessage: "We've escalated this to our dispute resolution team. I'll schedule a call to discuss your options.",
    lastMessageTime: "2024-02-02 11:45",
    unreadCount: 2,
    messages: [
      { id: "m1", senderId: "agent", content: "I'm reviewing the flagged issues with your Ajah property verification. There appear to be some ownership concerns.", timestamp: "2024-01-26 10:00", read: true },
      { id: "m2", senderId: "user", content: "What kind of concerns? The seller showed me all the documents.", timestamp: "2024-01-26 10:30", read: true },
      { id: "m3", senderId: "agent", content: "Our registry search found records showing a different registered owner. We're investigating further.", timestamp: "2024-01-26 11:00", read: true },
      { id: "m4", senderId: "user", content: "This is very concerning. What should I do?", timestamp: "2024-01-28 09:00", read: true },
      { id: "m5", senderId: "agent", content: "I strongly advise not to proceed with any payment until this is resolved. A formal dispute has been opened.", timestamp: "2024-01-28 09:30", read: true },
      { id: "m6", senderId: "agent", content: "We've escalated this to our dispute resolution team. I'll schedule a call to discuss your options.", timestamp: "2024-02-02 11:45", read: false }
    ]
  },
  {
    id: "chat-003",
    title: "VRP-2024-004 - Ikeja Commercial",
    verificationId: "VRP-2024-004",
    agent: { name: "Funke Adeleke", role: "Verification Officer", avatar: null },
    status: "active",
    lastMessage: "Thank you for your patience. We're awaiting the registry results.",
    lastMessageTime: "2024-02-02 09:00",
    unreadCount: 1,
    messages: [
      { id: "m1", senderId: "agent", content: "Welcome! Your Enterprise verification request has been received. This comprehensive package includes full due diligence.", timestamp: "2024-02-01 10:00", read: true },
      { id: "m2", senderId: "user", content: "Thanks! This is for a commercial property purchase. When can I expect results?", timestamp: "2024-02-01 10:30", read: true },
      { id: "m3", senderId: "agent", content: "Enterprise verifications take 5-7 business days due to the comprehensive checks involved. I'll keep you posted.", timestamp: "2024-02-01 10:45", read: true },
      { id: "m4", senderId: "agent", content: "Thank you for your patience. We're awaiting the registry results.", timestamp: "2024-02-02 09:00", read: false }
    ]
  },
  {
    id: "chat-004",
    title: "General Inquiry - Multiple Properties",
    verificationId: "",
    agent: { name: "Customer Support", role: "Support Team", avatar: null },
    status: "pending",
    lastMessage: "We offer bulk verification discounts for 5+ properties. Would you like more details?",
    lastMessageTime: "2024-01-30 15:00",
    unreadCount: 0,
    messages: [
      { id: "m1", senderId: "user", content: "Hi, I'm interested in verifying multiple properties for a real estate portfolio. Do you offer any discounts?", timestamp: "2024-01-30 14:30", read: true },
      { id: "m2", senderId: "agent", content: "We offer bulk verification discounts for 5+ properties. Would you like more details?", timestamp: "2024-01-30 15:00", read: true }
    ]
  }
];

// Mock Payments
export const mockPayments: Payment[] = [
  {
    id: "pay-001",
    invoiceId: "INV-2024-0001",
    date: "2024-01-15",
    description: "Premium Verification - VRP-2024-001",
    amount: 75000,
    status: "paid",
    verificationId: "VRP-2024-001"
  },
  {
    id: "pay-002",
    invoiceId: "INV-2024-0002",
    date: "2024-01-20",
    description: "Premium Verification - VRP-2024-002",
    amount: 75000,
    status: "paid",
    verificationId: "VRP-2024-002"
  },
  {
    id: "pay-003",
    invoiceId: "INV-2024-0003",
    date: "2024-01-22",
    description: "Standard Verification - VRP-2024-003",
    amount: 45000,
    status: "paid",
    verificationId: "VRP-2024-003"
  },
  {
    id: "pay-004",
    invoiceId: "INV-2024-0004",
    date: "2024-02-01",
    description: "Enterprise Verification - VRP-2024-004",
    amount: 150000,
    status: "pending",
    verificationId: "VRP-2024-004"
  },
  {
    id: "pay-005",
    invoiceId: "INV-2024-0005",
    date: "2024-02-03",
    description: "Standard Verification - VRP-2024-005",
    amount: 45000,
    status: "overdue",
    verificationId: "VRP-2024-005"
  }
];

// Mock Notifications
export const mockNotifications: Notification[] = [
  { id: 1, type: "task", title: "Task Completed", message: "GPS Survey for VRP-2024-001 completed by Engr. Kunle", time: "1 hour ago", read: false, link: "/portal/tasks/TSK-001" },
  { id: 2, type: "dispute", title: "Dispute Update", message: "New evidence submitted for DSP-001 ownership case", time: "3 hours ago", read: false, link: "/portal/disputes/DSP-001" },
  { id: 3, type: "report", title: "Report Ready", message: "VRP-2024-002 verification report is ready for download", time: "5 hours ago", read: false, link: "/portal/verifications/VRP-2024-002" },
  { id: 4, type: "message", title: "New Message", message: "Emeka Nwosu replied to your query about Ajah property", time: "Yesterday", read: true, link: "/portal/chats" },
  { id: 5, type: "invoice", title: "Payment Due", message: "Invoice INV-2024-0005 is now overdue", time: "2 days ago", read: true, link: "/portal/payments" },
  { id: 6, type: "report", title: "Verification Flagged", message: "VRP-2024-003 has been flagged - high risk detected", time: "3 days ago", read: true, link: "/portal/verifications/VRP-2024-003" },
  { id: 7, type: "task", title: "Task Assigned", message: "New registry search task assigned for VRP-2024-004", time: "4 days ago", read: true, link: "/portal/tasks/TSK-003" },
  { id: 8, type: "invoice", title: "Payment Received", message: "Payment of ₦75,000 confirmed for VRP-2024-002", time: "1 week ago", read: true, link: "/portal/payments" }
];

// Mock FAQs
export const mockFAQs: FAQ[] = [
  { 
    id: 1,
    question: "How long does a property verification take?",
    answer: "Verification timelines depend on the package selected. Standard verification takes 3-5 business days, Premium takes 2-4 days with priority processing, and Enterprise comprehensive verification takes 5-7 days due to the extensive due diligence involved."
  },
  {
    id: 2,
    question: "What documents do I need to submit for verification?",
    answer: "You'll need to provide the property's survey plan, any existing title documents (C of O, Deed of Assignment, etc.), proof of ownership from the seller, and the property address. Our team may request additional documents during the verification process."
  },
  {
    id: 3,
    question: "What happens if my property is flagged as high risk?",
    answer: "If a property is flagged, our team will provide a detailed report explaining the issues found. You'll be assigned a dedicated specialist who will guide you through your options, which may include dispute resolution services or recommendations to not proceed with the transaction."
  },
  {
    id: 4,
    question: "How are verification tasks assigned and tracked?",
    answer: "Verification tasks are automatically assigned to our network of certified professionals including land surveyors, property lawyers, registry staff, and field agents based on the property location and verification requirements. You can track all task progress in the Tasks section of your portal."
  },
  {
    id: 5,
    question: "What types of disputes can Veriprops help resolve?",
    answer: "We handle ownership disputes, boundary disputes, title authenticity issues, and undisclosed encumbrances. Our dispute resolution team includes legal experts who can mediate between parties and provide expert opinions to support resolution."
  },
  {
    id: 6,
    question: "Can I download my verification report?",
    answer: "Yes, once your verification is complete, you can download a comprehensive PDF report from the Verification Detail page. This report includes all findings, risk assessment, document verification status, and recommendations."
  },
  {
    id: 7,
    question: "What payment methods do you accept?",
    answer: "We accept bank transfers, card payments (Visa, Mastercard), and mobile money (Paystack, Flutterwave). All payments are processed securely and you'll receive an electronic receipt immediately."
  },
  {
    id: 8,
    question: "How do I contact my assigned verification officer?",
    answer: "You can communicate with your assigned officer through the Chats section of the portal. Each verification has a dedicated chat thread where you can ask questions and receive updates. For urgent matters, contact details are also provided in your verification details."
  }
];

// Helper functions
export const getRoleBadgeColor = (role: TaskRole): string => {
  const colors: Record<TaskRole, string> = {
    land_surveyor: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    property_lawyer: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
    registry_staff: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
    field_agent: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
  };
  return colors[role];
};

export const getRoleLabel = (role: TaskRole): string => {
  const labels: Record<TaskRole, string> = {
    land_surveyor: "Land Surveyor",
    property_lawyer: "Property Lawyer",
    registry_staff: "Registry Staff",
    field_agent: "Field Agent"
  };
  return labels[role];
};

export const getDisputeTypeBadgeColor = (type: DisputeType): string => {
  const colors: Record<DisputeType, string> = {
    ownership: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    boundary: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
    title: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
    encumbrance: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
  };
  return colors[type];
};

export const getDisputeTypeLabel = (type: DisputeType): string => {
  const labels: Record<DisputeType, string> = {
    ownership: "Ownership Dispute",
    boundary: "Boundary Dispute",
    title: "Title Dispute",
    encumbrance: "Encumbrance Issue"
  };
  return labels[type];
};

export const getStatusBadgeColor = (status: string): string => {
  const colors: Record<string, string> = {
    pending: "bg-muted text-muted-foreground",
    in_progress: "bg-warning/10 text-warning dark:bg-warning/20",
    completed: "bg-success/10 text-success dark:bg-success/20",
    blocked: "bg-danger/10 text-danger dark:bg-danger/20",
    verified: "bg-success/10 text-success dark:bg-success/20",
    flagged: "bg-danger/10 text-danger dark:bg-danger/20",
    active: "bg-danger/10 text-danger dark:bg-danger/20",
    under_review: "bg-warning/10 text-warning dark:bg-warning/20",
    resolved: "bg-success/10 text-success dark:bg-success/20",
    paid: "bg-success/10 text-success dark:bg-success/20",
    overdue: "bg-danger/10 text-danger dark:bg-danger/20"
  };
  return colors[status] || "bg-muted text-muted-foreground";
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0
  }).format(amount);
};

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-NG', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};
