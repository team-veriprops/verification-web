import { QueryTaskDto } from "@components/portal/tasks/models";
import { generateTask, tasks } from "@data/mock-tasks";
import { NextRequest, NextResponse } from "next/server";

// GET all or search/filter

export async function GET(req: NextRequest,
  { params }: { params: Promise<{ verifier_id: string }> }) {
    const { verifier_id } = await params;
  const { searchParams } = new URL(req.url);

  // Query params
  const query = searchParams.get("query")?.toLowerCase();
  const page = Math.max(parseInt(searchParams.get("page") || "0", 10), 0); // zero-indexed
  const page_size = Math.max(
    parseInt(searchParams.get("page_size") || "10", 10),
    1
  );

  // Apply filters
  const filtered = tasks.filter((p) => {
    let matches = true;

    if (query) {
      matches = matches && (p.property_title ?? "").toLowerCase().includes(query)!;
    }

    matches = matches && p.verifier_id === verifier_id;

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
    items: paginated as QueryTaskDto[],
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
