import { NextRequest, NextResponse } from "next/server";
import { verificationDetails } from "@data/mock-verifications";

// GET one
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ refId: string }> }
) {
  const { refId } = await params;

  const verificationDetail = verificationDetails.find((p) => p.refId === refId);

  return verificationDetail
    ? NextResponse.json(verificationDetail)
    : NextResponse.json({ error: "Not found" }, { status: 404 });
}
