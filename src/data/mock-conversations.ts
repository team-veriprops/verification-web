import { ConversationStatus, QueryConversationDto, QueryMessageDto } from "@components/portal/chat/models";

import { faker } from "@faker-js/faker";

export async function generateConversation(): Promise<QueryConversationDto> {
  const verification_id = `VRP-2026-00${faker.number.int({ min: 1000, max: 9000 })}`

  return {
    id: faker.string.uuid(),
    title: `${verification_id} - ${faker.company.catchPhrase()}`,
    verification_id: verification_id,
    status: faker.helpers.arrayElement([
      ConversationStatus.PENDING,
      ConversationStatus.ACTIVE,
      ConversationStatus.RESOLVED,
    ]),
    last_message: faker.lorem.sentence(),
    last_message_time: faker.date.past().toISOString(),
    unread_count: faker.number.int({ min: 1000, max: 9000 }),
    user: {
      name: faker.person.fullName(),
      role: faker.person.jobTitle(),
      avatar: "avatar",
    },
    date_created: faker.date.past().toISOString(),
  };
}


export async function generateConversationMessage(
  conversation_id: string,
): Promise<QueryMessageDto> {
  return {
    id: faker.string.uuid(),
    conversation_id: conversation_id,
    sender_id: faker.helpers.arrayElement(["user", "agent"]),
    content: faker.lorem.paragraph(),
    timestamp: faker.date.past().toISOString(),
    is_read: faker.helpers.arrayElement([true, false]),
    date_created: faker.date.past().toISOString(),
  };
}


export let conversations: QueryConversationDto[] = [];
export const conversationMessages: QueryMessageDto[] = [];

async function initData() {
  // only generate once
  if (conversations.length === 0) {
    conversations = await Promise.all(
      Array.from({ length: 20 }, () => generateConversation())
    );
  }

  if (conversationMessages.length === 0) {
    for (const conversation of conversations) {
      const this_messages = await Promise.all(
      Array.from({ length: faker.helpers.arrayElement([5, 3, 10, 20, 15]) }, () => generateConversationMessage(conversation.id!))
    );

      conversationMessages.push(...this_messages);
    }
  }

}

// Kick off immediately
initData();
