import express from "express";
import cors from "cors";
import farmsRoutes from "./routes/farmsRoutes.js";
import ndviRoutes from "./routes/ndvi.js";

const app = express();
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:3001",
    ],
    credentials: true,
  }),
);

app.use(express.json());

// API Routes
app.use("/api/farms", farmsRoutes);
app.use("/api", ndviRoutes); // NDVI routes

// Health check route
app.get("/", (req, res) => {
  res.json({ message: "PMFBY API Server is running" });
});

app.listen(3000, () => {
  console.log("server is running on port 3000");
});
