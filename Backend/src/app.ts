import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { errorHandler } from "./middleware/errorHandler.middleware.js";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//ROUTES
import userRoutes from "./routes/user.routes.js";

app.use("/api/v1/user", userRoutes);

app.get("/", (req, res) => {
  res.send("Hello World 👋, I'm Expenses Server");
});

app.use(errorHandler)

export default app;
