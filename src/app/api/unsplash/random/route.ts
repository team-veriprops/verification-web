// app/api/unsplash/random/route.ts
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const accessKey = process.env.UNSPLASH_ACCESS_KEY;

  if (!accessKey) {
    return new Response(
      JSON.stringify({ error: "UNSPLASH_ACCESS_KEY not configured" }),
      { status: 500 }
    );
  }

  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query") ?? "house";
  const orientation = searchParams.get("orientation") ?? "landscape";
  const count = Math.min(
    Math.max(Number(searchParams.get("count") ?? "1"), 1),
    30
  );

  const unsplashUrl = new URL("https://api.unsplash.com/photos/random");
  unsplashUrl.searchParams.set("query", query);
  unsplashUrl.searchParams.set("orientation", orientation);
  unsplashUrl.searchParams.set("count", String(count));

  try {
    const res = await fetch(unsplashUrl.toString(), {
      headers: {
        Authorization: `Client-ID ${accessKey}`,
        "Accept-Version": "v1",
      },
      cache: "no-store",
    });

    const body = await res.text();
    return new Response(body, {
      status: res.status,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Unsplash proxy error:", err);
    return new Response(JSON.stringify({ error: "Failed to fetch image(s)" }), {
      status: 500,
    });
  }
}
