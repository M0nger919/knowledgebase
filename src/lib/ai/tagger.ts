import { generateChatCompletion } from "@/lib/openai";

const SYSTEM_PROMPT =
  "You are a helpful assistant that generates relevant tags for documents. " +
  "Always respond with a valid JSON array of lowercase tag strings and nothing else.";

function extractJsonArray(raw: string): string {
  const fenced = raw.match(/```(?:json)?\s*\n?([\s\S]*?)\n?\s*```/);
  if (fenced) return fenced[1].trim();
  return raw.trim();
}

/**
 * Generate tags for a document, optionally merging with existing tags.
 *
 * Returns at most 10 tags (combined). On any failure falls back to
 * existingTags or an empty array.
 */
export async function generateTags(
  title: string,
  content: string,
  existingTags?: string[],
): Promise<string[]> {
  try {
    const truncated =
      content.length > 30_000
        ? content.slice(0, 30_000) + "\n\n[...truncated]"
        : content;

    const prompt =
      `Generate up to 10 relevant tags for the following document.\n` +
      `Tags should be lowercase, single words or short phrases (use hyphens for multi-word tags).\n` +
      `Return ONLY a JSON array of strings, e.g. ["react", "frontend", "performance"].\n\n` +
      `Document title: "${title}"\n\nDocument content:\n${truncated}`;

    const raw = await generateChatCompletion(prompt, SYSTEM_PROMPT, "gpt-4o-mini");
    const jsonStr = extractJsonArray(raw);
    const parsed: unknown[] = JSON.parse(jsonStr);

    const newTags: string[] = [];
    for (const item of parsed) {
      if (typeof item === "string") {
        const tag = item
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9\-_. ]/g, "")
          .replace(/\s+/g, "-");
        if (tag.length > 0) {
          newTags.push(tag);
        }
      }
    }

    // Merge with existing tags (case-insensitive dedup)
    const existing = (existingTags ?? []).map((t) => t.toLowerCase());
    const merged = [...existing];

    for (const tag of newTags) {
      if (!merged.includes(tag)) {
        merged.push(tag);
      }
    }

    // Limit to 10
    return merged.slice(0, 10);
  } catch {
    return existingTags ?? [];
  }
}
