import OpenAI from "openai";

let client: OpenAI | null = null;

function getClient(): OpenAI {
  if (!client) {
    const key = process.env.OPENROUTER_API_KEY;
    if (!key) throw new Error("OPENROUTER_API_KEY is not set");
    client = new OpenAI({
      apiKey: key,
      baseURL: "https://openrouter.ai/api/v1",
      defaultHeaders: {
        "HTTP-Referer": "https://quantafelis.org",
        "X-Title": "Knowbase",
      },
    });
  }
  return client;
}

export async function generateEmbedding(text: string): Promise<number[]> {
  const response = await getClient().embeddings.create({
    model: "openai/text-embedding-3-small",
    input: text,
  });
  return response.data[0].embedding;
}

export async function generateChatCompletion(
  prompt: string,
  system?: string,
  model: string = "google/gemma-3-27b-it:free"
): Promise<string> {
  const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [];
  if (system) {
    messages.push({ role: "system", content: system });
  }
  messages.push({ role: "user", content: prompt });

  const response = await getClient().chat.completions.create({
    model,
    messages,
    temperature: 0.3,
  });

  return response.choices[0]?.message?.content?.trim() ?? "";
}

export function countTokens(text: string): number {
  return Math.ceil(text.length / 4);
}
