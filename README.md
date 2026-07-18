# NanoLink - Enterprise URL Shortener 

NanoLink is a high-performance, fault-tolerant URL shortening service designed to handle massive viral traffic spikes. This project demonstrates modern distributed system architecture, built to scale to **>10,000 Requests Per Second (RPS)** with sub-50ms latency.

## System Architecture

```mermaid

graph TD
    Client([Client / Browser])
    
    Dashboard[React / Vite Dashboard]
    API[Fastify API Server]
    Worker[Kafka Analytics Worker]
    Redis[(Redis Cache)]
    DB[(PostgreSQL)]
    Kafka{Apache Kafka}

    Routes["POST /url<br/>GET /:shortId<br/>GET /analytics<br/>GET /all"]
    
    Client --> Routes
    Routes --> API
    
    API <-->|1. Sub-10ms Cache Hit| Redis
    API -->|2. Fire & Forget Click Event| Kafka
    API <-->|3. DB Fallback / Write| DB
    
    Kafka -->|4. Consume Event Queue| Worker
    Worker -->|5. Background Bulk Insert| DB
    
```

## The Tech Stack

- **Backend (API):** Node.js (v22), Fastify, TypeScript
- **Frontend (Client):** React, TypeScript, Vite
- **Database:** PostgreSQL (with `pg` driver)
- **Caching Layer:** Redis
- **Message Broker:** Apache Kafka (KRaft mode)
- **Infrastructure:** Docker, Docker Compose

## Engineering Highlights

- **Blazing Fast Redirects:** URL resolution hits the Redis cache first, bypassing the database entirely for popular links, guaranteeing sub-50ms redirects.
- **Event-Driven Analytics:** Redirects are completely non-blocking. Click events (IP, UserAgent, Timestamps) are published to a Kafka topic and processed asynchronously by a standalone worker node.
- **Auto-Healing Collisions:** Utilizes a cryptographically secure 7-character Base62 encoding system (via `nanoid`) with database constraint retry loops to prevent crashes on duplicate keys.
- **Fully Dockerized:** The entire distributed system spins up locally in isolated virtual networks via a single `compose.yaml` file.

## Getting Started

### 1. Configure Environment Variables
Create a `.env` file in the root `backend` directory and set your Postgres password:
```env
POSTGRES_PASSWORD=your_secure_password_here
DATABASE_URL=postgresql://aryan:your_secure_password_here@localhost:5433/url_shortner
```

### 2. Spin up the Infrastructure
Use Docker Compose to build the images and start the containers in detached mode:
```bash
cd backend
docker compose up -d
```

### 3. Run Database Migrations
Initialize the PostgreSQL schema and create the tables:
```bash
cd backend
npm run db:migrate
```

*The API is now fully available at `http://localhost:3000`!*

---
**Check out the [Backend README](./backend/README.md) for detailed API documentation and endpoints.**
