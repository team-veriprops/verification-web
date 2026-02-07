import {
  CreateVerifierResponseDto,
  CreateVerifierResponseUploadsDto,
  QueryVerifierActivityAuditDto,
  QueryVerifierResponseDto,
  QueryVerifierResponseUploadsDto,
  QueryTaskDto,
  QueryTaskStatsDto,
  SearchVerifierActivityAuditDto,
  SearchTaskDto,
} from "../models";
import { Page } from "types/models";
import { toQueryParams } from "@lib/utils";
import { HttpClient } from "@lib/FetchHttpClient";

export class VerifierService {
  verifierBaseUrl: string;
  constructor(private readonly http: HttpClient) {
    this.verifierBaseUrl = "/tasks";
  }


  async getTaskStats(
    verifierId: string
  ): Promise<QueryTaskStatsDto> {
    return await this.http.get<QueryTaskStatsDto>(
      `${this.verifierBaseUrl}/${verifierId}/stats`
    );
  }

  async searchTaskPage(
    verifierId: string,
    payload: SearchTaskDto
  ): Promise<Page<QueryTaskDto>> {
    const query = toQueryParams(payload);
    return await this.http.get<Page<QueryTaskDto>>(
      `${this.verifierBaseUrl}/${verifierId}?${query}`
    );
  }

  /**
   * VERIFIER RESPONSE
   */
  async createTaskResponse(
    taskId: string,
    payload: CreateVerifierResponseDto
  ): Promise<QueryVerifierResponseDto> {
    return await this.http.post<CreateVerifierResponseDto>(
      `${this.verifierBaseUrl}/task-response/${taskId}`,
      payload
    );
  }

  async createTaskResponseUpload(
    taskId: string,
    payload: CreateVerifierResponseUploadsDto
  ): Promise<QueryVerifierResponseUploadsDto> {
    return await this.http.post<QueryVerifierResponseUploadsDto>(
      `${this.verifierBaseUrl}/task-response/${taskId}/uploads`,
      payload
    );
  }

  async getTaskResponse(
    taskId: string
  ): Promise<QueryVerifierResponseDto> {
    return await this.http.get<QueryVerifierResponseDto>(
      `${this.verifierBaseUrl}/task-response/${taskId}`,
    );
  }

  /**
   * VERIFIER ACTIVITY AUDIT
   */
  async searchVerifierActivityAuditPage(
    taskId: string,
    payload: SearchVerifierActivityAuditDto
  ): Promise<Page<QueryVerifierActivityAuditDto>> {
    const query = toQueryParams(payload);
    return await this.http.get<Page<QueryVerifierActivityAuditDto>>(
      `${this.verifierBaseUrl}/task-response/${taskId}/audit?${query}`
    );
  }
}
