# NanoLink - Enterprise URL Shortener 

NanoLink is a high-performance, fault-tolerant URL shortening service designed to handle massive viral traffic spikes. This project demonstrates modern distributed system architecture, built to scale to **>10,000 Requests Per Second (RPS)** with sub-50ms latency.

## The Tech Stack

- **Backend (API):** Node.js (v22), Fastify, TypeScript
- **Frontend (Client):** React, TypeScript, Vite
- **Database:** PostgreSQL (with `pg` driver)
- **Infrastructure:** Docker, Docker Compose
- **Future Additions:** Redis, Kafka, Prometheus, Grafana

## The Architecture & Vision

NanoLink is separated into two primary services:

1. **The Backend API:** A blazing fast Fastify server compiled natively to JavaScript. It features an **auto-healing collision mechanism** utilizing a 7-character Base62 encoding system (via `nanoid`). It is completely protected against SQL injections via parameterized queries and handles graceful fallback for 404/400 errors.
2. **The Frontend Client:** A lightning-fast React application built with Vite for optimal Hot Module Replacement and minified production bundles.

Both services and the database are fully containerized using Docker, communicating over an isolated virtual network.

### Engineering Roadmap (The Scale)
We are currently building towards a "Twitter/X scale" system. Here is the roadmap of advanced distributed systems being integrated into NanoLink:

- [x] **Base62 Encoding:** Cryptographically secure 7-character generation using `nanoid`.
- [x] **Collision Auto-Healing:** Database constraint retry loops to prevent crashes on duplicate keys.
- [x] **Containerization:** Fully Dockerized backend environment with isolated network topologies.
- [ ] **The Caching Layer:** Integrating **Redis** to bypass PostgreSQL reads and serve viral links directly from memory.
- [ ] **Event-Driven Analytics:** Integrating **Kafka/RabbitMQ** to asynchronously log user clicks without blocking the redirect response time.
- [ ] **Security & Protection:** Implementing strict **Rate Limiting** to prevent DDoS and database spam.
- [ ] **Observability:** Adding **Prometheus & Grafana** to visualize RPS, latency, and database health in real-time.

---

## Getting Started

### Prerequisites
- Docker Desktop installed on your machine.

### Installation & Setup

1. **Configure Environment Variables**:
   Create a `.env` file in the root `backend` directory and set your Postgres password:
   ```env
   POSTGRES_PASSWORD=your_secure_password_here
   ```

2. **Start the Application**:
   Use Docker Compose to build the images and start the containers in detached mode:
   ```bash
   cd backend
   docker compose up --build -d
   ```
   *The API will be available at `http://localhost:3000`.*

---

## API Endpoints

### 1. Health Check
Checks if the server is up and running.
- **URL**: `/`
- **Method**: `GET`
- **Response**:
  ```json
  {
      "Status": "OK"
  }
  ```

### 2. Shorten URL
Accepts a long URL, validates it natively, and generates a short link.
- **URL**: `/url`
- **Method**: `POST`
- **Body** (JSON):
  ```json
  {
      "url": "https://www.google.com"
  }
  ```
- **Response**:
  ```json
  {
      "Shortened URL": "http://localhost:3000/a1B2c3D"
  }
  ```

### 3. View All URLs
Returns all saved URLs in the database.
- **URL**: `/all`
- **Method**: `GET`
- **Response**:
  ```json
  {
      "RESULT": [
          {
              "id": 1,
              "short_code": "a1B2c3D",
              "long_url": "https://www.google.com"
          }
      ]
  }
  ```

### 4. Redirect
Redirects the user to the original website associated with the short code.
- **URL**: `/:shortId`
- **Method**: `GET`
- **Behavior**: HTTP 302 Redirect to the original `long_url`. Returns 404 if not found.
