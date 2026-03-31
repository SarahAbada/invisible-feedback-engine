# Invisible Feedback Engine (IFE)

> Passive, real-time UX analytics via event-driven multi-agent architecture.
> Built at uOttaHack 8 in 24 hours.

## What it does

IFE runs silently in the background of any web app and monitors how users
actually feel while interacting with it — not what they say, but what their
behaviour reveals. No surveys, no popups, no visible UI.

Raw interaction signals (rage clicks, dwell time, scroll loops, repeated
failed attempts) are captured in the browser, streamed to a backend ingestion
gateway, and routed through a pipeline of specialized agents over a Solace
pub/sub message broker. The final synthesized insights surface in a live
React panel.

## Architecture
```
Browser SDK  →  Ingestion Gateway  →  Solace Broker
                                           │
                    ┌──────────────────────┼──────────────────────┐
                    ▼                      ▼                      ▼
             Emotion Agent        UX Friction Agent       Context Agent
             (frustration         (identifies UI          (correlates errors
              detection)           pain points)            with emotion)
                    │                      │                      │
                    └──────────────────────▼──────────────────────┘
                                    Insight Agent
                                  (synthesises output)
                                           │
                                           ▼
                                   InsightPanel (React)
                                   live feed of insights
```

## Tech stack

- **Frontend:** React, TypeScript, Solace JS SDK
- **Backend:** Node.js, TypeScript, multi-agent pipeline
- **Messaging:** Solace PubSub+ (pub/sub over topics)

## Agent pipeline

| Agent | Subscribes to | Publishes to | Purpose |
|---|---|---|---|
| Emotion | `ife/raw/signal` | `ife/agent/emotion` | Detects frustration severity |
| UX Friction | `ife/insight/aggregated` | `ife/agent/ux-friction` | Identifies problematic UI paths |
| Context | `ife/insight/aggregated` | `ife/agent/context` | Correlates errors with emotion spikes |
| Insight | `ife/agent/emotion` | `ife/insight/final` | Synthesises human-readable insights |

## Example output
```json
{
  "sessionId": "demo-session",
  "insight": "User likely frustrated",
  "confidence": 0.9,
  "route": "/checkout"
}
```

## Status

Core agent pipeline and Solace pub/sub infrastructure implemented during
the hackathon. The following are planned extensions:

- [ ] Browser SDK signal collector (click tracking, rage click detection, dwell time)
- [ ] Backend ingestion gateway with payload validation
- [ ] Context agent Sentry/latency integration
- [ ] Aggregation layer feeding `ife/insight/aggregated`

## Running locally

> Requires a Solace PubSub+ broker. A free instance is available at
> [solace.com/products/event-broker/cloud](https://solace.com/products/event-broker/cloud/)
```bash
cp .env.example .env   # add your Solace credentials
npm install
npm run dev
```

## Built at

uOttaHack 8 — University of Ottawa, 2025
