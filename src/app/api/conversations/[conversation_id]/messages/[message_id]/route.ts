import { NextRequest, NextResponse } from "next/server";
import { conversationMessages } from "@data/mock-conversations";

// PUT - update
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ conversation_id: string, message_id: string }> }
) {
  const { conversation_id } = await params;
  const { message_id } = await params;

  const idx = conversationMessages.findIndex((p) => p.id === message_id);
  if (idx === -1) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const body = await req.json();
  conversationMessages[idx] = { ...conversationMessages[idx], ...body };

  return NextResponse.json(conversationMessages[idx]);
}

// DELETE
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ conversation_id: string, message_id: string }> }
) {
   const { conversation_id } = await params;
  const { message_id } = await params;

  const idx = conversationMessages.findIndex((p) => p.id === message_id);
  if (idx === -1) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const [deleted] = conversationMessages.splice(idx, 1);
  return NextResponse.json(deleted);
}