# Claims Triage System — Prototype

Claims agent dashboard for an AI-powered auto insurance claims triage system. Built as part of an AI Product Manager take-home exercise. The full product reasoning, prioritization, and AI integration approach are documented in the accompanying PRD.

## What it shows

The prototype demonstrates the claims agent's surface, scoped to four moments:

1. A queue view sorted by routing decision (auto-resolved, agent review, senior adjuster).
2. A claim detail view with the model's structured assessment, per-dimension confidence breakdown, and routing rationale.
3. An action surface for accepting or overriding the recommendation, with structured override reasons captured.
4. An audit log keyed to each claim — the defensibility surface for regulatory review.

## Run it

```bash
git clone https://github.com/YOUR_USERNAME/claims-triage-prototype.git
cd claims-triage-prototype
npm install
npm run dev
```

Open the URL printed in the terminal (typically `http://localhost:3000` or `http://localhost:5173`).

## Sample claims

Three claims are pre-loaded to exercise the three routing outcomes:

- `CLM-2024-001` — severity confidence below threshold → **agent review**
- `CLM-2024-002` — all confidence dimensions high → **auto-resolved**
- `CLM-2024-003` — fraud signal flagged → **senior adjuster**

## A note on the AI

Model responses are mocked. The hardcoded outputs match the JSON schema a production system would expect from a real vision-language model call, and the production prompt and routing logic are documented in the PRD's AI Integration section. The prompt was tested offline against a live VLM to confirm it produces well-formed responses; cached outputs are used here for demo reliability.

## What's not built

The brief excluded customer intake and final inspection. Beyond that, the prototype deliberately omits the customer-facing transparency portal, multi-tenant configuration UI, mobile policyholder app, and live VLM integration — all P2 in the PRD or out of scope by design.
