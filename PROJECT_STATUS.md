# Netevo — Project Status Document

**Last Updated:** July 24, 2026  
**Overall Phase:** Phase 1 — Auth + Gateway (Week 2 of 3)  
**Implementation Status:** ~15% complete

---

## Executive Summary

Netevo has a **comprehensive architecture specification** (in `Netevo.md` and `README.md`) but **limited implementation**. Only the **Auth Service** has meaningful Go code. The API Gateway uses nginx instead of the planned Go implementation. All other services (User, Note, Notification, Search) exist only in documentation.

---

## What's Actually Implemented

### Auth Service (Go) — ✅ Substantially Complete

| Component | File | Status | Notes |
|-----------|------|--------|-------|
| **Project setup** | `go.mod`, `Dockerfile` | ✅ | Multi-stage build, dependencies |
| **Config** | `internal/config/config.go` | ✅ | Environment-based |
| **Models** | `internal/models/auth.go` | ✅ | Request/response DTOs |
| **Routes** | `internal/routes/routes.go` | ✅ | Gin router with `/auth/*` group |
| **Middleware** | `internal/middleware/auth.go` | ✅ | JWT validation, extracts claims to context |
| **Handlers** | `internal/handlers/auth.go` | ✅ | Signup, Login, Refresh, Logout, Profile |
| **Token Service** | `internal/service/tokens.go` | ⚠️ **Basic only** | Generates/validates JWTs, bcrypt passwords |
| **Redis Service** | `internal/service/redis.go` | ⚠️ **Access tokens only** | Stores access tokens with 15-min TTL |
| **Supabase Service** | `internal/service/supabase.go` | ✅ | User CRUD via Supabase REST API |

**Auth Endpoints Working:**
- `POST /auth/register` — Creates user, returns access + refresh tokens
- `POST /auth/login` — Verifies password, returns access + refresh tokens
- `POST /auth/refresh` — Validates refresh token, issues new pair
- `GET /auth/profile` — Protected endpoint (requires valid access token)
- `POST /auth/logout` — Deletes access token from Redis

---

## What's NOT Implemented (Despite Being Documented)

### Auth Service — Critical Gaps

| Feature | Documented in `Netevo.md` | Actually Implemented |
|---------|---------------------------|---------------------|
| **Refresh Token Rotation** | New refresh token issued on every use, old one deleted | ❌ Same refresh token reusable for 7 days |
| **Refresh Token Theft Detection** | Token families tracked; reuse revokes entire family | ❌ No tracking, no revocation |
| **Refresh Token Storage** | Stored as bcrypt hash in DB; only hash compared | ❌ Plain JWT, no storage, no revocation |
| **Access Token Blacklist** | Redis blacklist on logout | ✅ Partial (deletes by user_id only) |
| **OAuth2 / Google (PKCE)** | Full PKCE flow with challenge/verifier | ❌ Not started |
| **API Keys (Stripe-style)** | `sk_live_*` prefix, bcrypt hash, shown once | ❌ Not started |
| **Rate Limiting** | Redis sliding window (100 req/min/user) | ❌ Not started |

### API Gateway — Wrong Implementation

| Planned (Go) | Actual (nginx) |
|--------------|----------------|
| Go reverse proxy with `chi` | nginx + `gateway.conf` |
| gRPC call to Auth Service for token validation | No validation — passes through |
| Redis sliding window rate limiter | None |
| Request ID injection (`X-Request-ID`) | None |
| Per-service routing logic | Static upstream config |

**Current nginx config** (`services/api-gateway/conf.d/gateway.conf`):
- Routes `/api/v1/auth/*` → `auth-service:8080`
- Routes `/api/v1/users/*` → `user-service:8080` (service doesn't exist)
- No auth validation, no rate limiting

---

## Missing Services (0% Implemented)

| Service | Planned Responsibility | Status |
|---------|------------------------|--------|
| **User Service** | Orgs, workspaces, invitations, RBAC, schema-per-tenant | Directory only |
| **Note Service** | CRUD + JSONB, WebSockets, Redis pub/sub, optimistic locking | Directory only |
| **Notification Service** | RabbitMQ consumer, MongoDB, email via Resend | Directory only |
| **Search Service** | Meilisearch, gRPC, async indexing via RabbitMQ | Directory only |

---

## Infrastructure — Partial

| Component | Status | Notes |
|-----------|--------|-------|
| `docker-compose.yml` | ✅ Exists | Spins up Postgres, Redis, RabbitMQ, Meilisearch, MongoDB, Prometheus, Grafana |
| Auth Service Dockerfile | ✅ | Multi-stage, ~20MB final image |
| API Gateway Dockerfile | ✅ | nginx-based |
| Helm charts (k8s) | ❌ | Directory structure only |
| Terraform | ❌ | Directory only |
| GitHub Actions CI | ❌ | Workflow files listed in README don't exist |
| Prometheus/Grafana config | ❌ | Directory only |

---

## Documentation vs Reality Gap

| Document | Claims | Reality |
|----------|--------|---------|
| `README.md` | "Six microservices", "gRPC internal", "WebSockets + Redis pub/sub" | 1 service, nginx gateway, no gRPC, no WebSockets |
| `Netevo.md` | 12-week build plan, detailed ADRs, interview answers | Plan exists; code doesn't match Phase 1 completion |
| `docs/adr/*.md` | 5 ADRs documented | Files don't exist (directory empty) |

---

## Current Codebase Metrics

```
services/
├── auth-service/     ~12 Go files, ~2,500 lines — ONLY working service
├── api-gateway/      nginx config only — no Go code
├── user-service/     ❌ missing
├── note-service/     ❌ missing
├── notification-service/ ❌ missing
├── search-service/   ❌ missing
packages/             ❌ empty
infra/                docker-compose.yml only
scripts/              ❌ empty
docs/adr/             ❌ empty
.github/workflows/    ❌ empty
```

---

## What Needs to Happen Next (Priority Order)

### Week 2-3: Complete Phase 1 Auth + Gateway

1. **Implement Refresh Token Rotation + Theft Detection**
   - Store refresh token hashes in Redis/DB with `token_family_id`
   - On refresh: verify hash, delete old, create new with same family
   - On reuse detection: delete entire family, force re-login

2. **Migrate API Gateway to Go**
   - Replace nginx with Go `chi` reverse proxy
   - gRPC client to Auth Service `ValidateToken` RPC
   - Redis sliding window rate limiter
   - Request ID middleware

3. **Add OAuth2 (Google) + API Keys**
   - PKCE flow implementation
   - Stripe-style `sk_live_*` keys with bcrypt storage

4. **Write Auth Service Tests**
   - Unit tests for token rotation, theft detection
   - Integration tests for full auth flow

### Week 4+: Phase 2 — Multi-Tenancy + User Service

5. **Create User Service from scratch** (Go, same structure as Auth)
6. **Implement Schema-Per-Tenant** in PostgreSQL
7. **Build Migration Runner** (per-tenant schema migrations)

---

## Honest Assessment for Stakeholders

> **If you're showing this to an interviewer or investor:** Be transparent. The architecture is well-designed and documented. The Auth Service demonstrates solid Go fundamentals (clean architecture, DI, middleware, JWT, Redis). But **only ~1 of 6 services exists**, and the gateway is nginx not Go. The sophisticated auth features (rotation, theft detection, OAuth2, API keys) are **designed not built**.

> **If you're continuing development:** Finish Phase 1 completely before moving on. The Auth Service gaps (especially refresh token rotation) are security-critical and block the "production-grade auth" claim in the documentation.
