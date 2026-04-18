import { generateChatCompletion } from "@/lib/openai";

export interface DocumentSummary {
  oneLiner: string;
  shortSummary: string;
  keyPoints: string[];
  fullContent: string;
}

const SYSTEM_PROMPT =
  "You are a helpful assistant that summarises documents concisely and accurately.";

async function safeGenerate(prompt: string, fallback: string): Promise<string> {
  try {
    return await generateChatCompletion(prompt, SYSTEM_PROMPT, "gpt-4o-mini");
  } catch {
    return fallback;
  }
}

function parseBulletList(raw: string): string[] {
  const lines = raw.split("\n");
  const points: string[] = [];
  for (const line of lines) {
    const cleaned = line
      .replace(/^[-*]\s+/, "")
      .replace(/^\d+\.\s+/, "")
      .trim();
    if (cleaned.length > 0) {
      points.push(cleaned);
    }
  }
  return points.length > 0 ? points : [raw.trim()];
}

/**
 * Generate a hierarchical summary for a document.
 *
 * Four layers are produced in parallel:
 *  1. oneLiner   – single-sentence summary
 *  2. shortSummary – three-sentence summary
 *  3. keyPoints  – 5-10 bullet-point list
 *  4. fullContent – original content verbatim
 *
 * If any AI-powered layer fails, a placeholder is returned so the
 * caller always gets a usable DocumentSummary.
 */
export async function generateHierarchicalSummary(
  title: string,
  content: string,
): Promise<DocumentSummary> {
  // Truncate content to avoid token limits (gpt-4o-mini has 128k context,
  // but we keep it reasonable).
  const truncated =
    content.length > 60_000 ? content.slice(0, 60_000) + "\n\n[...truncated]" : content;

  const documentRef = `Document title: "${title}"\n\n${truncated}`;

  const [oneLiner, shortSummary, keyPointsRaw] = await Promise.all([
    safeGenerate(
      `Summarize what the following document is about in exactly one sentence.\n\n${documentRef}`,
      "Summary unavailable.",
    ),
    safeGenerate(
      `Summarize the following document in exactly three sentences.\n\n${documentRef}`,
      "Summary unavailable.",
    ),
    safeGenerate(
      `Extract 5-10 key points from the following document as a bullet list (use "- " for each bullet).\n\n${documentRef}`,
      "Key points unavailable.",
    ),
  ]);

  return {
    oneLiner,
    shortSummary,
    keyPoints: parseBulletList(keyPointsRaw),
    fullContent: content,
  };
}
