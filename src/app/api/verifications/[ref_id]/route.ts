import { NextRequest, NextResponse } from "next/server";
import { verificationDetails } from "@data/mock-verifications";

// GET one
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ ref_id: string }> }
) {
  const { ref_id } = await params;

  const verificationDetail = verificationDetails.find((p) => p.ref_id === ref_id);

  return verificationDetail
    ? NextResponse.json(verificationDetail)
    : NextResponse.json({ error: "Not found" }, { status: 404 });
}
