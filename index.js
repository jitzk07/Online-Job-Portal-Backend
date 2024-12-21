import express from "express";
import cors from "cors";
import { config } from "dotenv";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import { dbConnection } from "./database/dbConnection.js";
import jobRouter from "./routes/jobRoutes.js";
import userRouter from "./routes/userRoutes.js";
import applicationRouter from "./routes/applicationRoutes.js";
import { errorMiddleware } from "./middlewares/error.js";

// Load Environment Variables
config({ path: "./config/config.env" });

const app = express();
const allowedOrigins = ['http://localhost:5173', 'http://localhost:5174','http://localhost:5175','https://job-portal-jk07.netlify.app'];

// CORS Middleware with allowed origins
app.use(
  cors({
    origin: (origin, callback) => {
      if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
        callback(null, origin); // Allow requests from allowed origins or no origin (Postman/testing)
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true, // Allow credentials (cookies, authorization headers)
  })
);

// Middleware
app.use(cookieParser());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

// Routes
app.use("/api/v1/user", userRouter);
app.use("/api/v1/job", jobRouter);
app.use("/api/v1/application", applicationRouter);

// Error Handling Middleware
app.use(errorMiddleware);

// Connect Database and Start Server
dbConnection();

export default app;
