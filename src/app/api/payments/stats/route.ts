import { paymentStats } from "@data/mock-payments";
import { NextResponse } from "next/server";

// GET one
export async function GET() {

  return paymentStats
    ? NextResponse.json(paymentStats)
    : NextResponse.json({ error: "Not found" }, { status: 404 });
}
