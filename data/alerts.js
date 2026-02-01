/**
 * PMFBY Alert Data Storage
 * In-memory storage for crop health alerts
 */

import { v4 as uuidv4 } from "uuid";

// In-memory alert database
let alertsDatabase = [];

/**
 * Store a new alert
 * @param {Object} alertData - Alert information
 * @returns {Object} - Success status and created alert
 */
export function storeAlert(alertData) {
  const alert = {
    id: uuidv4(),
    farmId: alertData.farmId,
    farmerName: alertData.farmerName,
    alertType: alertData.alertType || "ndvi_drop",
    severity: alertData.severity, // 'low', 'medium', 'high', 'critical'
    currentNDVI: alertData.currentNDVI,
    baselineNDVI: alertData.baselineNDVI,
    dropPercentage: alertData.dropPercentage,
    message: alertData.message,
    timestamp: new Date(),
    status: "active", // 'active', 'acknowledged', 'resolved'
    estimatedCause: alertData.estimatedCause || null,
    metadata: alertData.metadata || {},
  };

  // Check if similar alert already exists and is active
  const existingAlert = alertsDatabase.find(
    (a) =>
      a.farmId === alert.farmId &&
      a.status === "active" &&
      a.severity === alert.severity,
  );

  if (existingAlert) {
    // Update existing alert instead of creating duplicate
    existingAlert.timestamp = new Date();
    existingAlert.currentNDVI = alert.currentNDVI;
    existingAlert.dropPercentage = alert.dropPercentage;
    existingAlert.message = alert.message;
    return { success: true, alert: existingAlert, isDuplicate: true };
  }

  alertsDatabase.push(alert);

  return { success: true, alert, isDuplicate: false };
}

/**
 * Get all alerts with optional filters
 * @param {Object} filters - Filter criteria
 * @returns {Array} - Filtered alerts
 */
export function getAlerts(filters = {}) {
  let results = [...alertsDatabase];

  // Filter by status
  if (filters.status) {
    results = results.filter((a) => a.status === filters.status);
  }

  // Filter by severity
  if (filters.severity) {
    results = results.filter((a) => a.severity === filters.severity);
  }

  // Filter by farm ID
  if (filters.farmId) {
    results = results.filter((a) => a.farmId === filters.farmId);
  }

  // Sort by timestamp (newest first)
  results.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  return results;
}

/**
 * Get all active alerts
 * @returns {Array} - Active alerts
 */
export function getActiveAlerts() {
  return getAlerts({ status: "active" });
}

/**
 * Get alerts for a specific farm
 * @param {number} farmId - Farm ID
 * @param {number} limit - Maximum number of alerts to return
 * @returns {Array} - Farm alerts
 */
export function getFarmAlerts(farmId, limit = 50) {
  const farmAlerts = alertsDatabase
    .filter((a) => a.farmId === farmId)
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .slice(0, limit);

  return farmAlerts;
}

/**
 * Get a specific alert by ID
 * @param {string} alertId - Alert UUID
 * @returns {Object|null} - Alert or null if not found
 */
export function getAlert(alertId) {
  return alertsDatabase.find((a) => a.id === alertId) || null;
}

/**
 * Acknowledge an alert
 * @param {string} alertId - Alert UUID
 * @returns {Object} - Success status and updated alert
 */
export function acknowledgeAlert(alertId) {
  const alert = getAlert(alertId);

  if (!alert) {
    return { success: false, message: "Alert not found" };
  }

  if (alert.status !== "active") {
    return { success: false, message: "Alert is not active" };
  }

  alert.status = "acknowledged";
  alert.acknowledgedAt = new Date();

  return { success: true, alert };
}

/**
 * Resolve an alert
 * @param {string} alertId - Alert UUID
 * @returns {Object} - Success status and updated alert
 */
export function resolveAlert(alertId) {
  const alert = getAlert(alertId);

  if (!alert) {
    return { success: false, message: "Alert not found" };
  }

  alert.status = "resolved";
  alert.resolvedAt = new Date();

  return { success: true, alert };
}

/**
 * Auto-resolve alerts for farms that have recovered
 * @param {number} farmId - Farm ID
 * @param {number} currentNDVI - Current NDVI value
 */
export function autoResolveAlerts(farmId, currentNDVI, baselineNDVI) {
  const activeAlerts = alertsDatabase.filter(
    (a) => a.farmId === farmId && a.status === "active",
  );

  const healthyThreshold = baselineNDVI * 0.8; // 80% of baseline

  if (currentNDVI >= healthyThreshold) {
    // Farm has recovered - resolve all active alerts
    activeAlerts.forEach((alert) => {
      alert.status = "resolved";
      alert.resolvedAt = new Date();
      alert.metadata.autoResolved = true;
      alert.metadata.recoveryNDVI = currentNDVI;
    });

    return activeAlerts.length;
  }

  return 0;
}

/**
 * Get alert statistics
 * @returns {Object} - Alert stats by severity and status
 */
export function getAlertStats() {
  const stats = {
    total: alertsDatabase.length,
    active: 0,
    acknowledged: 0,
    resolved: 0,
    bySeverity: {
      critical: 0,
      high: 0,
      medium: 0,
      low: 0,
    },
    activeBySeverity: {
      critical: 0,
      high: 0,
      medium: 0,
      low: 0,
    },
    recentAlerts: [],
  };

  alertsDatabase.forEach((alert) => {
    // Count by status
    if (alert.status === "active") stats.active++;
    else if (alert.status === "acknowledged") stats.acknowledged++;
    else if (alert.status === "resolved") stats.resolved++;

    // Count by severity
    if (alert.severity in stats.bySeverity) {
      stats.bySeverity[alert.severity]++;
    }

    // Count active by severity
    if (alert.status === "active" && alert.severity in stats.activeBySeverity) {
      stats.activeBySeverity[alert.severity]++;
    }
  });

  // Get recent alerts (last 10)
  stats.recentAlerts = alertsDatabase
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .slice(0, 10);

  return stats;
}

/**
 * Clear all alerts (for testing/demo purposes)
 * @returns {Object} - Success status and count
 */
export function clearAllAlerts() {
  const count = alertsDatabase.length;
  alertsDatabase = [];
  return { success: true, clearedCount: count };
}

/**
 * Get database size
 * @returns {number} - Number of alerts in database
 */
export function getAlertCount() {
  return alertsDatabase.length;
}
