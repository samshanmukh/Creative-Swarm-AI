import { NextResponse } from "next/server";
import { getAkamaiInfrastructure } from "@/lib/adapters/akamai";

export async function GET() {
  if (!process.env.AKAMAI_CLOUD_TOKEN) {
    return NextResponse.json(
      { error: "AKAMAI_CLOUD_TOKEN is not configured" },
      { status: 503 },
    );
  }

  try {
    return NextResponse.json(await getAkamaiInfrastructure());
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Akamai Cloud infrastructure lookup failed",
      },
      { status: 502 },
    );
  }
}
