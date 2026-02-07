import { ConversationStatus, QueryConversationDto, QueryMessageDto } from "@components/portal/chat/models";

import { faker } from "@faker-js/faker";

export async function generateConversation(): Promise<QueryConversationDto> {
  const verificationId = `VRP-2026-00${faker.number.int({ min: 1000, max: 9000 })}`

  return {
    id: faker.string.uuid(),
    title: `${verificationId} - ${faker.company.catchPhrase()}`,
    verificationId: verificationId,
    status: faker.helpers.arrayElement([
      ConversationStatus.PENDING,
      ConversationStatus.ACTIVE,
      ConversationStatus.RESOLVED,
    ]),
    lastMessage: faker.lorem.sentence(),
    lastMessageTime: faker.date.past().toISOString(),
    unreadCount: faker.number.int({ min: 1, max: 100 }),
    agent: {
      name: faker.person.fullName(),
      role: faker.person.jobTitle(),
      avatar: "avatar",
    },
    dateCreated: faker.date.past().toISOString(),
  };
}


export async function generateConversationMessage(
  conversationId: string,
): Promise<QueryMessageDto> {
  return {
    id: faker.string.uuid(),
    conversationId: conversationId,
    senderId: faker.helpers.arrayElement(["user", "agent"]),
    content: faker.lorem.paragraph(),
    timestamp: faker.date.past().toISOString(),
    isRead: faker.helpers.arrayElement([true, false]),
    dateCreated: faker.date.past().toISOString(),
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
