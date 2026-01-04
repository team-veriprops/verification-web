import { CreateMessageDto, QueryMessageDto, SearchMessageDto } from "../models";
import { Page } from "types/models";
import { buildPath, toQueryParams } from "@lib/utils";
import { HttpClient } from "@lib/FetchHttpClient";

export class MessageService {
  message_base_url: string;
  constructor(private readonly http: HttpClient) {
    this.message_base_url = "/conversations/{conversation_id}/messages";
  }

  async createMessage(
    conversation_id: string,
    payload: CreateMessageDto
  ): Promise<QueryMessageDto> {
    return await this.http.post<CreateMessageDto>(
      `${buildPath(this.message_base_url, {conversation_id})}`,
      payload
    );
  }

  async searchMessagePage(
    conversation_id: string,
    payload: SearchMessageDto
  ): Promise<Page<QueryMessageDto>> {
    const query = toQueryParams(payload);
    return await this.http.get<Page<QueryMessageDto>>(
      `${buildPath(this.message_base_url, {conversation_id})}?${query}`
    );
  }
}
