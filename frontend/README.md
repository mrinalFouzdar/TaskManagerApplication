# Task Manager Frontend

React + TypeScript + Vite frontend for the Task Manager application.

## Tech Stack

- React 19
- TypeScript
- Vite
- Redux Toolkit + React Redux
- React Router
- Tailwind CSS
- Axios

## Prerequisites

- Node.js 20+
- npm 10+

## Setup

```bash
npm install
```

## Run Locally

```bash
npm run dev
```

Default Vite dev URL: `http://localhost:5173`

## Build

```bash
npm run build
```

To preview production build:

```bash
npm run preview
```

## Lint

```bash
npm run lint
```

## Frontend Architecture

- App shell is defined in `src/App.tsx`.
- Routing is configured in `src/main.tsx`.
- Redux store is configured in `src/store/store.ts`.
- Task state and async APIs are in `src/features/tasksSlice.ts`.
- Axios client is in `src/services/api.ts`.

## Lazy Loading

Lazy loading is implemented in two places:

- Route-level: `TaskDashboard` is loaded lazily in `src/main.tsx`.
- Component-level: `TaskForm` modal is loaded lazily in `src/pages/TaskDashboard.tsx`.

`Suspense` fallback UIs are used while chunks are loading.

## Error Handling

- Global render/lifecycle crash protection is implemented using `ErrorBoundary` in `src/components/ErrorBoundary.tsx`.
- The boundary wraps the router tree in `src/main.tsx`.
- API and action-level errors are handled in feature/components (for example, Swal alerts in task actions).

## API Base URL

API base URL is currently hardcoded in `src/services/api.ts`:

- `http://localhost:5000/api`

If backend URL changes, update this value or move it to env-based config.
