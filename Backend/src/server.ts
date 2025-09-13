// Even though prisma.$connect() isn’t required (Prisma will auto-connect), in production it’s recommended to do this at startup

import app from "./app.js";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;

async function startServer() {
  try {
    await prisma.$connect();
    console.log("✅ Database connected");

    const server = app.listen(port, () => {
      console.log(`🚀 Express server running on port ${port}`);
    });

    // Graceful shutdown
    process.on("SIGTERM", async () => {
      console.log("SIGTERM received: shutting down gracefully...");
      await prisma.$disconnect();
      server.close(() => process.exit(0));
    });

    process.on("SIGINT", async () => {
      console.log("SIGINT received: shutting down gracefully...");
      await prisma.$disconnect();
      server.close(() => process.exit(0));
    });
  } catch (err) {
    console.error("❌ Could not start server:", err);
    process.exit(1);
  }
}

startServer();
