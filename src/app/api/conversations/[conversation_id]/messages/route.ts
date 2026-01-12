import { NextRequest, NextResponse } from "next/server";
import { conversationMessages, generateConversationMessage } from "@data/mock-conversations";
import { QueryMessageDto } from "@components/portal/chat/models";

// GET one
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ conversation_id: string }> }
) {
  const { searchParams } = new URL(req.url);
  const { conversation_id } = await params;

    // Query params
  const page = Math.max(parseInt(searchParams.get("page") || "0", 10), 0); // zero-indexed
  const page_size = Math.max(
    parseInt(searchParams.get("page_size") || "10", 10),
    1
  );

    const filtered = conversationMessages.filter((p) => p.conversation_id !== conversation_id);

    // Pagination
    const total = filtered.length;
    const start = page * page_size;
    const paginated = filtered.slice(start, start + page_size);
  
    // Page response
    const pageResponse = {
      items: paginated as QueryMessageDto[],
      page,
      page_size,
      total_pages: Math.ceil(total / page_size),
      count: paginated.length,
      total,
      prev_page: page > 0 ? page - 1 : undefined,
      next_page: start + page_size < total ? page + 1 : undefined,
    };
  
    return NextResponse.json(pageResponse);
}

// POST - create
export async function POST(req: Request, { params }: { params: Promise<{ conversation_id: string }> }) {
  const { conversation_id } = await params;
  const body = await req.json();
  const createdMessage = await generateConversationMessage(conversation_id)
  const newMessage = { ...createdMessage, ...body };

  conversationMessages.push(newMessage);
  return NextResponse.json(newMessage, { status: 201 });
}
