import { NextRequest, NextResponse } from "next/server";
import { generateUser, users } from "@data/mock-users";
import { QueryUserDto } from "@components/admin/user/models";
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
  const filtered = users.filter((p) => {
    let matches = true;

    if (query) {
      matches = matches && p.fullname.toLowerCase().includes(query)!;
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
    items: paginated as QueryUserDto[],
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
export async function POST(req: Request) {
  const body = await req.json();
  const newCompany = { ...generateUser(), ...body };

  users.push(newCompany);
  return NextResponse.json(newCompany, { status: 201 });
}
