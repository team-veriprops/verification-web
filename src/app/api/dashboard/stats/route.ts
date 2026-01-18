import { dashboardStats } from "@data/mock-dashboard";
import { NextResponse } from "next/server";

// GET one
export async function GET() {

  return dashboardStats
    ? NextResponse.json(dashboardStats)
    : NextResponse.json({ error: "Not found" }, { status: 404 });
}
