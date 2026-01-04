import {
  CreateConversationDto,
  QueryConversationDto,
  SearchConversationDto,
} from "../models";
import { Page } from "types/models";
import { toQueryParams } from "@lib/utils";
import { HttpClient } from "@lib/FetchHttpClient";

export class ConversationService {
  conversation_base_url: string;
  constructor(private readonly http: HttpClient) {
    this.conversation_base_url = "/conversations";
  }

  async createConversation(
    payload: CreateConversationDto
  ): Promise<QueryConversationDto> {
    return await this.http.post<CreateConversationDto>(
      `${this.conversation_base_url}`,
      payload
    );
  }

  async searchConversationPage(
    payload: SearchConversationDto
  ): Promise<Page<QueryConversationDto>> {
    const query = toQueryParams(payload);
    return await this.http.get<Page<QueryConversationDto>>(
      `${this.conversation_base_url}?${query}`
    );
  }
}
