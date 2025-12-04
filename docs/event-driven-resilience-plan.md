# Event-Driven Resilience Plan

Keep things simple, observable, and hard to break as usage grows.

## Why Do It
- Makes failures visible via events/logs instead of silent crashes.
- Decouples features so a broken handler cannot sink the whole app.
- Adds guardrails (validation/timeouts) before bad data spreads.
- Enables progressive rollout: toggle listeners on/off without rewrites.
- Supports load growth by batching/queuing writes.

## Why Not
- Adds wiring overhead (bus + handlers + tests).
- More moving parts to document and maintain.
- Without discipline, events can become noisy and hard to trace.
- JS-only logging is not a full observability stack; real telemetry would still be needed later.

## Implementation Outline
- **Event bus**: lightweight pub/sub for auth, quiz, profile, progress, leaderboard events. Single entry in `src/lib/events.ts`.
- **Guarded IO**: wrap DB/network helpers with timeouts, retries, and user-facing toasts; expose “pending” state to the UI.
- **Validation**: zod schemas at boundaries for profile updates, quiz submissions, leaderboard posts; fail fast with clear errors.
- **Error boundaries**: global boundary plus shells for quiz and profile to contain crashes and offer reset.
- **Concurrency controls**: serialize progress submissions, debounce rapid quiz submits, queue leaderboard updates.
- **Health checks**: on app start, probe IndexedDB stores; surface a “reset local data” escape hatch if corruption is detected.
- **Instrumentation**: minimal counters/timers (quiz_started, quiz_submitted, profile_updated) with console reporting and optional sampling.
