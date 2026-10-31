# AOS Product v0.1 — Gemini AI Build Brief

**Date:** 2026-10-23  
**Audience:** Gemini AI acting as product architect, UX designer and implementation lead  
**Document type:** Build-ready product handoff / initial scope, not deployment approval  
**Working title:** **AOS — One Account, N Devices, Many Experiences**  
**Status:** Proposed new **AOS Product/Custom Skins v0.1**, distinct from the *existing* AOS Dashboard v0.1 in the repository.

---

## 0. Your assignment (read first)

**Design and implement the smallest convincing, runnable AOS Product v0.1.** It must make the benefits of a shared, AI-native operating environment immediately visible to a nontechnical user through a polished mobile-first app, a useful default AI prompt, a small collection of ready-to-use *skins*, a skin library, and a safe path for tailoring an experience.

Do **not** build an empty dashboard, a generic chatbot clone, a new all-powerful autonomous agent, or one independent SaaS backend per industry. AOS is one reusable engine with many user-facing experiences. The app should demonstrate this proposition through **two different use cases** sharing the same account, context and controlled capabilities.

First inspect any repository files actually supplied to you. If no source code is available in your Gemini workspace, use this brief as the source of requirements and build a runnable **standalone prototype with a clearly labelled mock adapter**. Never claim to have accessed a repo, an API, Google Cloud, or a device you have not actually accessed. Do not invent runtime readiness.

**Instruction precedence:** User-approved constraints, actual repository contracts, and security gates take precedence over examples or guesses in this document. If historical docs disagree, verify against the current code and report the discrepancy. The user's sign-off remains required for paid calls, cloud resources, live mutations, production deployment and security-policy changes.

## 1. The product in one paragraph

AOS is an **AI-native, human-directed personal/business operating layer**. A user talks to AOS in natural language or voice, sees relevant tools and information as widgets, chooses or adapts an industry/persona-specific *skin*, and can approve a bounded plan that AOS executes with appropriate tools, policies and verification. The **same AOS account** supports **N separately authorized devices** and **many skins and widgets**; these share permitted goals, conversations, context, usage and an underlying AOS Engine. The app feels like “my useful app” for each activity—not like a technical agent console. Human intent is interpreted into structured, inspectable, reversible work, never silently converted into uncontrolled actions.

**Design principle:** *One Account, N Devices, Many Experiences.*  
**Interaction principle:** *Human Intent → Interpretation → Context → Proposal/Preview → Human Approval → Bounded Execution → Evidence/Verification → Updated State.*  
**Packaging principle:** *One shared AOS Engine; many reusable, versioned, domain-specific experience packages (skins), not separate engines.*

## 2. Intended customers and business model

- Initially target users and small businesses **with a concrete, recurring need and willingness to pay**; avoid a vague “AI for everyone” initial launch.
- A *skin* is a packaged working experience: purpose-specific onboarding, language, widgets, navigation, workflows, connectors, defaults and permission requests—not merely a color theme.
- Potential vertical packages: field service/locksmith, construction/HVAC, accounting/admin, mobile driver, property/home management. Prioritize by validated need and economics, not technical novelty.
- Commercial hypothesis: **account base subscription + measured usage** (AI tokens/compute and separately priced capabilities where relevant), optionally premium skins. One account may authorize multiple devices and experiences. Show usage transparency and estimated costs before expensive actions. **No real billing in v0.1.**
- Marketing should take a customer directly to the relevant skin preview and a fast, verifiable first benefit. Do not rely on a generalized “AI magic” promise.

## 3. What v0.1 must prove

1. **Immediate comprehension:** On first open the user sees the default conversational prompt and 2–3 tangible, preconfigured experiences. Within a minute they understand what AOS can do.
2. **Skin reuse:** Switching from one skin to another changes the UI/workflow vocabulary and available widgets **without changing the core engine**.
3. **Shared context with boundaries:** A saved, explicitly permitted goal/setting can be reused across experiences and devices; private or unrelated context is not leaked.
4. **Human-directed AI:** A natural-language request becomes an understandable *proposal* (goal, proposed steps, required data, cost/permissions, risks) that can be edited/rejected. Execution is gated.
5. **Useful action, not chat only:** At least one approved `plan_only` flow reaches a validated backend integration **if available**; otherwise it must be simulated explicitly and visibly.
6. **Honest operational state:** Data and capabilities are clearly marked live, offline, demo/mock or unavailable. No synthetic output masquerades as real task completion or verified business data.

## 4. Default Pack and initial screens

The default experience should be **beautiful, compact, accessible, and easy to understand**, not overloaded with agent jargon. Initial pack:

**A. Home / AI prompt (default start screen)**
- Familiar conversational composer (“What would you like to do?”), recent context, clear voice entry point if implemented, concise examples, and an obvious Skin switcher.
- Small “Your tools” section shows enabled core widgets and what they do.
- “Continue” card for a real or transparently demo conversation/goal/task; basic account and data-source status.

**B. Core skins, visible from the first launch**
- **Everyday / General Assistant:** Conversation, goals, notes and a personal dashboard of opted-in widgets. AOS utility should be apparent even before configuring a professional skin.
- **Field Service / Locksmith DEMO (commercial example):** Today’s jobs, new work request, customer context, proposed job plan, job status. Any booking, dispatch, invoice and customer records without a live connector must be clearly labelled sample data and cannot perform real-world actions.
- **Driver DEMO (context-aware example):** Route/next stop, optional interests, suggested relevant stops or alerts, and a voice-friendly compact mode. In v0.1 use fixtures unless real consented location and verified data sources are integrated. No fabricated route times, offers or safety claims. No distracting driver interaction while moving.

**C. Skin Library**
- Browse installed and available skins; show the purpose, preview, widgets, needed permissions, underlying capabilities and demo/live readiness.
- Add/activate/deactivate a pre-defined skin without adding a backend service. Do not pretend marketplace distribution/payments are finished.

**D. My Experience / Skin customization**
- Start from a template; configure title, visible widgets, order/layout and safe allowed settings. Provide preview, Save/Cancel and revert to default.
- Optional plain-English *propose customization* interaction may produce validated **declarative JSON** for review; **never execute arbitrary AI-generated JSX/HTML/scripts** from a skin manifest.
- Full AI-driven UI generation, app-store publishing and unrestricted marketplace submissions are later features.

**E. Tasks / Goals / Activity (minimal)**
- A human-readable summary: what AOS understood, what it proposes, what has been approved, what is running, what was verified, and the next action required.
- Keep the advanced multi-agent operational dashboard available as a separate power-user view; do not make it the first-time consumer landing page.

### Required demonstration walkthroughs

**Demo 1 — Service business (income/ROI story):** Select Field Service → inspect today’s sample jobs → enter “Prepare a plan for tomorrow’s three service visits” → see structured plan, context and permissions → edit/approve **plan_only** → get clearly traceable result/evidence or an explicit mock outcome. Never send customers messages or create real bookings without an approved integration.

**Demo 2 — Mobile driver (breadth/context story):** Switch to Driver on the same account → configure interests/consent → see route/status widgets from mock fixtures → receive one clearly labelled suggested action → open the same goal/activity context on a second authorized device or demonstrate the server-side account abstraction. No automatic tracking by default.

**Demo 3 — Composition:** Move a News/Notes widget to the main home experience; save a declarative layout; reload and verify persistence. If device sync is not actually implemented, say so prominently rather than pretending localStorage equals multi-device account sync.

## 5. Mobile-first interaction rules

- Design at **375/390 px phone**, **820 px tablet**, and **1440 px desktop**; responsive/adaptive layout, no horizontal overflow; effective touch targets ~44 px or larger; visible keyboard focus; accessible labels; AA-like text contrast (normal text ≥4.5:1 where applicable).
- Prefer a **bottom tab bar on phones**, optional sidebar on large screens, concise cards, one obvious primary action per view, appropriate empty/loading/error/saved states, and one readable typographic hierarchy.
- Use reusable visual tokens and declarative UI slots. Skins may change *layout, language, workflow and widgets*, not security or state ownership.
- Show **2–3 meaningful pages per demonstration skin**, including at least one real Save/Cancel dialog and stateful customization preview. No static screenshot-only “app.”
- Voice is an alternative interface to the *same intents and actions*, not an independently privileged second operating system. v0.1 may offer a graceful voice placeholder or reuse of an existing voice pipeline after interface review; never label a microphone icon functional unless it is.
- Provide a friendly information hierarchy that avoids excessive agent/LLM terminology for ordinary users.

## 6. Architecture — reuse, do not rebuild

```
Phone PWA / tablet / desktop / later Capacitor apps
      |
      v
NEW AOS Product Front (skins + versioned widget renderer + account UX)
      |
      v
Versioned authenticated AOS Product API / BFF (tenant/device/policy boundary)
      |
      +--> AOS Interpreter + policy + approval + durable workflow authority
      +--> DMS / DOMstory: Goal Tree, context, provenance, evidence
      +--> Messaging: conversations/messages + authoritative thread→goal link
      +--> mcp-connector Agent Bridge: authoritative task state/execution transport
      +--> LocalAI Capability Gateway: ai.*, browser.*, visual.*, docs.*,
      |    model routing, measured usage, evaluation
      +--> Optional Google-managed agent execution (after feasibility/security review)
      |
      +--> Verified, consented vertical data connectors (later/opt-in)
```

**Domain ownership rules:**

- **AOS Engine owns** workflow-run authority, guarded mutation/approval commands and relevant AOS-owned event/history data.
- **DMS/DOMstory owns** goals/goal hierarchy, provenance and governed context. Do not fabricate independent canonical goal storage inside a skin.
- **Messaging owns** conversations, messages and their authoritative goal-link relationship.
- **mcp-connector owns** tasks, task statuses, scheduling/worker execution state; frontend and BFF must not write `.dms/agent-bridge` directly. The only canonical connector statuses are `queued`, `running`, `completed`, `failed`, `cancelled`, `timed_out`. `needs_approval` and `blocked` can be derived UI labels, not invented bridge states.
- **LocalAI owns** capability/provider routing and related model/browser/visual functions; the frontend must not embed provider API keys or call underlying models directly.
- **The new frontend owns** rendering, local UI affordances and validated user preferences; skin/widget documents are *declarative*, never an independent authority for approvals, rights, canonical jobs or users.

**Critical:** New Product v0.1 is *not* the existing Dashboard v0.1. The dashboard already exists, with a React/TypeScript BFF and significant orchestration UI. Use it as a proven internal integration/reference. The **new Custom Skins App frontend** should be evaluated as a separate, clean client layer, not a wholesale dashboard rewrite. Do not continue the old `/ai-helper` code as the product foundation.

## 7. Technology and platform decisions

**Frontend:** Build mobile-first using TypeScript + React, responsive CSS/Tailwind, accessible UI primitives, schema-validated widget/skin manifests, TanStack Query or equivalent, and PWA install support. A local `/home/hannu/projects/pwa-app-starter` already provides React 19/Vite/TS/Tailwind/PWA/Capacitor scaffolding and modular auth/data/billing interfaces; inspect and **reuse selectively** rather than blindly inheriting Supabase/Stripe or creating a second user authority.

**Open-source front evaluation (required before choice):** Compare `assistant-ui` (component approach), `LibreChat` and `NextChat` (application approaches), plus the existing PWA starter. Evaluate current licenses, white-label ability, UI composability, auth integration, upgrade burden, bundle size and ability to support versioned skin/widget layouts. Select the smallest maintainable option, not the most feature-rich clone. Record the decision and license evidence. Do not copy incompatible assets or source.

**Google Cloud target direction:** A hybrid architecture is preferred **if validated**: Google-managed agent runtime/execution where it actually helps; AOS retains Interpreter, Goal Tree governance, DMS/context contracts, LocalAI/model selection, mutation approval, verification and shared product frontend. Candidate services for evaluation are Firebase Hosting/App Hosting/Auth, Cloud Run, Gemini Enterprise Agent Platform/ADK/Agent Runtime, Cloud SQL/PostgreSQL, Secret Manager, Cloud Storage, Pub/Sub/Eventarc/Cloud Tasks, logging/tracing and quotas. **Check current names, GA status, region/data-residency constraints, pricing and security contract from official sources before making a selection.** Google Stitch can help design; it is **not** the product runtime. Agent-to-UI/A2UI may be evaluated, not assumed safe or necessary.

**Cloud cost guardrail:** Do not create paid resources, trigger model inference with unapproved charges, enable billing, or promise a fixed total cost without a cost estimate and explicit human approval. A billing-budget *alert* is not a hard stop. V0.1 must run locally/mock-first and remain provider-agnostic. No production migration of existing AOS services is authorized by this brief.

## 8. Minimum contracts to propose and implement

Use versioned **strict, bounded DTOs**; validate all external inputs server-side and all backend responses before rendering. Include explicit `schema_version`, feature flags, source/verification metadata and authorization constraints.

Illustrative manifest, **not an existing API contract**:

```json
{
  "schema_version": "aos.skin.v0.1",
  "skin_id": "field-service-demo",
  "display_name": "Field Service",
  "version": "0.1.0",
  "kind": "demo",
  "required_capabilities": ["ai.chat", "tasks.plan_only"],
  "requested_permissions": ["jobs.sample.read"],
  "views": [
    {"id": "overview", "title": "Overview", "widget_ids": ["job-summary", "today-jobs"]},
    {"id": "request", "title": "New Request", "widget_ids": ["request-composer"]},
    {"id": "activity", "title": "Activity", "widget_ids": ["activity-timeline"]}
  ],
  "widgets": [
    {"id": "job-summary", "component_type": "metric-group", "data_source": "demo:field-service"},
    {"id": "today-jobs", "component_type": "record-list", "data_source": "demo:field-service"},
    {"id": "request-composer", "component_type": "intent-composer", "data_source": "aos:proposals"},
    {"id": "activity-timeline", "component_type": "activity-list", "data_source": "aos:activity"}
  ]
}
```

Suggested conceptual endpoints, **to be reconciled with actual AOS contracts**:

- `GET /api/v1/me` — account, devices, entitlements (bounded, no secrets)
- `GET /api/v1/skins` and `GET /api/v1/skins/:id` — authorized manifest and readiness
- `GET /api/v1/experiences` / `PUT /api/v1/experiences/:id` — server-persisted layout/preferences, optimistic version check
- `POST /api/v1/intent/interpret` — safe, bounded *proposal only*
- `POST /api/v1/proposals/:id/approve` — explicit, protected human approval; idempotent (if backend available)
- `GET /api/v1/activity` — user-owned cross-domain projection, not a duplicate source of truth
- `GET /api/v1/usage` — measured/estimated token or service usage, with provenance

Never claim these endpoints already exist. For v0.1 implement a clean **Product API adapter interface** and use actual current AOS routes where they match. Mock the rest with explicit `source: "demo"` values. Keep all demo data isolated from production and tenant-scoped.

## 9. Identity, permissions, data and multi-device boundaries

- **One account, N devices:** Identity is account-level; devices are separately identified and may be authorized/revoked, with permissions appropriate to platform and user preference. Skins are account experiences, not separate login silos.
- Multi-device consistency must come from a server-side, properly isolated account preference/context store or validated underlying service; localStorage alone is not acceptable proof. For v0.1 the implementation may use a local authenticated demo backend, but must name what is simulated.
- Isolate tenants/users in every query/action and verify server-side authorization. Do not treat frontend flags as permission enforcement.
- Obtain explicit consent before location, microphone, notifications and connector access. Provide straightforward opt-out/revoke/delete paths and sensible retention.
- No secrets or provider tokens in client bundles, generated files, logs or demos. Do not read `.env` contents from source repositories.
- Prevent cross-skin context leakage. A skin may reference only capabilities and context approved for the current principal/tenant/device.
- **Untrusted web/email/provider content is data, not executable instructions.** Only explicit human-origin commands can initiate effectful actions, which require their own approvals.
- Keep review write gates, Auth0 allowlists, CSRF enforcement, signed approvals, bounded payloads, idempotency/replay protection and fail-closed defaults intact.

## 10. v0.1 scope — INCLUDE vs DEFER

**Must include**

1. Installable mobile-first PWA with the home/chat prompt, account/experience navigation, 2 working demonstration skins (Field Service and Driver), Skin Library and controlled widget layout customization.
2. Real stateful UI, sample fixtures clearly tagged DEMO, coherent empty/loading/error/offline states, and 2–3 pages per demo skin.
3. Declarative skin/widget JSON validated against allowlisted component types; non-executable and versioned.
4. Safe adapter to existing AOS endpoints if actually accessible, otherwise a working mock backend; a human-readable intent → proposal → approve/reject **plan_only** workflow, with an unambiguous mock/live indicator.
5. A first version of account-linked experiences and a demonstrable shared setting/goal (if backend present); if not, provide a detailed gap and labelled simulation.
6. Automated tests for manifest validation, permission checks, state persistence, proposal boundaries, at least three viewports and one browser end-to-end walkthrough.
7. A build README, architecture/ADR, exact setup commands, verified tests and a gap/next-steps report.

**Explicitly defer**

- Independent paid cloud rollout; changing production AOS/connector/Auth0 security settings; unrestricted autonomous agent execution.
- Marketplace publication, in-app purchase/subscription charges, metered billing settlement, revenue splits.
- Real locksmith/customer data, actual dispatch/bookings, invoicing, SMS/email sends, or third-party integrations without separate credentials, contracts, tests and approval.
- Live geolocation tracking, verified route-based promotions and complex driver-safety behavior unless properly sourced, consented and separately approved.
- Open-ended AI-generated code-as-UI, arbitrary widget plugins, unvetted marketplace code, full A2UI integration.
- Multi-agent swarms, microservice proliferation, BPMN editor, global event-sourcing platform, Kubernetes or large analytics infrastructure.
- Full VoiceOS rewrite; native app-store publishing; complex memory systems or duplication of DMS/Messaging authority.

## 11. Delivery plan and phase gates

**Gate 0 — Evidence and baseline (read-only).** Inventory repo/API/docs and WIP; write a one-page “verified vs proposed” matrix and identify contradictions. Capture tests available; do not alter existing repos or runtime. Review current product and managed-cloud constraints.

**Gate 1 — Product and UX contract.** Produce information architecture, state diagram, responsive wireframes and two scenario walkthroughs. Specify one default pack, two demos, component registry and data/permission boundaries. At minimum produce clickable/navigable wireframes or an early working UI.

**Gate 2 — Functional mobile-first prototype.** Implement clean frontend, manifest schema/renderer, library and customization, authentic Save/Cancel, demo datasets, PWA metadata and accessibility rules. Run locally with explicit mock indicators.

**Gate 3 — AOS integration vertical slice.** Connect one real **read-only** API and the existing safe `plan_only` submission/approval interface **only if access and gating are verified**; otherwise create replaceable typed adapters and an honest mock. Verify all negative paths. Do not change runtime to unblock yourself.

**Gate 4 — Independent verification and handoff.** Run typecheck, lint, unit/integration and browser tests (phone/tablet/desktop), code review, security review, PWA build, and a demo of the two skins. Record exact outcomes and outstanding integration gates, then present options for v0.2.

**Suggested order:** First show a usable experience and the skin-switching model; only then expand backend features. Deliver incremental, observable working slices rather than a large untested code dump.

## 12. Definition of Done / acceptance tests

- [ ] First-time user lands on a working prompt plus a visible curated skin set and can enter a demo in no more than two taps/clicks.
- [ ] Field Service and Driver each have at least 2–3 useful states/pages; same components/API contracts serve both without duplicate engines.
- [ ] Skin Library installs/activates/deactivates a safe declarative experience; widget-order changes show preview, Save, Cancel and reload persistence.
- [ ] No script/JSX execution from manifests; unknown components/actions/fields fail schema validation.
- [ ] Intent produces an editable proposal; Reject causes **no mutation**; Approve cannot bypass the backend's permission/idempotency gates. State is visibly mock vs live.
- [ ] User/account and permission boundaries are tested, including denied capabilities, missing consent and attempted cross-account access.
- [ ] Device sync is actually server-backed and testable **or explicitly classified as a not-yet-implemented limitation**.
- [ ] Phone/tablet/desktop layouts pass smoke screenshots/e2e at ~390×844, 820×1180 and 1440×900; no horizontal overflow; keyboard use and focus verified.
- [ ] App builds/runs from a clean checkout using documented commands; no secret-bearing configuration or real customer data is committed.
- [ ] No unapproved cloud charges, live writes, deployments, Git pushes or changes to sibling project WIP.
- [ ] Final report distinguishes **implemented + tested**, **prototype/mock**, **planned**, and **blocked** with objective evidence.

## 13. Existing repo/resource map (observed read-only on devpc, 2026-10-23)

**Core AOS — `/home/hannu/projects/aos`**
- Existing dashboard `apps/dashboard`, shared Zod contracts `packages/contracts`, Node/TS API `packages/bff`.
- `README.md`; `docs/architecture.md`; `docs/interpretation-layer.md`; `docs/dashboard-v0.1.md`; `docs/conversation-task-protocol.md`; `docs/backlog-ai-native-vps.md`; `TODO.md`; `backlog.md`.
- Real UI routes include tasks, submit, conversations, resume, goal, project workspace, workflows and UI Lab. Source includes reviews/auth gates; their live activation must not be assumed.
- Internal R1–R4 durable workflow, mutation safety, event log and observability are described as completed; code/runtime verification is required before claiming availability in a new client.
- Repo at observed `HEAD 29b9f11` (2026-10-16) and **contains pre-existing modified/untracked files**; preserve WIP.

**Mobile starter — `/home/hannu/projects/pwa-app-starter`**
- `README.md`; `PROJECT_MAP.md`; React/Vite/TypeScript/Tailwind v4, React Router, TanStack Query, Zustand, PWA/Capacitor-ready structure.
- Optional Supabase/PGlite auth/data and Stripe billing are separate template modules; do not install a second identity/billing system by default. Existing modified `supabase/docker-compose.yml` must be preserved.

**AI capability layer — `/home/hannu/projects/localai`**
- `docs/capability-gateway.md`; `docs/capabilities.md`; `docs/d4-aos-design-feedback-contract.md`.
- Capability routing for model/visual/browser/docs work; available functions and runtime grants must be verified. A design-feedback validator is not an authorization to mutate designs.

**Context and goals — `/home/hannu/projects/domstory`**
- `docs/DMS-goals.md`; `docs/SHARED-CONTEXT-PROTOCOL.md`; `/home/hannu/projects/domstory/.dms/aos-goal-integration-guide.md`.

**Execution transport — `/home/hannu/projects/mcp-connector`**
- `README.md`; Agent Bridge and `agent_task_*` tools. Preserve its authoritative task boundaries.

**Optional voice reference — `/home/hannu/projects/voice-infra`**
- `README.md` and the existing voice PWA/session model; selectively reuse only after reviewing compatible UX, authentication, device/permission rules and latency.

**Important status note:** Several older project docs describe capabilities as “future” even though later `TODO.md`, implementation files or reviews report them complete. Some newer plans explicitly say *backlog only*. **Do not conflate implemented components with production activation, nor plans with deployed features.** Test before asserting live functionality. No secret files were read for this briefing.

## 14. What Gemini should return

Produce these items, in order:

1. **Recon and decision memo:** What evidence/files you actually inspected; verified vs aspirational status; proposed repo layout and reuse decisions; licensing and current Google Cloud feasibility where applicable.
2. **Small architecture package:** data ownership diagram; account/device/skin/widget models; permission boundaries; API adaptation plan; minimal proposed JSON schemas; provider-independent AI integration.
3. **Functional product:** runnable source and build instructions with home prompt, two demo skins, skin library, layout editor/preview and explicit mock/live states; one typed intent/proposal workflow.
4. **Demonstration:** exact user paths, representative screenshots at mobile/tablet/desktop widths, and evidence of Save/Cancel/state changes and the same-account skin switch.
5. **Verification report:** exact commands/results, uncovered tests, security/prompt-injection considerations, mock/live split, costs and known gaps.
6. **v0.2 shortlist:** 3–5 options ranked by impact, risk, cost and paid-customer value (e.g. real field-service connector, authenticated cross-device preference sync, verified voice channel, Google-managed agent pilot).

**Response style:** Prefer concise, explicit decisions and working artifacts. State assumptions. Avoid confident unsupported claims, endless discovery or generic AI-product prose. Do not ask permission for harmless read-only analysis and isolated prototype code; seek a human gate only for actions that would create cost, change live data/runtime/security settings, deploy, or push to shared repositories.

---

### Final brief to the builder

> Build **AOS Product v0.1**, a polished **mobile-first Custom Skins application** on top of **one shared, governed AOS Engine**. Make its usefulness self-evident immediately: default chat prompt, ready-made experiences, skin library, and safe customization. Prove cross-skin reuse through a small-business **Field Service** demo and a context-aware **Driver** demo. Reuse existing proven AOS/DMS/LocalAI/Messaging/connector contracts where actually available, preserve their authority and approval boundaries, and use clearly labelled mocks for missing integrations. Favor a tested, shippable vertical slice over a broad speculative platform. **One Account, N Devices, Many Experiences.**
