/**
 * PMFBY Alert Management API Routes
 * API endpoints for alerts, acknowledgment, and monitoring
 */

import express from "express";
import {
  getAlerts,
  getActiveAlerts,
  getFarmAlerts,
  getAlert,
  acknowledgeAlert,
  resolveAlert,
  getAlertStats,
  clearAllAlerts,
} from "../data/alerts.js";
import {
  monitorAllFarms,
  getMonitoringStatus,
  generateTestAlert,
} from "../services/ndviMonitor.js";

const router = express.Router();

/**
 * GET /api/alerts
 * Get all alerts with optional filters
 * Query params: ?status=active&severity=critical
 */
router.get("/alerts", (req, res) => {
  try {
    const { status, severity, farmId } = req.query;

    const filters = {};
    if (status) filters.status = status;
    if (severity) filters.severity = severity;
    if (farmId) filters.farmId = parseInt(farmId);

    const alerts = getAlerts(filters);

    res.json({
      success: true,
      count: alerts.length,
      filters: filters,
      data: alerts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch alerts",
      error: error.message,
    });
  }
});

/**
 * GET /api/alerts/active
 * Get all active (unresolved) alerts
 */
router.get("/alerts/active", (req, res) => {
  try {
    const alerts = getActiveAlerts();

    res.json({
      success: true,
      count: alerts.length,
      data: alerts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch active alerts",
      error: error.message,
    });
  }
});

/**
 * GET /api/alerts/farm/:id
 * Get all alerts for a specific farm
 */
router.get("/alerts/farm/:id", (req, res) => {
  try {
    const farmId = parseInt(req.params.id);
    const limit = parseInt(req.query.limit) || 50;

    const alerts = getFarmAlerts(farmId, limit);

    res.json({
      success: true,
      farmId: farmId,
      count: alerts.length,
      data: alerts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch farm alerts",
      error: error.message,
    });
  }
});

/**
 * GET /api/alerts/stats
 * Get alert statistics and counts
 */
router.get("/alerts/stats", (req, res) => {
  try {
    const stats = getAlertStats();

    res.json({
      success: true,
      stats: stats,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch alert statistics",
      error: error.message,
    });
  }
});

/**
 * GET /api/alerts/:id
 * Get a specific alert by ID
 */
router.get("/alerts/:id", (req, res) => {
  try {
    const alert = getAlert(req.params.id);

    if (!alert) {
      return res.status(404).json({
        success: false,
        message: "Alert not found",
      });
    }

    res.json({
      success: true,
      data: alert,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch alert",
      error: error.message,
    });
  }
});

/**
 * PUT /api/alerts/:id/acknowledge
 * Acknowledge an alert
 */
router.put("/alerts/:id/acknowledge", (req, res) => {
  try {
    const result = acknowledgeAlert(req.params.id);

    if (!result.success) {
      return res.status(400).json(result);
    }

    res.json({
      success: true,
      message: "Alert acknowledged",
      alert: result.alert,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to acknowledge alert",
      error: error.message,
    });
  }
});

/**
 * PUT /api/alerts/:id/resolve
 * Resolve an alert
 */
router.put("/alerts/:id/resolve", (req, res) => {
  try {
    const result = resolveAlert(req.params.id);

    if (!result.success) {
      return res.status(400).json(result);
    }

    res.json({
      success: true,
      message: "Alert resolved",
      alert: result.alert,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to resolve alert",
      error: error.message,
    });
  }
});

/**
 * POST /api/alerts/test
 * Generate a test alert for demonstration
 */
router.post("/alerts/test", (req, res) => {
  try {
    const { farmId, severity } = req.body;

    const testAlert = generateTestAlert(farmId || 1, severity || "critical");

    res.json({
      success: true,
      message: "Test alert generated",
      alert: testAlert,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to generate test alert",
      error: error.message,
    });
  }
});

/**
 * DELETE /api/alerts/clear
 * Clear all alerts (for testing/demo purposes)
 */
router.delete("/alerts/clear", (req, res) => {
  try {
    const result = clearAllAlerts();

    res.json({
      success: true,
      message: `Cleared ${result.clearedCount} alerts`,
      clearedCount: result.clearedCount,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to clear alerts",
      error: error.message,
    });
  }
});

/**
 * GET /api/monitoring/status
 * Get current monitoring status and farm health distribution
 */
router.get("/monitoring/status", (req, res) => {
  try {
    const status = getMonitoringStatus();

    res.json({
      success: true,
      status: status,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get monitoring status",
      error: error.message,
    });
  }
});

/**
 * POST /api/monitoring/trigger
 * Manually trigger NDVI monitoring check (for testing)
 */
router.post("/monitoring/trigger", (req, res) => {
  try {
    const results = monitorAllFarms();

    res.json({
      success: true,
      message: "Monitoring check completed",
      results: results,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Monitoring check failed",
      error: error.message,
    });
  }
});

export default router;
