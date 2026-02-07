import { NextRequest, NextResponse } from "next/server";
import { disputes, generateDispute } from "@data/mock-disputes";
import { QueryDisputeDto } from "@components/trust-network/disputes/models";
// GET all or search/filter

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  // Query params
  const query = searchParams.get("query")?.toLowerCase();
  const page = Math.max(parseInt(searchParams.get("page") || "0", 10), 0); // zero-indexed
  const pageSize = Math.max(
    parseInt(searchParams.get("pageSize") || "10", 10),
    1
  );

  // Apply filters
  let filtered = disputes.filter((p) => {
    let matches = true;

    if (query) {
      matches = matches && p.description?.toLowerCase().includes(query)!;
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
    items: paginated as QueryDisputeDto[],
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

// POST - create
export async function POST(
  req: Request,
  { params }: { params: Promise<{ user_id: string }> }
) {
  const { user_id } = await params;
  const body = await req.json();
  const newDispute = { ...(await generateDispute(user_id)), ...body };

  disputes.push(newDispute);
  return NextResponse.json(newDispute, { status: 201 });
}
