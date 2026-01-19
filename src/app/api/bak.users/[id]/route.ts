import { users } from "@data/mock-users";
import { NextRequest, NextResponse } from "next/server";

// GET one
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  console.log("Query params:", id);

  const property = users.find((p) => p.id === id);

  return property
    ? NextResponse.json(property)
    : NextResponse.json({ error: "Not found" }, { status: 404 });
}

// PUT - update
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const idx = users.findIndex((p) => p.id === id);
  if (idx === -1) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const body = await req.json();
  users[idx] = { ...users[idx], ...body };

  return NextResponse.json(users[idx]);
}

// DELETE
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const idx = users.findIndex((p) => p.id === id);
  if (idx === -1) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const [deleted] = users.splice(idx, 1);
  return NextResponse.json(deleted);
}
