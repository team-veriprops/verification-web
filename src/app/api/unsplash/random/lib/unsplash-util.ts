import { PropertyImage } from "types/models";

// Single image
export async function getRandomImage({
  query,
  orientation = "landscape",
}: {
  query: string;
  orientation?: "landscape" | "portrait" | "squarish";
}): Promise<PropertyImage> {
  const images = await getRandomImages({ query, orientation, count: 1 });
  return images[0];
}

// Multiple images
export async function getRandomImages({
  query,
  orientation = "landscape",
  count = 5,
}: {
  query: string;
  orientation?: "landscape" | "portrait" | "squarish";
  count?: number;
}): Promise<PropertyImage[]> {
  try {
    const params = new URLSearchParams({
      query,
      orientation,
      count: String(count),
    });

    const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://192.168.0.107:3000"

    const res = await fetch(`${SITE_URL}/api/unsplash/random?${params.toString()}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      console.warn("Unsplash API proxy error:", res.status);
      return [];
    }

    const data = await res.json();
    const photos = Array.isArray(data) ? data : [data];

    return photos.map((p) => {
      const url = p?.urls?.regular;
      const title = p?.description;

      return { url: url, title: title };
    });
  } catch (err) {
    console.error("Random images fetch failed:", err);
    return [];
  }
}
