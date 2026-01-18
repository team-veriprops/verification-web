import { getActiveAuditor, users } from "@data/mock-users";
import { NextResponse } from "next/server";

// Logged In User Details
export async function GET() {
  const activeAuditor = await getActiveAuditor();
  return activeAuditor
    ? NextResponse.json(activeAuditor)
    : NextResponse.json({ error: "Not found" }, { status: 404 });
}

// Logout
export async function DELETE(
) {
  const deleted = users[0];
  
  return NextResponse.json(deleted);
}
