import { NextRequest, NextResponse } from "next/server";
import { paymentDetails } from "@data/mock-payments";

// GET one
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ refId: string }> }
) {
  const { refId } = await params;

  const paymentDetail = paymentDetails.find((p) => p.refId === refId);

  return paymentDetail
    ? NextResponse.json(paymentDetail)
    : NextResponse.json({ error: "Not found" }, { status: 404 });
}
