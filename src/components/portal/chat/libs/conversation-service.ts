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
      conversation_id: string,
      payload: SearchMessageDto
    ): Promise<Page<QueryMessageDto>> {
    const query = toQueryParams(payload);
      return await this.http.get<Page<QueryMessageDto>>(
        `${this.conversation_base_url}/${conversation_id}/messages?${query}`
      );
    }

  async createConversationMessage(conversation_id: string, payload: CreateMessageDto): Promise<QueryMessageDto> {
    return await this.http.post<CreateMessageDto>(
      `${this.conversation_base_url}/${conversation_id}/messages`,
      payload
    );
  }

  async updateConversationMessage(
    conversation_id: string,
    message_id: string,
    new_message: UpdateMessageDto
  ): Promise<QueryMessageDto> {
    return await this.http.put<UpdateMessageDto, QueryMessageDto>(
      `${this.conversation_base_url}/${conversation_id}/messages/${message_id}`,
      new_message
    );
  }

  async deleteConversationMessage(
    conversation_id: string,
    message_id: string,
  ): Promise<QueryMessageDto> {
    return await this.http.delete<QueryMessageDto>(
      `${this.conversation_base_url}/${conversation_id}/messages/${message_id}`
    );
  }
}
