<div align="center">

<img src="public/logo.svg" alt="Gravitas Logo" width="80" height="80" />

# Gravitas

### Nigeria's AI-Powered Exam Preparation Platform

Pass JAMB. Conquer WAEC. Own your future.

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![NestJS](https://img.shields.io/badge/NestJS-10-e0234e?style=flat-square&logo=nestjs)](https://nestjs.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178c6?style=flat-square&logo=typescript)](https://typescriptlang.org)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?style=flat-square&logo=postgresql)](https://postgresql.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0-38bdf8?style=flat-square&logo=tailwindcss)](https://tailwindcss.com)
[![License](https://img.shields.io/badge/License-Private-red?style=flat-square)]()
[![Status](https://img.shields.io/badge/Status-In%20Development-yellow?style=flat-square)]()

[Live Demo](#) · [API Docs](#) · [Report Bug](#) · [Request Feature](#)

</div>

---

## 📋 Table of Contents

- [About The Project](#about-the-project)
- [System Architecture](#system-architecture)
- [Product Architecture](#product-architecture)
- [Tech Stack](#tech-stack)
- [Monorepo Structure](#monorepo-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Frontend Guide](#frontend-guide)
- [Backend Guide](#backend-guide)
- [Database](#database)
- [AI Integration](#ai-integration)
- [Nigerian Context](#nigerian-context)
- [API Reference](#api-reference)
- [Testing](#testing)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [Roadmap](#roadmap)

---

## About The Project

Gravitas is a unified educational operating system for Nigerian students —
from SS1 through university entrance and professional certifications
(ICAN, Nursing Council of Nigeria).

**The core problem it solves:**

Nigerian students preparing for JAMB, WAEC, and Post-UTME have no single
platform that mirrors the exact exam interfaces they will face, provides
AI-powered explanations grounded in the Nigerian curriculum, and works
reliably on the 2G/3G networks most students use daily. Gravitas fixes all three.

**The single promise:**
Every Nigerian student, regardless of location or income, gets access to
exam preparation that actually works.

### What Makes Gravitas Different

| Feature | Gravitas | Ulessons | PrepClass | Exampulse |
|---|---|---|---|---|
| Exact CBT interface replication | ✅ JAMB + WAEC 2026 | ❌ | ❌ | Partial |
| Theory/Essay smart mode | ✅ | ❌ | ❌ | ❌ |
| AI explanations (Nigerian context) | ✅ Sabi-Explain | ❌ | ❌ | ❌ |
| Professional exams (ICAN, Nursing) | ✅ | ❌ | ❌ | ❌ |
| School white-label portal | ✅ | ❌ | ❌ | ❌ |
| Parent dashboard + WhatsApp report | ✅ | ❌ | ❌ | ❌ |
| In-person tutor location matching | ✅ LGA-level | ❌ | Partial | ❌ |
| Offline content + PWA | ✅ | ✅ | ❌ | ❌ |
| Pidgin AI support | ✅ | ❌ | ❌ | ❌ |

---

## System Architecture
```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENTS                              │
│                                                             │
│   ┌──────────────┐    ┌──────────────┐   ┌─────────────┐  │
│   │  Next.js 15  │    │  Mobile App  │   │   Schools   │  │
│   │  (Web App)   │    │ (Future/RN)  │   │  (Portal)   │  │
│   └──────┬───────┘    └──────┬───────┘   └──────┬──────┘  │
└──────────┼────────────────── ┼──────────────────┼─────────┘
           │                   │                  │
           └───────────────────┴──────────────────┘
                               │
                    REST API + WebSocket
                               │
┌──────────────────────────────▼──────────────────────────────┐
│                    NestJS API Server                         │
│                                                             │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────┐  │
│  │   Auth   │ │   CBT    │ │  School  │ │   AI / LLM   │  │
│  │  Module  │ │  Module  │ │  Module  │ │    Module    │  │
│  └──────────┘ └──────────┘ └──────────┘ └──────────────┘  │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────┐  │
│  │  Tutor   │ │ Library  │ │ Payment  │ │   Realtime   │  │
│  │  Module  │ │  Module  │ │  Module  │ │  (Socket.io) │  │
│  └──────────┘ └──────────┘ └──────────┘ └──────────────┘  │
└──────────────────────────────┬──────────────────────────────┘
                               │
        ┌──────────────────────┼──────────────────────┐
        │                      │                      │
┌───────▼──────┐    ┌──────────▼──────┐    ┌─────────▼──────┐
│  PostgreSQL  │    │  Redis (Cache)  │    │    Qdrant      │
│  (Supabase)  │    │   (Upstash)     │    │  (Vector DB)   │
│  TypeORM     │    │  Sessions/Queue │    │  AI Embeddings │
└──────────────┘    └─────────────────┘    └────────────────┘
        │
┌───────▼────────────────────────────────────────────────────┐
│                   External Services                         │
│                                                             │
│  Groq (AI)  ·  Gemini Flash  ·  Cloudflare R2  ·  Resend  │
│  Termii (SMS)  ·  Paystack  ·  Livekit  ·  Meilisearch    │
│  n8n (WhatsApp Automation)  ·  BullMQ (Job Queue)          │
└────────────────────────────────────────────────────────────┘
```

---

## Product Architecture
```
TIER 1 — CBT Exam Engine              ← MVP. Ship this first.
├── JAMB CBT Simulator                (pixel-perfect interface replication)
├── WAEC / NECO / NABTEB CBT          (objective + theory/essay modes)
├── Post-UTME Suite                   (40+ universities)
└── ICAN & Nursing Professional       (2025/26 syllabus)

TIER 2 — School White-Label Portal   ← B2B recurring revenue
├── Branded school subdomain
├── Custom CBT test builder           (Class → Subject → Topic)
├── Auto-grading + PDF report cards
├── Attendance + announcements
└── Parent WhatsApp weekly reports    (via n8n + Termii)

TIER 3 — AI Sabi-Tutor Layer         ← Embedded across everything
├── Sabi-Explain (wrong answer AI breakdown)
├── Post-exam post-mortem analysis
├── Endless practice question generation
├── Voice input support
└── Pidgin language support

TIER 4 — Tutoring Marketplace        ← Network effect builder
├── Online live tutoring (whiteboard + video)
├── In-person tutor matching          (LGA-level location)
└── Booking + escrow payment system

TIER 5 — Content Library             ← Daily retention engine
├── Short video lessons per topic
├── PDF resources + formula sheets
├── Offline download mode
└── Streaks, XP, leaderboards
```

---

## Tech Stack

### Frontend — `apps/web`

| Category | Technology | Purpose |
|---|---|---|
| Framework | Next.js 15 (App Router) | Full-stack React framework |
| Language | TypeScript (strict) | End-to-end type safety |
| Styling | Tailwind CSS v3 | Utility-first CSS |
| Components | shadcn/ui + Radix UI | Accessible UI primitives |
| Animation | Framer Motion | Page transitions + micro-interactions |
| Icons | lucide-react | SVG icon system |
| State (client) | Zustand + immer | CBT session, auth, UI state |
| State (server) | TanStack Query v5 | API fetching, caching, sync |
| Forms | React Hook Form + Zod | Validation with shared schemas |
| Date/Time | date-fns | Timer formatting, scheduling |
| Charts | Recharts | Score analytics, performance radar |
| Rich Text | Tiptap | WAEC/ICAN essay interface |
| Math | KaTeX + react-katex | Physics, Chemistry, Maths equations |
| Video | Video.js + hls.js | Adaptive bitrate streaming |
| Whiteboard | @tldraw/tldraw | Live tutoring collaborative board |
| Offline | next-pwa + Dexie.js | Service worker + IndexedDB cache |
| HTTP | Axios | API calls with interceptors |
| Realtime | socket.io-client | Whiteboard sync, live leaderboards |
| Payments | @paystack/inline-js | Nigerian payment processing |
| Notifications | react-hot-toast | Global flash notifications |
| Utilities | nanoid, lodash-es | IDs and utility functions |

### Backend — `apps/api`

| Category | Technology | Purpose |
|---|---|---|
| Framework | NestJS 10 | Modular, scalable Node.js framework |
| Language | TypeScript (strict) | End-to-end type safety |
| Runtime | Node.js 20 LTS | Server runtime |
| Database | PostgreSQL 16 (Supabase) | Primary relational database |
| ORM | TypeORM | Database queries + migrations |
| Cache | Redis (Upstash) | Sessions, exam timer sync, rate limiting |
| Job Queue | BullMQ | Background jobs — emails, PDF generation, AI tasks |
| Auth | Better Auth | Sessions, OAuth, roles, JWT |
| Realtime | Socket.io | WebSocket server for live features |
| AI (Primary) | Groq (llama-3.3-70b) | Explanations, chat, post-mortem |
| AI (Secondary) | Gemini Flash | Image questions, PDF extraction |
| AI SDK | Vercel AI SDK | Streaming AI responses |
| Vector DB | Qdrant | Semantic question search + RAG |
| Storage | Cloudflare R2 | Videos, PDFs, images (zero egress fees) |
| Email | Resend | Transactional emails |
| SMS/OTP | Termii | Nigerian phone verification |
| Video Calls | Livekit | WebRTC tutoring sessions |
| Search | Meilisearch | Question bank + content search |
| Automation | n8n | WhatsApp parent reports via Termii |
| PDF | pdf-parse + Puppeteer | Question extraction + report card generation |
| Validation | class-validator + class-transformer | NestJS DTO validation |
| Config | @nestjs/config | Environment variable management |
| Throttling | @nestjs/throttler | API rate limiting |
| Docs | Swagger (@nestjs/swagger) | Auto-generated API documentation |

---

## Monorepo Structure
```
gravitas/                              ← Monorepo root
│
├── apps/
│   ├── web/                           ← Next.js 15 frontend
│   └── api/                           ← NestJS backend
│
├── packages/
│   ├── types/                         ← Shared TypeScript types
│   │   ├── src/
│   │   │   ├── exam.types.ts
│   │   │   ├── user.types.ts
│   │   │   ├── school.types.ts
│   │   │   └── index.ts
│   │   └── package.json
│   │
│   └── utils/                         ← Shared utility functions
│       ├── src/
│       │   ├── format-score.ts
│       │   ├── format-currency.ts     ← ₦ formatting
│       │   └── index.ts
│       └── package.json
│
├── AGENTS.md                          ← AI agent context (web)
├── CLAUDE.md                          ← Symlink → AGENTS.md
├── package.json                       ← Root workspace config
├── turbo.json                         ← Turborepo pipeline
├── pnpm-workspace.yaml
└── README.md                          ← This file
│
│
├── apps/web/                          ← FRONTEND ROOT
│   ├── app/
│   │   ├── (marketing)/               ← Public pages
│   │   │   ├── page.tsx               ← Homepage
│   │   │   ├── pricing/page.tsx
│   │   │   ├── about/page.tsx
│   │   │   ├── blog/[slug]/page.tsx
│   │   │   └── schools/page.tsx
│   │   │
│   │   ├── (auth)/                    ← Auth flow
│   │   │   ├── login/page.tsx
│   │   │   ├── signup/page.tsx
│   │   │   ├── verify/page.tsx
│   │   │   └── reset-password/page.tsx
│   │   │
│   │   ├── (dashboard)/               ← Student portal
│   │   │   ├── page.tsx
│   │   │   ├── practice/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── [examType]/page.tsx
│   │   │   │   └── session/
│   │   │   │       └── [sessionId]/
│   │   │   │           ├── page.tsx   ← LIVE CBT EXAM
│   │   │   │           └── results/page.tsx
│   │   │   ├── library/
│   │   │   ├── reports/
│   │   │   ├── tutors/
│   │   │   ├── leaderboard/page.tsx
│   │   │   ├── ai-tutor/page.tsx
│   │   │   └── settings/
│   │   │
│   │   ├── (school)/                  ← School admin portal
│   │   │   ├── page.tsx
│   │   │   ├── students/
│   │   │   ├── tests/
│   │   │   ├── classes/
│   │   │   ├── reports/
│   │   │   └── settings/page.tsx
│   │   │
│   │   ├── (tutor)/                   ← Tutor portal
│   │   │   ├── page.tsx
│   │   │   ├── sessions/
│   │   │   ├── availability/page.tsx
│   │   │   └── earnings/page.tsx
│   │   │
│   │   └── api/                       ← Minimal route handlers
│   │       ├── auth/[...nextauth]/route.ts
│   │       ├── payments/webhook/route.ts
│   │       └── revalidate/route.ts
│   │
│   ├── components/
│   │   ├── ui/                        ← shadcn/ui (never hand-edit)
│   │   ├── cbt/                       ← Exam engine components
│   │   │   ├── exam-interface.tsx
│   │   │   ├── question-card.tsx
│   │   │   ├── question-navigator.tsx
│   │   │   ├── exam-timer.tsx
│   │   │   ├── subject-tabs.tsx
│   │   │   ├── sabi-explain.tsx       ← Hidden in school-exam mode
│   │   │   ├── essay-interface.tsx
│   │   │   ├── exam-submit-dialog.tsx
│   │   │   ├── results-screen.tsx
│   │   │   └── post-mortem.tsx
│   │   ├── ai-tutor/
│   │   ├── tutoring/
│   │   ├── library/
│   │   ├── dashboard/
│   │   ├── school/
│   │   ├── layout/
│   │   └── shared/
│   │
│   ├── lib/
│   │   ├── utils.ts                   ← cn() helper
│   │   ├── api.ts                     ← Axios instance
│   │   ├── query-client.ts
│   │   ├── constants.ts
│   │   ├── validations.ts
│   │   └── offline/
│   │       ├── db.ts                  ← Dexie schema
│   │       └── sync.ts
│   │
│   ├── stores/
│   │   ├── exam-store.ts
│   │   ├── auth-store.ts
│   │   └── ui-store.ts
│   │
│   ├── hooks/
│   ├── types/
│   ├── config/
│   ├── middleware.ts
│   ├── next.config.ts
│   ├── tailwind.config.ts
│   ├── AGENTS.md
│   └── CLAUDE.md
│
│
└── apps/api/                          ← BACKEND ROOT
    ├── src/
    │   ├── main.ts                    ← NestJS bootstrap + Swagger setup
    │   ├── app.module.ts              ← Root module
    │   │
    │   ├── config/
    │   │   ├── database.config.ts     ← TypeORM PostgreSQL config
    │   │   ├── redis.config.ts        ← Upstash Redis config
    │   │   ├── jwt.config.ts
    │   │   └── app.config.ts          ← All env vars typed with @nestjs/config
    │   │
    │   ├── modules/
    │   │   │
    │   │   ├── auth/                  ← Authentication module
    │   │   │   ├── auth.module.ts
    │   │   │   ├── auth.controller.ts
    │   │   │   ├── auth.service.ts
    │   │   │   ├── strategies/
    │   │   │   │   ├── jwt.strategy.ts
    │   │   │   │   └── google.strategy.ts
    │   │   │   ├── guards/
    │   │   │   │   ├── jwt-auth.guard.ts
    │   │   │   │   └── roles.guard.ts
    │   │   │   ├── decorators/
    │   │   │   │   ├── roles.decorator.ts
    │   │   │   │   └── current-user.decorator.ts
    │   │   │   └── dto/
    │   │   │       ├── register.dto.ts
    │   │   │       ├── login.dto.ts
    │   │   │       └── verify-otp.dto.ts
    │   │   │
    │   │   ├── users/                 ← User management module
    │   │   │   ├── users.module.ts
    │   │   │   ├── users.controller.ts
    │   │   │   ├── users.service.ts
    │   │   │   ├── entities/
    │   │   │   │   └── user.entity.ts
    │   │   │   └── dto/
    │   │   │       └── update-user.dto.ts
    │   │   │
    │   │   ├── cbt/                   ← CBT exam engine module
    │   │   │   ├── cbt.module.ts
    │   │   │   ├── cbt.controller.ts
    │   │   │   ├── cbt.service.ts
    │   │   │   ├── session.service.ts ← Exam session management
    │   │   │   ├── scoring.service.ts ← Answer scoring logic
    │   │   │   ├── entities/
    │   │   │   │   ├── question.entity.ts
    │   │   │   │   ├── option.entity.ts
    │   │   │   │   ├── exam-session.entity.ts
    │   │   │   │   └── answer.entity.ts
    │   │   │   └── dto/
    │   │   │       ├── start-exam.dto.ts
    │   │   │       ├── submit-answer.dto.ts
    │   │   │       └── submit-exam.dto.ts
    │   │   │
    │   │   ├── school/                ← School portal module
    │   │   │   ├── school.module.ts
    │   │   │   ├── school.controller.ts
    │   │   │   ├── school.service.ts
    │   │   │   ├── test-builder.service.ts
    │   │   │   ├── report-card.service.ts  ← Puppeteer PDF generation
    │   │   │   ├── entities/
    │   │   │   │   ├── school.entity.ts
    │   │   │   │   ├── class.entity.ts
    │   │   │   │   ├── school-test.entity.ts
    │   │   │   │   └── enrollment.entity.ts
    │   │   │   └── dto/
    │   │   │       ├── create-school.dto.ts
    │   │   │       ├── create-test.dto.ts
    │   │   │       └── bulk-upload.dto.ts
    │   │   │
    │   │   ├── ai/                    ← AI module (Groq + Gemini)
    │   │   │   ├── ai.module.ts
    │   │   │   ├── ai.controller.ts
    │   │   │   ├── explain.service.ts ← Sabi-Explain logic
    │   │   │   ├── tutor.service.ts   ← Sabi-Tutor chat logic
    │   │   │   ├── postmortem.service.ts ← Post-exam analysis
    │   │   │   ├── embeddings.service.ts ← Qdrant vector operations
    │   │   │   └── dto/
    │   │   │       ├── explain.dto.ts
    │   │   │       └── chat-message.dto.ts
    │   │   │
    │   │   ├── tutors/                ← Tutor marketplace module
    │   │   │   ├── tutors.module.ts
    │   │   │   ├── tutors.controller.ts
    │   │   │   ├── tutors.service.ts
    │   │   │   ├── booking.service.ts
    │   │   │   ├── livekit.service.ts ← Video session management
    │   │   │   ├── entities/
    │   │   │   │   ├── tutor-profile.entity.ts
    │   │   │   │   └── booking.entity.ts
    │   │   │   └── dto/
    │   │   │       ├── create-tutor-profile.dto.ts
    │   │   │       └── create-booking.dto.ts
    │   │   │
    │   │   ├── library/               ← Content library module
    │   │   │   ├── library.module.ts
    │   │   │   ├── library.controller.ts
    │   │   │   ├── library.service.ts
    │   │   │   ├── r2.service.ts      ← Cloudflare R2 uploads
    │   │   │   ├── entities/
    │   │   │   │   └── content.entity.ts
    │   │   │   └── dto/
    │   │   │       └── upload-content.dto.ts
    │   │   │
    │   │   ├── payments/              ← Paystack payments module
    │   │   │   ├── payments.module.ts
    │   │   │   ├── payments.controller.ts
    │   │   │   ├── payments.service.ts
    │   │   │   ├── webhook.service.ts ← Paystack webhook handler
    │   │   │   ├── entities/
    │   │   │   │   ├── subscription.entity.ts
    │   │   │   │   └── transaction.entity.ts
    │   │   │   └── dto/
    │   │   │       └── initialize-payment.dto.ts
    │   │   │
    │   │   ├── notifications/         ← Notifications module
    │   │   │   ├── notifications.module.ts
    │   │   │   ├── email.service.ts   ← Resend email
    │   │   │   ├── sms.service.ts     ← Termii SMS/OTP
    │   │   │   └── whatsapp.service.ts ← n8n webhook trigger
    │   │   │
    │   │   └── search/                ← Meilisearch module
    │   │       ├── search.module.ts
    │   │       ├── search.controller.ts
    │   │       └── search.service.ts
    │   │
    │   ├── database/
    │   │   ├── migrations/            ← TypeORM migration files
    │   │   │   └── *.migration.ts
    │   │   └── seeds/                 ← Database seed scripts
    │   │       ├── questions.seed.ts
    │   │       └── subjects.seed.ts
    │   │
    │   ├── gateways/                  ← Socket.io WebSocket gateways
    │   │   ├── exam.gateway.ts        ← Live exam events
    │   │   └── tutoring.gateway.ts    ← Live tutoring room events
    │   │
    │   ├── queues/                    ← BullMQ job processors
    │   │   ├── email.processor.ts
    │   │   ├── report-card.processor.ts
    │   │   ├── ai-explain.processor.ts
    │   │   └── whatsapp.processor.ts
    │   │
    │   ├── common/                    ← Shared across all modules
    │   │   ├── filters/
    │   │   │   └── http-exception.filter.ts
    │   │   ├── interceptors/
    │   │   │   ├── response.interceptor.ts   ← Standardized API response shape
    │   │   │   └── logging.interceptor.ts
    │   │   ├── pipes/
    │   │   │   └── validation.pipe.ts
    │   │   ├── decorators/
    │   │   │   └── api-response.decorator.ts
    │   │   └── constants/
    │   │       ├── roles.constant.ts
    │   │       └── exam-types.constant.ts
    │   │
    │   └── utils/
    │       ├── hash.util.ts           ← bcrypt password hashing
    │       ├── format-currency.util.ts ← ₦ formatting
    │       └── parse-csv.util.ts      ← Bulk student CSV processing
    │
    ├── test/
    │   ├── auth.e2e-spec.ts
    │   ├── cbt.e2e-spec.ts
    │   └── jest-e2e.json
    │
    ├── ormconfig.ts                   ← TypeORM datasource config
    ├── nest-cli.json
    ├── tsconfig.json
    └── tsconfig.build.json
```

---

## Getting Started

### Prerequisites
```bash
node --version    # v20 LTS or higher
npm --version     # v10 or higher
git --version
```

You will also need:
- A **Supabase** project (free tier) for PostgreSQL
- An **Upstash** account (free tier) for Redis
- A **Paystack** account for payments
- A **Groq** API key (free tier) for AI features

### 1. Clone the Repository
```bash
git clone https://github.com/your-org/gravitas.git
cd gravitas
```

### 2. Install All Dependencies
```bash
# Install frontend dependencies
cd apps/web
npm install

# Install backend dependencies
cd ../api
npm install

# Back to root
cd ../..
```

### 3. Set Up Environment Variables

**Frontend:**
```bash
cp apps/web/.env.example apps/web/.env.local
```

**Backend:**
```bash
cp apps/api/.env.example apps/api/.env
```

Fill in both files — see [Environment Variables](#environment-variables) below.

### 4. Set Up the Database
```bash
cd apps/api

# Run all TypeORM migrations
npm run migration:run

# Seed the database with questions + subjects
npm run seed
```

### 5. Start Development Servers

Open two terminal windows:

**Terminal 1 — Backend (NestJS):**
```bash
cd apps/api
npm run start:dev
# API running on http://localhost:5000
# Swagger docs at http://localhost:5000/api/docs
```

**Terminal 2 — Frontend (Next.js):**
```bash
cd apps/web
npm run dev
# App running on http://localhost:3000
```

---

## Environment Variables

### Frontend — `apps/web/.env.local`
```bash
# ── API ──────────────────────────────────────────────────────
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1

# ── APP ──────────────────────────────────────────────────────
NEXT_PUBLIC_APP_URL=http://localhost:3000

# ── PAYMENTS ─────────────────────────────────────────────────
# Get from dashboard.paystack.com → Settings → API Keys
NEXT_PUBLIC_PAYSTACK_KEY=pk_test_xxxxxxxxxxxxxxxxxxxx

# ── REALTIME ─────────────────────────────────────────────────
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000

# ── AUTOMATION ───────────────────────────────────────────────
NEXT_PUBLIC_N8N_WEBHOOK_URL=https://your-n8n.com/webhook/xxx

# ── ANALYTICS ────────────────────────────────────────────────
NEXT_PUBLIC_POSTHOG_KEY=phc_xxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
```

### Backend — `apps/api/.env`
```bash
# ── APP ──────────────────────────────────────────────────────
NODE_ENV=development
PORT=5000
APP_URL=http://localhost:3000

# ── DATABASE (Supabase PostgreSQL) ───────────────────────────
# Get from Supabase → Project Settings → Database
DATABASE_HOST=db.xxxxxxxxxxxx.supabase.co
DATABASE_PORT=5432
DATABASE_NAME=postgres
DATABASE_USER=postgres
DATABASE_PASSWORD=your-supabase-password
DATABASE_SSL=true

# ── REDIS (Upstash) ──────────────────────────────────────────
# Get from console.upstash.com
REDIS_URL=rediss://default:xxxxxxxxxxxx@xxx.upstash.io:6379

# ── AUTH ─────────────────────────────────────────────────────
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
JWT_EXPIRY=7d
BETTER_AUTH_SECRET=your-better-auth-secret

# ── GOOGLE OAUTH ─────────────────────────────────────────────
GOOGLE_CLIENT_ID=xxxxxxxxxxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxxxxxxxxxxx
GOOGLE_CALLBACK_URL=http://localhost:5000/api/v1/auth/google/callback

# ── AI PROVIDERS ─────────────────────────────────────────────
# Get from console.groq.com
GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxx

# Get from aistudio.google.com
GEMINI_API_KEY=AIzaxxxxxxxxxxxxxxxxxx

# ── VECTOR DATABASE (Qdrant) ─────────────────────────────────
QDRANT_URL=https://xxxxxxxxxxxx.europe-west3-0.gcp.cloud.qdrant.io
QDRANT_API_KEY=xxxxxxxxxxxxxxxxxxxx

# ── FILE STORAGE (Cloudflare R2) ─────────────────────────────
R2_ACCOUNT_ID=xxxxxxxxxxxxxxxxxxxx
R2_ACCESS_KEY_ID=xxxxxxxxxxxxxxxxxxxx
R2_SECRET_ACCESS_KEY=xxxxxxxxxxxxxxxxxxxx
R2_BUCKET_NAME=gravitas-media
R2_PUBLIC_URL=https://media.gravitas.ng

# ── EMAIL (Resend) ───────────────────────────────────────────
# Get from resend.com
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxx
EMAIL_FROM=noreply@gravitas.ng

# ── SMS / OTP (Termii) ───────────────────────────────────────
# Get from termii.com
TERMII_API_KEY=TLxxxxxxxxxxxxxxxxxxxxxxxxxx
TERMII_SENDER_ID=Gravitas

# ── PAYMENTS (Paystack) ──────────────────────────────────────
PAYSTACK_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxxxxxx
PAYSTACK_WEBHOOK_SECRET=xxxxxxxxxxxxxxxxxxxx

# ── VIDEO CALLS (Livekit) ────────────────────────────────────
LIVEKIT_URL=wss://your-livekit-server.livekit.cloud
LIVEKIT_API_KEY=xxxxxxxxxxxxxxxxxxxx
LIVEKIT_API_SECRET=xxxxxxxxxxxxxxxxxxxx

# ── SEARCH (Meilisearch) ─────────────────────────────────────
MEILISEARCH_HOST=http://localhost:7700
MEILISEARCH_API_KEY=xxxxxxxxxxxxxxxxxxxx

# ── AUTOMATION (n8n) ─────────────────────────────────────────
N8N_WEBHOOK_URL=https://your-n8n.com/webhook/whatsapp-report

# ── MONITORING ───────────────────────────────────────────────
SENTRY_DSN=https://xxxxxxxxxxxx@o0.ingest.sentry.io/0
```

> ⚠️ Never commit `.env` or `.env.local` to version control.
> Always use `.env.example` as the template — fill in dummy values,
> no real secrets.

---

## Frontend Guide

### Available Scripts
```bash
cd apps/web

npm run dev          # Start dev server → http://localhost:3000
npm run build        # Production build
npm run start        # Start production server
npm run typecheck    # TypeScript check (no emit)
npm run lint         # ESLint
npm run lint:fix     # ESLint with auto-fix
npm run format       # Prettier format
npm run test         # Vitest unit tests
npm run test:watch   # Vitest watch mode
npm run test:e2e     # Playwright E2E tests
npm run analyze      # Bundle size analyzer
```

### Adding shadcn Components
```bash
# Always use the CLI — never create components/ui files manually
npx shadcn@latest add button
npx shadcn@latest add dialog
npx shadcn@latest add data-table
```

### Key Coding Patterns

**Always use `cn()` for Tailwind:**
```typescript
import { cn } from '@/lib/utils'

<div className={cn('base', isActive && 'active', className)} />
```

**Always use the Axios instance:**
```typescript
import api from '@/lib/api'

// ✅ Correct — uses interceptors, auth, error handling
const { data } = await api.get('/cbt/questions')

// ❌ Never use raw axios or fetch for API calls
```

**Always TanStack Query for data:**
```typescript
const { data, isLoading } = useQuery({
  queryKey: ['questions', examType, subjectId],
  queryFn: () => api.get(`/cbt/questions/${examType}/${subjectId}`)
})
```

### CBT Exam Mode Rules
```
practice    → AI features ON  — Sabi-Explain visible
mock        → AI features ON  — Sabi-Explain visible, no mid-exam coaching
school-exam → AI features OFF — remove from DOM entirely, never just hide with CSS
```

---

## Backend Guide

### Available Scripts
```bash
cd apps/api

npm run start:dev     # Dev server with hot reload → http://localhost:5000
npm run start:debug   # Dev server with debugger attached
npm run build         # Compile TypeScript to dist/
npm run start:prod    # Run compiled production build
npm run typecheck     # TypeScript check
npm run lint          # ESLint
npm run format        # Prettier
npm run test          # Jest unit tests
npm run test:watch    # Jest watch mode
npm run test:cov      # Jest with coverage report
npm run test:e2e      # Jest E2E tests

# Database
npm run migration:generate --name=MigrationName   # Generate new migration
npm run migration:run                              # Run pending migrations
npm run migration:revert                           # Revert last migration
npm run seed                                       # Seed database with test data
```

### NestJS Module Pattern

Every feature follows this exact structure:
```typescript
// ── MODULE ───────────────────────────────────────────────────
// cbt.module.ts
@Module({
  imports: [TypeOrmModule.forFeature([Question, ExamSession, Answer])],
  controllers: [CbtController],
  providers: [CbtService, SessionService, ScoringService],
  exports: [CbtService],
})
export class CbtModule {}

// ── CONTROLLER ───────────────────────────────────────────────
// cbt.controller.ts
@ApiTags('CBT')
@Controller('cbt')
@UseGuards(JwtAuthGuard)
export class CbtController {
  constructor(private readonly cbtService: CbtService) {}

  @Get('questions/:examType/:subjectId')
  @ApiOperation({ summary: 'Get questions for an exam session' })
  getQuestions(
    @Param('examType') examType: string,
    @Param('subjectId') subjectId: string,
    @CurrentUser() user: User,
  ) {
    return this.cbtService.getQuestions(examType, subjectId, user.id)
  }
}

// ── SERVICE ──────────────────────────────────────────────────
// cbt.service.ts
@Injectable()
export class CbtService {
  constructor(
    @InjectRepository(Question)
    private questionRepository: Repository<Question>,
  ) {}

  async getQuestions(examType: string, subjectId: string, userId: string) {
    return this.questionRepository.find({
      where: { examType, subjectId },
      order: { createdAt: 'DESC' },
    })
  }
}
```

### TypeORM Entity Pattern
```typescript
// question.entity.ts
@Entity('questions')
export class Question {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'enum', enum: ExamType })
  examType: ExamType

  @Column()
  subjectId: string

  @Column('text')
  questionText: string

  @Column({ nullable: true })
  imageUrl: string

  @OneToMany(() => Option, (option) => option.question, { cascade: true })
  options: Option[]

  @Column()
  correctOptionId: string

  @Column()
  year: number

  @Column('text', { nullable: true })
  explanation: string

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
```

### DTO Validation Pattern
```typescript
// start-exam.dto.ts
import { IsEnum, IsString, IsOptional, IsInt, Min, Max } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class StartExamDto {
  @ApiProperty({ enum: ExamType })
  @IsEnum(ExamType)
  examType: ExamType

  @ApiProperty()
  @IsString()
  subjectId: string

  @ApiProperty({ enum: ExamMode })
  @IsEnum(ExamMode)
  mode: ExamMode

  @ApiProperty({ required: false })
  @IsInt()
  @Min(10)
  @Max(100)
  @IsOptional()
  questionCount?: number
}
```

### Standardized API Response

All endpoints return this shape via the `ResponseInterceptor`:
```typescript
// Success
{
  "success": true,
  "data": { ... },
  "message": "Questions fetched successfully",
  "timestamp": "2025-03-19T12:00:00.000Z"
}

// Error
{
  "success": false,
  "error": "Question not found",
  "statusCode": 404,
  "timestamp": "2025-03-19T12:00:00.000Z"
}
```

---

## Database

### PostgreSQL Schema Overview
```
users
├── id (uuid, PK)
├── email (unique)
├── phone (+234 format)
├── passwordHash
├── role (student | teacher | school_admin | tutor | super_admin)
├── subscriptionTier (free | pro | school)
└── timestamps

questions
├── id (uuid, PK)
├── examType (jamb | waec | neco | nabteb | post-utme | ican | nursing)
├── subjectId
├── topicId
├── year
├── questionText
├── imageUrl (nullable — Cloudflare R2)
├── correctOptionId
├── explanation (AI pre-generated)
└── timestamps

options
├── id (uuid, PK)
├── questionId (FK → questions)
├── label (A | B | C | D)
└── text

exam_sessions
├── id (uuid, PK)
├── userId (FK → users)
├── examType
├── mode (practice | mock | school-exam)
├── subjectIds (array)
├── score
├── totalQuestions
├── timeTaken (seconds)
├── submittedAt
└── timestamps

answers
├── id (uuid, PK)
├── sessionId (FK → exam_sessions)
├── questionId (FK → questions)
├── selectedOptionId
└── isCorrect

schools
├── id (uuid, PK)
├── name
├── subdomain (unique)
├── logoUrl
├── adminId (FK → users)
├── subscriptionTier
└── timestamps

school_tests
├── id (uuid, PK)
├── schoolId (FK → schools)
├── classId
├── subjectId
├── topicId
├── title
├── timeLimit (minutes)
├── randomize (boolean)
├── maxRetakes
└── timestamps

subscriptions
├── id (uuid, PK)
├── userId (FK → users)
├── plan (free | pro | school)
├── paystackRef
├── startDate
├── endDate
└── status (active | expired | cancelled)

tutor_profiles
├── id (uuid, PK)
├── userId (FK → users)
├── subjects (array)
├── stateId
├── lgaId
├── hourlyRate (₦)
├── isVerified (boolean)
├── rating
└── timestamps

bookings
├── id (uuid, PK)
├── studentId (FK → users)
├── tutorId (FK → tutor_profiles)
├── scheduledAt
├── durationMinutes
├── amountPaid (₦)
├── status (pending | confirmed | completed | cancelled)
├── livekitRoomId
└── timestamps
```

### TypeORM Migrations
```bash
# Create a new migration after changing an entity
npm run migration:generate --name=AddExplanationToQuestion

# Run all pending migrations
npm run migration:run

# Undo the last migration (careful in production)
npm run migration:revert
```

> Never edit migration files after they have been run.
> Always generate a new migration for changes.

---

## AI Integration

### Architecture
```
Frontend (Next.js)
       │
       │  HTTP (streaming)
       ▼
Backend (NestJS) ── ai.module.ts
       │
       ├── Groq API          ← Primary: text explanations, chat, Pidgin
       ├── Gemini Flash API  ← Secondary: images, PDF extraction
       └── Qdrant            ← Vector search for similar questions
```

### Sabi-Explain Flow
```
Student answers question incorrectly
         │
         ▼
Frontend sends: POST /api/v1/ai/explain
{
  questionId: "uuid",
  selectedOptionId: "uuid",
  examType: "jamb",
  subject: "physics"
}
         │
         ▼
explain.service.ts fetches question context
         │
         ▼
Groq (llama-3.3-70b) generates streaming explanation
using Nigerian curriculum context
         │
         ▼
Frontend streams response into SabiExplain component
```

### Sabi-Tutor System Prompt
```
You are Sabi-Tutor, an AI subject expert for Nigerian secondary school
and university entrance exam students. You follow these rules strictly:

1. Ground all explanations in the Nigerian curriculum (WAEC/JAMB syllabus)
2. Use Nigerian examples — garri, danfo, market prices, NEPA light, etc.
3. If the student writes in Pidgin, respond in Pidgin
4. Never give generic textbook answers
5. Always be encouraging — Nigerian students face real pressure
6. After explaining, offer a follow-up practice question
7. Currency examples always use Naira (₦)
8. Reference Nigerian institutions when relevant (UNILAG, UI, etc.)
```

---

## Nigerian Context

This section is critical. Gravitas is built for Nigeria, not adapted to it.

| Context | Rule |
|---|---|
| Currency | Always `₦2,500` — never `NGN`, never `N2500` |
| Payments | Paystack only — Stripe has poor Nigerian card support |
| SMS/OTP | Termii only — better delivery rates than Twilio in Nigeria |
| Phone | `+234XXXXXXXXXX` format everywhere |
| Network | Significant 2G/3G base — keep bundles lean, lazy-load everything |
| AI language | English primary, Pidgin supported in all AI features |
| Exam timer | JetBrains Mono font — non-negotiable |

### Exam Bodies
```
JAMB    — Joint Admissions and Matriculation Board
WAEC    — West African Examinations Council
NECO    — National Examinations Council
NABTEB  — National Business and Technical Examinations Board
ICAN    — Institute of Chartered Accountants of Nigeria
NCN     — Nursing Council of Nigeria
```

---

## API Reference

Full interactive documentation is available at:
```
http://localhost:5000/api/docs    ← Development (Swagger UI)
https://api.gravitas.ng/docs      ← Production
```

### Key Endpoints
```
AUTH
POST   /api/v1/auth/register          Register new user
POST   /api/v1/auth/login             Login with email + password
POST   /api/v1/auth/google            Google OAuth
POST   /api/v1/auth/verify-otp        Verify phone OTP
POST   /api/v1/auth/refresh           Refresh access token

CBT
GET    /api/v1/cbt/questions/:examType/:subjectId    Fetch questions
POST   /api/v1/cbt/sessions/start                    Start exam session
PATCH  /api/v1/cbt/sessions/:id/answer               Submit single answer
POST   /api/v1/cbt/sessions/:id/submit               Submit full exam
GET    /api/v1/cbt/sessions/:id/results               Get results
GET    /api/v1/cbt/sessions/:id/timer                 Get remaining time

AI
POST   /api/v1/ai/explain             Stream Sabi-Explain response
POST   /api/v1/ai/chat                Stream Sabi-Tutor message
POST   /api/v1/ai/postmortem/:sessionId   Generate post-exam analysis

SCHOOL
POST   /api/v1/school                 Create school
GET    /api/v1/school/:id/students    List students
POST   /api/v1/school/:id/students/bulk-upload   CSV upload
POST   /api/v1/school/:id/tests       Create test
GET    /api/v1/school/:id/tests       List tests
GET    /api/v1/school/:id/reports     School performance report

PAYMENTS
POST   /api/v1/payments/initialize    Initialize Paystack transaction
POST   /api/v1/payments/webhook       Paystack webhook (public)
GET    /api/v1/payments/subscription  Get current subscription

TUTORS
GET    /api/v1/tutors                  Browse tutors (filter by LGA, subject)
GET    /api/v1/tutors/:id              Tutor profile
POST   /api/v1/tutors/bookings         Book a session
GET    /api/v1/tutors/bookings/:id/room   Get Livekit room token
```

---

## Testing

### Frontend (Vitest + Playwright)
```bash
cd apps/web

# Unit tests
npm run test

# E2E tests
npm run test:e2e
```

**Critical E2E flows tested:**
- Complete full JAMB mock exam start to results
- Submit essay in practice mode and receive AI marking
- School admin creates test, student takes it
- Student books tutor and enters live room
- Paystack subscription upgrade

### Backend (Jest)
```bash
cd apps/api

# Unit tests
npm run test

# E2E tests (requires test database)
npm run test:e2e

# Coverage report
npm run test:cov
```

**Critical backend tests:**
- Exam scoring — correct/incorrect answer calculation
- Timer sync — Redis read/write on session
- Mode enforcement — school-exam returns no AI data
- Paystack webhook — subscription activated on payment
- Auth guards — protected routes reject unauthenticated requests

---

## Deployment

### Frontend — Vercel
```bash
npm i -g vercel
cd apps/web
vercel --prod
```

Set all `NEXT_PUBLIC_*` variables in Vercel dashboard →
Project Settings → Environment Variables.

### Backend — Railway
```bash
npm i -g @railway/cli
cd apps/api
railway login
railway up
```

Set all backend env vars in Railway dashboard →
Service → Variables.

### Environment URLs

| Environment | Frontend | API |
|---|---|---|
| Development | `http://localhost:3000` | `http://localhost:5000` |
| Staging | `https://staging.gravitas.ng` | `https://staging-api.gravitas.ng` |
| Production | `https://gravitas.ng` | `https://api.gravitas.ng` |

---

## Contributing

### Branch Strategy
```
main        ← production (protected — PR only)
staging     ← pre-production testing
develop     ← active development (branch from here)
feature/*   ← new features
fix/*       ← bug fixes
hotfix/*    ← urgent production fixes (branch from main)
```

### Commit Convention
```
feat(scope):      new feature
fix(scope):       bug fix
style(scope):     UI/CSS only, no logic
refactor(scope):  restructure, no behavior change
test(scope):      tests only
chore(scope):     deps, config, tooling
docs(scope):      documentation only

Examples:
feat(cbt): add flag question with gold navigator highlight
fix(timer): resume from Redis value on page refresh
feat(school): bulk CSV upload with papaparse validation
fix(ai): remove sabi-explain from DOM in school-exam mode
feat(api): add post-exam AI post-mortem endpoint
fix(payments): verify paystack webhook signature before processing
```

### Pull Request Checklist

**Before opening a PR confirm:**

- [ ] TypeScript compiles with zero errors
- [ ] ESLint passes with zero warnings
- [ ] All existing tests pass
- [ ] New feature has unit tests
- [ ] No `any` types introduced
- [ ] No hardcoded hex colors (CSS variables or Tailwind only)
- [ ] `school-exam` mode removes AI features from DOM (not CSS hide)
- [ ] API endpoints have Swagger decorators (`@ApiOperation`, `@ApiResponse`)
- [ ] New TypeORM entities have a migration generated
- [ ] No secrets committed — check `.env` is in `.gitignore`
- [ ] Mobile responsive — tested at 375px minimum width

---

## Roadmap

### Phase 1 — MVP
- [x] Project setup + monorepo structure
- [ ] Auth — email, Google OAuth, phone OTP (Termii)
- [ ] JAMB CBT simulator — objective mode
- [ ] Question navigator with color coding
- [ ] Sabi-Explain AI popup (Groq streaming)
- [ ] Student performance dashboard
- [ ] Paystack subscription

### Phase 2 — Core Platform
- [ ] WAEC/NECO — objective + theory/essay mode
- [ ] Post-UTME module (40+ universities)
- [ ] School white-label portal
- [ ] Auto-grading + PDF report cards
- [ ] Parent WhatsApp reports (n8n + Termii)

### Phase 3 — AI & Tutoring
- [ ] Sabi-Tutor dedicated chat
- [ ] Post-exam AI post-mortem
- [ ] Voice input support
- [ ] Tutor marketplace
- [ ] Live tutoring room (Livekit + tldraw)

### Phase 4 — Scale
- [ ] ICAN & Nursing professional modules
- [ ] Content library (Video.js + Cloudflare R2)
- [ ] Full PWA offline mode
- [ ] Streaks, XP, national leaderboards
- [ ] Mobile app (React Native — separate repo)

---

## License

Private and proprietary. All rights reserved.
© 2025 Gravitas Technologies Ltd. Made with ❤️ in Nigeria.

---

<div align="center">

**Built for Nigerian students. By Nigerians.**

[gravitas.ng](https://gravitas.ng) · [support@gravitas.ng](mailto:support@gravitas.ng)

</div>
