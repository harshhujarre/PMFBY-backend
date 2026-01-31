import farmsData from "../data/farms.js";

// Get all farms
export const getAllFarms = (req, res) => {
  try {
    res.status(200).json({
      success: true,
      count: farmsData.length,
      data: farmsData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// Get farm by ID
export const getFarmById = (req, res) => {
  try {
    const { id } = req.params;
    const farm = farmsData.find((f) => f.id === parseInt(id));

    if (!farm) {
      return res.status(404).json({
        success: false,
        message: `Farm not found with id: ${id}`,
      });
    }

    res.status(200).json({
      success: true,
      data: farm,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// Get farms by location
export const getFarmsByLocation = (req, res) => {
  try {
    const { location } = req.params;
    const farms = farmsData.filter(
      (f) => f.location.toLowerCase() === location.toLowerCase(),
    );

    if (farms.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No farms found in location: ${location}`,
      });
    }

    res.status(200).json({
      success: true,
      count: farms.length,
      data: farms,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// Get farms by crop
export const getFarmsByCrop = (req, res) => {
  try {
    const { crop } = req.params;
    const farms = farmsData.filter(
      (f) => f.crop.toLowerCase() === crop.toLowerCase(),
    );

    if (farms.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No farms found growing crop: ${crop}`,
      });
    }

    res.status(200).json({
      success: true,
      count: farms.length,
      data: farms,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};
