import { verifications } from "@data/mock-verifications";

import { NextRequest, NextResponse } from "next/server";
import { QueryVerificationDto } from "@components/portal/verifications/models";
// GET all or search/filter

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  // Query params
  const status = searchParams.get("status")?.toLowerCase();
  const query = searchParams.get("query")?.toLowerCase();
  const page = Math.max(parseInt(searchParams.get("page") || "0", 10), 0); // zero-indexed
  const page_size = Math.max(
    parseInt(searchParams.get("page_size") || "10", 10),
    1
  );

  // Apply filters
  const filtered = verifications.filter((p) => {
    let matches = true;

    if(status && status !== "all"){
      matches = matches && p.status.toLowerCase().includes(status)
    }
    if (query) {
      matches = matches && p.ref_id.toLowerCase().includes(query);
    }

    return matches;
  });

  // Apply sorting
  filtered.sort(
        (a, b) =>
          new Date(b.date_created!).getTime() - new Date(a.date_created!).getTime()
      );

  // Pagination
  const total = filtered.length;
  const start = page * page_size;
  const paginated = filtered.slice(start, start + page_size);

  // Page response
  const pageResponse = {
    items: paginated as QueryVerificationDto[],
    page,
    page_size,
    total_pages: Math.ceil(total / page_size),
    count: paginated.length,
    total,
    prev_page: page > 0 ? page - 1 : undefined,
    next_page: start + page_size < total ? page + 1 : undefined,
  };

  return NextResponse.json(pageResponse);
}
