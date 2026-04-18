import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { fetchUrlContent } from "@/lib/ingestion/url-parser";
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
    const { url, spaceId } = body;

    if (!url || typeof url !== "string") {
      return NextResponse.json(
        { error: "URL is required and must be a string" },
        { status: 400 }
      );
    }

    // SSRF protection: validate URL scheme and resolve to check for private IPs
    let parsedUrl: URL;
    try {
      parsedUrl = new URL(url);
    } catch {
      return NextResponse.json(
        { error: "Invalid URL format" },
        { status: 400 }
      );
    }

    if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") {
      return NextResponse.json(
        { error: "Only http and https URLs are allowed" },
        { status: 400 }
      );
    }

    const hostname = parsedUrl.hostname.toLowerCase();
    if (
      hostname === "localhost" ||
      hostname === "127.0.0.1" ||
      hostname === "[::1]" ||
      hostname.endsWith(".local")
    ) {
      return NextResponse.json(
        { error: "URL pointing to localhost is not allowed" },
        { status: 400 }
      );
    }

    // Reject private/reserved IP ranges via netmask matching
    const isPrivateIp = (ip: string): boolean => {
      const parts = ip.split(".").map(Number);
      if (parts.length !== 4 || parts.some((p) => isNaN(p) || p < 0 || p > 255)) return false;
      const [a, b] = parts;
      // 127.0.0.0/8
      if (a === 127) return true;
      // 10.0.0.0/8
      if (a === 10) return true;
      // 172.16.0.0/12
      if (a === 172 && b >= 16 && b <= 31) return true;
      // 192.168.0.0/16
      if (a === 192 && b === 168) return true;
      // 169.254.0.0/16
      if (a === 169 && b === 254) return true;
      return false;
    };

    if (isPrivateIp(hostname)) {
      return NextResponse.json(
        { error: "URL pointing to a private/reserved IP is not allowed" },
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

    // Start background processing pipeline (fire-and-forget)
    startDocumentPipeline(result.documentId).catch((err) =>
      console.error("Pipeline start error:", err),
    );

    return NextResponse.json({
      success: true,
      documentId: result.documentId,
      title: parsed.title,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to ingest URL content";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
