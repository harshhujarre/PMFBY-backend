/**
 * PMFBY NDVI Monitoring Service
 * Automated crop health monitoring and alert generation
 */

import { getFarms } from "../data/farms.js";
import { getLatestNDVI, getAllCurrentNDVI } from "../data/ndviData.js";
import { assessNDVIHealth } from "./ndviGenerator.js";
import {
  storeAlert,
  getActiveAlerts,
  autoResolveAlerts,
} from "../data/alerts.js";

/**
 * Check individual farm health and generate alert if needed
 * @param {Object} farm - Farm object
 * @param {Object} latestNDVI - Latest NDVI reading
 * @returns {Object|null} - Alert if threshold breached, null otherwise
 */
export function checkFarmHealth(farm, latestNDVI) {
  if (!latestNDVI || !farm.baselineNDVI) {
    return null;
  }

  const health = assessNDVIHealth(latestNDVI.ndvi, farm.baselineNDVI);

  // Check if farm has recovered
  if (health.status === "healthy") {
    autoResolveAlerts(farm.id, latestNDVI.ndvi, farm.baselineNDVI);
    return null;
  }

  // Generate alert based on health status
  if (
    health.status === "warning" ||
    health.status === "critical" ||
    health.status === "severe"
  ) {
    const alertData = {
      farmId: farm.id,
      farmerName: farm.farmerName,
      alertType: "ndvi_drop",
      severity: mapHealthToSeverity(health.status),
      currentNDVI: latestNDVI.ndvi,
      baselineNDVI: farm.baselineNDVI,
      dropPercentage: health.dropPercentage,
      message: generateAlertMessage(farm, health),
      estimatedCause: latestNDVI.disaster?.type || null,
      metadata: {
        cropType: farm.cropType,
        area: farm.area,
        insuranceValue: farm.insuranceValue,
        healthStatus: health.status,
        weatherCondition: latestNDVI.metadata?.weatherCondition || "unknown",
      },
    };

    const result = storeAlert(alertData);
    return result.isDuplicate ? null : result.alert;
  }

  return null;
}

/**
 * Map health status to alert severity
 * @param {string} healthStatus - Health status from assessNDVIHealth
 * @returns {string} - Alert severity level
 */
function mapHealthToSeverity(healthStatus) {
  const severityMap = {
    healthy: "low",
    warning: "medium",
    critical: "high",
    severe: "critical",
  };
  return severityMap[healthStatus] || "medium";
}

/**
 * Generate human-readable alert message
 * @param {Object} farm - Farm object
 * @param {Object} health - Health assessment result
 * @returns {string} - Alert message
 */
function generateAlertMessage(farm, health) {
  const dropPercent = health.dropPercentage.toFixed(1);
  const cropName = farm.cropType || farm.crop;

  if (health.status === "severe") {
    return `🚨 SEVERE ALERT: ${farm.farmerName}'s ${cropName} field showing ${dropPercent}% NDVI drop. Immediate inspection recommended.`;
  } else if (health.status === "critical") {
    return `⚠️ CRITICAL: ${farm.farmerName}'s ${cropName} crop health deteriorating (${dropPercent}% below normal). Action required.`;
  } else if (health.status === "warning") {
    return `⚡ WARNING: ${farm.farmerName}'s ${cropName} field NDVI declining (${dropPercent}% below baseline). Monitor closely.`;
  }

  return `Crop health issue detected for ${farm.farmerName}'s farm.`;
}

/**
 * Monitor all farms and generate alerts for threshold breaches
 * @returns {Object} - Monitoring results
 */
export function monitorAllFarms() {
  const farms = getFarms();
  const allNDVI = getAllCurrentNDVI();

  const results = {
    timestamp: new Date(),
    farmsChecked: 0,
    alertsGenerated: 0,
    alertsResolved: 0,
    newAlerts: [],
    errors: [],
  };

  farms.forEach((farm) => {
    try {
      const latestReading = getLatestNDVI(farm.id);

      if (latestReading) {
        results.farmsChecked++;

        const newAlert = checkFarmHealth(farm, latestReading);

        if (newAlert) {
          results.alertsGenerated++;
          results.newAlerts.push(newAlert);
        }
      }
    } catch (error) {
      results.errors.push({
        farmId: farm.id,
        farmerName: farm.farmerName,
        error: error.message,
      });
    }
  });

  // Log monitoring results
  console.log(
    `[NDVI Monitor] ${new Date().toISOString()} - Checked ${results.farmsChecked} farms, Generated ${results.alertsGenerated} new alerts`,
  );

  if (results.alertsGenerated > 0) {
    console.log(
      `[NDVI Monitor] New alerts:`,
      results.newAlerts.map((a) => ({
        farmer: a.farmerName,
        severity: a.severity,
        drop: `${a.dropPercentage.toFixed(1)}%`,
      })),
    );
  }

  return results;
}

/**
 * Get monitoring status summary
 * @returns {Object} - Current monitoring status
 */
export function getMonitoringStatus() {
  const farms = getFarms();
  const activeAlerts = getActiveAlerts();

  const farmHealthCounts = {
    healthy: 0,
    warning: 0,
    critical: 0,
    severe: 0,
    noData: 0,
  };

  farms.forEach((farm) => {
    const latestReading = getLatestNDVI(farm.id);
    if (latestReading && farm.baselineNDVI) {
      const health = assessNDVIHealth(latestReading.ndvi, farm.baselineNDVI);
      farmHealthCounts[health.status]++;
    } else {
      farmHealthCounts.noData++;
    }
  });

  return {
    totalFarms: farms.length,
    farmsWithData: farms.length - farmHealthCounts.noData,
    activeAlerts: activeAlerts.length,
    farmHealthDistribution: farmHealthCounts,
    lastCheck: new Date(),
  };
}

/**
 * Generate test alert for demonstration
 * @param {number} farmId - Farm ID
 * @param {string} severity - Alert severity
 * @returns {Object} - Generated alert
 */
export function generateTestAlert(farmId = 1, severity = "critical") {
  const farms = getFarms();
  const farm = farms.find((f) => f.id === farmId);

  if (!farm) {
    throw new Error(`Farm ${farmId} not found`);
  }

  const testAlertData = {
    farmId: farm.id,
    farmerName: farm.farmerName,
    alertType: "ndvi_drop",
    severity: severity,
    currentNDVI: 0.42,
    baselineNDVI: farm.baselineNDVI || 0.75,
    dropPercentage: 44,
    message: `🧪 TEST ALERT: ${farm.farmerName}'s ${farm.cropType || farm.crop} showing simulated crop stress`,
    estimatedCause: "test_scenario",
    metadata: {
      isTest: true,
      cropType: farm.cropType,
      area: farm.area,
    },
  };

  const result = storeAlert(testAlertData);
  return result.alert;
}
