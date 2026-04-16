export interface User {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  created_at: string;
}

export interface Space {
  id: string;
  name: string;
  description: string;
  owner_id: string;
  created_at: string;
  updated_at: string;
}

export interface Document {
  id: string;
  space_id: string;
  title: string;
  content: string;
  embedding?: number[];
  created_at: string;
  updated_at: string;
}

export interface SearchResult {
  document: Document;
  score: number;
  highlights?: string[];
}

export interface SearchQuery {
  query: string;
  spaceId?: string;
  limit?: number;
}
