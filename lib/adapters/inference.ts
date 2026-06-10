export interface InferenceAdapter {
  complete(
    system: string,
    input: string,
  ): Promise<{ text: string; tokens: number }>;
}

export class OpenAIInferenceAdapter implements InferenceAdapter {
  async complete(system: string, input: string) {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY is required when USE_REAL_OPENAI=true");
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-4o-mini",
        messages: [
          { role: "system", content: system },
          { role: "user", content: input },
        ],
        response_format: { type: "json_object" },
        temperature: 0.65,
      }),
    });

    if (!response.ok) {
      const detail = await response.text();
      throw new Error(`OpenAI request failed (${response.status}): ${detail}`);
    }

    const data = (await response.json()) as {
      choices?: { message?: { content?: string } }[];
      usage?: { total_tokens?: number };
    };
    const text = data.choices?.[0]?.message?.content;
    if (!text) throw new Error("OpenAI returned an empty response");

    return {
      text,
      tokens: data.usage?.total_tokens || 0,
    };
  }
}
