import { createJob, processNextJob, getJobStatus, type JobType } from "./worker";
import { createClient } from "@/lib/supabase/server";

/**
 * Ordered pipeline stages.
 * chunk must run first so that embed has chunks to process.
 * The rest can run in any order, but we keep a deterministic sequence.
 */
const PIPELINE_STAGES: { type: JobType; priority: number }[] = [
  { type: "chunk", priority: 50 },
  { type: "summarize", priority: 40 },
  { type: "embed", priority: 30 },
  { type: "extract_entities", priority: 20 },
  { type: "tag", priority: 10 },
  { type: "suggest_space", priority: 0 },
];

/**
 * Create all pipeline jobs for a document (fire-and-forget).
 *
 * Jobs are inserted as "pending". A separate call to
 * `processDocumentPipeline` or an external worker loop will pick them up.
 */
export async function startDocumentPipeline(
  documentId: string,
): Promise<void> {
  const supabase = await createClient();

  // Update document processing status
  await supabase
    .from("documents")
    .update({ processing_status: "processing" })
    .eq("id", documentId);

  // Create all pipeline jobs
  for (const stage of PIPELINE_STAGES) {
    await createJob(stage.type, documentId, stage.priority);
  }

}

/**
 * Process all pending jobs for a specific document until completion or failure.
 *
 * This is the main entry point called from API routes after ingestion.
 * It loops calling processNextJob, but only processes jobs belonging to
 * the given document to avoid stealing other documents' work.
 */
export async function processDocumentPipeline(
  documentId: string,
): Promise<void> {
  const supabase = await createClient();
  const maxIterations = PIPELINE_STAGES.length * 3; // safety bound

  for (let i = 0; i < maxIterations; i++) {
    // Check if all jobs for this document are done
    const { data: pendingJobs, error } = await supabase
      .from("processing_jobs")
      .select("id, status")
      .eq("document_id", documentId)
      .eq("status", "pending")
      .limit(1);

    if (error) {
      break;
    }

    // No more pending jobs — check for any that are still processing
    const { data: processingJobs } = await supabase
      .from("processing_jobs")
      .select("id")
      .eq("document_id", documentId)
      .eq("status", "processing")
      .limit(1);

    if (!pendingJobs || pendingJobs.length === 0) {
      if (!processingJobs || processingJobs.length === 0) {
        // All jobs are completed or failed — update document status
        const statuses = await getJobStatus(documentId);
        const hasFailed = statuses.some((s) => s.status === "failed");
        const allCompleted = statuses.every(
          (s) => s.status === "completed" || s.status === "failed",
        );

        if (allCompleted) {
          await supabase
            .from("documents")
            .update({
              processing_status: hasFailed ? "failed" : "completed",
            })
            .eq("id", documentId);
        }
        break;
      }
      // Wait a bit for processing jobs to finish
      await new Promise((r) => setTimeout(r, 500));
      continue;
    }

    // Process the next job (may be for a different document, but that's OK)
    const processed = await processNextJob();
    if (!processed) {
      // No pending jobs at all — shouldn't happen since we checked above
      break;
    }
  }
}
