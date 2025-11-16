# 📦 Expense Tracker -- Docker Development Setup

A full-stack **Expense Tracker** application powered by:

-   **Frontend:** Vite + React\
-   **Backend:** Node.js + Prisma\
-   **Database:** PostgreSQL\
-   **Runtime:** Docker & Docker Compose

This guide walks you through installing, configuring, and running the
entire application using Docker.

## 📑 Table of Contents

-   Project Structure
-   Prerequisites
-   Environment Variables
-   Running the Application
-   Available Commands
-   Application URLs
-   Auto-Restart Behavior
-   Troubleshooting
-   License

## 📁 Project Structure

    Expense-Tracker/
    │
    ├── Frontend/
    │   ├── Dockerfile.dev
    │   ├── .env
    │
    ├── Backend/
    │   ├── Dockerfile.dev
    │   ├── prisma/
    │   ├── .env
    │
    └── docker-compose.yml

## 📌 Prerequisites

Make sure you have the following installed:

-   Git
-   Docker Desktop
-   Docker Compose (v2+ included in Docker Desktop)

## 🔧 Environment Variables

You must create `.env` files for the frontend and backend.

### Backend `.env`

    # JWT Access Token
    ACCESS_TOKEN_EXPIRY=1d
    ACCESS_TOKEN_SECRET=<your_access_token_secret_here>

    # JWT Refresh Token
    REFRESH_TOKEN_EXPIRY=15d
    REFRESH_TOKEN_SECRET=<your_refresh_token_secret_here>

    # CORS
    CORS_ORIGIN=http://localhost:5173

    # Server
    PORT=3000

    # Database (PostgreSQL)
    DATABASE_URL=<your_database_connection_string>

    # Google OAuth
    GOOGLE_CLIENT_ID=<your_google_client_id>

### Frontend `.env`

    VITE_API_URL=http://localhost:3000/
    VITE_GOOGLE_CLIENT_ID=42m02pu7403od.apps.googleusercontent.com

## 🐳 Running the Application

    docker compose up --build -d

## ▶️ Application URLs

  Service    URL
  ---------- -----------------------
  Frontend   http://localhost:5173
  Backend    http://localhost:3000

## 🔁 Available Commands

Rebuild:

    docker compose up --build -d

Stop:

    docker compose down

Logs:

    docker logs expense-backend -f

## ♻️ Auto-Restart Behavior

    restart: unless-stopped

## 🧪 Troubleshooting

### API not working

Check backend logs:

    docker logs expense-backend

### Blank frontend

Verify:

    VITE_API_URL=http://localhost:3000/

## 📜 License

Add your license here.
