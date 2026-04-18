# Knowbase — Product Specification

> "The context layer between your knowledge and your AI agents."

---

## Vision

Every AI agent hits the context wall. Knowbase solves this by automatically organizing knowledge into AI-optimal context chunks with smart retrieval.

The problem is universal: LLMs have finite context windows, and as teams accumulate more knowledge, feeding the *right* information to AI agents becomes a bottleneck. Existing solutions either require heavy engineering (RAG pipelines, vector databases, chunking strategies) or are too generic (file storage, note-taking apps) to be truly useful for AI workflows.

Knowbase is the missing infrastructure layer — a productized, zero-config context management platform that turns raw knowledge into AI-ready context on demand.

---

## Core Value Proposition

Not just storage, not just search — intelligent context management. Dump your knowledge in, and Knowbase:

- **Understands and organizes it automatically** — no manual filing, tagging, or folder hierarchies required
- **Pre-processes into optimal context-sized chunks** — semantically aware chunking that respects meaning, not arbitrary character limits
- **Retrieves the RIGHT context for any query within any token budget** — multi-signal relevance scoring ensures quality over quantity
- **Tracks conversation context to avoid redundancy** — agents never see the same information twice unless it's newly relevant
- **Maintains a relationship graph between knowledge pieces** — surface hidden connections across documents, projects, and domains

---

## User Personas

### Persona 1: Alex — Solo AI Builder

| Attribute | Detail |
|---|---|
| **Role** | Indie hacker building an AI SaaS product |
| **Demographics** | 28 years old, solo founder, based in a mid-size US city |
| **Technical Level** | High — comfortable with APIs, basic Python/JS, uses Cursor and ChatGPT daily |
| **Current Stack** | Next.js frontend, Python backend, Supabase, OpenAI API |

**Situation:**
Alex is building a niche AI-powered writing assistant. He has product documentation, API specs, design mockups in Figma (exported as images and text), competitor analysis PDFs, and hundreds of brainstorming notes scattered across Notion, Google Drive, and local files. He uses three different AI agents daily: a coding assistant (Cursor), a content brainstorming assistant (ChatGPT), and a customer support draft assistant (Claude). Each agent needs different slices of his knowledge base, but there's no unified way to feed them context.

**Pain Points:**
- Manual RAG setup is too complex — he spent two weekends building a basic pipeline with LangChain and gave up when retrieval quality was poor
- Copy-pasting relevant docs into AI chats is tedious and error-prone — he always forgets something important
- Context window limits mean he has to manually triage what to include, which defeats the purpose of having comprehensive knowledge
- Different agents need different context profiles, but managing this manually is unsustainable
- He's burning money on API calls because he's sending too much irrelevant context

**Goals:**
- Plug all his AI agents into one knowledge source and get smart, pre-filtered context automatically
- Spend zero time managing context — just dump knowledge and let the system figure out retrieval
- Get from "idea" to "prototype" faster by having instant access to all relevant past work

**Budget:** $0–50/mo — very cost-conscious, will only pay when he sees clear ROI on development speed

**How Knowbase Helps:**
Alex drops all his docs, notes, and specs into Knowbase. He creates three context profiles — "Coding Agent," "Content Agent," and "Support Agent" — each tuned to different source spaces and token budgets. His Cursor workflow pulls context via the API, and his ChatGPT/Claude workflows use the chat interface. He never manually manages context again.

---

### Persona 2: Sarah — AI Startup CTO

| Attribute | Detail |
|---|---|
| **Role** | CTO and co-founder of a 5-person AI agent consultancy |
| **Demographics** | 34 years old, based in London, manages a small engineering team |
| **Technical Level** | Expert — former ML engineer at a big tech company |
| **Current Stack** | Python, LangChain, Pinecone, custom RAG pipelines, AWS |

**Situation:**
Sarah's company builds custom AI agent products for enterprise clients. They currently have active projects for a legal firm (case law and contract knowledge), a healthcare startup (medical protocols and research papers), and a fintech company (regulatory docs and financial reports). Each client requires a separate, isolated knowledge base with domain-specific retrieval strategies. Her team currently builds a custom RAG pipeline for each client project, which takes 2–3 weeks of engineering time and requires ongoing maintenance.

**Pain Points:**
- Context retrieval quality directly affects client satisfaction — a bad retrieval = a wrong answer = an angry client
- Building and maintaining custom RAG for each project is expensive and slow — it's eating into margins
- Each domain has different retrieval needs: legal needs exact citation matching, medical needs comprehensive coverage, finance needs recency-weighted results
- Team members struggle with context consistency — different engineers configure retrieval differently
- Onboarding new clients takes too long because knowledge base setup is manual

**Goals:**
- Consistent, high-quality context retrieval across all client agent deployments
- Reduce per-project setup time from weeks to hours
- Standardize retrieval quality so every client gets the same level of service
- Give her team a shared platform instead of everyone maintaining their own pipelines

**Budget:** $50–200/mo per project — willing to pay for quality and reliability, currently spending more on engineering time

**How Knowbase Helps:**
Sarah creates a separate "Space" in Knowbase for each client project. Each space has its own context profiles tuned to domain-specific needs (legal: high precision, medical: high recall, finance: recency-weighted). Her team uses the REST API to integrate Knowbase into their agent deployments. Setup time drops from weeks to hours, and retrieval quality improves because Knowbase handles chunking, ranking, and deduplication automatically.

---

### Persona 3: David — Enterprise AI Engineer

| Attribute | Detail |
|---|---|
| **Role** | Senior AI engineer at a mid-size enterprise (2,000 employees) |
| **Demographics** | 41 years old, based in Austin, TX, part of a 4-person AI team |
| **Technical Level** | Expert — deep experience with ML infrastructure, enterprise integrations |
| **Current Stack** | Python, internal tools, Confluence, SharePoint, ServiceNow, Slack |

**Situation:**
David's company has accumulated years of institutional knowledge: a 15,000-page Confluence wiki, thousands of Jira tickets, years of Slack history, HR policy documents, IT runbooks, and product specification docs. Leadership wants AI-powered internal tools (support bots, onboarding assistants, search agents), but nobody has solved the "which context matters" problem at scale. Previous attempts at building a knowledge chatbot returned generic, unhelpful answers because they couldn't identify and retrieve the right context from the massive corpus.

**Pain Points:**
- Knowledge is scattered across 6+ systems with no unified search or retrieval
- Simple keyword search returns thousands of irrelevant results
- Vector-only retrieval misses context that isn't semantically similar but is critically related
- Nobody has time to manually curate, tag, or organize the knowledge base
- Compliance and security requirements mean he can't use consumer AI tools
- SSO integration and audit logging are non-negotiable for enterprise deployment

**Goals:**
- One knowledge platform that all internal AI tools can query for context
- Intelligent retrieval that works at scale without manual curation
- Security and compliance: SSO, role-based access, audit logs, data residency
- Prove ROI to leadership with measurable improvements in employee productivity

**Budget:** $200–500/mo — enterprise procurement process, needs SSO and compliance features, values reliability and support

**How Knowbase Helps:**
David's team ingests the entire company knowledge base into Knowbase via webhooks and batch uploads (Confluence export, Slack archive, Jira dump). Knowbase's AI processing pipeline automatically chunks, summarizes, and builds relationships across all documents. Internal AI tools query Knowbase via the REST API with appropriate token budgets. The knowledge graph surfaces hidden connections between docs that simple search would miss. SSO and role-based access ensure compliance.

---

### Persona 4: Mina — Power User / Knowledge Worker

| Attribute | Detail |
|---|---|
| **Role** | Senior product manager at a tech company, heavy AI user |
| **Demographics** | 31 years old, based in Toronto, non-developer |
| **Technical Level** | Low-moderate — comfortable with SaaS tools, uses ChatGPT and Claude extensively, has built custom GPTs |
| **Current Tools** | Notion, Google Docs, ChatGPT Plus, Claude Pro, Raindrop.io (bookmarks) |

**Situation:**
Mina relies on AI for a huge portion of her daily work: writing PRDs, synthesizing user research, preparing meeting notes, drafting strategy docs, and answering team questions. She has thousands of notes across Notion, hundreds of bookmarked articles, dozens of research PDFs, and years of meeting transcripts. Her frustration is that AI tools can only see what she manually pastes into the chat — and she can never paste enough.

**Pain Points:**
- AI can't see all her knowledge at once — she's constantly manually selecting and copy-pasting relevant docs
- Custom GPTs help but have tiny knowledge limits and no intelligent retrieval
- She forgets what she knows — buried in thousands of notes are insights that would be valuable if she could find them
- No single place to search across all her knowledge sources
- She's not technical enough to build a RAG pipeline, but she understands the concept and wishes it existed as a product

**Goals:**
- One place to dump everything — notes, docs, bookmarks, transcripts — and then chat with it
- Ask a question and get an answer drawn from her entire personal knowledge base
- Discover forgotten insights and connections across her notes
- Zero technical setup — just works out of the box

**Budget:** $0–20/mo — paying for ChatGPT Plus and Claude Pro already, hesitant to add more subscriptions but will if the value is clear

**How Knowbase Helps:**
Mina connects her Notion workspace, uploads PDFs, and pastes in notes. Knowbase organizes everything automatically. She uses the chat interface to ask questions like "What did we decide about the pricing page redesign?" and gets answers drawn from meeting notes, PRDs, and Slack summaries — without ever manually curating context. The knowledge graph surfaces related research she forgot she had.

---

## Core Features (Phase 2)

### 1. Ingestion Engine

The entry point for all knowledge into the platform. Designed for zero-friction ingestion.

**Supported Input Types:**
- Text (plain text, Markdown, rich text)
- Files: PDF, DOCX, TXT, MD, CSV, JSON
- URLs: automatically fetch and extract content from web pages
- Images: OCR extraction for scanned documents and screenshots

**Ingestion Methods:**
- Drag-and-drop file upload (web interface)
- Batch upload: select multiple files or a zip archive
- Paste from clipboard: instant text ingestion
- URL import: paste a link, Knowbase fetches and processes the content
- API upload: programmatic ingestion for automated workflows
- Webhook integrations: Slack messages, email attachments, GitHub repo files, Notion pages

**Processing Guarantees:**
- Every ingested item is processed within 60 seconds (background queue)
- Extraction quality report per document (coverage %, entities found, issues)
- Duplicate detection: warn if similar content already exists

---

### 2. AI Processing Pipeline

Transforms raw content into AI-ready, semantically rich knowledge units.

**Auto-Chunking:**
- Semantic boundary detection: splits at natural paragraph, section, and topic boundaries
- Respects document structure (headings, lists, tables) rather than arbitrary character counts
- Configurable target chunk size (default: ~500 tokens)
- Overlap between chunks for context continuity (configurable)
- Special handling for code blocks, tables, and structured data

**Hierarchical Summaries (per chunk):**
- One-liner: ultra-compressed essence (10–20 tokens)
- Short summary: key point in 1–2 sentences (50–100 tokens)
- Key points: bullet list of main takeaways (100–200 tokens)
- Full content: the original chunk text
- Each level is stored and indexed independently for tiered retrieval

**Entity Extraction:**
- People: names, roles, affiliations
- Projects: project names, statuses, milestones
- Concepts: technical terms, domain-specific jargon
- Dates: temporal references, deadlines, timelines
- Organizations: companies, teams, departments
- Locations: geographic references
- Custom entity types (user-defined)

**Auto-Tagging and Categorization:**
- Automatic topic tags based on content analysis
- Domain classification (technical, legal, medical, financial, general)
- Content type detection (documentation, meeting notes, research, code, policy)
- Priority/sensitivity tagging (public, internal, confidential)
- User-defined custom tags and categories

**Relationship Detection:**
- Cross-reference identification: "Document A references Document B"
- Temporal relationships: "This update supersedes the earlier version"
- Hierarchical relationships: "This is a sub-component of the main spec"
- Causal relationships: "This issue was caused by the change described in..."
- Similarity clusters: groups of related but distinct documents

---

### 3. Smart Context Engine (THE CORE)

The heart of Knowbase. This is what makes it fundamentally different from storage + search.

**Context Budget System:**
- User specifies a token budget (e.g., 4,000 tokens)
- Engine selects the optimal combination of knowledge chunks to fill the budget
- Maximizes relevance and coverage within the constraint
- No manual selection — the system decides what matters

**Multi-Signal Relevance Scoring:**
Each candidate chunk is scored on multiple dimensions:
- Semantic similarity: how closely does the chunk match the query? (vector embedding distance)
- Keyword match: does it contain exact terms from the query?
- Recency: when was this knowledge created or last updated?
- Relationship proximity: is this chunk connected to other highly-relevant chunks?
- Conversation history: has this topic come up before? Is this new information?
- User priority: has the user explicitly boosted or pinned this content?
- Source authority: is this from a high-priority source (e.g., official docs vs. informal notes)?
- Composite score: weighted combination of all signals (weights configurable per context profile)

**Hierarchical Retrieval Strategy:**
1. Start broad: retrieve top-level summaries of relevant documents
2. Identify promising areas: which documents/chunks are most relevant?
3. Drill deep: retrieve full content of the most relevant chunks
4. Fill remaining budget: add related chunks that provide additional context
5. Optimize: ensure maximum coverage with minimum redundancy

**Context Deduplication:**
- Track what context has been injected into each agent's conversation
- Maintain a "seen context" window per agent session
- Avoid re-sending the same chunks unless:
  - The query has shifted significantly and previously seen context is newly relevant
  - The user explicitly requests broader context
- Deduplication reduces token waste by 20–40% in multi-turn conversations

**Token Efficiency Metrics:**
- Relevance density: % of injected tokens that directly address the query
- Coverage score: % of distinct relevant topics covered within the budget
- Redundancy ratio: % of tokens that duplicate already-known information
- Per-query and per-conversation dashboards

---

### 4. Knowledge Graph

An auto-generated, continuously evolving graph of relationships between all knowledge in the system.

**Auto-Generated Relationships:**
- Explicit references: document A cites document B (detected from content analysis)
- Entity co-occurrence: documents that mention the same people, projects, or concepts
- Semantic similarity: documents with closely related content
- Temporal sequences: documents created in response to or as follow-ups to others
- Hierarchical structure: parent-child relationships between documents and sections

**Visual Graph View:**
- Interactive node-and-edge visualization
- Nodes represent documents, chunks, or entities (filterable)
- Edges represent relationships (color-coded by type)
- Click any node to see its content, relationships, and connected context
- Zoom and pan to explore large knowledge bases
- Cluster detection: visually identify topic groupings

**Related Knowledge Suggestions:**
- "You might also want to consider..." — proactively surfaces related documents
- Connection paths: "Here's how these two documents are related" — traces the graph path between any two items
- Orphan detection: identifies knowledge that has no connections (potential gap or filing error)

**Graph-Powered Retrieval:**
- Beyond vector similarity: follow relationship edges to discover relevant content that semantic search alone would miss
- Example: a query about "Q3 pricing changes" might retrieve a meeting note that mentions the pricing page, which is connected to a design spec, which contains the actual pricing table
- Graph traversal depth is configurable per context profile
- Relationship strength weighting: closer connections contribute more to relevance scores

---

### 5. AI Agent Interface

The human-facing interaction layer for querying your knowledge base.

**Chat Interface:**
- Natural language questions: "What's our refund policy for enterprise clients?"
- Answers are grounded in your knowledge base with source citations
- Follow-up questions maintain conversation context
- "Show me the source" — click through to see the original document/chunk

**Multi-Agent Support:**
- Define multiple AI agents, each with a different context profile
- Switch between agents or address specific agents by name
- Each agent has its own conversation history and context window
- Agent avatars and personality descriptions for clarity

**Conversation-Aware Retrieval:**
- The engine tracks what's been discussed in the current conversation
- Subsequent queries build on previous context rather than starting fresh
- "What else is relevant that we haven't discussed?" — proactive gap filling
- Conversation summary maintained for long sessions

**Proactive Suggestions:**
- "Based on your recent work on the pricing project, you might want to look at these related documents..."
- Triggered by pattern detection in query topics
- Can be configured per agent (on/off, frequency)
- Notification system for important knowledge updates in areas of interest

---

### 6. Agent Integration (API)

The developer-facing interface for connecting external AI systems to your knowledge base.

**REST API:**
```
POST /api/v1/context/query
{
  "query": "What is our SLA for critical bugs?",
  "token_budget": 4000,
  "profile": "support-bot",
  "conversation_id": "abc123",  // optional, for deduplication
  "exclude_sources": ["internal-drafts"]  // optional filters
}

Response:
{
  "context": [
    {
      "content": "...",
      "source": "support-policy-doc.pdf",
      "relevance_score": 0.94,
      "tokens": 350
    },
    ...
  ],
  "total_tokens": 3850,
  "coverage_score": 0.87,
  "sources_used": ["support-policy-doc.pdf", "engineering-runbook.md"]
}
```

**Key API Features:**
- Simple request/response model: POST a question + token budget, GET optimal context
- Conversation tracking via optional conversation_id for deduplication
- Context profiles: specify which profile to use for retrieval tuning
- Source filtering: include or exclude specific knowledge spaces
- Streaming support for real-time agent workflows
- Rate limiting and usage analytics

**SDKs:**
- Python SDK: `pip install knowbase`
- TypeScript SDK: `npm install knowbase`
- Thin wrappers around the REST API with type safety, retry logic, and error handling
- Example integrations with LangChain, LlamaIndex, and Vercel AI SDK

**Webhooks:**
- Real-time notifications when knowledge is updated
- Subscribe to specific spaces or tags
- Payload includes the affected document and its relationships
- Enables agents to stay current without polling

---

## Context Profile System

Context profiles are the key abstraction that makes Knowbase work across diverse use cases. Instead of one-size-fits-all retrieval, users define profiles that encode the retrieval strategy for each scenario.

**Profile Configuration:**

| Setting | Description | Example |
|---|---|---|
| Sources | Which knowledge spaces to query | FAQ docs + policy docs |
| Token Budget | Max tokens per query | 4,000 tokens |
| Retrieval Strategy | Precision vs. recall vs. balanced | Balanced |
| Priority Rules | What to prefer (recency, authority, completeness) | Prioritize recent content |
| Entity Filters | Include/exclude specific entity types | Only people and projects |
| Recency Weight | How much to boost recently updated content | High (0.8) |
| Dedup Window | How long to remember "seen" context | 20 turns |
| Graph Depth | How many relationship hops to traverse | 2 hops |
| Hierarchical Mode | Start with summaries or go straight to full content | Summaries first |

**Example Profiles:**

**"Support Bot" Profile:**
- Sources: FAQ space, policy documents, known issues space
- Token budget: 4,000 tokens
- Strategy: high precision (prefer exact matches over broad coverage)
- Priority: recency-weighted (newer policies take precedence)
- Graph depth: 1 hop (stay close to direct matches)
- Use case: customer-facing support agent that needs concise, accurate answers

**"Research Assistant" Profile:**
- Sources: all document spaces, research papers, web clippings
- Token budget: 50,000 tokens
- Strategy: high recall (comprehensive coverage preferred)
- Priority: completeness-weighted (don't miss anything)
- Graph depth: 3 hops (follow connections to discover hidden insights)
- Use case: internal research tool that needs thorough, exploratory context

**"Code Review Agent" Profile:**
- Sources: technical docs, API specs, architecture decisions, past PRs
- Token budget: 8,000 tokens
- Strategy: balanced
- Priority: authority-weighted (official specs > informal notes)
- Entity filter: only technical entities (projects, code references, decisions)
- Use case: AI code reviewer that needs accurate technical context

**Agent-Profile Assignment:**
- Each agent is assigned one or more context profiles
- Agents can switch profiles mid-conversation based on topic detection
- API consumers specify the profile in their query request
- Default profile is used if none specified

---

## Pricing Strategy (Future)

| Plan | Price | Agents | Chunks | Storage | Key Features |
|---|---|---|---|---|---|
| Free | $0/mo | 1 | 1,000 | 50 MB | Chat interface, basic retrieval, 1 context profile |
| Pro | $19/mo | 5 | 50,000 | 2 GB | API access, 10 profiles, knowledge graph, priority processing |
| Team | $49/mo | 20 | 200,000 | 10 GB | Team collaboration, shared spaces, role-based access, analytics |
| Enterprise | Custom | Unlimited | Unlimited | Unlimited | SSO, dedicated support, custom integrations, SLA, compliance |

**Notes:**
- Chunks are the atomic unit of billing — one chunk ≈ one ~500-token segment
- Free tier is generous enough for individual power users to experience core value
- Pro tier unlocks the developer platform (API + SDK)
- Team tier adds collaboration features needed for small companies
- Enterprise tier is for organizations with security/compliance requirements
- Overage pricing: pay-as-you-go beyond plan limits (pricing TBD)
- Annual billing: 20% discount on all paid plans

---

## Technical Architecture

```
┌─────────────────────────────────────────────────┐
│                  Frontend                        │
│            Next.js 15 + TypeScript               │
│         React Server Components + SPA           │
├─────────────────────────────────────────────────┤
│                  API Layer                       │
│         Next.js API Routes + REST API           │
│          WebSocket (real-time updates)           │
├──────────┬──────────┬──────────┬────────────────┤
│  Auth    │ Ingestion│ Context  │  Knowledge     │
│ Service  │ Pipeline │ Engine   │  Graph         │
├──────────┴──────────┴──────────┴────────────────┤
│              Background Workers                  │
│     Processing Queue (ingestion, embeddings)     │
├─────────────────────────────────────────────────┤
│               Data Layer                         │
│   Supabase (Auth, Real-time, Edge Functions)    │
│   PostgreSQL + pgvector (storage + vectors)      │
├─────────────────────────────────────────────────┤
│              External Services                   │
│   OpenAI API (embeddings, summaries, entities)   │
└─────────────────────────────────────────────────┘
```

**Core Technology Choices:**

- **Next.js 15 + TypeScript**: Full-stack framework for both the web UI and the API layer. Server components for performance, client components for interactivity.
- **Supabase**: Managed PostgreSQL with built-in authentication (email, OAuth, magic links), real-time subscriptions, and edge functions for background processing.
- **PostgreSQL + pgvector**: Primary data store with vector similarity search. pgvector extension enables efficient approximate nearest neighbor (ANN) search on embeddings.
- **OpenAI API**: Used for text embeddings (text-embedding-3-small), summarization (GPT-4o-mini), entity extraction, and auto-tagging. Designed to be swappable for other embedding/LLM providers.
- **Background Processing Queue**: Ingestion and AI processing happen asynchronously. Jobs are queued and processed by workers to keep the API responsive. Built on Supabase Edge Functions or a dedicated queue service (e.g., BullMQ, Inngest).
- **REST API + SDK**: Clean REST API for external integrations. Official Python and TypeScript SDKs with full type definitions and examples.

**Data Model (Simplified):**

- `users` → user accounts and authentication
- `spaces` → top-level knowledge containers (e.g., "Project Alpha", "Personal Notes")
- `documents` → individual ingested items
- `chunks` → processed segments of documents with embeddings and metadata
- `summaries` → hierarchical summaries per chunk
- `entities` → extracted entities with references to chunks
- `relationships` → edges in the knowledge graph
- `context_profiles` → retrieval configuration profiles
- `agents` → AI agent definitions with profile assignments
- `conversations` → chat history and context tracking

---

## Success Metrics

### Primary Metrics (Product-Market Fit Indicators)
- **Context retrieval accuracy**: User feedback on whether retrieved context was relevant (thumbs up/down per query). Target: >85% positive.
- **Token efficiency score**: Ratio of relevant tokens to total tokens injected. Target: >70% relevance density.
- **Time to first answer**: Seconds from query to first context response. Target: <2 seconds for cached, <5 seconds for fresh.

### Engagement Metrics
- **Knowledge base size**: Total chunks stored per user/org. Indicates platform stickiness.
- **Active agents connected**: Number of unique agents querying the API per week.
- **Weekly active users (WAU)**: Users who query their knowledge base at least once per week.
- **Query volume**: Total queries per user per week. Target: >20 queries/week for active users.

### Business Metrics
- **Free-to-paid conversion rate**: Percentage of free users who upgrade within 90 days. Target: >5%.
- **Monthly recurring revenue (MRR)**: Total subscription revenue.
- **Churn rate**: Monthly cancellation rate. Target: <5%.
- **Net Promoter Score (NPS)**: Would users recommend Knowbase? Target: >50.

### Technical Metrics
- **Ingestion latency**: Time from upload to fully processed and searchable. Target: <60 seconds for documents <100 pages.
- **Query latency**: P95 response time for context queries. Target: <3 seconds.
- **Uptime**: API availability. Target: 99.9%.

---

## Differentiation from Competitors

| Competitor | What They Are | Why Knowbase Is Different |
|---|---|---|
| **Notion / Confluence** | Document storage and collaboration | Manual filing and organization. No AI-native context retrieval. Knowbase auto-organizes and retrieves optimal context. |
| **Pinecone / Weaviate** | Vector database (developer infrastructure) | Low-level tools requiring engineering effort to build retrieval systems. Knowbase is a product — zero-config intelligence on top of vector search. |
| **LangChain / LlamaIndex** | Developer frameworks for LLM apps | Require code, configuration, and ongoing maintenance. Knowbase is a managed service — no code required for core use cases. |
| **ChatGPT / Claude** | General-purpose AI assistants | Great at conversation, poor at managing large personal knowledge bases. Knowledge limits are small. Knowbase is purpose-built for knowledge management and context retrieval. |
| **Custom GPTs / Claude Projects** | AI assistants with file upload | Limited knowledge capacity, no intelligent retrieval, no multi-agent support. Knowbase scales to millions of chunks with smart retrieval. |
| **Obsidian / Roam Research** | Personal knowledge management | Excellent for note-taking and linking, but not AI-native. No API for agents, no semantic retrieval. Knowbase bridges PKM and AI. |

**Knowbase's Unique Position:**

Knowbase is the only product that combines:
1. **Zero-config ingestion** — drop in files, URLs, or text, and the system handles the rest
2. **Intelligent context retrieval** — not just search, but optimal context selection within token budgets
3. **Knowledge graph** — auto-generated relationships that surface hidden connections
4. **Multi-agent support** — different agents get different context profiles from the same knowledge base
5. **API-first design** — works as both a standalone product and a developer platform

The core thesis: the next wave of AI applications won't be limited by model capability, but by context management. Knowbase owns the context layer.

---

*Document version: 1.0*
*Last updated: April 2026*
