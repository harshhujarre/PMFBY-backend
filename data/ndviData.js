/**
 * In-memory storage for NDVI time series data
 * In production, this would be a MongoDB/PostgreSQL database
 */

let ndviDatabase = [];

/**
 * Store NDVI data points
 * @param {Array} ndviDataPoints - Array of NDVI data to store
 */
export function storeNDVIData(ndviDataPoints) {
  // Remove existing data for the same farm and dates to avoid duplicates
  const farmIds = new Set(ndviDataPoints.map((d) => d.farmId));
  ndviDatabase = ndviDatabase.filter((d) => !farmIds.has(d.farmId));

  // Add new data
  ndviDatabase.push(...ndviDataPoints);

  // Sort by timestamp
  ndviDatabase.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

  return { success: true, count: ndviDataPoints.length };
}

/**
 * Get NDVI history for a specific farm
 * @param {number} farmId - Farm ID
 * @param {number} days - Number of days to retrieve (default: 60)
 * @returns {Array} NDVI data points
 */
export function getNDVIHistory(farmId, days = 60) {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);

  return ndviDatabase
    .filter((d) => d.farmId === farmId && new Date(d.timestamp) >= cutoffDate)
    .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
}

/**
 * Get latest NDVI reading for a farm
 * @param {number} farmId - Farm ID
 * @returns {Object|null} Latest NDVI data point
 */
export function getLatestNDVI(farmId) {
  const farmData = ndviDatabase
    .filter((d) => d.farmId === farmId)
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  return farmData.length > 0 ? farmData[0] : null;
}

/**
 * Get current NDVI status for all farms
 * @returns {Array} Array of latest NDVI for each farm
 */
export function getAllCurrentNDVI() {
  const latestByFarm = {};

  ndviDatabase.forEach((dataPoint) => {
    const existing = latestByFarm[dataPoint.farmId];
    if (
      !existing ||
      new Date(dataPoint.timestamp) > new Date(existing.timestamp)
    ) {
      latestByFarm[dataPoint.farmId] = dataPoint;
    }
  });

  return Object.values(latestByFarm);
}

/**
 * Clear all NDVI data (for testing)
 */
export function clearNDVIData() {
  ndviDatabase = [];
  return { success: true, message: "All NDVI data cleared" };
}

/**
 * Get NDVI statistics
 */
export function getNDVIStats() {
  return {
    totalDataPoints: ndviDatabase.length,
    farmsTracked: new Set(ndviDatabase.map((d) => d.farmId)).size,
    dateRange: {
      oldest:
        ndviDatabase.length > 0
          ? new Date(
              Math.min(...ndviDatabase.map((d) => new Date(d.timestamp))),
            )
          : null,
      newest:
        ndviDatabase.length > 0
          ? new Date(
              Math.max(...ndviDatabase.map((d) => new Date(d.timestamp))),
            )
          : null,
    },
  };
}

export default {
  storeNDVIData,
  getNDVIHistory,
  getLatestNDVI,
  getAllCurrentNDVI,
  clearNDVIData,
  getNDVIStats,
};
