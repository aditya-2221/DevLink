# DevLink

DevLink is a full-stack social platform for developers to showcase projects, form teams, find collaborators through a recruitment board, manage work with a Kanban-style task tracker, and communicate in real time — with a few AI-assisted writing tools built in.

**Live app:** https://dev-link-chi-cyan.vercel.app
**Repository:** https://github.com/aditya-2221/DevLink

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [Real-Time Events (Socket.IO)](#real-time-events-socketio)
- [API Reference](#api-reference)
- [Deployment](#deployment)

---

## Features

- **Authentication** — Register/login with JWT access + refresh tokens (httpOnly cookies), avatar/cover image upload, password change, and email-based forgot/reset password flow.
- **Developer Profiles** — Bio, skills, education history, social links (GitHub, LinkedIn, portfolio), and an earned-badge system (`devlink-developer`, `top-contributor`, `elite-developer`) based on project count, likes, and bookmarks.
- **Projects** — Create/edit/delete projects with image uploads, likes, bookmarks, comments, a trending feed, and per-user project listings.
- **Teams** — Create teams, invite/add/remove members, manage invitations, and post pinned announcements.
- **Recruitment Board** — Post openings, browse/filter by skill, apply to openings, and accept/reject applicants.
- **Tasks (Kanban)** — Create tasks per team, drag-and-drop status changes, assignment, file attachments, and an activity log per task (built with `@dnd-kit`).
- **Resources** — Upload and share team resource files, with download tracking.
- **Real-Time Chat** — Direct-message requests (send/accept/reject/block), group conversations, typing indicators, read receipts, message edit/delete, attachments, and online-user presence — powered by Socket.IO.
- **Notifications** — In-app notifications with read/unread state.
- **Global Search** — Cross-entity search (users, projects, etc.).
- **AI Tools (Google Gemini)** — Generate project descriptions, auto-generate README files, generate project reports, and get an AI review of a project.

## Tech Stack

**Backend**
- Node.js + Express 5
- MongoDB with Mongoose 9
- Socket.IO 4 (real-time chat/presence)
- JWT (`jsonwebtoken`) for access/refresh tokens, `bcryptjs` for password hashing
- Multer for uploads, Cloudinary for media storage
- Nodemailer for transactional email (password reset)
- Google Gemini (`@google/genai`) for AI-assisted content generation

**Frontend**
- React 19 + Vite
- Redux Toolkit + React Redux (state management, feature-sliced)
- React Router v7
- Tailwind CSS v4
- Axios (with `withCredentials` for cookie-based auth)
- Socket.IO client
- `@dnd-kit` (drag-and-drop task board)
- `react-hook-form`, `react-hot-toast`, `framer-motion`, `date-fns`

**Deployment:** Frontend on Vercel; backend deployable to any Node host with a MongoDB connection (Render/Railway/etc. — not specified in repo).

## Project Structure

```
DevLink/
├── Backend/
│   ├── src/
│   │   ├── config/          # Gemini AI client config
│   │   ├── controllers/     # Route handler logic, one per resource
│   │   ├── db/               # MongoDB connection
│   │   ├── middlewares/      # JWT auth, multer/attachment upload
│   │   ├── models/            # Mongoose schemas (User, Project, Team, Task, Chat, etc.)
│   │   ├── routes/            # Express routers, one per resource
│   │   ├── services/          # Business logic used by controllers/sockets
│   │   ├── socket/            # Socket.IO server + event handlers
│   │   ├── utils/             # ApiError/ApiResponse wrappers, Cloudinary, badges, etc.
│   │   ├── app.js             # Express app + route mounting
│   │   └── index.js           # Server entry point (HTTP + Socket.IO bootstrap)
│   └── package.json
└── Frontend/
    ├── src/
    │   ├── api/                # Axios instance + API modules
    │   ├── app/                # Redux store
    │   ├── components/         # Reusable UI (cards, chat, forms, modals, nav, ui)
    │   ├── features/           # Redux slices (auth, projects, tasks, chat, etc.)
    │   ├── hooks/               # useAuth, useChat, useLogout
    │   ├── layouts/              # Auth/Main/Chat layouts
    │   ├── pages/                 # Route-level page components
    │   ├── routes/                 # AppRoutes + ProtectedRoute
    │   ├── services/               # API-calling service functions
    │   ├── socket/                 # Socket.IO client wrapper
    │   └── main.jsx / App.jsx
    └── package.json
```

## Getting Started

### Prerequisites

- Node.js (v18+ recommended, given Express 5 / Vite 8 / React 19)
- A MongoDB instance (local or Atlas)
- A Cloudinary account (for image/file uploads)
- A Google Gemini API key (for AI features)
- An SMTP-capable email account (for password reset emails, via Nodemailer)

### Backend Setup

```bash
cd Backend
npm install
cp .env.sample .env   # then fill in the values — see Environment Variables below
npm run dev            # starts with nodemon on http://localhost:<PORT>
```

### Frontend Setup

```bash
cd Frontend
npm install
# create a .env file in Frontend/ — see Environment Variables below
npm run dev             # starts Vite dev server
```

The frontend expects the backend to be reachable at the URLs set in its env vars (`VITE_API_BASE_URL`, `VITE_API_URL`), and the backend expects `CORS_ORIGIN` to allow the frontend's origin since cookies are sent cross-origin (`withCredentials: true`).

## Environment Variables

### Backend (`Backend/.env`)

| Variable | Description |
|---|---|
| `PORT` | Port the Express server listens on |
| `MONGODB_URI` | MongoDB connection string (database name `devlink` is appended automatically) |
| `ACCESS_TOKEN_SECRET` | Secret used to sign JWT access tokens |
| `ACCESS_TOKEN_EXPIRY` | Access token expiry (e.g. `1d`) |
| `REFRESH_TOKEN_SECRET` | Secret used to sign JWT refresh tokens |
| `REFRESH_TOKEN_EXPIRY` | Refresh token expiry (e.g. `10d`) |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |
| `CORS_ORIGIN` | Allowed origin for CORS (your frontend URL) |
| `CLIENT_URL` | Frontend base URL, used to build links (e.g. in password-reset emails) |
| `EMAIL_USER` | Nodemailer sender email address |
| `EMAIL_PASS` | Nodemailer sender password / app password |
| `GEMINI_API_KEY` | Google Gemini API key for the AI endpoints |

> Note: `.env.sample` in the repo lists most of these but is missing `CLIENT_URL`, `EMAIL_USER`, `EMAIL_PASS`, and `GEMINI_API_KEY` — these are used in code but not currently in the sample file, so add them manually.

### Frontend (`Frontend/.env`)

| Variable | Description |
|---|---|
| `VITE_API_BASE_URL` | Base URL for REST API calls (used by Axios), e.g. `http://localhost:8000/api/v1` |
| `VITE_API_URL` | Base URL for the Socket.IO connection, e.g. `http://localhost:8000` |

## Available Scripts

**Backend**
| Script | Description |
|---|---|
| `npm run dev` | Run with nodemon + dotenv for local development |
| `npm start` | Run in production mode (`node src/index.js`) |

**Frontend**
| Script | Description |
|---|---|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Production build |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |

## Real-Time Events (Socket.IO)

Handled server-side in `Backend/src/socket/socket.events.js`, consumed client-side via `Frontend/src/socket/socket.js`.

**Client → Server**
- `joinConversation` / `leaveConversation`
- `markConversationRead`
- `typing:start` / `typing:stop`

**Server → Client**
- `connect` / `disconnect`
- `newMessage`
- `conversationUpdated`
- `conversationRead`
- `typing:start` / `typing:stop`
- `onlineUsers`
- `messageUpdated` / `messageDeleted`

Socket connections are authenticated and conversation membership is checked server-side (via `permission.service.js`) before allowing a client to join a room or receive updates for it.

## API Reference

The full REST endpoint list (grouped by resource, with auth requirements) is in [`API_REFERENCE.md`](./API_REFERENCE.md). All endpoints are mounted under `/api/v1`.

## Deployment

- **Frontend** is deployed on Vercel: https://dev-link-chi-cyan.vercel.app
- **Backend**: no deployment config (e.g. `render.yaml`, `Procfile`) is present in the repo — deploy it to any Node-compatible host, ensure `CORS_ORIGIN` matches the deployed frontend URL, and point the frontend's `VITE_API_BASE_URL` / `VITE_API_URL` at the deployed backend.
