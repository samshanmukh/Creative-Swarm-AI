export interface EnhancedAsset {
  assetUrl: string;
  provider: "mock-magnific" | "magnific";
  status: "placeholder" | "enhanced";
}

export interface MagnificAdapter {
  enhance(prompt: string, index?: number): Promise<EnhancedAsset>;
}

// ─── Mock ────────────────────────────────────────────────────────────────────

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

// ─── MCP client ──────────────────────────────────────────────────────────────

const MCP_URL = "https://mcp.magnific.com/mcp";

interface McpJsonRpc<P = unknown> {
  jsonrpc: "2.0";
  id: number;
  method: string;
  params: P;
}

interface McpTool {
  name: string;
  description?: string;
  inputSchema?: { properties?: Record<string, unknown> };
}

async function mcpPost<T>(
  apiKey: string,
  payload: McpJsonRpc,
): Promise<T> {
  const res = await fetch(MCP_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  if (res.status === 401)
    throw new Error("Magnific MCP: invalid or missing API key (401)");
  if (!res.ok)
    throw new Error(`Magnific MCP request failed (${res.status})`);

  const data = (await res.json()) as { result?: T; error?: { message: string } };
  if (data.error) throw new Error(`Magnific MCP error: ${data.error.message}`);
  if (data.result === undefined) throw new Error("Magnific MCP returned no result");
  return data.result as T;
}

let cachedTools: McpTool[] | undefined;

async function getTools(apiKey: string): Promise<McpTool[]> {
  if (cachedTools) return cachedTools;

  // MCP handshake
  await mcpPost(apiKey, {
    jsonrpc: "2.0",
    id: 1,
    method: "initialize",
    params: {
      protocolVersion: "2024-11-05",
      capabilities: {},
      clientInfo: { name: "creative-swarm-ai", version: "0.1.0" },
    },
  });

  const list = await mcpPost<{ tools: McpTool[] }>(apiKey, {
    jsonrpc: "2.0",
    id: 2,
    method: "tools/list",
    params: {},
  });

  cachedTools = list.tools ?? [];
  return cachedTools;
}

function pickEnhanceTool(tools: McpTool[]): McpTool {
  const keywords = ["enhance", "upscale", "generate", "image", "create"];
  for (const kw of keywords) {
    const match = tools.find((t) => t.name.toLowerCase().includes(kw));
    if (match) return match;
  }
  if (tools.length > 0) return tools[0];
  throw new Error("Magnific MCP: no usable tool found on the server");
}

function extractUrl(content: unknown): string {
  if (Array.isArray(content)) {
    for (const item of content as { type: string; url?: string; text?: string }[]) {
      if (item.type === "image" && item.url) return item.url;
      if (item.type === "text" && item.text) {
        const match = item.text.match(/https?:\/\/\S+/);
        if (match) return match[0];
      }
    }
  }
  throw new Error("Magnific MCP: could not extract an asset URL from the response");
}

// ─── Real adapter ─────────────────────────────────────────────────────────────

export class MagnificMCPAdapter implements MagnificAdapter {
  constructor(private readonly apiKey: string) {}

  async enhance(prompt: string, index = 0): Promise<EnhancedAsset> {
    const tools = await getTools(this.apiKey);
    const tool = pickEnhanceTool(tools);

    // Build arguments — include every field the tool schema declares; fall back
    // to a sensible minimal set when the schema isn't available.
    const schema = tool.inputSchema?.properties ?? {};
    const hasField = (name: string) => name in schema;

    const args: Record<string, unknown> = { prompt };
    if (hasField("index") || hasField("seed")) args.seed = index;
    if (hasField("scale") || hasField("upscale_factor")) args.scale = 2;
    if (hasField("creativity")) args.creativity = 0.35;
    if (hasField("resemblance")) args.resemblance = 0.9;

    const result = await mcpPost<{ content: unknown }>(this.apiKey, {
      jsonrpc: "2.0",
      id: 3,
      method: "tools/call",
      params: { name: tool.name, arguments: args },
    });

    return {
      assetUrl: extractUrl(result.content),
      provider: "magnific",
      status: "enhanced",
    };
  }
}

// ─── Resilient adapter (used by the app) ─────────────────────────────────────

class ResilientMagnificAdapter implements MagnificAdapter {
  private readonly mock = new MockMagnificAdapter();
  private readonly mcp: MagnificMCPAdapter | null;

  constructor() {
    const key = process.env.MAGNIFIC_API_KEY;
    this.mcp = key ? new MagnificMCPAdapter(key) : null;
  }

  async enhance(prompt: string, index = 0): Promise<EnhancedAsset> {
    if (process.env.USE_REAL_MAGNIFIC !== "true" || !this.mcp) {
      return this.mock.enhance(prompt, index);
    }
    try {
      return await this.mcp.enhance(prompt, index);
    } catch (error) {
      console.error("Magnific MCP unavailable; using mock asset", error);
      return this.mock.enhance(prompt, index);
    }
  }
}

export const magnificAdapter: MagnificAdapter = new ResilientMagnificAdapter();
