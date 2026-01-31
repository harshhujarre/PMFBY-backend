/**
 * NDVI Time Series Generator
 * Simulates realistic satellite NDVI data for crop monitoring
 * NDVI Range: 0.2 (bare soil/disaster) to 0.9 (healthy vegetation)
 */

/**
 * Generate realistic NDVI time series for a farm
 * @param {Object} farm - Farm data object
 * @param {number} daysHistory - Number of days to generate data for
 * @returns {Array} Array of NDVI data points
 */
export function generateNDVITimeSeries(farm, daysHistory = 60) {
  const ndviData = [];
  const today = new Date();
  const sowingDate = new Date(farm.sowingDate);

  // Calculate crop age in days
  const cropAgeDays = Math.floor((today - sowingDate) / (1000 * 60 * 60 * 24));

  for (let i = daysHistory; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);

    // Calculate days since sowing for this date
    const daysSinceSowing = Math.floor(
      (date - sowingDate) / (1000 * 60 * 60 * 24),
    );

    // Generate NDVI based on crop growth stage
    const ndvi = calculateHealthyNDVI(daysSinceSowing, farm.baselineNDVI);

    // Add natural variation (±0.05)
    const variation = (Math.random() - 0.5) * 0.1;
    const finalNDVI = Math.max(0.2, Math.min(0.9, ndvi + variation));

    ndviData.push({
      farmId: farm.id,
      timestamp: date,
      ndvi: parseFloat(finalNDVI.toFixed(3)),
      weatherCondition: "normal",
      satelliteImageUrl: `/api/satellite-images/${farm.id}/${date.toISOString().split("T")[0]}.jpg`,
      metadata: {
        cloudCover: Math.random() * 20, // 0-20% cloud cover
        temperature: 25 + Math.random() * 10, // 25-35°C
        rainfall: Math.random() * 5, // 0-5mm (normal)
      },
    });
  }

  return ndviData;
}

/**
 * Calculate healthy NDVI based on crop growth stage
 * Soybean growth curve:
 * - Days 0-15: Germination (0.2 -> 0.3)
 * - Days 15-30: Vegetative (0.3 -> 0.6)
 * - Days 30-60: Rapid growth (0.6 -> peak)
 * - Days 60-90: Flowering/Pod (peak)
 * - Days 90-120: Maturity (peak -> decline)
 */
function calculateHealthyNDVI(daysSinceSowing, baselineNDVI) {
  if (daysSinceSowing < 0) return 0.2; // Before sowing
  if (daysSinceSowing < 15) {
    // Germination phase
    return 0.2 + 0.1 * (daysSinceSowing / 15);
  } else if (daysSinceSowing < 30) {
    // Early vegetative
    return 0.3 + 0.3 * ((daysSinceSowing - 15) / 15);
  } else if (daysSinceSowing < 60) {
    // Rapid growth
    return 0.6 + (baselineNDVI - 0.6) * ((daysSinceSowing - 30) / 30);
  } else if (daysSinceSowing < 90) {
    // Peak growth (flowering/pod formation)
    return baselineNDVI;
  } else if (daysSinceSowing < 120) {
    // Maturity (slight decline)
    return baselineNDVI - 0.2 * ((daysSinceSowing - 90) / 30);
  } else {
    // Post-harvest
    return 0.3;
  }
}

/**
 * Inject a disaster event into NDVI time series
 * @param {Array} ndviData - Existing NDVI data
 * @param {Object} disaster - Disaster configuration
 * @returns {Array} Modified NDVI data with disaster
 */
export function injectDisasterEvent(ndviData, disaster) {
  const {
    type, // 'flood', 'drought', 'pest'
    startDay, // Day index (0 = most recent)
    duration, // Number of days
    severity, // 0-1 (impact strength)
  } = disaster;

  const modifiedData = [...ndviData];
  const startIndex = Math.max(0, ndviData.length - startDay - duration);
  const endIndex = Math.min(ndviData.length, ndviData.length - startDay);

  for (let i = startIndex; i < endIndex; i++) {
    const dataPoint = { ...modifiedData[i] };
    const dayInDisaster = i - startIndex;

    switch (type) {
      case "flood":
        // Sudden NDVI drop, slow recovery
        const floodImpact = severity * 0.5; // Max 50% drop
        dataPoint.ndvi = Math.max(0.2, dataPoint.ndvi - floodImpact);
        dataPoint.weatherCondition = "flood";
        dataPoint.metadata.rainfall = 100 + Math.random() * 100; // Heavy rainfall
        break;

      case "drought":
        // Gradual NDVI decline
        const droughtProgress = dayInDisaster / duration;
        const droughtImpact = severity * 0.4 * droughtProgress;
        dataPoint.ndvi = Math.max(0.2, dataPoint.ndvi - droughtImpact);
        dataPoint.weatherCondition = "drought";
        dataPoint.metadata.rainfall = 0;
        dataPoint.metadata.temperature = 35 + Math.random() * 5; // High temp
        break;

      case "pest":
        // Patchy decline
        const pestImpact = severity * 0.3;
        dataPoint.ndvi = Math.max(0.3, dataPoint.ndvi - pestImpact);
        dataPoint.weatherCondition = "pest_attack";
        break;
    }

    modifiedData[i] = dataPoint;
  }

  // Add recovery curve after disaster
  const recoveryDays = 15;
  for (
    let i = endIndex;
    i < Math.min(endIndex + recoveryDays, modifiedData.length);
    i++
  ) {
    const recoveryProgress = (i - endIndex) / recoveryDays;
    const recoveryBoost = severity * 0.2 * recoveryProgress;
    modifiedData[i] = {
      ...modifiedData[i],
      ndvi: Math.min(0.85, modifiedData[i].ndvi + recoveryBoost),
      weatherCondition: "recovering",
    };
  }

  return modifiedData;
}

/**
 * Get current NDVI status and health assessment
 * @param {number} currentNDVI - Current NDVI value
 * @param {number} baselineNDVI - Baseline healthy NDVI
 * @returns {Object} Health status object
 */
export function assessNDVIHealth(currentNDVI, baselineNDVI) {
  const dropPercentage = ((baselineNDVI - currentNDVI) / baselineNDVI) * 100;

  let status, severity, color;

  if (dropPercentage < 10) {
    status = "healthy";
    severity = "low";
    color = "#10b981"; // green
  } else if (dropPercentage < 25) {
    status = "warning";
    severity = "medium";
    color = "#f59e0b"; // yellow
  } else if (dropPercentage < 50) {
    status = "critical";
    severity = "high";
    color = "#f97316"; // orange
  } else {
    status = "severe";
    severity = "critical";
    color = "#ef4444"; // red
  }

  return {
    status,
    severity,
    color,
    currentNDVI,
    baselineNDVI,
    dropPercentage: parseFloat(dropPercentage.toFixed(2)),
    message: getHealthMessage(status, dropPercentage),
  };
}

function getHealthMessage(status, dropPercentage) {
  const messages = {
    healthy: `Crop health is excellent (${dropPercentage.toFixed(1)}% below baseline)`,
    warning: `Minor stress detected (${dropPercentage.toFixed(1)}% below baseline)`,
    critical: `Significant stress detected (${dropPercentage.toFixed(1)}% below baseline)`,
    severe: `Severe crop damage detected (${dropPercentage.toFixed(1)}% below baseline)`,
  };
  return messages[status] || "Status unknown";
}
