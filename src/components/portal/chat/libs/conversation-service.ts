import {
  CreateMessageDto,
  QueryConversationDto,
  QueryMessageDto,
  SearchConversationDto,
  SearchMessageDto,
  UpdateMessageDto,
} from "../models";
import { Page } from "types/models";
import { toQueryParams } from "@lib/utils";
import { HttpClient } from "@lib/FetchHttpClient";

export class ConversationService {
  conversationBaseUrl: string;
  constructor(private readonly http: HttpClient) {
    this.conversationBaseUrl = "/conversations";
  }

  async searchConversationPage(
    payload: SearchConversationDto
  ): Promise<Page<QueryConversationDto>> {
    const query = toQueryParams(payload);
    return await this.http.get<Page<QueryConversationDto>>(
      `${this.conversationBaseUrl}?${query}`
    );
  }

  async searchConversationMessagePage(
      conversationId: string,
      payload: SearchMessageDto
    ): Promise<Page<QueryMessageDto>> {
    const query = toQueryParams(payload);
      return await this.http.get<Page<QueryMessageDto>>(
        `${this.conversationBaseUrl}/${conversationId}/messages?${query}`
      );
    }

  async createConversationMessage(conversationId: string, payload: CreateMessageDto): Promise<QueryMessageDto> {
    return await this.http.post<CreateMessageDto>(
      `${this.conversationBaseUrl}/${conversationId}/messages`,
      payload
    );
  }

  async updateConversationMessage(
    conversationId: string,
    message_id: string,
    new_message: UpdateMessageDto
  ): Promise<QueryMessageDto> {
    return await this.http.put<UpdateMessageDto, QueryMessageDto>(
      `${this.conversationBaseUrl}/${conversationId}/messages/${message_id}`,
      new_message
    );
  }

  async deleteConversationMessage(
    conversationId: string,
    message_id: string,
  ): Promise<QueryMessageDto> {
    return await this.http.delete<QueryMessageDto>(
      `${this.conversationBaseUrl}/${conversationId}/messages/${message_id}`
    );
  }
}
