import { QueryConversationDto } from "@components/portal/chat/models";
import { conversations } from "@data/mock-conversations";

import { NextRequest, NextResponse } from "next/server";
// GET all or search/filter

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  // Query params
  const status = searchParams.get("status")?.toLowerCase();
  const query = searchParams.get("query")?.toLowerCase();
  const page = Math.max(parseInt(searchParams.get("page") || "0", 10), 0); // zero-indexed
  const pageSize = Math.max(
    parseInt(searchParams.get("pageSize") || "10", 10),
    1
  );

      
  // Apply filters
  const filtered = conversations.filter((p) => {
    let matches = true;

    if(status){
      matches = matches && p.status.toLowerCase().includes(status)
    }
    if (query) {
      matches = matches && p.title.toLowerCase().includes(query);
    }

    return matches;
  });

  // Apply sorting
  filtered.sort(
        (a, b) =>
          new Date(b.dateCreated!).getTime() - new Date(a.dateCreated!).getTime()
      );

  // Pagination
  const total = filtered.length;
  const start = page * pageSize;
  const paginated = filtered.slice(start, start + pageSize);

  // Page response
  const pageResponse = {
    items: paginated as QueryConversationDto[],
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
    count: paginated.length,
    total,
    prevPage: page > 0 ? page - 1 : undefined,
    nextPage: start + pageSize < total ? page + 1 : undefined,
  };

  return NextResponse.json(pageResponse);
}
