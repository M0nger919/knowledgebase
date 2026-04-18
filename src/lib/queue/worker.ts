import { createClient } from "@/lib/supabase/server";

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

// ---- Stub job processor ----

async function processJobType(
  type: JobType,
  _documentId: string,
): Promise<unknown> {
  switch (type) {
    case "chunk":
      // TODO: const chunks = await chunkDocument(content); save to document_embeddings
      return { stub: true, chunksCreated: 0 };

    case "summarize":
      // TODO: const summary = await generateHierarchicalSummary(title, content);
      // update documents: one_liner, short_summary, key_points
      return { stub: true, summarized: true };

    case "embed":
      // TODO: for each chunk, await generateEmbedding(chunk); update document_embeddings.embedding
      return { stub: true, embedded: 0 };

    case "extract_entities":
      // TODO: const entities = await extractEntities(content);
      // update documents: entities column
      return { stub: true, entitiesExtracted: 0 };

    case "tag":
      // TODO: const tags = await generateTags(title, content, existingTags);
      // update documents: tags column
      return { stub: true, tagsGenerated: 0 };

    case "suggest_space":
      // TODO: const suggestion = await suggestSpace(title, content, existingSpaces);
      // if high confidence, optionally move document
      return { stub: true, suggested: true };

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
