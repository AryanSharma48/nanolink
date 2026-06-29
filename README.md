# URL Shortener API

A robust, containerized REST API for shortening URLs, built from scratch with Node.js, Express, TypeScript, and PostgreSQL.

## Tech Stack
- **Backend**: Node.js, Express, TypeScript
- **Database**: PostgreSQL (with `pg` driver)
- **Infrastructure**: Docker, Docker Compose

## Features
- **RESTful API:** Clean and predictable endpoints for URL shortening.
- **Dynamic Token Generation:** Utilizes Node's native `crypto` module to generate secure, randomized short codes.
- **Persistent Storage:** Uses a persistent, enterprise-grade PostgreSQL database.
- **Security:** Implements parameterized SQL queries to protect the database against SQL Injection attacks.
- **Containerization:** The entire backend and database are wrapped inside Docker containers, wired together using a custom Docker Compose network, with credentials secured via a `.env` file.

## Getting Started

### Prerequisites
- Docker Desktop installed on your machine.

### Installation & Setup

1. **Configure Environment Variables**:
   Create a `.env` file in the root directory and set your Postgres password:
   ```env
   POSTGRES_PASSWORD=your_secure_password_here
   ```

2. **Start the Application**:
   Use Docker Compose to build the images and start the containers in detached mode:
   ```bash
   docker compose up --build -d
   ```
   *The API will be available at `http://localhost:3000`.*

## API Endpoints

### 1. Health Check
Checks if the server is up and running.
- **URL**: `/health`
- **Method**: `GET`
- **Response**:
  ```json
  {
      "Status": "OK"
  }
  ```

### 2. Shorten URL
Accepts a long URL and generates a short link.
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
      "Shortened URL": "http://localhost:3000/a1b2c3d4"
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
              "short_code": "a1b2c3d4",
              "long_url": "https://www.google.com"
          }
      ]
  }
  ```

### 4. Redirect
Redirects the user to the original website associated with the short code.
- **URL**: `/:shortId`
- **Method**: `GET`
- **Behavior**: HTTP 302 Redirect to the original `long_url`.
