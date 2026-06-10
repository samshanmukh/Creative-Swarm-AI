import { NextRequest, NextResponse } from "next/server";
import { magnificAdapter } from "@/lib/adapters/magnific";
export async function POST(request: NextRequest) {
  const { prompt, index = 0 } = await request.json();
  if (!prompt)
    return NextResponse.json({ error: "prompt is required" }, { status: 400 });
  return NextResponse.json(await magnificAdapter.enhance(prompt, index));
}
