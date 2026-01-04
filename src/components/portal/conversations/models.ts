import { PropertyType } from "@components/website/property/models";
import { BaseQueryDto, PageRequest } from "types/models";

// Base Interfaces
export interface ConversationBaseDto {

}

// Create DTO
export interface CreateConversationDto extends ConversationBaseDto {
    property_id?: string;
}

// Update DTO (full override)
export interface UpdateConversationDto extends ConversationBaseDto {}

export interface SearchConversationDto extends PageRequest, BaseQueryDto {
  
}

// Query DTO (combination of Create + PartialUpdate + BaseQuery)
export interface QueryConversationDto extends CreateConversationDto, BaseQueryDto {
  title: string;
  participants: string[];
  last_message: string;
  last_message_time: string;
  unread_count: number;
  type: PropertyType;
}
