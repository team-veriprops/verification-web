import { NextRequest, NextResponse } from "next/server";
import { paymentDetails } from "@data/mock-payments";

// GET one
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ ref_id: string }> }
) {
  const { ref_id } = await params;

  const paymentDetail = paymentDetails.find((p) => p.ref_id === ref_id);

  return paymentDetail
    ? NextResponse.json(paymentDetail)
    : NextResponse.json({ error: "Not found" }, { status: 404 });
}
