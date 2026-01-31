import express from "express";
import farmsData from "../data/farms.js";
import {
  generateNDVITimeSeries,
  injectDisasterEvent,
  assessNDVIHealth,
} from "../services/ndviGenerator.js";
import {
  storeNDVIData,
  getNDVIHistory,
  getLatestNDVI,
  getAllCurrentNDVI,
  clearNDVIData,
  getNDVIStats,
} from "../data/ndviData.js";

const router = express.Router();

/**
 * GET /api/farms/:id/ndvi
 * Get NDVI history for a specific farm
 */
router.get("/farms/:id/ndvi", (req, res) => {
  try {
    const farmId = parseInt(req.params.id);
    const days = parseInt(req.query.days) || 60;

    const farm = farmsData.find((f) => f.id === farmId);
    if (!farm) {
      return res.status(404).json({ error: "Farm not found" });
    }

    const ndviHistory = getNDVIHistory(farmId, days);

    return res.json({
      farmId,
      farmerName: farm.farmerName,
      crop: farm.crop,
      baselineNDVI: farm.baselineNDVI,
      dataPoints: ndviHistory.length,
      history: ndviHistory,
    });
  } catch (error) {
    console.error("Error fetching NDVI history:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * GET /api/farms/:id/ndvi/latest
 * Get current NDVI reading for a farm
 */
router.get("/farms/:id/ndvi/latest", (req, res) => {
  try {
    const farmId = parseInt(req.params.id);

    const farm = farmsData.find((f) => f.id === farmId);
    if (!farm) {
      return res.status(404).json({ error: "Farm not found" });
    }

    const latestNDVI = getLatestNDVI(farmId);

    if (!latestNDVI) {
      return res.status(404).json({
        error: "No NDVI data available",
        message: "Generate NDVI data using POST /api/ndvi/simulate",
      });
    }

    const healthStatus = assessNDVIHealth(latestNDVI.ndvi, farm.baselineNDVI);

    return res.json({
      farmId,
      farmerName: farm.farmerName,
      latest: latestNDVI,
      health: healthStatus,
    });
  } catch (error) {
    console.error("Error fetching latest NDVI:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * GET /api/ndvi/all
 * Get current NDVI status for all farms
 */
router.get("/ndvi/all", (req, res) => {
  try {
    const allNDVI = getAllCurrentNDVI();

    const enrichedData = allNDVI.map((ndviPoint) => {
      const farm = farmsData.find((f) => f.id === ndviPoint.farmId);
      const health = farm
        ? assessNDVIHealth(ndviPoint.ndvi, farm.baselineNDVI)
        : null;

      return {
        ...ndviPoint,
        farmerName: farm?.farmerName,
        crop: farm?.crop,
        location: farm?.location,
        health,
      };
    });

    return res.json({
      count: enrichedData.length,
      data: enrichedData,
    });
  } catch (error) {
    console.error("Error fetching all NDVI:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * POST /api/ndvi/simulate
 * Generate fake NDVI data for testing
 * Body: { farmId?: number, days?: number }
 */
router.post("/ndvi/simulate", (req, res) => {
  try {
    const { farmId, days = 60 } = req.body;

    let farmsToSimulate = farmsData;

    if (farmId) {
      farmsToSimulate = farmsData.filter((f) => f.id === parseInt(farmId));
      if (farmsToSimulate.length === 0) {
        return res.status(404).json({ error: "Farm not found" });
      }
    }

    let totalGenerated = 0;

    farmsToSimulate.forEach((farm) => {
      const ndviTimeSeries = generateNDVITimeSeries(farm, days);
      storeNDVIData(ndviTimeSeries);
      totalGenerated += ndviTimeSeries.length;
    });

    return res.json({
      success: true,
      message: `Generated NDVI data for ${farmsToSimulate.length} farm(s)`,
      farmsProcessed: farmsToSimulate.length,
      dataPointsGenerated: totalGenerated,
      daysPerFarm: days,
    });
  } catch (error) {
    console.error("Error generating NDVI data:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * POST /api/ndvi/disaster
 * Inject a disaster scenario into existing NDVI data
 * Body: { farmId: number, type: string, startDay: number, duration: number, severity: number }
 */
router.post("/ndvi/disaster", (req, res) => {
  try {
    const {
      farmId,
      type,
      startDay = 10,
      duration = 5,
      severity = 0.8,
    } = req.body;

    if (!farmId) {
      return res.status(400).json({ error: "farmId is required" });
    }

    if (!["flood", "drought", "pest"].includes(type)) {
      return res.status(400).json({
        error: "Invalid disaster type",
        validTypes: ["flood", "drought", "pest"],
      });
    }

    const farm = farmsData.find((f) => f.id === parseInt(farmId));
    if (!farm) {
      return res.status(404).json({ error: "Farm not found" });
    }

    const existingData = getNDVIHistory(farmId, 90);
    if (existingData.length === 0) {
      return res.status(400).json({
        error: "No NDVI data exists for this farm",
        message: "Generate NDVI data first using POST /api/ndvi/simulate",
      });
    }

    const modifiedData = injectDisasterEvent(existingData, {
      type,
      startDay,
      duration,
      severity,
    });

    storeNDVIData(modifiedData);

    return res.json({
      success: true,
      message: `${type} disaster injected into farm ${farmId}`,
      disaster: {
        type,
        farmId,
        farmerName: farm.farmerName,
        startDay,
        duration,
        severity,
        affectedDataPoints: modifiedData.filter(
          (d) => d.weatherCondition === type,
        ).length,
      },
    });
  } catch (error) {
    console.error("Error injecting disaster:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * GET /api/ndvi/stats
 * Get NDVI database statistics
 */
router.get("/ndvi/stats", (req, res) => {
  try {
    const stats = getNDVIStats();
    return res.json(stats);
  } catch (error) {
    console.error("Error fetching NDVI stats:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * DELETE /api/ndvi/clear
 * Clear all NDVI data (for testing)
 */
router.delete("/ndvi/clear", (req, res) => {
  try {
    const result = clearNDVIData();
    return res.json(result);
  } catch (error) {
    console.error("Error clearing NDVI data:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
