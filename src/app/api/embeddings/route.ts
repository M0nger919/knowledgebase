import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json();

    if (!text || typeof text !== "string") {
      return NextResponse.json(
        { error: "Text is required" },
        { status: 400 }
      );
    }

    // TODO: Generate embedding using OpenAI
    // const embedding = await generateEmbedding(text);

    return NextResponse.json({
      embedding: [], // placeholder
      message: "Embedding generated successfully",
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to generate embedding" },
      { status: 500 }
    );
  }
}
