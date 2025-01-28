import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import TestRouter from "./routes/test.router.js";
import LoginRouter from "./routes/login.route.js";
import SignupRouter from "./routes/signup.route.js";
import LogoutRouter from "./routes/logout.route.js";
import cookieParser from "cookie-parser";
import AddPostRouter from "./routes/AddPost.routes.js";
import GetPostRouter from "./routes/GetPost.route.js";

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

// Database Connection
connectDB();

// Middleware
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// Routes
app.use("/", TestRouter);
app.use("/user/login", LoginRouter);
app.use("/user/signup", SignupRouter);
app.use("/user/logout", LogoutRouter);
app.use("/dashboard", AddPostRouter);
app.use("/dashboard", GetPostRouter);
app.use("/dashboard", GetPostRouter);

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});

// Start Server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
