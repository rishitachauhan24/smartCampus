import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import {
  fileURLToPath
} from "url";

import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import issueRoutes from "./routes/issueRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import publicRoutes from "./routes/publicRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";


dotenv.config();


const app = express();

const PORT =
  process.env.PORT || 5000;


const __filename =
  fileURLToPath(import.meta.url);

const __dirname =
  path.dirname(__filename);


// MongoDB
await connectDB();


// Middleware
app.use(
  cors({
    origin: (origin, callback) => {
      const configuredOrigin =
        process.env.CLIENT_URL ||
        "http://localhost:5173";

      const isLocalFrontend =
        !origin ||
        origin === configuredOrigin ||
        /^http:\/\/localhost:\d+$/.test(origin) ||
        /^http:\/\/127\.0\.0\.1:\d+$/.test(origin);

      callback(
        isLocalFrontend
          ? null
          : new Error("Origin not allowed by CORS"),
        isLocalFrontend
      );
    },

    credentials: true
  })
);


app.use(
  express.json({
    limit: "1mb"
  })
);


app.use(
  express.urlencoded({
    extended: true
  })
);


// Uploaded images
app.use(
  "/uploads",
  express.static(
    path.join(
      __dirname,
      "uploads"
    )
  )
);


// Home
app.get(
  "/",
  (_req, res) => {

    res.json({

      success: true,

      message:
        "SmartCampus API is running"

    });

  }
);


// Health
app.get(
  "/api/health",
  (_req, res) => {

    res.json({

      success: true,

      message:
        "Server healthy"

    });

  }
);


// Routes
app.use(
  "/api/auth",
  authRoutes
);


app.use(
  "/api/issues",
  issueRoutes
);


app.use(
  "/api/projects",
  projectRoutes
);


app.use(
  "/api/analytics",
  analyticsRoutes
);


app.use(
  "/api/ai",
  aiRoutes
);


app.use(
  "/api/public",
  publicRoutes
);


// 404
app.use(
  (req, res) => {

    res.status(404).json({

      success: false,

      message:
        `Route not found: ${req.method} ${req.originalUrl}`

    });

  }
);


// Error handler
app.use(
  (err, _req, res, _next) => {

    console.error(err);


    if (
      err.code ===
      "LIMIT_FILE_SIZE"
    ) {

      return res.status(400).json({

        success: false,

        message:
          "Image must be 5MB or smaller"

      });

    }


    if (
      err.message?.includes(
        "Only JPG"
      )
    ) {

      return res.status(400).json({

        success: false,

        message: err.message

      });

    }


    res.status(500).json({

      success: false,

      message:
        err.message ||
        "Internal server error"

    });

  }
);


// Start server
app.listen(
  PORT,
  () => {

    console.log(
      `SmartCampus server running on http://localhost:${PORT}`
    );

  }
);