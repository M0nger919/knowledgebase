import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { parseFile } from "@/lib/ingestion/file-parser";
import { ingestContent } from "@/lib/ingestion/ingest";
import { startDocumentPipeline } from "@/lib/queue/pipeline";

const ALLOWED_EXTENSIONS = ["md", "txt", "pdf", "html", "htm", "docx"];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

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

    // Parse FormData
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const spaceId = formData.get("spaceId") as string | null;

    if (!file) {
      return NextResponse.json(
        { error: "No file provided. Use 'file' as the form field name." },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `File is too large (max ${MAX_FILE_SIZE / 1024 / 1024}MB)` },
        { status: 400 }
      );
    }

    // Validate file extension
    const extension = file.name.split(".").pop()?.toLowerCase() || "";
    if (!ALLOWED_EXTENSIONS.includes(extension)) {
      return NextResponse.json(
        {
          error: `Unsupported file type: .${extension}. Supported: ${ALLOWED_EXTENSIONS.join(", ")}`,
        },
        { status: 400 }
      );
    }

    // Parse file content
    let parsed;
    try {
      parsed = await parseFile(file);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to parse file";
      return NextResponse.json({ error: message }, { status: 422 });
    }

    if (!parsed.content || parsed.content.trim().length === 0) {
      return NextResponse.json(
        { error: "No content could be extracted from this file" },
        { status: 422 }
      );
    }

    const result = await ingestContent({
      userId: user.id,
      source: "file",
      content: parsed.content,
      title: parsed.title,
      fileName: file.name,
      spaceId: spaceId || undefined,
    });

    // Start background processing pipeline (fire-and-forget)
    startDocumentPipeline(result.documentId).catch(() => undefined);

    return NextResponse.json({
      success: true,
      documentId: result.documentId,
      title: parsed.title,
      fileName: file.name,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to ingest file";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
