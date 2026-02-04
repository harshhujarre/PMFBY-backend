import express from "express";
import cors from "cors";
import cron from "node-cron";
import farmsRoutes from "./routes/farmsRoutes.js";
import ndviRoutes from "./routes/ndvi.js";
import alertRoutes from "./routes/alerts.js";
import divisionRoutes from "./routes/divisions.js";
import claimsRoutes from "./routes/claims.js";
import { monitorAllFarms } from "./services/ndviMonitor.js";

const app = express();
const PORT = process.env.PORT || 3000;

// CORS Configuration - Allow localhost and production Vercel URL
const allowedOrigins = [
  "https://pmfby-ten.vercel.app/",
  "https://pmfby-ten.vercel.app",
  "http://localhost:3001", 
  process.env.FRONTEND_URL, // Vercel production URL
].filter(Boolean); // Remove undefined values

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (mobile apps, curl, etc)
      if (!origin) return callback(null, true);

      // Check if origin is in allowed list or is a Vercel preview URL
      if (allowedOrigins.includes(origin) || origin.endsWith(".vercel.app")) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);

app.use(express.json());

// Health Check Route (for Render deployment)
app.get("/api/health", (req, res) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
  });
});

// API Routes
app.use("/api", divisionRoutes); // Administrative Division routes - MUST be before farmsRoutes to avoid collision with /:id
app.use("/api/farms", farmsRoutes);
app.use("/api", ndviRoutes); // NDVI routes
app.use("/api", alertRoutes); // Alert & Monitoring routes
app.use("/api", claimsRoutes); // Claims & Approval routes

// Root route
app.get("/", (req, res) => {
  res.json({ message: "PMFBY API Server is running" });
});

// Cron Job: NDVI Monitoring
// In real life, satellite data updates every 3 days
// For demo: Run every 5 minutes to show real-time alerts
// Pattern: '*/5 * * * *' = every 5 minutes
// Pattern: '0 0 */3 * *' = every 3 days at midnight (production)
cron.schedule("*/5 * * * *", () => {
  console.log("\n🛰️  [Cron] Running scheduled NDVI monitoring check...");
  try {
    const results = monitorAllFarms();
    console.log(
      `✅ [Cron] Monitoring completed - ${results.farmsChecked} farms checked, ${results.alertsGenerated} alerts generated\n`,
    );
  } catch (error) {
    console.error("❌ [Cron] Monitoring failed:", error.message);
  }
});

app.listen(PORT, () => {
  console.log(`🌾 PMFBY API Server is running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
  console.log("📡 NDVI Monitoring: Every 5 minutes (demo mode)");
  console.log(
    "💡 Tip: Change to '0 0 */3 * *' for 3-day production schedule\n",
  );
});
