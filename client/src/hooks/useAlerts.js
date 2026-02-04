/**
 * PMFBY useAlerts Custom Hook
 * Manages alert data fetching, polling, and actions
 */

import { useState, useEffect, useCallback, useRef } from "react";

import { API_BASE_URL } from "../config/api.js";

const API_BASE = `${API_BASE_URL}/api`;

export function useAlerts(autoRefresh = true, refreshInterval = 30000) {
  const [alerts, setAlerts] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const intervalRef = useRef(null);

  /**
   * Fetch all alerts with optional filters
   */
  const fetchAlerts = useCallback(async (filters = {}) => {
    try {
      setLoading(true);
      setError(null);

      const queryParams = new URLSearchParams();
      if (filters.status) queryParams.append("status", filters.status);
      if (filters.severity) queryParams.append("severity", filters.severity);
      if (filters.farmId) queryParams.append("farmId", filters.farmId);

      const url = `${API_BASE}/alerts${queryParams.toString() ? "?" + queryParams.toString() : ""}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        setAlerts(result.data);
        return result.data;
      } else {
        throw new Error(result.message || "Failed to fetch alerts");
      }
    } catch (err) {
      setError(err.message);
      console.error("Error fetching alerts:", err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Fetch active alerts only
   */
  const fetchActiveAlerts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE}/alerts/active`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        setAlerts(result.data);
        return result.data;
      } else {
        throw new Error(result.message || "Failed to fetch active alerts");
      }
    } catch (err) {
      setError(err.message);
      console.error("Error fetching active alerts:", err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Fetch alert statistics
   */
  const fetchAlertStats = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE}/alerts/stats`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        setStats(result.stats);
        return result.stats;
      } else {
        throw new Error(result.message || "Failed to fetch stats");
      }
    } catch (err) {
      console.error("Error fetching alert stats:", err);
      return null;
    }
  }, []);

  /**
   * Acknowledge an alert
   */
  const acknowledgeAlert = useCallback(async (alertId) => {
    try {
      const response = await fetch(
        `${API_BASE}/alerts/${alertId}/acknowledge`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        // Update local state
        setAlerts((prev) =>
          prev.map((alert) =>
            alert.id === alertId
              ? { ...alert, status: "acknowledged", acknowledgedAt: new Date() }
              : alert,
          ),
        );
        return result.alert;
      } else {
        throw new Error(result.message || "Failed to acknowledge alert");
      }
    } catch (err) {
      console.error("Error acknowledging alert:", err);
      throw err;
    }
  }, []);

  /**
   * Resolve an alert
   */
  const resolveAlert = useCallback(async (alertId) => {
    try {
      const response = await fetch(`${API_BASE}/alerts/${alertId}/resolve`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        // Update local state
        setAlerts((prev) =>
          prev.map((alert) =>
            alert.id === alertId
              ? { ...alert, status: "resolved", resolvedAt: new Date() }
              : alert,
          ),
        );
        return result.alert;
      } else {
        throw new Error(result.message || "Failed to resolve alert");
      }
    } catch (err) {
      console.error("Error resolving alert:", err);
      throw err;
    }
  }, []);

  /**
   * Generate a test alert
   */
  const generateTestAlert = useCallback(
    async (farmId = 1, severity = "critical") => {
      try {
        const response = await fetch(`${API_BASE}/alerts/test`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ farmId, severity }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        if (result.success) {
          // Refresh alerts
          await fetchActiveAlerts();
          return result.alert;
        } else {
          throw new Error(result.message || "Failed to generate test alert");
        }
      } catch (err) {
        console.error("Error generating test alert:", err);
        throw err;
      }
    },
    [fetchActiveAlerts],
  );

  /**
   * Clear all alerts
   */
  const clearAllAlerts = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE}/alerts/clear`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        setAlerts([]);
        setStats(null);
        return result;
      } else {
        throw new Error(result.message || "Failed to clear alerts");
      }
    } catch (err) {
      console.error("Error clearing alerts:", err);
      throw err;
    }
  }, []);

  // Auto-refresh effect
  useEffect(() => {
    if (autoRefresh) {
      // Initial fetch
      fetchActiveAlerts();
      fetchAlertStats();

      // Set up polling
      intervalRef.current = setInterval(() => {
        fetchActiveAlerts();
        fetchAlertStats();
      }, refreshInterval);

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }
  }, [autoRefresh, refreshInterval, fetchActiveAlerts, fetchAlertStats]);

  return {
    alerts,
    stats,
    loading,
    error,
    fetchAlerts,
    fetchActiveAlerts,
    fetchAlertStats,
    acknowledgeAlert,
    resolveAlert,
    generateTestAlert,
    clearAllAlerts,
  };
}
