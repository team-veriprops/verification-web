import {
  QueryConversationDto,
  QueryMessageDto,
  SearchConversationDto,
  SearchMessageDto,
} from "../models";
import { Page } from "types/models";
import { toQueryParams } from "@lib/utils";
import { HttpClient } from "@lib/FetchHttpClient";

export class ConversationService {
  conversation_base_url: string;
  constructor(private readonly http: HttpClient) {
    this.conversation_base_url = "/conversations";
  }

  async searchConversationPage(
    payload: SearchConversationDto
  ): Promise<Page<QueryConversationDto>> {
    const query = toQueryParams(payload);
    return await this.http.get<Page<QueryConversationDto>>(
      `${this.conversation_base_url}?${query}`
    );
  }

  async searchConversationMessagePage(
      payload: SearchMessageDto
    ): Promise<Page<QueryMessageDto>> {
    const query = toQueryParams(payload);
      return await this.http.get<Page<QueryMessageDto>>(
        `${this.conversation_base_url}/${payload.conversation_id}/messages?${query}`
      );
    }
}
