# Netevo

A scalable, multi-tenant collaboration platform built with microservices, real-time systems, and cloud-native architecture.

---

## Overview

Netevo is a modern team collaboration platform that enables organizations to:

- Organize work into structured workspaces
- Create and manage rich documents
- Collaborate in real-time
- Manage users, roles, and permissions at scale

The system is designed for high scalability, strong tenant isolation, and low-latency communication.

---

## Architecture

Netevo follows a microservices architecture with independently deployable services.

### Core Services

- **API Gateway** — request routing, authentication, rate limiting
- **Auth Service** — authentication, token lifecycle, API keys
- **User Service** — organizations, memberships, RBAC
- **Note Service** — document management and real-time collaboration
- **Notification Service** — event-driven notifications
- **Search Service** — full-text search

### Communication

- **REST** — client-facing APIs
- **gRPC** — internal service communication
- **RabbitMQ** — asynchronous event-driven workflows
- **WebSockets** — real-time updates

---

## Tech Stack

### Backend
- Go
- Node.js (Fastify)
- TypeScript

### Data Layer
- PostgreSQL
- Redis
- MongoDB
- Meilisearch

### Infrastructure
- Docker
- Kubernetes
- Helm
- Terraform

### Observability
- Prometheus
- Grafana
- Jaeger

---

## Core Capabilities

- Multi-tenant architecture with strong isolation
- JWT authentication with refresh token rotation
- OAuth2 integration
- Role-Based Access Control (RBAC)
- Real-time collaboration (WebSockets + Redis)
- Event-driven architecture (RabbitMQ)
- Distributed rate limiting
- Full-text search with low latency
- Structured logging and distributed tracing

---

## Repository Structure

```
netevo/
│
├── apps/                                   # Things that face the outside world
│   └── web/                                # Frontend (React/Next.js) — add later
│
├── services/                               # All six microservices
│   │
│   ├── api-gateway/
│   │   ├── cmd/
│   │   │   └── server/
│   │   │       └── main.go                 # Entry point — starts the server
│   │   ├── internal/
│   │   │   ├── handlers/                   # HTTP route handlers
│   │   │   ├── middleware/                 # Auth, logging, tracing middleware
│   │   │   └── proxy/                      # Reverse proxy logic per service
│   │   ├── Dockerfile
│   │   └── go.mod                          # This service's own dependency list
│   │
│   ├── auth-service/
│   │   ├── cmd/
│   │   │   └── server/
│   │   │       └── main.go
│   │   ├── internal/
│   │   │   ├── handlers/                   # HTTP handlers (register, login, refresh)
│   │   │   ├── middleware/                 # JWT validation middleware
│   │   │   ├── models/                     # Struct definitions (User, Token, etc.)
│   │   │   ├── repository/                 # All DB queries — no business logic here
│   │   │   └── service/                    # Business logic — no HTTP or DB here
│   │   ├── Dockerfile
│   │   └── go.mod
│   │
│   ├── user-service/
│   │   ├── cmd/
│   │   │   └── server/
│   │   │       └── main.go
│   │   ├── internal/
│   │   │   ├── handlers/                   # Org, workspace, invitation handlers
│   │   │   ├── middleware/                 # RBAC middleware
│   │   │   ├── models/
│   │   │   ├── repository/                 # Postgres queries — schema-per-tenant
│   │   │   └── service/                    # Org creation, invite logic
│   │   ├── Dockerfile
│   │   └── go.mod
│   │
│   ├── note-service/
│   │   ├── cmd/
│   │   │   └── server/
│   │   │       └── main.go
│   │   ├── internal/
│   │   │   ├── handlers/
│   │   │   │   ├── http.go                 # REST handlers (CRUD)
│   │   │   │   └── websocket.go            # WebSocket upgrade + message handling
│   │   │   ├── middleware/
│   │   │   ├── models/
│   │   │   ├── repository/                 # JSONB queries, optimistic locking
│   │   │   ├── service/
│   │   │   └── realtime/
│   │   │       └── hub.go                  # Manages WS connections + Redis pub/sub
│   │   ├── Dockerfile
│   │   └── go.mod
│   │
│   ├── notification-service/
│   │   ├── cmd/
│   │   │   └── server/
│   │   │       └── main.go
│   │   ├── internal/
│   │   │   ├── consumer/                   # RabbitMQ consumer — no HTTP server
│   │   │   ├── models/
│   │   │   ├── repository/                 # MongoDB writes
│   │   │   └── service/                    # Email dispatch, idempotency logic
│   │   ├── Dockerfile
│   │   └── go.mod
│   │
│   └── search-service/
│       ├── cmd/
│       │   └── server/
│       │       └── main.go
│       ├── internal/
│       │   ├── handlers/                   # gRPC handlers only — no HTTP
│       │   ├── consumer/                   # RabbitMQ consumer for index events
│       │   ├── repository/                 # Meilisearch client
│       │   └── service/
│       ├── Dockerfile
│       └── go.mod
│
├── packages/                               # Shared code used by multiple services
│   └── proto/                              # gRPC contracts
│       ├── auth/
│       │   └── auth.proto                  # ValidateToken RPC definition
│       ├── search/
│       │   └── search.proto                # Search RPC definition
│       └── gen/                            # Auto-generated Go code — never edit manually
│           ├── auth/
│           └── search/
│
├── infra/                                  # Everything deployment related
│   ├── docker/
│   │   └── docker-compose.yml              # Starts entire local stack in one command
│   ├── k8s/
│   │   └── helm/                           # Helm charts — one per service
│   │       ├── api-gateway/
│   │       ├── auth-service/
│   │       ├── user-service/
│   │       ├── note-service/
│   │       ├── notification-service/
│   │       └── search-service/
│   ├── terraform/                          # Cloud infrastructure as code
│   └── monitoring/
│       ├── prometheus.yml
│       └── grafana/
│           └── dashboards/
│
├── docs/                                   # Architecture Decision Records
│   └── adr/
│       ├── 001-schema-per-tenant.md
│       ├── 002-grpc-for-internal-calls.md
│       ├── 003-rabbitmq-event-bus.md
│       ├── 004-go-only-stack.md
│       └── 005-redis-pubsub-websocket-scaling.md
│
├── scripts/
│   ├── migrate.sh                          # Run migrations across all tenant schemas
│   └── gen-proto.sh                        # Regenerate gRPC code from .proto files
│
├── .github/
│   └── workflows/
│       ├── auth-service.yml
│       ├── user-service.yml
│       ├── note-service.yml
│       ├── notification-service.yml
│       └── search-service.yml
│
└── README.md
```
