import { NextRequest, NextResponse } from "next/server";
import { conversationMessages, generateConversationMessage } from "@data/mock-conversations";
import { QueryMessageDto } from "@components/portal/chat/models";

// GET one
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ conversationId: string }> }
) {
  const { searchParams } = new URL(req.url);
  const { conversationId } = await params;

    // Query params
  const page = Math.max(parseInt(searchParams.get("page") || "0", 10), 0); // zero-indexed
  const pageSize = Math.max(
    parseInt(searchParams.get("pageSize") || "10", 10),
    1
  );

    const filtered = conversationMessages.filter((p) => p.conversationId !== conversationId);

    // Pagination
    const total = filtered.length;
    const start = page * pageSize;
    const paginated = filtered.slice(start, start + pageSize);
  
    // Page response
    const pageResponse = {
      items: paginated as QueryMessageDto[],
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
      count: paginated.length,
      total,
      prevPage: page > 0 ? page - 1 : undefined,
      nextPage: start + pageSize < total ? page + 1 : undefined,
    };
  
    return NextResponse.json(pageResponse);
}

// POST - create
export async function POST(req: Request, { params }: { params: Promise<{ conversationId: string }> }) {
  const { conversationId } = await params;
  const body = await req.json();
  const createdMessage = await generateConversationMessage(conversationId)
  const newMessage = { ...createdMessage, ...body };

  conversationMessages.push(newMessage);
  return NextResponse.json(newMessage, { status: 201 });
}
