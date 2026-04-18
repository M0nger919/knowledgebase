-- ===========================================
-- Processing Jobs Queue
-- ===========================================

CREATE TABLE public.processing_jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type TEXT NOT NULL CHECK (type IN ('chunk', 'summarize', 'embed', 'extract_entities', 'tag', 'suggest_space')),
  document_id UUID REFERENCES public.documents(id) ON DELETE CASCADE NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  priority INT DEFAULT 0,
  attempt INT DEFAULT 0,
  max_attempts INT DEFAULT 3,
  result JSONB,
  error TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ
);

CREATE INDEX idx_jobs_status ON public.processing_jobs(status, priority DESC);
CREATE INDEX idx_jobs_document ON public.processing_jobs(document_id);

ALTER TABLE public.processing_jobs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own document jobs" ON public.processing_jobs FOR ALL
  USING (EXISTS (SELECT 1 FROM public.documents WHERE documents.id = processing_jobs.document_id AND documents.owner_id = auth.uid()));

-- ===========================================
-- Document processing columns
-- ===========================================

ALTER TABLE public.documents ADD COLUMN one_liner TEXT;
ALTER TABLE public.documents ADD COLUMN short_summary TEXT;
ALTER TABLE public.documents ADD COLUMN key_points TEXT[];
ALTER TABLE public.documents ADD COLUMN processing_status TEXT DEFAULT 'pending' CHECK (processing_status IN ('pending', 'processing', 'completed', 'failed'));
ALTER TABLE public.documents ADD COLUMN entities JSONB DEFAULT '[]';
