-- ===========================================
-- Knowbase Database Schema
-- ===========================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ===========================================
-- PROFILES (extends Supabase auth.users)
-- ===========================================
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  display_name TEXT,
  avatar_url TEXT,
  plan TEXT DEFAULT 'free' CHECK (plan IN ('free', 'pro', 'team')),
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ===========================================
-- SPACES (like folders/workspaces)
-- ===========================================
CREATE TABLE public.spaces (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  icon TEXT DEFAULT '📁',
  color TEXT DEFAULT '#3B82F6',
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- ===========================================
-- DOCUMENTS
-- ===========================================
CREATE TABLE public.documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  space_id UUID REFERENCES public.spaces(id) ON DELETE CASCADE NOT NULL,
  owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL DEFAULT 'Untitled',
  content TEXT DEFAULT '',
  content_text TEXT DEFAULT '', -- plain text version for search
  tags TEXT[] DEFAULT '{}',
  is_published BOOLEAN DEFAULT false,
  word_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- ===========================================
-- DOCUMENT EMBEDDINGS (for semantic search)
-- ===========================================
CREATE TABLE public.document_embeddings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  document_id UUID REFERENCES public.documents(id) ON DELETE CASCADE NOT NULL,
  content_chunk TEXT NOT NULL,
  embedding VECTOR(1536), -- OpenAI text-embedding-3-small dimension
  chunk_index INT NOT NULL
);

-- Create vector extension (Supabase has this built-in)
CREATE EXTENSION IF NOT EXISTS vector;

-- ===========================================
-- FULL-TEXT SEARCH INDEX
-- ===========================================
ALTER TABLE public.documents ADD COLUMN search_vector TSVECTOR;

CREATE OR REPLACE FUNCTION public.documents_search_vector_update()
RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector :=
    setweight(to_tsvector('english', COALESCE(NEW.title, '')), 'A') ||
    setweight(to_tsvector('english', COALESCE(NEW.content_text, '')), 'B') ||
    setweight(to_tsvector('english', COALESCE(array_to_string(NEW.tags, ' '), '')), 'C');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER documents_search_vector_trigger
  BEFORE INSERT OR UPDATE ON public.documents
  FOR EACH ROW EXECUTE FUNCTION public.documents_search_vector_update();

CREATE INDEX idx_documents_search ON public.documents USING GIN(search_vector);

-- ===========================================
-- ROW LEVEL SECURITY
-- ===========================================

-- Profiles: users can read all profiles, update only their own
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Spaces: users can CRUD their own, read public spaces
ALTER TABLE public.spaces ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own spaces" ON public.spaces FOR SELECT USING (auth.uid() = owner_id OR is_public = true);
CREATE POLICY "Users can create spaces" ON public.spaces FOR INSERT WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Users can update own spaces" ON public.spaces FOR UPDATE USING (auth.uid() = owner_id);
CREATE POLICY "Users can delete own spaces" ON public.spaces FOR DELETE USING (auth.uid() = owner_id);

-- Documents: users can CRUD their own within their spaces
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view documents in their spaces" ON public.documents FOR SELECT
  USING (auth.uid() = owner_id OR EXISTS (SELECT 1 FROM public.spaces WHERE spaces.id = documents.space_id AND (spaces.owner_id = auth.uid() OR spaces.is_public = true)));
CREATE POLICY "Users can create documents in their spaces" ON public.documents FOR INSERT
  WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Users can update own documents" ON public.documents FOR UPDATE USING (auth.uid() = owner_id);
CREATE POLICY "Users can delete own documents" ON public.documents FOR DELETE USING (auth.uid() = owner_id);

-- Embeddings: follow document access
ALTER TABLE public.document_embeddings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view embeddings for accessible documents" ON public.document_embeddings FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.documents WHERE documents.id = document_embeddings.document_id AND (documents.owner_id = auth.uid() OR EXISTS (SELECT 1 FROM public.spaces WHERE spaces.id = documents.space_id AND (spaces.owner_id = auth.uid() OR spaces.is_public = true)))));
CREATE POLICY "Users can create embeddings for own documents" ON public.document_embeddings FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM public.documents WHERE documents.id = document_embeddings.document_id AND documents.owner_id = auth.uid()));

-- ===========================================
-- HELPER FUNCTIONS
-- ===========================================

-- Semantic search function using cosine similarity
CREATE OR REPLACE FUNCTION public.match_documents_semantic(
  query_embedding VECTOR(1536),
  match_threshold FLOAT DEFAULT 0.7,
  match_count INT DEFAULT 10,
  p_user_id UUID DEFAULT NULL
)
RETURNS TABLE (
  id UUID,
  document_id UUID,
  title TEXT,
  content_chunk TEXT,
  similarity FLOAT,
  space_id UUID
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    de.id,
    de.document_id,
    d.title,
    de.content_chunk,
    1 - (de.embedding <=> query_embedding) AS similarity,
    d.space_id
  FROM public.document_embeddings de
  JOIN public.documents d ON d.id = de.document_id
  WHERE 1 - (de.embedding <=> query_embedding) > match_threshold
    AND (p_user_id IS NULL OR d.owner_id = p_user_id
         OR EXISTS (SELECT 1 FROM public.spaces s WHERE s.id = d.space_id AND s.is_public = true))
  ORDER BY de.embedding <=> query_embedding
  LIMIT match_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Full-text search function
CREATE OR REPLACE FUNCTION public.match_documents_fulltext(
  query_text TEXT,
  match_count INT DEFAULT 10,
  p_user_id UUID DEFAULT NULL
)
RETURNS TABLE (
  id UUID,
  title TEXT,
  content_text TEXT,
  rank REAL,
  space_id UUID,
  tags TEXT[]
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    d.id,
    d.title,
    d.content_text,
    ts_rank(d.search_vector, plainto_tsquery('english', query_text)) AS rank,
    d.space_id,
    d.tags
  FROM public.documents d
  WHERE d.search_vector @@ plainto_tsquery('english', query_text)
    AND (p_user_id IS NULL OR d.owner_id = p_user_id
         OR EXISTS (SELECT 1 FROM public.spaces s WHERE s.id = d.space_id AND s.is_public = true))
  ORDER BY rank DESC
  LIMIT match_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER spaces_updated_at BEFORE UPDATE ON public.spaces FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER documents_updated_at BEFORE UPDATE ON public.documents FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
