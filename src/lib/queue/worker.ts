import { createClient } from "@/lib/supabase/server";
import { chunkDocument } from "@/lib/ai/chunker";
import { generateHierarchicalSummary } from "@/lib/ai/summarizer";
import { extractEntities } from "@/lib/ai/entities";
import { generateTags } from "@/lib/ai/tagger";
import { suggestSpace } from "@/lib/ai/space-suggester";
import { generateEmbedding } from "@/lib/openai";

// ---- Types ----

export type JobType =
  | "chunk"
  | "summarize"
  | "embed"
  | "extract_entities"
  | "tag"
  | "suggest_space";

export interface JobStatus {
  id: string;
  type: JobType;
  status: "pending" | "processing" | "completed" | "failed";
  attempt: number;
  error: string | null;
  createdAt: string;
}

interface ProcessingJobRow {
  id: string;
  type: JobType;
  document_id: string;
  status: string;
  priority: number;
  attempt: number;
  max_attempts: number;
  result: unknown;
  error: string | null;
  created_at: string;
  started_at: string | null;
  completed_at: string | null;
}

// ---- Create Job ----

export async function createJob(
  type: JobType,
  documentId: string,
  priority = 0,
): Promise<string> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("processing_jobs")
    .insert({
      type,
      document_id: documentId,
      priority,
    })
    .select("id")
    .single();

  if (error) {
    throw new Error(`Failed to create job: ${error.message}`);
  }

  return data.id;
}

// ---- Process Next Job ----

export async function processNextJob(): Promise<boolean> {
  const supabase = await createClient();

  // Pick highest priority pending job
  const { data: job, error: fetchError } = await supabase
    .from("processing_jobs")
    .select("*")
    .eq("status", "pending")
    .order("priority", { ascending: false })
    .order("created_at", { ascending: true })
    .limit(1)
    .single<ProcessingJobRow>();

  if (fetchError || !job) {
    return false; // no pending jobs
  }

  // Mark as processing
  const { error: updateError } = await supabase
    .from("processing_jobs")
    .update({
      status: "processing",
      started_at: new Date().toISOString(),
      attempt: job.attempt + 1,
    })
    .eq("id", job.id);

  if (updateError) {
    return false;
  }

  try {
    // Stub processing — real AI calls will be wired in during integration
    // TODO: Replace stubs with actual AI module calls:
    //   chunk          → import { chunkDocument } from '@/lib/ai/chunker'
    //   summarize      → import { generateHierarchicalSummary } from '@/lib/ai/summarizer'
    //   embed          → import { generateEmbedding } from '@/lib/openai'
    //   extract_entities → import { extractEntities } from '@/lib/ai/entities'
    //   tag            → import { generateTags } from '@/lib/ai/tagger'
    //   suggest_space  → import { suggestSpace } from '@/lib/ai/space-suggester'

    const result = await processJobType(job.type, job.document_id);

    // Mark completed
    await supabase
      .from("processing_jobs")
      .update({
        status: "completed",
        completed_at: new Date().toISOString(),
        result,
      })
      .eq("id", job.id);

    return true;
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);

    if (job.attempt + 1 < job.max_attempts) {
      // Retry: set back to pending
      await supabase
        .from("processing_jobs")
        .update({
          status: "pending",
          error: message,
        })
        .eq("id", job.id);
    } else {
      // Max attempts reached
      await supabase
        .from("processing_jobs")
        .update({
          status: "failed",
          error: message,
          completed_at: new Date().toISOString(),
        })
        .eq("id", job.id);
    }

    return true;
  }
}

// ---- Job processor ----

const EMBED_DELAY_MS = 100; // rate-limit guard between embedding calls

async function processJobType(
  type: JobType,
  documentId: string,
): Promise<unknown> {
  switch (type) {
    // ─── CHUNK ────────────────────────────────────────────────────
    case "chunk": {
      const supabase = await createClient();

      const { data: doc, error: fetchErr } = await supabase
        .from("documents")
        .select("id, content, text_content")
        .eq("id", documentId)
        .single();

      if (fetchErr || !doc) {
        throw new Error(`Document ${documentId} not found: ${fetchErr?.message}`);
      }

      const rawContent = doc.text_content ?? doc.content ?? "";
      if (!rawContent.trim()) {
        return { chunksCreated: 0 };
      }

      const chunks = await chunkDocument(rawContent);

      if (chunks.length === 0) {
        return { chunksCreated: 0 };
      }

      const rows = chunks.map((c) => ({
        document_id: documentId,
        chunk_index: c.index,
        content: c.content,
        token_count: c.tokenCount,
      }));

      const { error: insertErr } = await supabase
        .from("document_chunks")
        .insert(rows);

      if (insertErr) {
        throw new Error(`Failed to insert chunks: ${insertErr.message}`);
      }

      return { chunksCreated: chunks.length };
    }

    // ─── SUMMARIZE ────────────────────────────────────────────────
    case "summarize": {
      const supabase = await createClient();

      const { data: doc, error: fetchErr } = await supabase
        .from("documents")
        .select("id, title, content, text_content")
        .eq("id", documentId)
        .single();

      if (fetchErr || !doc) {
        throw new Error(`Document ${documentId} not found: ${fetchErr?.message}`);
      }

      const rawContent = doc.text_content ?? doc.content ?? "";
      const summary = await generateHierarchicalSummary(doc.title ?? "", rawContent);

      const { error: updateErr } = await supabase
        .from("documents")
        .update({
          one_liner: summary.oneLiner,
          short_summary: summary.shortSummary,
          key_points: summary.keyPoints,
        })
        .eq("id", documentId);

      if (updateErr) {
        throw new Error(`Failed to update summary: ${updateErr.message}`);
      }

      return { summarized: true };
    }

    // ─── EMBED ────────────────────────────────────────────────────
    case "embed": {
      const supabase = await createClient();

      const { data: chunks, error: fetchErr } = await supabase
        .from("document_chunks")
        .select("id, content")
        .eq("document_id", documentId)
        .order("chunk_index", { ascending: true });

      if (fetchErr) {
        throw new Error(`Failed to fetch chunks: ${fetchErr.message}`);
      }

      if (!chunks || chunks.length === 0) {
        return { embedded: 0 };
      }

      let embeddedCount = 0;
      for (const chunk of chunks) {
        try {
          const embedding = await generateEmbedding(chunk.content);

          const { error: updateErr } = await supabase
            .from("document_chunks")
            .update({ embedding })
            .eq("id", chunk.id);

          if (updateErr) {
            console.error(
              `Failed to update embedding for chunk ${chunk.id}: ${updateErr.message}`,
            );
          } else {
            embeddedCount++;
          }
        } catch (err) {
          console.error(
            `Failed to generate embedding for chunk ${chunk.id}:`,
            err,
          );
        }

        // Rate-limit guard for OpenAI
        if (embeddedCount < chunks.length) {
          await new Promise((r) => setTimeout(r, EMBED_DELAY_MS));
        }
      }

      return { embedded: embeddedCount };
    }

    // ─── EXTRACT ENTITIES ─────────────────────────────────────────
    case "extract_entities": {
      const supabase = await createClient();

      const { data: doc, error: fetchErr } = await supabase
        .from("documents")
        .select("id, content, text_content")
        .eq("id", documentId)
        .single();

      if (fetchErr || !doc) {
        throw new Error(`Document ${documentId} not found: ${fetchErr?.message}`);
      }

      const rawContent = doc.text_content ?? doc.content ?? "";
      if (!rawContent.trim()) {
        return { entitiesExtracted: 0 };
      }

      const entities = await extractEntities(rawContent);

      const { error: updateErr } = await supabase
        .from("documents")
        .update({ entities: entities as unknown as Record<string, unknown> })
        .eq("id", documentId);

      if (updateErr) {
        throw new Error(`Failed to update entities: ${updateErr.message}`);
      }

      return { entitiesExtracted: entities.length };
    }

    // ─── TAG ──────────────────────────────────────────────────────
    case "tag": {
      const supabase = await createClient();

      const { data: doc, error: fetchErr } = await supabase
        .from("documents")
        .select("id, title, content, text_content, tags")
        .eq("id", documentId)
        .single();

      if (fetchErr || !doc) {
        throw new Error(`Document ${documentId} not found: ${fetchErr?.message}`);
      }

      const rawContent = doc.text_content ?? doc.content ?? "";
      const existingTags: string[] = Array.isArray(doc.tags) ? doc.tags : [];

      const tags = await generateTags(
        doc.title ?? "",
        rawContent,
        existingTags,
      );

      const { error: updateErr } = await supabase
        .from("documents")
        .update({ tags })
        .eq("id", documentId);

      if (updateErr) {
        throw new Error(`Failed to update tags: ${updateErr.message}`);
      }

      return { tagsGenerated: tags.length };
    }

    // ─── SUGGEST SPACE ────────────────────────────────────────────
    case "suggest_space": {
      const supabase = await createClient();

      const { data: doc, error: fetchErr } = await supabase
        .from("documents")
        .select("id, title, content, text_content, owner_id, space_id")
        .eq("id", documentId)
        .single();

      if (fetchErr || !doc) {
        throw new Error(`Document ${documentId} not found: ${fetchErr?.message}`);
      }

      const rawContent = doc.text_content ?? doc.content ?? "";

      // Fetch user's existing spaces
      const { data: spaces, error: spacesErr } = await supabase
        .from("spaces")
        .select("id, name, description")
        .eq("owner_id", doc.owner_id);

      if (spacesErr) {
        throw new Error(`Failed to fetch spaces: ${spacesErr.message}`);
      }

      const existingSpaces = (spaces ?? []).map((s) => ({
        id: s.id,
        name: s.name,
        description: s.description ?? "",
      }));

      const suggestion = await suggestSpace(
        doc.title ?? "",
        rawContent,
        existingSpaces,
      );

      // If high confidence and a valid space, move the document
      if (
        suggestion.confidence > 0.7 &&
        suggestion.spaceId &&
        suggestion.spaceId !== doc.space_id
      ) {
        const { error: updateErr } = await supabase
          .from("documents")
          .update({ space_id: suggestion.spaceId })
          .eq("id", documentId);

        if (updateErr) {
          console.error(
            `Failed to move document to space ${suggestion.spaceId}: ${updateErr.message}`,
          );
        }
      }

      return {
        suggested: true,
        spaceName: suggestion.spaceName,
        confidence: suggestion.confidence,
      };
    }

    default:
      throw new Error(`Unknown job type: ${type}`);
  }
}

// ---- Get Job Status ----

export async function getJobStatus(documentId: string): Promise<JobStatus[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("processing_jobs")
    .select("id, type, status, attempt, error, created_at")
    .eq("document_id", documentId)
    .order("created_at", { ascending: true });

  if (error) {
    throw new Error(`Failed to fetch job status: ${error.message}`);
  }

  return (data ?? []).map((row) => ({
    id: row.id,
    type: row.type as JobType,
    status: row.status as JobStatus["status"],
    attempt: row.attempt,
    error: row.error,
    createdAt: row.created_at,
  }));
}
