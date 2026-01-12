/* eslint-disable @typescript-eslint/no-empty-object-type */

import { BaseQueryDto, PageRequest } from "types/models";

// #######################################################################################################
//          Conversation
// Base Interfaces
export interface ConversationBaseDto {
  title: string;
  verification_id: string;
}

// Create DTO
export interface CreateConversationDto extends ConversationBaseDto {

}

// Update DTO (full override)
export interface UpdateConversationDto extends ConversationBaseDto {}

export interface SearchConversationDto extends PageRequest, BaseQueryDto {
    status?: ConversationStatus;
    title?: string;
    verification_id?: string;
}

// Query DTO (combination of Create + PartialUpdate + BaseQuery)
export interface QueryConversationDto extends CreateConversationDto, BaseQueryDto {
  status: ConversationStatus;
  last_message: string;
  last_message_time: string;
  unread_count: number;
  agent: {
    name: string;
    role: string;
    avatar: string | null;
  };
}


// #######################################################################################################
//          MESSAGE
// Base Interfaces
export interface MessageBaseDto {
  content: string;
  timestamp: string;
}

// Create DTO
export interface CreateMessageDto extends MessageBaseDto {
  conversation_id: string;
  sender_id?: string;
}

// Update DTO (full override)
export interface UpdateMessageDto extends MessageBaseDto {}

export interface SearchMessageDto extends PageRequest, BaseQueryDto {
    conversation_id: string;
}

// Query DTO (combination of Create + PartialUpdate + BaseQuery)
export interface QueryMessageDto extends CreateMessageDto, BaseQueryDto {
  is_read: boolean;
}


// #######################################################################################################
//          ConversationParticipant
// Base Interfaces
export interface ConversationParticipantBaseDto {

}

// Create DTO
export interface CreateConversationParticipantDto extends ConversationParticipantBaseDto {

}

// Update DTO (full override)
export interface UpdateConversationParticipantDto extends ConversationParticipantBaseDto {}

export interface SearchConversationParticipantDto extends PageRequest, BaseQueryDto {
}

// Query DTO (combination of Create + PartialUpdate + BaseQuery)
export interface QueryConversationParticipantDto extends CreateConversationParticipantDto, BaseQueryDto {
  conversation_id: string;
  name: string;
  role: string;
  avatar: string | null;
}

export enum ConversationStatus {
  ACTIVE = "active",
  PENDING = "pending",
  RESOLVED = "resolved",
}
