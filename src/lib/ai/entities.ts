import { generateChatCompletion } from "@/lib/openai";

export interface Entity {
  type: "person" | "organization" | "project" | "concept" | "date";
  name: string;
  count: number;
}

const SYSTEM_PROMPT =
  "You are a helpful assistant that extracts named entities from documents. " +
  "Always respond with a valid JSON array and nothing else.";

function extractJsonArray(raw: string): string {
  // Strip markdown code-block fences if the model wraps the response.
  const fenced = raw.match(/```(?:json)?\s*\n?([\s\S]*?)\n?\s*```/);
  if (fenced) return fenced[1].trim();
  return raw.trim();
}

function deduplicate(entities: Entity[]): Entity[] {
  const map = new Map<string, Entity>();
  for (const entity of entities) {
    const key = `${entity.type}:${entity.name.toLowerCase()}`;
    const existing = map.get(key);
    if (!existing || entity.count > existing.count) {
      map.set(key, entity);
    }
  }
  return Array.from(map.values());
}

function isValidEntityType(
  t: string,
): t is Entity["type"] {
  return ["person", "organization", "project", "concept", "date"].includes(t);
}

/**
 * Extract named entities from a document.
 *
 * Returns entities sorted by count (descending). On any failure an empty
 * array is returned so callers never need to handle AI errors themselves.
 */
export async function extractEntities(content: string): Promise<Entity[]> {
  try {
    const truncated =
      content.length > 40_000
        ? content.slice(0, 40_000) + "\n\n[...truncated]"
        : content;

    const prompt =
      `Extract all named entities from the following document.\n\n` +
      `For each entity provide:\n` +
      `- "type": one of "person", "organization", "project", "concept", "date"\n` +
      `- "name": the entity name\n` +
      `- "count": how many times the entity is mentioned in the document\n\n` +
      `Return ONLY a JSON array of objects with keys type, name, count.\n\n` +
      `Document:\n${truncated}`;

    const raw = await generateChatCompletion(prompt, SYSTEM_PROMPT, "gpt-4o-mini");
    const jsonStr = extractJsonArray(raw);
    const parsed: unknown[] = JSON.parse(jsonStr);

    const entities: Entity[] = [];
    for (const item of parsed) {
      if (
        typeof item === "object" &&
        item !== null &&
        "type" in item &&
        "name" in item &&
        "count" in item &&
        isValidEntityType((item as Record<string, unknown>).type as string) &&
        typeof (item as Record<string, unknown>).name === "string" &&
        typeof (item as Record<string, unknown>).count === "number"
      ) {
        entities.push({
          type: (item as Record<string, unknown>).type as Entity["type"],
          name: ((item as Record<string, unknown>).name as string).trim(),
          count: (item as Record<string, unknown>).count as number,
        });
      }
    }

    return deduplicate(entities).sort((a, b) => b.count - a.count);
  } catch {
    return [];
  }
}
