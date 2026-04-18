import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { ingestContent } from "@/lib/ingestion/ingest";
import { startDocumentPipeline } from "@/lib/queue/pipeline";

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
    const { content, title, spaceId } = body;

    if (!content || typeof content !== "string") {
      return NextResponse.json(
        { error: "Content is required and must be a string" },
        { status: 400 }
      );
    }

    if (content.trim().length === 0) {
      return NextResponse.json(
        { error: "Content cannot be empty" },
        { status: 400 }
      );
    }

    if (content.length > 5_000_000) {
      return NextResponse.json(
        { error: "Content is too large (max 5MB)" },
        { status: 400 }
      );
    }

    const result = await ingestContent({
      userId: user.id,
      source: "text",
      content: content.trim(),
      title: title || undefined,
      spaceId: spaceId || undefined,
    });

    // Start background processing pipeline (fire-and-forget)
    startDocumentPipeline(result.documentId).catch(() => undefined);

    return NextResponse.json({
      success: true,
      documentId: result.documentId,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to ingest text content";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
