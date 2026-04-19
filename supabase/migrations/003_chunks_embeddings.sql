-- ===========================================
-- Document Chunks + Embeddings (pgvector)
-- ===========================================

CREATE EXTENSION IF NOT EXISTS vector;

-- Chunks table
CREATE TABLE public.document_chunks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  document_id UUID REFERENCES public.documents(id) ON DELETE CASCADE NOT NULL,
  chunk_index INT NOT NULL,
  content TEXT NOT NULL,
  token_count INT NOT NULL,
  embedding vector(1536),
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE INDEX idx_chunks_document ON public.document_chunks(document_id);
CREATE INDEX idx_chunks_embedding ON public.document_chunks
  USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

ALTER TABLE public.document_chunks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own document chunks" ON public.document_chunks FOR ALL
  USING (EXISTS (
    SELECT 1 FROM public.documents
    WHERE documents.id = document_chunks.document_id
      AND documents.owner_id = auth.uid()
  ));

-- ===========================================
-- Tags column on documents
-- ===========================================

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'documents'
      AND column_name = 'tags'
  ) THEN
    ALTER TABLE public.documents ADD COLUMN tags TEXT[] DEFAULT '{}';
  END IF;
END $$;
