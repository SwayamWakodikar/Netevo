# 🚀 Notevo

> A scalable, multi-tenant collaboration platform built with microservices, real-time systems, and cloud-native architecture.

---

## 📌 Overview

**Notevo** is a modern team collaboration platform that enables organizations to:

- Organize work into structured workspaces  
- Create and manage rich documents  
- Collaborate in real-time  
- Manage users, roles, and permissions at scale  

The system is designed for **high scalability, strong tenant isolation, and low-latency communication**.

---

## 🏗️ Architecture

Notevo follows a **microservices architecture** with independently deployable services.

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

## ⚙️ Tech Stack

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

## 🔐 Core Capabilities

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

## 📂 Repository Structure
