# MedVoice AI — Compliance & Explainability Report
### AI Bill of Materials (AIBOM) · Explainability Log · M.Tech Research Artifact

> **Classification:** Internal Research & Academic Documentation  
> **Project:** MED-VOICE AI — Voice-Enabled Clinical Decision Support System  
> **Prepared by:** Aishika Roy, M.Tech (AI/ML), 2025–2026  
> **Date:** March 2026  
> **Version:** 2.0 (Post-Clinical-Evaluation Upgrade)

---

## 1. Executive Summary

MedVoice AI is a full-stack, voice-enabled clinical decision-support web application built on Next.js 16 (App Router), interfacing with a FastAPI Python backend. It uses Large Language Model (LLM) inference to generate structured clinical evaluations — including symptom pathophysiology, differential diagnoses, urgency triage, and pharmacist notes — in response to natural-language patient symptom descriptions.

This document constitutes the **AI Bill of Materials (AIBOM)**, providing full traceability of every AI model, library, data flow, and compliance mechanism used in the system.

---

## 2. AI Bill of Materials (AIBOM)

The AIBOM lists every AI/ML component in the production system, modelled on the NTIA Software Bill of Materials (SBOM) specification adapted for AI systems.

| # | Component | Type | Version / Endpoint | Supplier | Usage in MedVoice AI | License |
|---|---|---|---|---|---|---|
| 1 | **Groq Inference API** | Cloud LLM Inference | `llama3-70b-8192` (via Groq SDK) | Groq Inc. | Primary AI engine for all clinical text generation | Proprietary API |
| 2 | **Vercel AI SDK** (`ai`) | Orchestration Library | `^6.0.116` | Vercel Inc. | `useChat` hook, streamed responses, message history management | Apache-2.0 |
| 3 | **@ai-sdk/react** | Frontend AI Client | `^3.0.118` | Vercel Inc. | React bindings for the streaming chat UI | Apache-2.0 |
| 4 | **@ai-sdk/openai** | Provider Adapter | `^3.0.41` | Vercel Inc. | OpenAI-compatible provider (fallback path) | Apache-2.0 |
| 5 | **@ai-sdk/google** | Provider Adapter | `^3.0.43` | Vercel Inc. | Gemini-compatible provider (research path) | Apache-2.0 |
| 6 | **FastAPI** | Backend API Framework | `0.115.x` (Python) | Sebastián Ramírez | Hosts the `/chat`, `/analyze-prescription`, and `/health` endpoints; receives structured prompts from Next.js and forwards to Groq | MIT |
| 7 | **LangGraph / LangChain** | AI Orchestration | `^0.2.x` (Python) | LangChain Inc. | Multi-step reasoning graph: symptom extraction → differential generation → triage → response synthesis | MIT |
| 8 | **Supabase Vector DB** | Semantic Memory Store | Managed Cloud (`pgvector`) | Supabase Inc. | Persistent conversation history; potential RAG retrieval for clinical knowledge base | Apache-2.0 |
| 9 | **Tesseract OCR (via FastAPI)** | Document AI | `5.x` | Google (Open Source) | Extracts text from uploaded prescription images (PNG/JPG/PDF) | Apache-2.0 |
| 10 | **html2pdf.js** | PDF Generation | `^0.14.0` | Erik Koopmans | Generates HIPAA-formatted diagnostic export reports client-side | MIT |
| 11 | **GSAP** | UI Animation Engine | `^3.14.2` | GreenSock | Entrance animations for clinical result panels | Standard/Free |

---

## 3. Model Card — Primary LLM

| Field | Value |
|---|---|
| **Model Name** | Llama 3 70B (Meta AI) |
| **Inference Provider** | Groq Cloud API |
| **Context Window** | 8,192 tokens |
| **Training Cut-off** | Early 2024 |
| **Task Fine-tuning** | None (zero-shot with structured system prompt) |
| **Prompt Strategy** | System instruction injection appended to each user message; forces JSON-schema-compliant output |
| **Output Format** | Structured JSON with keys: `specialty`, `diagnosis`, `clinical_evaluation` (4 sub-keys), `home_remedies`, `medical_treatments`, `doctors`, `chat_response` |
| **Known Limitations** | May hallucinate rare conditions; no access to real-time medical databases; not trained on patient-specific data |
| **Bias Mitigations** | All outputs include a mandatory DISCLAIMER field; urgency triage defaults to ROUTINE unless specific red-flag keywords detected |
| **Human-in-the-Loop** | All outputs are advisory only; the UI displays a persistent disclaimer on every response |

---

## 4. Explainability Log (AIBOM Transparency Protocol)

### 4.1 Reasoning Chain — Clinical Evaluation Pipeline

Every user query passes through a deterministic 5-stage pipeline:

```
Stage 1: INPUT NORMALIZATION
  ↓  User's free-text / voice transcript is sanitised and optionally
     merged with OCR-extracted prescription text.

Stage 2: SYSTEM PROMPT INJECTION (route.ts)
  ↓  The MED-VOICE Clinical Engine v2.0 system instruction is appended to
     the user message. This prompt mandates a strict JSON schema and
     defines four mandatory clinical_evaluation sub-keys.

Stage 3: LLM INFERENCE (Groq → Llama 3 70B)
  ↓  The assembled message array is sent to the Groq inference API.
     Temperature: 0 (deterministic). No streaming at this stage —
     a complete JSON object is requested.

Stage 4: JSON PARSING & SCHEMA VALIDATION (processAssistantContent)
  ↓  The raw string response is parsed. If JSON.parse fails (e.g., model
     wraps output in markdown backticks), a regex fallback extracts the
     plain text. Sub-keys are mapped to typed React state.

Stage 5: UI RENDERING WITH SECTION ISOLATION
  ↓  Each clinical_evaluation sub-key is rendered in a dedicated card
     with a distinct colour-coded header (blue/purple/orange/amber).
     The urgency triage label is extracted and rendered as a pill badge
     with dynamic colour (green=ROUTINE, orange=URGENT, red=EMERGENCY).
```

### 4.2 Prompt Transparency

The exact system instruction injected at Stage 2 is defined in `src/app/api/chat/route.ts` and is version-controlled in Git. It is reproducible and auditable at any time.

**Key prompt constraints enumerated:**
- `clinical_evaluation` object is **mandatory** — the model cannot skip it
- `urgency_triaging` **must** begin with `ROUTINE`, `URGENT`, or `EMERGENCY`
- `differential_considerations` **must** end with a patient-facing disclaimer
- `pharmacist_notes` **must not** include specific dosages (avoids prescribing)

### 4.3 Fallback & Graceful Degradation

| Scenario | Behaviour |
|---|---|
| Backend offline (FastAPI not running) | `getMockResponse()` activates, returning a clinically realistic mock with all 4 `clinical_evaluation` sections populated |
| JSON parse failure | `processAssistantContent` falls back to plain-text rendering in the "Primary Clinical Impression" block |
| Groq API timeout (>15 s) | `AbortSignal.timeout(15000)` triggers; mock fallback activates; user sees loading skeleton then mock data |
| PDF export failure | User-facing `alert()` with browser Print fallback instruction |

---

## 5. Data Flow & Privacy Architecture

```
[Patient Browser]
    │  HTTPS (TLS 1.3)
    ▼
[Vercel Edge Network — CDN + WAF]
    │
    ▼
[Next.js App Router — src/app/api/chat/route.ts]
    │  Auth check via Supabase JWT
    │  System prompt injection
    ▼
[Groq Cloud API — Llama 3 70B]
    │  JSON response
    ▼
[Next.js — processAssistantContent()]
    │  Schema validation & state update
    ▼
[React UI — Clinical Evaluation Card]
    │
    ├── Messages persisted → [Supabase PostgreSQL (messages table)]
    │   Conversation ID links user sessions.
    │   Row-Level Security (RLS) ensures users can only read their own messages.
    │
    └── PDF Export (client-side) → [html2pdf.js → Blob URL → User Download]
        No PHI is transmitted to any third-party during PDF generation.
```

**PHI (Protected Health Information) handling:**
- No patient names or identifiers are transmitted — only symptom text
- Supabase stores messages against `user_id` (UUID), not PII
- All connections use TLS; Supabase enforces RLS policies
- PDF is generated entirely client-side — no data leaves the browser at export time

---

## 6. HIPAA Alignment (Best-Effort)

> ⚠️ **Note:** MedVoice AI is a research prototype. Full HIPAA certification requires a signed Business Associate Agreement (BAA) with each cloud provider and a formal Risk Assessment. The following measures are implemented as best-effort architectural controls.

| HIPAA Safeguard | Implementation |
|---|---|
| Access Control | Supabase Auth (JWT) gates all `/chatbot` and `/api` routes via Next.js middleware |
| Audit Controls | All conversation messages are timestamped and stored in Supabase with `user_id` and `conversation_id` |
| Transmission Security | HTTPS enforced on Vercel; `Strict-Transport-Security` header set |
| Data Integrity | Supabase Row-Level Security prevents cross-user data access |
| Minimum Necessary | Symptom text only — no DOB, SSN, insurance, or contact data collected |
| Business Associate Agreements | Required from: Vercel, Supabase, Groq before production PHI processing |

---

## 7. Security Headers (Vercel Production)

Defined in `next.config.js → headers()` and applied to all routes:

| Header | Value | Purpose |
|---|---|---|
| `X-Frame-Options` | `SAMEORIGIN` | Prevents clickjacking |
| `X-Content-Type-Options` | `nosniff` | Blocks MIME sniffing |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | PHI referrer leakage prevention |
| `Permissions-Policy` | `microphone=(self), camera=()` | Only voice input permitted |
| `Content-Security-Policy` | Inline — see `next.config.js` | Restricts script/connect origins |

---

## 8. Environment Variables Registry

The following variables must be set in the **Vercel Dashboard → Project → Settings → Environment Variables** for the production deployment to function correctly.

| Variable | Environment | Description | Example Value |
|---|---|---|---|
| `GROQ_API_KEY` | Production + Preview | Groq API key for Llama 3 inference | `gsk_xxxxxxxxxxxx` |
| `NEXT_PUBLIC_SUPABASE_URL` | All | Supabase project URL | `https://xxxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | All | Supabase anon/public key (safe to expose) | `eyJhbGci...` |
| `BACKEND_URL` | Production | **Server-side only** URL of the FastAPI backend (used by `route.ts`) | `https://your-backend.fly.dev` |
| `NEXT_PUBLIC_BACKEND_URL` | Production | **Client-side** backend URL (leave blank to use Next.js proxy rewrite) | *(leave empty)* |

> **Security note:** `GROQ_API_KEY` and `BACKEND_URL` must **never** be prefixed `NEXT_PUBLIC_`. They are server-side secrets that must not appear in the browser bundle.

---

## 9. Deployment Checklist

- [ ] `vercel.json` committed to repo root
- [ ] `next.config.js` (replaces `next.config.ts`) committed
- [ ] All 5 environment variables set in Vercel Dashboard
- [ ] `NEXT_PUBLIC_BACKEND_URL` left **empty** (or set to backend URL if deployed)
- [ ] `BACKEND_URL` set to production FastAPI URL (e.g., Fly.io, Railway, Render)
- [ ] Supabase RLS policies reviewed and enabled on `messages` and `conversations` tables
- [ ] Vercel project Framework Preset confirmed as **Next.js**
- [ ] Root Directory confirmed as `/` (repo root)
- [ ] Output Directory confirmed as `.next`
- [ ] Build command: `next build`

---

## 10. References

1. NTIA, "The Minimum Elements For a Software Bill of Materials (SBOM)," July 2021.
2. Meta AI, "Llama 3 Model Card," 2024. Available: https://ai.meta.com/blog/meta-llama-3/
3. Groq Inc., "Groq API Documentation," 2024. Available: https://console.groq.com/docs
4. Vercel Inc., "Next.js 15 App Router Documentation," 2025. Available: https://nextjs.org/docs
5. Supabase Inc., "Row Level Security," 2024. Available: https://supabase.com/docs/guides/auth/row-level-security
6. U.S. Department of Health & Human Services, "HIPAA Security Rule," 45 CFR Part 164.
7. LangChain Inc., "LangGraph Documentation," 2024. Available: https://langchain-ai.github.io/langgraph/
