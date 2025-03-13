import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const apiKey = process.env.OPENROUTER_API_KEY;

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: apiKey,
  defaultHeaders: {
    "HTTP-Referer": "https://codeframe.vercel.app", // Erforderlich für OpenRouter
    "X-Title": "CodeFrame", // Erforderlich für OpenRouter
  },
});

export async function POST(req: NextRequest) {
  try {
    // Überprüfe, ob der API-Schlüssel vorhanden ist
    if (!apiKey) {
      return NextResponse.json(
        { error: "OPENROUTER_API_KEY ist nicht definiert" },
        { status: 500 }
      );
    }

    const { imageUrl, description } = await req.json();

    if (!imageUrl) {
      return NextResponse.json(
        { error: "Image URL ist erforderlich" },
        { status: 400 }
      );
    }

    if (!description) {
      return NextResponse.json(
        { error: "Beschreibung ist erforderlich" },
        { status: 400 }
      );
    }

    // Always use Gemini model
    const modelName = "google/gemini-2.0-flash-lite-preview-02-05:free";

    try {
      // Eigentliche Anfrage mit Bild
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
          try {
            for await (const chunk of response) {
              const text = chunk.choices?.[0]?.delta?.content || "";
              controller.enqueue(new TextEncoder().encode(text));
            }
            controller.close();
          } catch (error) {
            controller.error(error);
          }
        },
      });

      return new Response(stream, {
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
        },
      });
    } catch (openaiError) {
      let errorMessage = "Unbekannter Fehler bei der OpenAI API";

      if (openaiError instanceof Error) {
        errorMessage = openaiError.message;
      }

      return NextResponse.json(
        {
          error: "OpenAI API Fehler",
          message: errorMessage,
        },
        { status: 500 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to process AI model request" },
      { status: 500 }
    );
  }
}
