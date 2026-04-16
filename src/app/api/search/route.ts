import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query");
    const spaceId = searchParams.get("spaceId");

    if (!query) {
      return NextResponse.json(
        { error: "Query is required" },
        { status: 400 }
      );
    }

    // TODO: Implement semantic search using embeddings
    // 1. Generate embedding for query
    // 2. Query Supabase vector similarity
    // 3. Return ranked results

    return NextResponse.json({
      results: [],
      query,
      spaceId,
    });
  } catch {
    return NextResponse.json(
      { error: "Search failed" },
      { status: 500 }
    );
  }
}
