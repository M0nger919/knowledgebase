import OpenAI from "openai";

let openai: OpenAI | null = null;

function getOpenAI(): OpenAI {
  if (!openai) {
    const key = process.env.OPENAI_API_KEY;
    if (!key) throw new Error("OPENAI_API_KEY is not set");
    openai = new OpenAI({ apiKey: key });
  }
  return openai;
}

export async function generateEmbedding(text: string): Promise<number[]> {
  const response = await getOpenAI().embeddings.create({
    model: "text-embedding-3-small",
    input: text,
  });
  return response.data[0].embedding;
}

export async function generateChatCompletion(
  prompt: string,
  system?: string,
  model: string = "gpt-4o-mini"
): Promise<string> {
  const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [];
  if (system) {
    messages.push({ role: "system", content: system });
  }
  messages.push({ role: "user", content: prompt });

  const response = await getOpenAI().chat.completions.create({
    model,
    messages,
    temperature: 0.3,
  });

  return response.choices[0]?.message?.content?.trim() ?? "";
}

export function countTokens(text: string): number {
  return Math.ceil(text.length / 4);
}
