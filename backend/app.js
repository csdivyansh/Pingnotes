import express, { urlencoded } from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import cors from "cors";
import passport from "passport";

// Import routes
import rootRoutes from "./routes/root.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import userRoutes from "./routes/user.routes.js";
import groupRoutes from "./routes/group.routes.js";
import teacherRoutes from "./routes/teacher.routes.js";
import noteRoutes from "./routes/note.routes.js";
import subjectRoutes from "./routes/subject.routes.js";
import authRoutes from "./routes/auth.routes.js";
import fileRoutes from "./routes/file.routes.js";
import stripeRoutes from "./routes/stripe.routes.js";
import miscRoutes from "./routes/misc.routes.js";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
// Connect to database
await connectDB();

// CORS configuration for separated frontend/backend
const corsOptions = {
  origin: process.env.FRONTEND_URL || "https://pingnotes.vercel.app",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  maxAge: 86400,
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json({ limit: "50mb" }));
app.use(urlencoded({ extended: true, limit: "50mb" }));

// Initialize Passport
app.use(passport.initialize());

// API Routes
app.use("/", rootRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/users", userRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/subjects", subjectRoutes);
app.use("/api/groups", groupRoutes);
app.use("/api/teachers", teacherRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/files", fileRoutes);
app.use("/api/stripe", stripeRoutes);
app.use("/api/misc", miscRoutes);

// 404 handler for undefined routes
app.use((req, res) => {
  res.status(404).json({
    message: `Route ${req.originalUrl} not found`,
    error: "Not Found",
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error("Error:", error);
  res.status(500).json({
    message: "Internal server error",
    error:
      process.env.NODE_ENV === "development"
        ? error.message
        : "Something went wrong",
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📚 PingNotes API ready at http://localhost:${PORT}`);
});
