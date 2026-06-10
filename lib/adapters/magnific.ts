export interface EnhancedAsset {
  assetUrl: string;
  provider: "mock-magnific" | "magnific";
  status: "placeholder" | "enhanced";
}

export interface MagnificAdapter {
  enhance(prompt: string, index?: number): Promise<EnhancedAsset>;
}

export class MockMagnificAdapter implements MagnificAdapter {
  async enhance(prompt: string, index = 0) {
    return {
      assetUrl: `/api/assets/mock?index=${index}&prompt=${encodeURIComponent(
        prompt.slice(0, 240),
      )}`,
      provider: "mock-magnific" as const,
      status: "placeholder" as const,
    };
  }
}

export class RealMagnificAdapter implements MagnificAdapter {
  private readonly apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async enhance(prompt: string, index = 0): Promise<EnhancedAsset> {
    const response = await fetch("https://api.magnific.ai/v1/upscale", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        prompt,
        image_url: `/api/assets/mock?index=${index}&prompt=${encodeURIComponent(prompt.slice(0, 240))}`,
        scale: 2,
        creativity: 0.35,
        resemblance: 0.9,
      }),
    });

    if (!response.ok) {
      const detail = await response.text();
      throw new Error(`Magnific API request failed (${response.status}): ${detail}`);
    }

    const data = (await response.json()) as { url?: string; output_url?: string };
    const assetUrl = data.url ?? data.output_url;
    if (!assetUrl) throw new Error("Magnific returned no asset URL");

    return {
      assetUrl,
      provider: "magnific",
      status: "enhanced",
    };
  }
}

class ResilientMagnificAdapter implements MagnificAdapter {
  private readonly mock = new MockMagnificAdapter();
  private readonly real: RealMagnificAdapter | null;

  constructor() {
    const key = process.env.MAGNIFIC_API_KEY;
    this.real = key ? new RealMagnificAdapter(key) : null;
  }

  async enhance(prompt: string, index = 0): Promise<EnhancedAsset> {
    if (process.env.USE_REAL_MAGNIFIC !== "true" || !this.real) {
      return this.mock.enhance(prompt, index);
    }
    try {
      return await this.real.enhance(prompt, index);
    } catch (error) {
      console.error("Magnific API unavailable; using mock asset", error);
      return this.mock.enhance(prompt, index);
    }
  }
}

export const magnificAdapter: MagnificAdapter = new ResilientMagnificAdapter();
