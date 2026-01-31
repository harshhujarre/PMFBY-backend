import express from "express";
import {
  getAllFarms,
  getFarmById,
  getFarmsByLocation,
  getFarmsByCrop,
} from "../controller/farmsController.js";

const router = express.Router();

// GET /api/farms - Get all farms
router.get("/", getAllFarms);

// GET /api/farms/:id - Get farm by ID
router.get("/:id", getFarmById);

// GET /api/farms/location/:location - Get farms by location
router.get("/location/:location", getFarmsByLocation);

// GET /api/farms/crop/:crop - Get farms by crop
router.get("/crop/:crop", getFarmsByCrop);

export default router;
