import { QueryTaskDto } from "@components/portal/tasks/models";
import { generateTask, tasks } from "@data/mock-tasks";
import { NextRequest, NextResponse } from "next/server";

// GET all or search/filter

export async function GET(req: NextRequest,
  { params }: { params: Promise<{ verifierId: string }> }) {
    const { verifierId } = await params;
  const { searchParams } = new URL(req.url);

  // Query params
  const query = searchParams.get("query")?.toLowerCase();
  const page = Math.max(parseInt(searchParams.get("page") || "0", 10), 0); // zero-indexed
  const pageSize = Math.max(
    parseInt(searchParams.get("pageSize") || "10", 10),
    1
  );

  // Apply filters
  const filtered = tasks.filter((p) => {
    let matches = true;

    if (query) {
      matches = matches && (p.propertyTitle ?? "").toLowerCase().includes(query)!;
    }

    matches = matches && p.verifierId === verifierId;

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
    items: paginated as QueryTaskDto[],
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
  { params }: { params: Promise<{ verifier_verifier_id: string }> }
) {
  const { verifier_verifier_id } = await params;
  const body = await req.json();
  const newTask = { ...(await generateTask(verifier_verifier_id)), ...body };

  tasks.push(newTask);
  return NextResponse.json(newTask, { status: 201 });
}
