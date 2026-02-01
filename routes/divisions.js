import express from "express";
import farmsData from "../data/farms.js";

const router = express.Router();

/**
 * Get distinct list of districts
 */
router.get("/divisions/districts", (req, res) => {
  try {
    const districts = [
      ...new Set(
        farmsData.map((f) => f.administrativeData?.district).filter(Boolean),
      ),
    ];
    res.json({ success: true, count: districts.length, data: districts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * Get distinct list of tehsils in a district
 */
router.get("/divisions/tehsils", (req, res) => {
  const { district } = req.query;
  try {
    let farms = farmsData;
    if (district) {
      farms = farms.filter((f) => f.administrativeData?.district === district);
    }

    const tehsils = [
      ...new Set(
        farms.map((f) => f.administrativeData?.tehsil).filter(Boolean),
      ),
    ];
    res.json({ success: true, count: tehsils.length, data: tehsils });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * Get distinct list of villages in a tehsil
 */
router.get("/divisions/villages", (req, res) => {
  const { tehsil } = req.query;
  try {
    let farms = farmsData;
    if (tehsil) {
      farms = farms.filter((f) => f.administrativeData?.tehsil === tehsil);
    }

    const villages = [
      ...new Set(
        farms.map((f) => f.administrativeData?.village).filter(Boolean),
      ),
    ];
    res.json({ success: true, count: villages.length, data: villages });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * Filter farms by administrative division
 * Supports pagination and search
 */
router.get("/farms/by-division", (req, res) => {
  const { district, tehsil, village, search, page = 1, limit = 50 } = req.query;

  try {
    let filteredFarms = farmsData;

    // Apply administrative filters
    if (district) {
      filteredFarms = filteredFarms.filter(
        (f) => f.administrativeData?.district === district,
      );
    }
    if (tehsil) {
      filteredFarms = filteredFarms.filter(
        (f) => f.administrativeData?.tehsil === tehsil,
      );
    }
    if (village) {
      filteredFarms = filteredFarms.filter(
        (f) => f.administrativeData?.village === village,
      );
    }

    // Apply search filter (farmer name, case-insensitive)
    if (search) {
      const searchLower = search.toLowerCase();
      filteredFarms = filteredFarms.filter((f) =>
        f.farmerName.toLowerCase().includes(searchLower),
      );
    }

    // Calculate pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const total = filteredFarms.length;
    const totalPages = Math.ceil(total / limitNum);
    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = startIndex + limitNum;

    // Apply pagination
    const paginatedFarms = filteredFarms.slice(startIndex, endIndex);

    res.json({
      success: true,
      count: paginatedFarms.length,
      total: total,
      page: pageNum,
      limit: limitNum,
      totalPages: totalPages,
      data: paginatedFarms,
      filters: { district, tehsil, village, search },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * Get statistics by administrative division
 */
router.get("/divisions/stats", (req, res) => {
  try {
    const stats = {
      district: {},
      tehsil: {},
    };

    // Group by District
    farmsData.forEach((farm) => {
      const dist = farm.administrativeData?.district || "Unknown";
      const tehsil = farm.administrativeData?.tehsil || "Unknown";

      // District stats
      if (!stats.district[dist]) {
        stats.district[dist] = { count: 0, area: 0 };
      }
      stats.district[dist].count++;
      stats.district[dist].area += farm.area || 0;

      // Tehsil stats
      if (!stats.tehsil[tehsil]) {
        stats.tehsil[tehsil] = { count: 0, area: 0, district: dist };
      }
      stats.tehsil[tehsil].count++;
      stats.tehsil[tehsil].area += farm.area || 0;
    });

    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
