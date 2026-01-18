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
  is_available?: boolean;
  jurisdiction?: string;
  verifier_id?: string;
  status?: TaskStatus;
}

// Query DTO (combination of Create + PartialUpdate + BaseQuery)
export interface QueryTaskDto
  extends CreateTaskDto,
    BaseQueryDto {
  property_id: string;
  property_parcel_id: string;
  property_title: string;
  plot_size: Measurement;
  location: {
    address: string;
    country: string;
    state: string;
    city: string;
    grouping_city: string;
    area: string;
    coordinates?: { lat: number; lng: number };
  };

  verifier_id: string | null;
  role_required: VerifierRole;
  verification_focus: string[];
  required_response: MediaType[];
  provided_response: MediaType[];
  status: TaskStatus;
  availability_status?: TaskAvailabilityStatus;
  date_assigned: string;
  date_due: string;
  // sla_progress: number;
  // sla_hours: number;
  // progress?: number;
  notes?: string[];
  qualified_verifier_ids: string[];

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
  in_progress: number;
  due_soon: number;
  submitted: number;
  overdue: number;
  avg_resolution__hours: number;
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
  { key: "in_progress", value: "In Progress" },
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
  task_id: string;
  type: AttachmentType;
  status?: AttachmentStatus;
  filename: string;
  filesize_bytes?: number;
  hash?: string;
  metadata?: {
    lat?: number;
    lng?: number;
    timestamp?: string;
    device_id?: string;
    exif?: any;
  };
  date_uploaded?: string;
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
  task_id: string;
  verifier_id: string;
  action: string;
  date_audited: string;
  details?: any;
}
