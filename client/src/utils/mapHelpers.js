/**
 * PMFBY Map Helpers & Farm Health Utilities
 * Helper functions for map visualization and farm health color coding
 */

/**
 * Convert farms array to GeoJSON format for MapLibre
 * NOTE: Farms data has coordinates as [latitude, longitude]
 * but GeoJSON requires [longitude, latitude] - we swap them here
 */
export function farmsToGeoJSON(farms) {
  return {
    type: "FeatureCollection",
    features: farms.map((farm) => {
      // Get coordinates and swap [lat, lng] to [lng, lat]
      const coords = farm.polygon.map((coord) => [coord[1], coord[0]]);

      // GeoJSON requires the first and last point to be identical (closed loop)
      if (
        coords.length > 0 &&
        (coords[0][0] !== coords[coords.length - 1][0] ||
          coords[0][1] !== coords[coords.length - 1][1])
      ) {
        coords.push(coords[0]);
      }

      return {
        type: "Feature",
        properties: {
          id: farm.id,
          farmerName: farm.farmerName,
          crop: farm.crop,
          location: farm.location,
          cropType: farm.cropType,
          area: farm.area,
          baselineNDVI: farm.baselineNDVI,
          insuranceValue: farm.insuranceValue,
        },
        geometry: {
          type: "Polygon",
          coordinates: [coords],
        },
      };
    }),
  };
}

/**
 * Get farms visible in current map viewport
 */
export function getVisibleFarms(farms, bounds) {
  return farms.filter((farm) => {
    const farmCenter = calculatePolygonCenter(farm.polygon);
    return bounds.contains([farmCenter.lng, farmCenter.lat]);
  });
}

/**
 * Calculate center point of a polygon
 */
function calculatePolygonCenter(polygon) {
  let sumLat = 0,
    sumLng = 0;
  polygon.forEach((coord) => {
    sumLat += coord[0]; // latitude
    sumLng += coord[1]; // longitude
  });
  return {
    lat: sumLat / polygon.length,
    lng: sumLng / polygon.length,
  };
}

/**
 * Determine farm health status based on NDVI reading
 * @param {number} currentNDVI - Current NDVI value
 * @param {number} baselineNDVI - Baseline (healthy) NDVI value
 * @returns {Object} - Health status and color
 */
export function getFarmHealthStatus(currentNDVI, baselineNDVI) {
  if (!currentNDVI || !baselineNDVI) {
    return {
      status: "no-data",
      color: "#9E9E9E", // Gray
      fillColor: "#BDBDBD",
      opacity: 0.3,
      label: "No Data",
      severity: 0,
    };
  }

  const percentage = (currentNDVI / baselineNDVI) * 100;

  if (percentage >= 80) {
    // Healthy: NDVI > 80% of baseline
    return {
      status: "healthy",
      color: "#4A7C4E", // Deep crop green
      fillColor: "#5A9560",
      opacity: 0.6,
      label: "Healthy",
      severity: 1,
      pulse: false,
    };
  } else if (percentage >= 60) {
    // Warning: NDVI 60-80% of baseline
    return {
      status: "warning",
      color: "#F59E0B", // Amber/Yellow
      fillColor: "#FCD34D",
      opacity: 0.6,
      label: "Warning",
      severity: 2,
      pulse: false,
    };
  } else if (percentage >= 40) {
    // Critical: NDVI 40-60% of baseline
    return {
      status: "critical",
      color: "#FB923C", // Orange
      fillColor: "#FDBA74",
      opacity: 0.7,
      label: "Critical",
      severity: 3,
      pulse: true,
    };
  } else {
    // Severe: NDVI < 40% of baseline
    return {
      status: "severe",
      color: "#DC2626", // Red
      fillColor: "#F87171",
      opacity: 0.8,
      label: "Severe",
      severity: 4,
      pulse: true,
    };
  }
}

/**
 * Get color gradient for NDVI value display
 * @param {number} ndvi - NDVI value (0-1)
 * @returns {string} - Color hex code
 */
export function getNDVIColor(ndvi) {
  if (ndvi >= 0.7) return "#22c55e"; // Green
  if (ndvi >= 0.5) return "#84cc16"; // Lime
  if (ndvi >= 0.3) return "#eab308"; // Yellow
  if (ndvi >= 0.2) return "#f97316"; // Orange
  return "#ef4444"; // Red
}

/**
 * Create farm health legend data
 * @returns {Array} - Legend items
 */
export function getFarmHealthLegend() {
  return [
    { status: "healthy", color: "#4A7C4E", label: "Healthy (>80%)", icon: "✓" },
    {
      status: "warning",
      color: "#F59E0B",
      label: "Warning (60-80%)",
      icon: "⚠",
    },
    {
      status: "critical",
      color: "#FB923C",
      label: "Critical (40-60%)",
      icon: "!",
    },
    { status: "severe", color: "#DC2626", label: "Severe (<40%)", icon: "🚨" },
    { status: "no-data", color: "#9E9E9E", label: "No Data", icon: "?" },
  ];
}

/**
 * Format NDVI value for display
 * @param {number} ndvi - NDVI value
 * @returns {string} - Formatted string
 */
export function formatNDVI(ndvi) {
  if (ndvi === null || ndvi === undefined) return "N/A";
  return ndvi.toFixed(3);
}

/**
 * Calculate health statistics for a list of farms
 * @param {Array} farms - Array of farms with NDVI data
 * @param {Object} ndviData - Map of farmId to latest NDVI
 * @returns {Object} - Health distribution stats
 */
export function calculateHealthStats(farms, ndviData) {
  const stats = {
    healthy: 0,
    warning: 0,
    critical: 0,
    severe: 0,
    noData: 0,
    total: farms.length,
  };

  farms.forEach((farm) => {
    const latestNDVI = ndviData[farm.id];
    const health = getFarmHealthStatus(latestNDVI?.ndvi, farm.baselineNDVI);
    stats[health.status === "no-data" ? "noData" : health.status]++;
  });

  return stats;
}
