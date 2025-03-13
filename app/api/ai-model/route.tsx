import { NextRequest } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

export async function POST(req: NextRequest) {
  const { imageUrl, description, model } = await req.json();
  const modelName =
    model === "gemini-google"
      ? "google/gemini-2.0-flash-lite-preview-02-05:free"
      : "meta-llama/Llama-3.1-8B-Instruct";

  const response = await openai.chat.completions.create({
    model: modelName,
    stream: true,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: description,
          },
          {
            type: "image_url",
            image_url: {
              url: imageUrl,
            },
          },
        ],
      },
    ],
  });
  const stream = new ReadableStream({
    async start(controller) {
      for await (const chunk of response) {
        const text = chunk.choices?.[0]?.delta?.content || "";
        controller.enqueue(new TextEncoder().encode(text));
      }
      controller.close();
    },
  });
  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
