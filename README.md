# 🎨 Draw App

A real-time collaborative whiteboard application inspired by **Excalidraw**, where users can create rooms and draw together on a shared canvas in real time.

The project is built as a **TypeScript monorepo** using Turborepo and pnpm, with a Next.js frontend, Node.js WebSocket backend, and PostgreSQL database powered by Prisma.

## ✨ Features

* 🖌️ Interactive drawing canvas
* ✏️ Pencil/freehand drawing
* 🟦 Drawing shapes on the canvas
* 💬 Real-time chat
* 👥 Create and join collaborative rooms
* 🔄 Real-time synchronization using WebSockets
* 🔐 User authentication
* 🎫 JWT-based authorization
* 💾 Persistent users, rooms, and chat data
* 📱 Responsive frontend
* ⚡ Monorepo architecture using Turborepo
* 🗄️ PostgreSQL database with Prisma ORM

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

### Development Tools

* **Turborepo**
* **pnpm**
* **Docker**
* **Git & GitHub**

## 🏗️ Architecture

```text
                    ┌──────────────────────┐
                    │      Next.js App     │
                    │      Frontend        │
                    └──────────┬───────────┘
                               │
                    HTTP / REST API
                               │
                               ▼
                    ┌──────────────────────┐
                    │    Node.js Backend   │
                    │   Express + JWT       │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │      PostgreSQL       │
                    │       Prisma ORM      │
                    └──────────────────────┘

                               │
                               │ WebSocket
                               ▼
                    ┌──────────────────────┐
                    │   WebSocket Server   │
                    │ Real-time Updates    │
                    └──────────────────────┘
```

## 📁 Project Structure

```text
draw-app/
│
├── apps/
│   ├── draw-frontend/       # Next.js frontend
│   ├── http-backend/        # REST API backend
│   └── ws-backend/          # WebSocket server
│
├── packages/
│   ├── ui/                  # Shared UI components
│   ├── db/                  # Prisma/database package
│   └── ...                  # Shared packages
│
├── package.json
├── pnpm-workspace.yaml
├── turbo.json
└── README.md
```

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/15-archit/Draw-app
cd draw-app
```

### 2. Install dependencies

Make sure you have **Node.js 18+** and **pnpm** installed.

```bash
pnpm install
```

### 3. Configure environment variables

Create the required `.env` files for the backend/database configuration.

Example:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/drawapp"
JWT_SECRET="your-secret-key"
```

> Do not commit your `.env` files to GitHub.

### 4. Start PostgreSQL

If you're using Docker:

```bash
docker compose up -d
```

### 5. Run Prisma

Generate the Prisma client:

```bash
pnpm prisma generate
```

Run database migrations:

```bash
pnpm prisma migrate dev
```

### 6. Start the development servers

From the root directory:

```bash
pnpm dev
```

The frontend, HTTP backend, and WebSocket server will start according to the project's configured scripts.

## 🔐 Authentication

The application uses **JWT-based authentication**.

The authentication flow is approximately:

```text
User
 │
 ├── Signup
 │      │
 │      ▼
 │   Password hashed
 │      │
 │      ▼
 │   PostgreSQL
 │
 └── Signin
        │
        ▼
     JWT Token
        │
        ▼
   Authenticated Requests
```

Passwords are hashed using `bcrypt`, while JWTs are used to authenticate protected API and WebSocket requests.

## 🔄 Real-Time Collaboration

The application uses **WebSockets** to provide real-time communication between users.

When a user performs an action on the canvas:

```text
User A
  │
  │ Draws
  ▼
WebSocket Server
  │
  │ Broadcasts event
  ├──────────────► User B
  ├──────────────► User C
  └──────────────► User D
```

This allows multiple users inside the same room to see updates without manually refreshing the page.

## 💬 Real-Time Chat

Users inside a room can also communicate using the built-in chat functionality.

Messages are sent through the WebSocket connection and persisted in PostgreSQL.

```text
Client
  │
  │ chat message
  ▼
WebSocket Server
  │
  ├──► Broadcast to room
  │
  └──► Save to PostgreSQL
```

## 🗄️ Database Models

The application uses Prisma with PostgreSQL.

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

Users can create rooms, rooms have administrators, and chat messages belong to rooms.

## 🧩 Monorepo

The project uses **Turborepo** and **pnpm workspaces** to manage multiple applications and shared packages.

This provides:

* Shared TypeScript configurations
* Reusable UI components
* Centralized database package
* Faster development workflows
* Better code organization
* Easier management of frontend and backend applications

## 🧪 Available Scripts

From the root directory:

```bash
# Start development servers
pnpm dev

# Build the project
pnpm build

# Run linting
pnpm lint

# Check TypeScript types
pnpm check-types

# Format code
pnpm format
```

## 📌 Future Improvements

Some features that can be added in future:

* [ ] Undo/redo functionality
* [ ] Eraser tool
* [ ] Selection and move tools
* [ ] Text tool
* [ ] More geometric shapes
* [ ] Export canvas as PNG/SVG
* [ ] Persistent canvas drawings
* [ ] Cursor presence for other users
* [ ] User avatars
* [ ] Room invitation links
* [ ] Improved mobile experience
* [ ] Rate limiting and additional security
* [ ] Production deployment

## 🎯 What I Learned

Building this project helped me understand and implement:

* Real-time communication using WebSockets
* JWT authentication and authorization
* REST API development
* Database design with PostgreSQL
* Prisma ORM
* React and Next.js
* Canvas-based drawing
* State management
* TypeScript in a full-stack application
* Monorepo architecture with Turborepo
* pnpm workspaces
* Docker-based development environments
* Client-server communication
* Handling real-time events and synchronization

## 👨‍💻 Author

**Archit Vats**

Full-Stack Developer | React | Next.js | Node.js | TypeScript

---

⭐ If you found this project useful, consider giving it a star!
