export interface EnhancedAsset {
  assetUrl: string;
  provider: "mock-magnific" | "magnific";
  status: "enhanced";
}

export interface MagnificAdapter {
  enhance(prompt: string, index?: number): Promise<EnhancedAsset>;
}

export class MockMagnificAdapter implements MagnificAdapter {
  async enhance(_prompt: string, index = 0) {
    const accents = ["c7ff47", "8b5cf6", "38bdf8"];
    return {
      assetUrl: `https://placehold.co/1200x800/171a28/${accents[index % 3]}?text=Magnific+Enhanced+0${index + 1}`,
      provider: "mock-magnific" as const,
      status: "enhanced" as const,
    };
  }
}

export const magnificAdapter: MagnificAdapter = new MockMagnificAdapter();
