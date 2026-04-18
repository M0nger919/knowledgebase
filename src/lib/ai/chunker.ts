import { countTokens } from "@/lib/openai";

export interface Chunk {
  content: string;
  index: number;
  startOffset: number;
  endOffset: number;
  tokenCount: number;
}

export interface ChunkOptions {
  maxChunkTokens?: number;
  overlapTokens?: number;
}

const DEFAULT_MAX_TOKENS = 500;
const DEFAULT_OVERLAP_TOKENS = 50;

/**
 * Split text on sentence boundaries, preserving markdown formatting.
 */
function splitOnSentences(text: string): string[] {
  // Split on sentence-ending punctuation followed by whitespace or end of string.
  // This keeps the delimiter attached to the preceding sentence.
  const raw = text.split(/(?<=[.!?])\s+/);
  return raw.filter((s) => s.trim().length > 0);
}

/**
 * Split raw markdown content into semantic sections.
 *
 * Recognised boundaries:
 *  - Fenced code blocks (```)
 *  - ATX-style headers (# ## ### …)
 *  - Double newlines (paragraph breaks)
 *  - Unordered list items (- or *)
 *  - Ordered list items (1. 2. …)
 *
 * Each section is returned with its start/end character offsets in the
 * original string so we can reconstruct positions later.
 */
function splitIntoSections(content: string): { text: string; start: number; end: number }[] {
  const sections: { text: string; start: number; end: number }[] = [];
  const lines = content.split("\n");

  let currentSection = "";
  let sectionStart = 0;

  const flush = (sectionEnd: number) => {
    const trimmed = currentSection.trim();
    if (trimmed.length > 0) {
      sections.push({ text: trimmed, start: sectionStart, end: sectionEnd });
    }
  };

  // Detect fenced code blocks so we don't split inside them.
  let insideCodeBlock = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lineStart = content.indexOf(line, sectionStart + currentSection.length);
    const lineEnd = lineStart + line.length;

    // Toggle code-block tracking.
    if (line.trim().startsWith("```")) {
      insideCodeBlock = !insideCodeBlock;
      // Flush before the code block fence.
      if (!insideCodeBlock && currentSection.trim().length > 0) {
        flush(lineEnd);
        currentSection = "";
        sectionStart = lineEnd + 1;
      } else if (!insideCodeBlock) {
        sectionStart = lineEnd + 1;
      }
      currentSection += (currentSection ? "\n" : "") + line;
      continue;
    }

    // Inside a code block – just accumulate.
    if (insideCodeBlock) {
      currentSection += (currentSection ? "\n" : "") + line;
      continue;
    }

    // Outside code block – check for semantic boundary.
    const isHeader = /^#{1,6}\s/.test(line.trim());
    const isBlank = line.trim().length === 0;
    const isListItem = /^(\s*)([-*]|\d+\.)\s/.test(line);

    if (isHeader || isBlank || isListItem) {
      // Flush current section before this boundary.
      if (currentSection.trim().length > 0) {
        flush(lineStart);
        currentSection = "";
        sectionStart = lineStart;
      } else if (currentSection.length === 0) {
        sectionStart = lineStart;
      }

      currentSection += (currentSection ? "\n" : "") + line;
    } else {
      currentSection += (currentSection ? "\n" : "") + line;
    }
  }

  // Flush remainder.
  if (currentSection.trim().length > 0) {
    flush(content.length);
  }

  return sections;
}

/**
 * Merge sections into chunks that respect the target token budget.
 *
 * - Greedily appends sections until the budget is exceeded.
 * - If a single section exceeds 2× the budget, split it on sentences.
 * - Adds overlap by prepending a tail of the previous chunk.
 */
function mergeSectionsIntoChunks(
  sections: { text: string; start: number; end: number }[],
  maxTokens: number,
  overlapTokens: number,
): Chunk[] {
  const chunks: Chunk[] = [];
  let buffer = "";
  let bufferStart = 0;
  let bufferEnd = 0;
  let prevChunkTail = "";

  const flushBuffer = () => {
    const content = prevChunkTail + buffer;
    if (content.trim().length === 0) return;

    chunks.push({
      content: content.trim(),
      index: chunks.length,
      startOffset: bufferStart,
      endOffset: bufferEnd,
      tokenCount: countTokens(content),
    });

    // Compute overlap tail for the next chunk.
    // We take characters from the end of this chunk roughly equal to overlapTokens * 4.
    const overlapChars = overlapTokens * 4;
    prevChunkTail =
      content.length > overlapChars ? content.slice(-overlapChars) : content;

    buffer = "";
  };

  for (const section of sections) {
    const sectionTokens = countTokens(section.text);

    // If a single section is too large, split on sentences.
    if (sectionTokens > maxTokens * 2) {
      flushBuffer(); // flush anything pending first
      const sentences = splitOnSentences(section.text);
      let sentenceBuf = "";
      let sentenceBufStart = section.start;

      for (const sentence of sentences) {
        const candidate = sentenceBuf + (sentenceBuf ? " " : "") + sentence;
        if (sentenceBuf && countTokens(candidate) > maxTokens) {
          const c = prevChunkTail + sentenceBuf;
          chunks.push({
            content: c.trim(),
            index: chunks.length,
            startOffset: sentenceBufStart,
            endOffset: section.start + sentenceBuf.length,
            tokenCount: countTokens(c),
          });
          const overlapChars = overlapTokens * 4;
          prevChunkTail =
            c.length > overlapChars ? c.slice(-overlapChars) : c;
          sentenceBuf = sentence;
          sentenceBufStart = section.start + section.text.indexOf(sentence);
        } else {
          sentenceBuf = candidate;
        }
      }

      if (sentenceBuf.trim()) {
        buffer = sentenceBuf;
        bufferStart = sentenceBufStart;
        bufferEnd = section.end;
      }
      continue;
    }

    // Check if adding this section would exceed the budget.
    const candidate = buffer + (buffer ? "\n\n" : "") + section.text;
    if (buffer && countTokens(candidate) > maxTokens) {
      flushBuffer();
    }

    if (buffer.length === 0) {
      bufferStart = section.start;
    }
    buffer = buffer ? buffer + "\n\n" + section.text : section.text;
    bufferEnd = section.end;
  }

  // Flush remaining buffer.
  if (buffer.trim().length > 0) {
    flushBuffer();
  }

  return chunks;
}

/**
 * Semantically chunk a markdown document.
 *
 * Splits on paragraph breaks, headers, code blocks, and list items.
 * Merges small sections up to ~maxChunkTokens and adds ~overlapTokens
 * of overlap between consecutive chunks.
 */
export async function chunkDocument(
  content: string,
  options?: ChunkOptions,
): Promise<Chunk[]> {
  const maxChunkTokens = options?.maxChunkTokens ?? DEFAULT_MAX_TOKENS;
  const overlapTokens = options?.overlapTokens ?? DEFAULT_OVERLAP_TOKENS;

  if (!content.trim()) return [];

  const sections = splitIntoSections(content);
  const chunks = mergeSectionsIntoChunks(sections, maxChunkTokens, overlapTokens);
  return chunks;
}
