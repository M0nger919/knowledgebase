import { createClient } from "@/lib/supabase/server";

export interface IngestContentParams {
  userId: string;
  source: "text" | "url" | "file";
  content: string;
  title?: string;
  fileName?: string;
  spaceId?: string;
}

export interface IngestContentResult {
  documentId: string;
}

export async function ingestContent(
  params: IngestContentParams
): Promise<IngestContentResult> {
  const { userId, source, content, title, fileName, spaceId } = params;

  if (!content || content.trim().length === 0) {
    throw new Error("Content is required");
  }

  const supabase = await createClient();

  // Generate a fallback title based on content preview
  const fallbackTitle =
    title ||
    fileName ||
    content.trim().substring(0, 100).replace(/\n/g, " ").trim() ||
    "Untitled Document";

  // Generate plain text by stripping markdown
  const textContent = content
    .replace(/#{1,6}\s/g, "")
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/\*(.*?)\*/g, "$1")
    .replace(/`(.*?)`/g, "$1")
    .replace(/\[(.*?)\]\(.*?\)/g, "$1")
    .replace(/!\[(.*?)\]\(.*?\)/g, "$1")
    .replace(/---/g, "")
    .replace(/>\s/g, "")
    .replace(/[-*+]\s/g, "")
    .trim();

  const { data, error } = await supabase
    .from("documents")
    .insert({
      user_id: userId,
      space_id: spaceId || null,
      title: fallbackTitle.substring(0, 500),
      content,
      text_content: textContent,
      source_type: source,
      file_name: fileName || null,
      status: "pending",
    })
    .select("id")
    .single();

  if (error) {
    console.error("Failed to create document:", error);
    throw new Error(`Failed to create document: ${error.message}`);
  }

  return { documentId: data.id };
}
