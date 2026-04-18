import TurndownService from "turndown";
import mammoth from "mammoth";

const turndown = new TurndownService({
  headingStyle: "atx",
  codeBlockStyle: "fenced",
});

export interface ParseFileResult {
  title: string;
  content: string;
  textContent: string;
}

function extractTitleFromMarkdown(markdown: string, fileName: string): string {
  // Look for first heading
  const headingMatch = markdown.match(/^#{1,6}\s+(.+)$/m);
  if (headingMatch) {
    return headingMatch[1].trim();
  }

  // Fallback to filename without extension
  return fileName.replace(/\.[^/.]+$/, "") || "Untitled Document";
}

function stripMarkdown(text: string): string {
  return text
    .replace(/#{1,6}\s/g, "")
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/\*(.*?)\*/g, "$1")
    .replace(/`(.*?)`/g, "$1")
    .replace(/\[(.*?)\]\(.*?\)/g, "$1")
    .replace(/!\[(.*?)\]\(.*?\)/g, "$1")
    .replace(/```[\s\S]*?```/g, (match) => match.replace(/```\w*\n?/g, ""))
    .replace(/---/g, "")
    .replace(/>\s/g, "")
    .replace(/[-*+]\s/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

async function parseMarkdown(
  text: string,
  fileName: string
): Promise<ParseFileResult> {
  const title = extractTitleFromMarkdown(text, fileName);
  return {
    title,
    content: text,
    textContent: stripMarkdown(text),
  };
}

async function parseText(
  text: string,
  fileName: string
): Promise<ParseFileResult> {
  const title = fileName.replace(/\.[^/.]+$/, "") || "Untitled Document";
  return {
    title,
    content: text,
    textContent: text,
  };
}

async function parseHtml(
  html: string,
  fileName: string
): Promise<ParseFileResult> {
  // Extract title from <title> or <h1>
  let title = "";
  const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  if (titleMatch) {
    title = titleMatch[1].trim();
  }
  if (!title || title.length < 3) {
    const h1Match = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
    if (h1Match) {
      title = h1Match[1].replace(/<[^>]*>/g, "").trim();
    }
  }
  if (!title) {
    title = fileName.replace(/\.[^/.]+$/, "") || "Untitled Document";
  }

  const content = turndown.turndown(html);
  const textContent = html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();

  return { title, content, textContent };
}

async function parsePdf(
  buffer: ArrayBuffer,
  fileName: string
): Promise<ParseFileResult> {
  // mammoth can extract text from .docx files
  // For PDF support, we read it as a raw buffer and extract text
  // mammoth actually handles .docx, not PDF
  // We'll use mammoth for .docx and a basic PDF text extraction
  const uint8 = new Uint8Array(buffer);
  const text = new TextDecoder("utf-8", { fatal: false }).decode(uint8);

  // Try to find readable text in the PDF (basic extraction)
  // PDF text is often stored between BT and ET markers
  const textBlocks: string[] = [];
  const btEtRegex = /BT\s([\s\S]*?)ET/g;
  let match;
  while ((match = btEtRegex.exec(text)) !== null) {
    const block = match[1];
    // Extract text from Tj and TJ operators
    const tjMatches = block.matchAll(/\(([^)]*)\)\s*Tj/g);
    for (const tjMatch of tjMatches) {
      textBlocks.push(tjMatch[1]);
    }
    // TJ arrays
    const tjArrayMatches = block.matchAll(/\[([\s\S]*?)\]\s*TJ/g);
    for (const tjArrayMatch of tjArrayMatches) {
      const arrayContent = tjArrayMatch[1];
      const strMatches = arrayContent.matchAll(/\(([^)]*)\)/g);
      for (const strMatch of strMatches) {
        textBlocks.push(strMatch[1]);
      }
    }
  }

  const extractedText = textBlocks.join(" ").trim();

  if (extractedText.length < 10) {
    throw new Error(
      "Could not extract meaningful text from this PDF. The file may be image-based or encrypted."
    );
  }

  const title = fileName.replace(/\.[^/.]+$/, "") || "Untitled Document";

  return {
    title,
    content: extractedText,
    textContent: extractedText,
  };
}

async function parseDocx(
  buffer: ArrayBuffer,
  fileName: string
): Promise<ParseFileResult> {
  const result = await mammoth.extractRawText({ arrayBuffer: buffer });
  const text = result.value;

  const title = fileName.replace(/\.[^/.]+$/, "") || "Untitled Document";

  return {
    title,
    content: text,
    textContent: text,
  };
}

export async function parseFile(file: File): Promise<ParseFileResult> {
  const fileName = file.name || "unknown";
  const extension = fileName.split(".").pop()?.toLowerCase() || "";

  const buffer = await file.arrayBuffer();

  switch (extension) {
    case "md":
    case "markdown": {
      const text = new TextDecoder("utf-8").decode(buffer);
      return parseMarkdown(text, fileName);
    }
    case "txt": {
      const text = new TextDecoder("utf-8").decode(buffer);
      return parseText(text, fileName);
    }
    case "html":
    case "htm": {
      const html = new TextDecoder("utf-8").decode(buffer);
      return parseHtml(html, fileName);
    }
    case "pdf": {
      return parsePdf(buffer, fileName);
    }
    case "docx": {
      return parseDocx(buffer, fileName);
    }
    default:
      throw new Error(
        `Unsupported file type: .${extension}. Supported types: .md, .txt, .html, .pdf, .docx`
      );
  }
}
