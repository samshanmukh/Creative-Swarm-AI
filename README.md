# Creative Swarm AI

A hackathon-ready distributed AI creative campaign generator. Creative Swarm turns a product description into market signals, global strategy, localized creative for US/EU/APAC, visual prompts, Magnific enhancement placeholders, and a complete execution trace.

## Architecture

- **Next.js App Router + TypeScript + Tailwind** for UI and API routes.
- **Agent orchestrator** runs nine specialized agents in parallel.
- **Adapter interfaces** isolate Akamai routing, Magnific enhancement, and model inference so mock implementations can be replaced cleanly.
- **Mock-first mode** is deterministic, fast, and requires no credentials.
- **OpenAI mode** is enabled only through `USE_REAL_OPENAI=true`.
- **In-memory campaign store** keeps the MVP intentionally simple; replace it with a persistent database for production.

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
- `POST /api/agents/run` — run one named agent
- `POST /api/magnific/enhance` — submit a mock enhancement job
- `GET /api/observability/:campaignId` — fetch workflow telemetry

Example:

```bash
curl -X POST http://localhost:3000/api/campaigns \
  -H 'Content-Type: application/json' \
  -d '{"product":"An AI coding assistant that automates repetitive developer workflows."}'
```

## Replacing mock integrations

Implement `RoutingAdapter` in `lib/adapters/akamai.ts` and `MagnificAdapter` in `lib/adapters/magnific.ts`, then swap the exported adapter instance. Agent call sites do not need to change.
