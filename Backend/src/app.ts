import express from "express";
import cors from "cors";
import dotenv from "dotenv";

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
// import userRoutes from "./routes/user.routes.js";

// app.use("/api/v1/users", userRoutes);

app.get("/", (req, res) => {
  res.send("Hello World 👋, I'm Expenses Server");
});

export default app;
