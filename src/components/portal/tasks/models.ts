/* eslint-disable @typescript-eslint/no-empty-object-type */

import { BaseQueryDto, Measurement, PageRequest, KeyValue } from "types/models";
import { MediaType } from "@components/ui/upload/MediaCard";

export enum VerifierRole {
  LAWYER = "Lawyer",
  SURVEYOR = "Surveyor",
  FIELD_AGENT = "FieldAgent",
  REGISTRY = "Registry",
}

/**
 *  VERIFIER TASK
 */
export interface TaskBaseDto {}

// Create DTO
export interface CreateTaskDto extends TaskBaseDto {}

export interface SearchTaskDto extends PageRequest, BaseQueryDto {
  isAvailable?: boolean;
  jurisdiction?: string;
  verifierId?: string;
  status?: TaskStatus;
}

// Query DTO (combination of Create + PartialUpdate + BaseQuery)
export interface QueryTaskDto
  extends CreateTaskDto,
    BaseQueryDto {
  property_id: string;
  property_parcel_id: string;
  propertyTitle: string;
  plotSize: Measurement;
  location: ExactLocation;

  verifierId: string | null;
  roleRequired: VerifierRole;
  verificationFocus: string[];
  requiredResponse: MediaType[];
  providedResponse: MediaType[];
  status: TaskStatus;
  availabilityStatus?: TaskAvailabilityStatus;
  dateAssigned: string;
  dateDue: string;
  // sla_progress: number;
  // sla_hours: number;
  // progress?: number;
  notes?: string[];
  qualifiedVerifierIds: string[];

  // response?: ResponseItem[];
  // history?: AuditEntry[];
  // formDraft?: any;
}

export enum TaskStatus {
  ASSIGNED = "Assigned",
  ACCEPTED = "Accepted",
  IN_PROGRESS = "In Progress",
  DUE_SOON = "Due Soon",
  SUBMITTED = "Submitted",
  COMPLETED = "Completed",
  DECLINED = "Declined",
  OVERDUE = "Overdue",
}

export enum TaskAvailabilityStatus {
  PENDING = "pending",
  ACCEPTED = "accepted",
  DECLINED = "declined",
}

export interface QueryTaskStatsDto {
  assigned: number;
  inProgress: number;
  dueSoon: number;
  submitted: number;
  overdue: number;
  avgResolutionHours: number;
}

export interface TaskStatusDetail {
  key: string;
  title: string;
  value?: number | string;
  icon?: React.ComponentType<{ className?: string }>;
  color?: string;
  bgColor?: string;
  subtitle?: string;
}

export const verifierStatuses: KeyValue[] = [
  { key: "all", value: "All Status" },
  { key: "assigned", value: "Assigned" },
  { key: "accepted", value: "Accepted" },
  { key: "inProgress", value: "In Progress" },
  { key: "submitted", value: "Submitted" },
  { key: "completed", value: "Completed" },
  { key: "declined", value: "Declined" },
  { key: "overdue", value: "Overdue" },
];

/**
 * VERIFIER RESPONSE
 */

export interface VerifierResponseBaseDto {}

// Create DTO
export interface CreateVerifierResponseDto extends VerifierResponseBaseDto {}

export interface SearchVerifierResponseDto extends PageRequest, BaseQueryDto {}
export interface QueryVerifierResponseDto
  extends CreateVerifierResponseDto,
    BaseQueryDto {
  uploads?: QueryVerifierResponseUploadsDto[]
}



export interface CreateVerifierResponseUploadsDto
  extends BaseQueryDto {
  taskId: string;
  type: AttachmentType;
  status?: AttachmentStatus;
  filename: string;
  filesizeBytes?: number;
  hash?: string;
  metadata?: {
    lat?: number;
    lng?: number;
    timestamp?: string;
    deviceId?: string;
    exif?: any;
  };
  dateUploaded?: string;
  comment?: string;
}


export interface QueryVerifierResponseUploadsDto
  extends CreateVerifierResponseUploadsDto, BaseQueryDto {
}

export enum AttachmentType {
  Photo = "photo",
  Video = "video",
  Pdf = "pdf",
  GpsTrace = "gps_trace",
  OcrText = "ocr_text",
}

export enum AttachmentStatus {
  Local = "local",
  Queued = "queued",
  Uploaded = "uploaded",
  Failed = "failed",
}

// FORMS


/**
 * VERIFIER ACTIVITY AUDIT
 */

export interface VerifierActivityAuditBaseDto {}

// Create DTO
export interface CreateVerifierActivityAuditDto extends VerifierActivityAuditBaseDto {}

export interface SearchVerifierActivityAuditDto extends PageRequest, BaseQueryDto {}
export interface QueryVerifierActivityAuditDto
  extends CreateVerifierActivityAuditDto,
    BaseQueryDto {
  taskId: string;
  verifierId: string;
  action: string;
  dateAudited: string;
  details?: any;
}
