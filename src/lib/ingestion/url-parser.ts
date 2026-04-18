import TurndownService from "turndown";

const turndown = new TurndownService({
  headingStyle: "atx",
  codeBlockStyle: "fenced",
});

export interface FetchUrlResult {
  title: string;
  content: string;
  textContent: string;
}

export async function fetchUrlContent(url: string): Promise<FetchUrlResult> {
  // Validate URL
  let parsedUrl: URL;
  try {
    parsedUrl = new URL(url);
  } catch {
    throw new Error("Invalid URL provided");
  }

  if (!["http:", "https:"].includes(parsedUrl.protocol)) {
    throw new Error("Only HTTP and HTTPS URLs are supported");
  }

  // Fetch with timeout
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  let response: Response;
  try {
    response = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent":
          "Knowbase/1.0 (Knowledge Base Content Fetcher)",
        Accept: "text/html,application/xhtml+xml,text/plain",
      },
    });
  } catch (err) {
    clearTimeout(timeout);
    if (err instanceof DOMException && err.name === "AbortError") {
      throw new Error("Request timed out after 15 seconds");
    }
    throw new Error(`Failed to fetch URL: ${err instanceof Error ? err.message : "Network error"}`);
  } finally {
    clearTimeout(timeout);
  }

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("Page not found (404)");
    }
    if (response.status === 403) {
      throw new Error("Access denied (403) - the page may block automated requests");
    }
    throw new Error(`HTTP error ${response.status}: ${response.statusText}`);
  }

  const contentType = response.headers.get("content-type") || "";
  if (!contentType.includes("text/html") && !contentType.includes("text/plain")) {
    throw new Error(
      `Unsupported content type: ${contentType}. Only HTML and plain text pages are supported.`
    );
  }

  const html = await response.text();

  // Extract title from <title> tag
  let title = "";
  const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  if (titleMatch) {
    title = titleMatch[1].trim();
  }

  // Try to extract from <h1> if title is empty or generic
  if (!title || title.length < 3) {
    const h1Match = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
    if (h1Match) {
      title = h1Match[1].replace(/<[^>]*>/g, "").trim();
    }
  }

  // Fallback to URL hostname + path
  if (!title) {
    title = parsedUrl.hostname + parsedUrl.pathname;
  }

  // Convert HTML to Markdown
  const content = turndown.turndown(html);

  // Strip all HTML tags for plain text
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
