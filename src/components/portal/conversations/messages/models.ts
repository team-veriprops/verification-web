import { BaseQueryDto, PageRequest } from "types/models";

// Base Interfaces
export interface MessageBaseDto {
  content: string;
  attachments?: { name: string; type: string }[];
}

// Create DTO
export interface CreateMessageDto extends MessageBaseDto {
    conversation_id: string;
}

// Update DTO (full override)
export interface UpdateMessageDto extends MessageBaseDto {}

export interface SearchMessageDto extends PageRequest, BaseQueryDto {
  conversation_id: string;
}

// Query DTO (combination of Create + PartialUpdate + BaseQuery)
export interface QueryMessageDto extends CreateMessageDto, BaseQueryDto {
  sender: string;
  sender_type: "BUYER" | "SELLER" | "ADMIN";
  avatar?: string;
}
