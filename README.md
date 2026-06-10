# Creative Swarm AI

A hackathon-ready distributed AI creative campaign generator. Creative Swarm turns a product description into market signals, global strategy, localized creative for US/EU/APAC, visual prompts, Magnific enhancement placeholders, and a complete execution trace.

## What the demo does

1. Accepts a product URL or description.
2. Runs Trend and Research agents in parallel.
3. Feeds their findings into a Strategy agent.
4. Fans strategy out to US, EU, APAC, and Visual Prompt agents.
5. Sends visual concepts through the Magnific adapter.
6. Runs a final Critic agent.
7. Shows the campaign and a distributed execution trace.

## Architecture

```text
Product brief
  └─ TrendAgent + ResearchAgent              (parallel)
       └─ StrategyAgent
            ├─ USRegionalAgent               (Akamai US edge)
            ├─ EURegionalAgent               (Akamai EU edge)
            ├─ APACRegionalAgent             (Akamai APAC edge)
            └─ VisualPromptAgent
                 └─ MagnificAgent
                      └─ CriticAgent
```

- **Next.js App Router + TypeScript + Tailwind** power the UI and API routes.
- **Staged agent orchestrator** passes typed outputs between nine specialist agents.
- **Adapter interfaces** isolate Akamai routing, Magnific enhancement, and model inference.
- **Mock-first mode** is deterministic, fast, and requires no credentials.
- **OpenAI mode** uses JSON agent responses and is enabled only through `USE_REAL_OPENAI=true`.
- **In-memory campaign store** keeps the hackathon MVP simple. Replace it with a database before production.

## Quick start

```bash
cp .env.example .env.local
npm install
npm run dev
```

Open http://localhost:3000 or jump directly to the seeded demo at http://localhost:3000/campaign/demo-swarm-001.

## Environment variables

| Variable               | Purpose                                                       |
| ---------------------- | ------------------------------------------------------------- |
| `USE_REAL_OPENAI`      | Set to `true` to use OpenAI inference instead of mock outputs |
| `OPENAI_API_KEY`       | OpenAI API credential                                         |
| `OPENAI_MODEL`         | Optional model override; defaults to `gpt-4o-mini`            |
| `MAGNIFIC_API_KEY`     | Reserved for the future real Magnific adapter                 |
| `AKAMAI_CLIENT_TOKEN`  | Reserved for the future real Akamai adapter                   |
| `AKAMAI_CLIENT_SECRET` | Reserved for the future real Akamai adapter                   |
| `AKAMAI_ACCESS_TOKEN`  | Reserved for the future real Akamai adapter                   |

Never commit `.env.local` or credentials.

## API

- `POST /api/campaigns` — run the full distributed workflow
- `GET /api/campaigns/:id` — fetch campaign output
- `POST /api/agents/run` — run one named agent with optional upstream context
- `POST /api/magnific/enhance` — submit a mock enhancement job
- `GET /api/observability/:campaignId` — fetch workflow telemetry

Example:

```bash
curl -X POST http://localhost:3000/api/campaigns \
  -H 'Content-Type: application/json' \
  -d '{"product":"An AI coding assistant that automates repetitive developer workflows."}'
```

Each agent trace includes:

```json
{
  "agentName": "EURegionalAgent",
  "region": "EU",
  "input": "...",
  "output": "...",
  "latencyMs": 243,
  "tokensUsed": 318,
  "status": "completed",
  "edge": "fra-edge-03",
  "startedAt": "2026-06-10T16:30:00.000Z"
}
```

## Replacing mock integrations

Implement `RoutingAdapter` in `lib/adapters/akamai.ts` and `MagnificAdapter` in `lib/adapters/magnific.ts`, then swap the exported adapter instances. Agent call sites do not need to change.

The OpenAI adapter is already implemented in `lib/adapters/inference.ts`. Set `USE_REAL_OPENAI=true` and provide `OPENAI_API_KEY` to use it.

## MVP notes

- Generated campaigns are stored in memory and reset when the server restarts.
- Akamai and Magnific are intentionally mocked behind production-shaped interfaces.
- `npm install` currently reports two upstream dependency audit findings. Review dependency upgrades before production use.
