import { NextRequest, NextResponse } from "next/server";
import { conversationMessages } from "@data/mock-conversations";

// GET one
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ conversation_id: string }> }
) {
  const { conversation_id } = await params;

  const conversationMessageFiltered = conversationMessages.find((p) => p.conversation_id === conversation_id);

  return conversationMessageFiltered
    ? NextResponse.json(conversationMessageFiltered)
    : NextResponse.json({ error: "Not found" }, { status: 404 });
}
