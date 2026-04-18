import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getJobStatus } from "@/lib/queue/worker";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const documentId = searchParams.get("documentId");

    if (!documentId) {
      return NextResponse.json(
        { error: "documentId query parameter is required" },
        { status: 400 },
      );
    }

    const jobs = await getJobStatus(documentId);

    // Determine overall status
    let overallStatus: "pending" | "processing" | "completed" | "failed" =
      "pending";

    if (jobs.length === 0) {
      overallStatus = "pending";
    } else if (jobs.every((j) => j.status === "completed")) {
      overallStatus = "completed";
    } else if (jobs.some((j) => j.status === "failed")) {
      // If any job failed and no pending/processing remain
      const hasActive = jobs.some(
        (j) => j.status === "pending" || j.status === "processing",
      );
      overallStatus = hasActive ? "processing" : "failed";
    } else if (
      jobs.some((j) => j.status === "pending" || j.status === "processing")
    ) {
      overallStatus = "processing";
    }

    return NextResponse.json({ jobs, overallStatus });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch job status";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
