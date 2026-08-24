# 🎨 Draw App

A real-time collaborative whiteboard application inspired by **Excalidraw**, where users can create rooms, join rooms, draw on a shared canvas, and communicate through real-time chat.

The project is built as a **TypeScript monorepo** using **Turborepo and pnpm**, with Next.js applications, Node.js HTTP and WebSocket backends, shared packages, and a PostgreSQL database powered by Prisma.

## ✨ Features

* 🖌️ Interactive drawing canvas
* ✏️ Pencil/freehand drawing
* 🟦 Drawing shapes on the canvas
* 💬 Real-time chat
* 👥 Create and join collaborative rooms
* 🔄 Real-time synchronization using WebSockets
* 🔐 User authentication
* 🎫 JWT-based authorization
* 🔒 Password hashing using bcrypt
* ✅ Request validation using Zod
* 💾 Persistent users, rooms, and chat data
* 🌓 Dark/light mode
* 📱 Responsive frontend
* ⚡ Monorepo architecture using Turborepo
* 🧩 Shared packages for UI, state, types, database, and backend utilities
* 🗄️ PostgreSQL database with Prisma ORM
* 🐳 Docker-based database setup

## 🖼️ Screenshots

### 🏠 Home / Landing Page

<img width="1920" height="1080" alt="Screenshot (6)" src="https://github.com/user-attachments/assets/1b273afb-a2c8-46e3-948e-50f2648fff61" />

### 🔐 Sign In Page

<img width="1920" height="1080" alt="Screenshot (7)" src="https://github.com/user-attachments/assets/2b0f0682-f603-4dac-8a51-3f14e86b995b" />

### 🆕 Sign Up Page

<img width="1920" height="1080" alt="Screenshot (8)" src="https://github.com/user-attachments/assets/beae60c4-19ef-4cc4-831d-890bfc33a219" />

### 🎨 Drawing Canvas

<img width="1920" height="911" alt="Screenshot (11)" src="https://github.com/user-attachments/assets/7676bf77-d17a-4009-a4a0-647cb1b26f2e" />

### 💬 Real-time Chat

<img width="1920" height="1080" alt="Screenshot (10)" src="https://github.com/user-attachments/assets/3c0a124a-3871-49b0-9c9b-786ef1395260" />

## 🛠️ Tech Stack

### Frontend

* **Next.js**
* **React**
* **TypeScript**
* **Tailwind CSS**
* **Axios**
* **Lucide React**
* **Redux Toolkit**

### Backend

* **Node.js**
* **Express.js**
* **WebSocket**
* **TypeScript**
* **JWT**
* **Zod**
* **bcrypt**

### Database

* **PostgreSQL**
* **Prisma ORM**

### Development & Tooling

* **Turborepo**
* **pnpm Workspaces**
* **Docker**
* **ESLint**
* **Prettier**
* **Git & GitHub**

## 🏗️ Architecture

The application uses separate HTTP and WebSocket communication channels.

```text
                         ┌──────────────────────────┐
                         │        Clients           │
                         │                          │
                         │  draw-frontend / web     │
                         └────────────┬─────────────┘
                                      │
                     ┌────────────────┴────────────────┐
                     │                                 │
                  HTTP/REST                         WebSocket
                     │                                 │
                     ▼                                 ▼
          ┌─────────────────────┐          ┌─────────────────────┐
          │    HTTP Backend     │          │   WebSocket Backend │
          │                     │          │                     │
          │ Express + JWT +     │          │ Real-time Events    │
          │ Zod + bcrypt        │          │ Room Communication  │
          └──────────┬──────────┘          └──────────┬──────────┘
                     │                                 │
                     │                                 │
                     └──────────────┬──────────────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │     PostgreSQL      │
                         │                     │
                         │       Prisma        │
                         └─────────────────────┘
```

### Communication Flow

**Authentication & Room APIs**

```text
draw-frontend
      │
      │ HTTP Request
      ▼
http-backend
      │
      ▼
Prisma
      │
      ▼
PostgreSQL
```

**Real-Time Drawing & Collaboration**

```text
User A
   │
   │ WebSocket
   ▼
ws-backend
   │
   ├──────────────► User B
   ├──────────────► User C
   └──────────────► User D
```

**Real-Time Chat**

```text
Client
   │
   │ WebSocket
   ▼
ws-backend
   │
   ├──────────────► Other users
   │
   └──────────────► PostgreSQL
```

## 📁 Project Structure

The project follows a **Turborepo monorepo architecture**.

```text
15-archit-draw-app/
│
├── README.md
├── docker-compose.yml
├── package.json
├── pnpm-workspace.yaml
├── turbo.json
├── .npmrc
│
├── apps/
│   │
│   ├── draw-frontend/
│   │   ├── app/
│   │   │   ├── page.tsx
│   │   │   ├── layout.tsx
│   │   │   ├── canvas/
│   │   │   │   └── [roomid]/
│   │   │   │       └── page.tsx
│   │   │   ├── create-room/
│   │   │   │   └── page.tsx
│   │   │   ├── join-room/
│   │   │   │   └── page.tsx
│   │   │   ├── signin/
│   │   │   │   └── page.tsx
│   │   │   └── signup/
│   │   │       └── page.tsx
│   │   │
│   │   ├── components/
│   │   │   ├── AuthPage.tsx
│   │   │   ├── Canvas.tsx
│   │   │   ├── DarkModeToggle.tsx
│   │   │   ├── Features.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── Header.tsx
│   │   │   ├── Hero.tsx
│   │   │   ├── HowItWorks.tsx
│   │   │   ├── IconButton.tsx
│   │   │   ├── Pricing.tsx
│   │   │   └── RoomCanvas.tsx
│   │   │
│   │   └── draw/
│   │       ├── Game.ts
│   │       ├── http.ts
│   │       └── index.ts
│   │
│   ├── http-backend/
│   │   └── src/
│   │       ├── index.ts
│   │       └── middleware.ts
│   │
│   ├── web/
│   │   ├── app/
│   │   │   ├── page.tsx
│   │   │   └── room/
│   │   │       └── [slug]/
│   │   │           └── page.tsx
│   │   │
│   │   ├── components/
│   │   │   ├── ChatRoom.tsx
│   │   │   └── ChatRoomClient.tsx
│   │   │
│   │   └── hooks/
│   │       └── useSocket.ts
│   │
│   └── ws-backend/
│       └── src/
│           └── index.ts
│
└── packages/
    │
    ├── backend-common/
    │   └── src/
    │       └── index.ts
    │
    ├── common/
    │   └── src/
    │       └── types.ts
    │
    ├── db/
    │   ├── prisma/
    │   │   ├── schema.prisma
    │   │   └── migrations/
    │   │
    │   └── src/
    │       └── index.ts
    │
    ├── eslint-config/
    │   ├── base.js
    │   ├── next.js
    │   └── react-internal.js
    │
    ├── store/
    │   └── src/
    │       ├── store.ts
    │       └── userSlice.ts
    │
    ├── typescript-config/
    │   ├── base.json
    │   ├── nextjs.json
    │   └── react-library.json
    │
    └── ui/
        └── src/
            ├── button.tsx
            ├── card.tsx
            └── code.tsx
```

## 📦 Monorepo Packages

The repository is divided into `apps` and `packages`.

### `apps`

| Application     | Purpose                                                        |
| --------------- | -------------------------------------------------------------- |
| `draw-frontend` | Main collaborative drawing application                         |
| `web`           | Web application containing the real-time chat interface        |
| `http-backend`  | REST API, authentication, room management and protected routes |
| `ws-backend`    | WebSocket server responsible for real-time communication       |

### `packages`

| Package             | Purpose                                   |
| ------------------- | ----------------------------------------- |
| `backend-common`    | Shared backend functionality              |
| `common`            | Shared TypeScript types                   |
| `db`                | Prisma client, schema and database access |
| `eslint-config`     | Shared ESLint configurations              |
| `store`             | Redux store and user state                |
| `typescript-config` | Shared TypeScript configurations          |
| `ui`                | Reusable UI components                    |

This structure allows frontend and backend applications to share common code while keeping each service independent.

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

* **Node.js 18+**
* **pnpm**
* **Docker**
* **Git**

### 1. Clone the repository

```bash
git clone https://github.com/15-archit/Draw-app.git
cd Draw-app
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Configure environment variables

Create the required `.env` files for the database and backend configuration.

Example:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/drawapp"
JWT_SECRET="your-secret-key"
```

> Do not commit your `.env` files or secret keys to GitHub.

### 4. Start PostgreSQL

The project includes a Docker Compose configuration.

```bash
docker compose up -d
```

### 5. Generate Prisma Client

```bash
pnpm prisma generate
```

### 6. Run database migrations

```bash
pnpm prisma migrate dev
```

### 7. Start the development servers

From the root directory:

```bash
pnpm dev
```

Turborepo will run the development tasks configured for the workspace.

## 🔐 Authentication

The application uses **JWT-based authentication**.

The authentication flow is:

```text
                    Signup
                       │
                       ▼
                Validate Input
                       │
                       ▼
                Hash Password
                   bcrypt
                       │
                       ▼
                  PostgreSQL


                    Signin
                       │
                       ▼
                Validate User
                       │
                       ▼
                  Generate JWT
                       │
                       ▼
                    Client
                       │
                       ▼
             Authenticated Requests
```

### Authentication Components

* **Zod** validates incoming request data.
* **bcrypt** securely hashes passwords.
* **JWT** is used to authenticate users.
* Authentication middleware protects restricted API routes.

The HTTP authentication middleware is located at:

```text
apps/http-backend/src/middleware.ts
```

## 🔄 Real-Time Collaboration

The application uses **WebSockets** for real-time communication.

The WebSocket server is located at:

```text
apps/ws-backend/src/index.ts
```

When a user performs an action on the canvas, the event can be sent to the WebSocket server and distributed to other users in the same room.

```text
                  User A
                    │
                    │ Drawing Event
                    ▼
             WebSocket Server
                    │
          ┌─────────┼─────────┐
          │         │         │
          ▼         ▼         ▼
       User A     User B     User C
                   │         │
                   └────┬────┘
                        │
                   Same Room
```

This enables collaborative drawing without requiring users to refresh the page.

## 💬 Real-Time Chat

The chat functionality is implemented using WebSockets.

Relevant files include:

```text
apps/web/

├── components/
│   ├── ChatRoom.tsx
│   └── ChatRoomClient.tsx
│
└── hooks/
    └── useSocket.ts
```

The general flow is:

```text
Client
   │
   │ Chat Message
   ▼
WebSocket Server
   │
   ├──────────────► Users in Room
   │
   ▼
PostgreSQL
```

## 🗄️ Database Models

The application uses **PostgreSQL** with **Prisma ORM**.

Database-related code is centralized inside:

```text
packages/db/
```

The Prisma schema is located at:

```text
packages/db/prisma/schema.prisma
```

The main entities include:

```text
User
 │
 ├── id
 ├── name
 ├── username
 ├── email
 └── password

Room
 │
 ├── id
 ├── slug
 └── adminId

Chat
 │
 ├── id
 ├── roomId
 └── message
```

The basic relationship is:

```text
        ┌─────────────┐
        │    User     │
        └──────┬──────┘
               │
               │ creates
               ▼
        ┌─────────────┐
        │    Room     │
        └──────┬──────┘
               │
               │ contains
               ▼
        ┌─────────────┐
        │    Chat     │
        └─────────────┘
```

## 🧩 Shared State

Global user-related state is managed through the shared `store` package:

```text
packages/store/

└── src/
    ├── store.ts
    └── userSlice.ts
```

This allows application-level state such as user information and authentication-related data to be shared across components.

## 🧱 Shared UI Components

Reusable UI components are maintained inside:

```text
packages/ui/
```

Current shared components include:

```text
packages/ui/src/

├── button.tsx
├── card.tsx
└── code.tsx
```

This avoids duplicating common UI components across applications.

## 🐳 Docker

Docker is used to simplify local database setup.

Start the containers:

```bash
docker compose up -d
```

Stop the containers:

```bash
docker compose down
```

Check running containers:

```bash
docker ps
```

## 🧪 Available Scripts

Run these commands from the project root:

```bash
# Install dependencies
pnpm install

# Start development servers
pnpm dev

# Build all applications and packages
pnpm build

# Run linting
pnpm lint

# Check TypeScript types
pnpm check-types

# Format the codebase
pnpm format
```

## 🧠 Key Concepts Implemented

### Frontend

* React component architecture
* Next.js App Router
* Dynamic routes
* Client-side state management
* Canvas API
* REST API integration
* WebSocket client communication
* Responsive UI
* Dark/light mode

### Backend

* REST API development
* Express.js
* WebSocket server
* JWT authentication
* Authentication middleware
* Zod validation
* Password hashing with bcrypt
* Real-time event broadcasting

### Database

* PostgreSQL
* Prisma ORM
* Database migrations
* Relational data modeling
* User-room-chat relationships

### Architecture

* Monorepo architecture
* Turborepo
* pnpm Workspaces
* Shared packages
* HTTP + WebSocket communication
* Separation of frontend and backend services
* Shared state management

## 🧩 Why Turborepo?

Turborepo is used to manage the multiple applications and shared packages in the repository.

The monorepo provides:

* ♻️ Code reusability
* 📦 Shared packages
* ⚡ Faster development workflows
* 🏗️ Better project organization
* 🔄 Consistent configurations
* 🧩 Easier dependency management
* 🚀 Scalable project structure

## 📌 Future Improvements

Some features planned for future development:

* [ ] Undo/redo functionality
* [ ] Eraser tool
* [ ] Selection and move tools
* [ ] Text tool
* [ ] More geometric shapes
* [ ] Line and arrow tools
* [ ] Canvas zoom and pan
* [ ] Export canvas as PNG/SVG
* [ ] Persistent canvas drawings
* [ ] Cursor presence for other users
* [ ] User avatars
* [ ] Room invitation links
* [ ] Improved mobile experience
* [ ] Rate limiting and additional security
* [ ]  gRPC for faster backend communication
* [ ] Production deployment
* [ ] Redis-based WebSocket scaling
* [ ] Horizontal WebSocket server scaling

## 🎯 What I Learned

Building this project helped me understand and implement:

* Real-time communication using WebSockets
* JWT authentication and authorization
* REST API development
* Database design with PostgreSQL
* Prisma ORM
* React and Next.js
* Canvas-based drawing
* Redux state management
* TypeScript in a full-stack application
* Monorepo architecture with Turborepo
* pnpm workspaces
* Docker-based development environments
* Client-server communication
* Real-time event synchronization
* Shared packages and code reuse
* Separation of HTTP and WebSocket services

## 👨‍💻 Author

**Archit Vats**

Full-Stack Developer | React | Next.js | Node.js | TypeScript

---

⭐ If you found this project useful, consider giving it a star!
