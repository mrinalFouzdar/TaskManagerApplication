# TaskManagerApplication

A simple task manager app with:
- `frontend`: React + Vite
- `backend`: Node.js + Express + TypeScript
- `db`: PostgreSQL

## Prerequisites

- Docker Desktop (for Docker setup)
- Node.js `22.x` recommended (Vite 8 requires Node 20.19+)
- npm
- PostgreSQL (only for full local setup without Docker DB)

## Run With Docker (Recommended)

From project root:

```bash
docker-compose up --build
```

Services:
- Frontend: `http://localhost`
- Backend API: `http://localhost:5000`
- PostgreSQL (host): `localhost:5433` (container still uses `5432`)

Stop:

```bash
docker-compose down
```

## Run Locally (Without Full Docker)

You can run frontend/backend locally and choose DB in one of two ways.

### Option A: Run DB in Docker, app locally

Start only database:

```bash
docker-compose up -d db
```

Then set backend env in `backend/.env`:

```env
PORT=5000
DB_USER=postgres
DB_HOST=localhost
DB_NAME=task_manager
DB_PASSWORD=admin
DB_PORT=5433
```

### Option B: Run everything locally

Install PostgreSQL locally and create a DB named `task_manager`, then set:

```env
PORT=5000
DB_USER=postgres
DB_HOST=localhost
DB_NAME=task_manager
DB_PASSWORD=<your_password>
DB_PORT=5432
```

## Start Backend (Local)

```bash
cd backend
npm install
npm run dev
```

Backend runs on `http://localhost:5000`.

## Start Frontend (Local)

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on Vite default URL (usually `http://localhost:5173`).

## API Quick Test

Create a task:

```bash
curl -X POST "http://localhost:5000/api/tasks" \
  -H "Content-Type: application/json" \
  -d "{\"title\":\"Coding\",\"description\":\"need to write features\",\"status\":\"pending\"}"
```

Get tasks:

```bash
curl "http://localhost:5000/api/tasks"
```
