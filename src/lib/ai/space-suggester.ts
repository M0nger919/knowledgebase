import { generateChatCompletion } from "@/lib/openai";

export interface SpaceSuggestion {
  spaceId: string | null;
  spaceName: string;
  confidence: number;
  reason: string;
}

interface ExistingSpace {
  id: string;
  name: string;
  description: string;
}

const SYSTEM_PROMPT =
  "You are a helpful assistant that suggests the best space (folder/category) " +
  "for a document based on its content. Always respond with valid JSON.";

function extractJson(raw: string): string {
  const fenced = raw.match(/```(?:json)?\s*\n?([\s\S]*?)\n?\s*```/);
  if (fenced) return fenced[1].trim();
  return raw.trim();
}

/**
 * Suggest the most appropriate space for a document.
 *
 * If a good match (>0.7 confidence) is found among existingSpaces, its id
 * is returned. Otherwise a new space name is proposed with spaceId = null.
 */
export async function suggestSpace(
  title: string,
  content: string,
  existingSpaces: ExistingSpace[],
): Promise<SpaceSuggestion> {
  const fallback: SpaceSuggestion = {
    spaceId: null,
    spaceName: "General",
    confidence: 0,
    reason: "Unable to determine the best space.",
  };

  try {
    const truncated =
      content.length > 20_000
        ? content.slice(0, 20_000) + "\n\n[...truncated]"
        : content;

    const spacesDescription =
      existingSpaces.length > 0
        ? existingSpaces
            .map((s) => `- ID: ${s.id}, Name: "${s.name}", Description: "${s.description}"`)
            .join("\n")
        : "No existing spaces available.";

    const prompt =
      `Analyze the following document and suggest the best space for it.\n\n` +
      `Existing spaces:\n${spacesDescription}\n\n` +
      `Document title: "${title}"\n\nDocument content:\n${truncated}\n\n` +
      `Respond with a JSON object containing:\n` +
      `- "spaceId": the ID of the best matching existing space, or null if no good match (confidence below 0.7)\n` +
      `- "spaceName": the name of the matched space, or a suggested new space name if no match\n` +
      `- "confidence": a number between 0 and 1 indicating how confident you are in the match\n` +
      `- "reason": a brief explanation of why this space was chosen or suggested\n\n` +
      `Return ONLY a single JSON object.`;

    const raw = await generateChatCompletion(prompt, SYSTEM_PROMPT, "gpt-4o-mini");
    const jsonStr = extractJson(raw);
    const parsed = JSON.parse(jsonStr) as Record<string, unknown>;

    const suggestion: SpaceSuggestion = {
      spaceId: typeof parsed.spaceId === "string" ? parsed.spaceId : null,
      spaceName:
        typeof parsed.spaceName === "string" ? parsed.spaceName : fallback.spaceName,
      confidence:
        typeof parsed.confidence === "number" ? parsed.confidence : 0,
      reason:
        typeof parsed.reason === "string" ? parsed.reason : fallback.reason,
    };

    // Clamp confidence
    suggestion.confidence = Math.max(0, Math.min(1, suggestion.confidence));

    // If confidence is below threshold, treat as no match
    if (suggestion.confidence < 0.7) {
      suggestion.spaceId = null;
    }

    // If no existing spaces, always suggest a new space
    if (existingSpaces.length === 0) {
      suggestion.spaceId = null;
    }

    return suggestion;
  } catch {
    return fallback;
  }
}
