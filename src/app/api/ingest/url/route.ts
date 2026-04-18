import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { fetchUrlContent } from "@/lib/ingestion/url-parser";
import { ingestContent } from "@/lib/ingestion/ingest";

export async function POST(request: Request) {
  try {
    // Auth check
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse request body
    const body = await request.json();
    const { url, spaceId } = body;

    if (!url || typeof url !== "string") {
      return NextResponse.json(
        { error: "URL is required and must be a string" },
        { status: 400 }
      );
    }

    // Fetch and parse URL content
    let parsed;
    try {
      parsed = await fetchUrlContent(url);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to fetch URL content";
      return NextResponse.json({ error: message }, { status: 422 });
    }

    if (!parsed.content || parsed.content.trim().length === 0) {
      return NextResponse.json(
        { error: "No content could be extracted from this URL" },
        { status: 422 }
      );
    }

    const result = await ingestContent({
      userId: user.id,
      source: "url",
      content: parsed.content,
      title: parsed.title,
      spaceId: spaceId || undefined,
    });

    return NextResponse.json({
      success: true,
      documentId: result.documentId,
      title: parsed.title,
    });
  } catch (error) {
    console.error("URL ingestion error:", error);
    const message =
      error instanceof Error
        ? error.message
        : "Failed to ingest URL content";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
