# 🧾 Expense Tracker Backend

A lightweight **MERN stack** backend for managing daily expenses and incomes — powered by **Node.js**, **Express**, **MongoDB/Postgres**, and **Docker**.

---

## 🚀 Quick Start Guide with Docker

Follow these steps to get your backend up and running quickly using Docker.

---

### 🧩 1️⃣ Pull the Docker Image

```bash
docker pull vpswebdocker/expense-tracker:latest
```
### ⚙️ 2️⃣ Create a .env File

```bash
# JWT Access Token
ACCESS_TOKEN_EXPIRY=1d
ACCESS_TOKEN_SECRET=<your_access_token_secret_here>

# JWT Refresh Token
REFRESH_TOKEN_EXPIRY=15d
REFRESH_TOKEN_SECRET=<your_refresh_token_secret_here>

# CORS and Server
CORS_ORIGIN=http://localhost:5173
PORT=3000

# Database (PostgreSQL)
DATABASE_URL=<your_database_connection_string>

# Google OAuth
GOOGLE_CLIENT_ID=<your_google_client_id>
```

### 🧱 3️⃣ Run the Container

```bash
docker run -d --env-file .env -p 3000:3000 vpswebdocker/expense-tracker:latest
```

