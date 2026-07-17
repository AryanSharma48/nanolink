# NanoLink - Backend API

The backend for NanoLink is engineered for speed and resilience. It is built using **Node.js (v22)** and **Fastify**, a framework designed for extremely high throughput.

## Core Features
- **TypeScript:** Fully strongly typed, compiled down to optimized JavaScript for production via `tsc`.
- **PostgreSQL:** Uses parameterized queries to prevent SQL injection.
- **Docker Compose:** The entire backend stack (API + Database) can be spun up with a single command.
- **Robust Error Handling:** Features a self-healing retry loop to mathematically guarantee no unhandled URL collisions (Unique Constraint Violations).

## 🚀 Running the Backend

### The Docker Way (Production Mode)
The easiest way to run the backend is using Docker Compose. This will spin up the PostgreSQL database, automatically inject the correct environment variables over an isolated virtual network, and start the Fastify API.

```bash
cd backend
docker compose up --build
```
The API will be available at `http://localhost:3000`.

### The Local Way (Development Mode)
If you want to run the code locally for fast iteration:

1. Ensure your `.env` file exists and contains your local `DATABASE_URL`:
   ```env
   DATABASE_URL=postgresql://user:password@localhost:5432/url_shortner
   ```
2. Start your Postgres instance manually or via Docker.
3. Install dependencies:
   ```bash
   npm install
   ```
4. Run the development server (transpiles on the fly):
   ```bash
   npm run dev
   ```

## 🏗️ Building for Production
To compile the TypeScript code into optimized JavaScript:
```bash
npm run build
```
This will output the code to the `/dist` folder. You can then run it with:
```bash
npm start
```
*(Note: Ensure you are using Node 20.6+ as the start script relies on the `--env-file` flag!)*
