import { useState, useEffect, useCallback } from "react";

import { API_BASE_URL } from "../config/api.js";

const API_BASE = `${API_BASE_URL}/api`;

/**
 * Custom hook for managing NDVI data
 * @param {number} farmId - Optional farm ID to fetch data for
 * @returns {Object} NDVI data and helper functions
 */
export function useNDVI(farmId = null) {
  const [ndviHistory, setNdviHistory] = useState([]);
  const [latestNDVI, setLatestNDVI] = useState(null);
  const [allFarmsNDVI, setAllFarmsNDVI] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Fetch NDVI history for a specific farm
   */
  const fetchNDVIHistory = useCallback(
    async (farmIdParam, days = 60) => {
      const targetFarmId = farmIdParam || farmId;
      if (!targetFarmId) return;

      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `${API_BASE}/farms/${targetFarmId}/ndvi?days=${days}`,
        );

        if (!response.ok) {
          throw new Error("Failed to fetch NDVI history");
        }

        const data = await response.json();
        setNdviHistory(data.history || []);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching NDVI history:", err);
      } finally {
        setLoading(false);
      }
    },
    [farmId],
  );

  /**
   * Fetch latest NDVI for a specific farm
   */
  const fetchLatestNDVI = useCallback(
    async (farmIdParam) => {
      const targetFarmId = farmIdParam || farmId;
      if (!targetFarmId) return;

      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `${API_BASE}/farms/${targetFarmId}/ndvi/latest`,
        );

        if (!response.ok) {
          throw new Error("Failed to fetch latest NDVI");
        }

        const data = await response.json();
        setLatestNDVI(data.latest);
        return data;
      } catch (err) {
        setError(err.message);
        console.error("Error fetching latest NDVI:", err);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [farmId],
  );

  /**
   * Fetch NDVI status for all farms
   */
  const fetchAllFarmsNDVI = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE}/ndvi/all`);

      if (!response.ok) {
        throw new Error("Failed to fetch all farms NDVI");
      }

      const result = await response.json();
      setAllFarmsNDVI(result.data || []);
      return result.data;
    } catch (err) {
      setError(err.message);
      console.error("Error fetching all farms NDVI:", err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Generate simulated NDVI data
   */
  const simulateNDVI = useCallback(
    async (targetFarmId = null, days = 60) => {
      setLoading(true);
      setError(null);

      try {
        const body = {};
        if (targetFarmId) body.farmId = targetFarmId;
        if (days) body.days = days;

        const response = await fetch(`${API_BASE}/ndvi/simulate`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        });

        if (!response.ok) {
          throw new Error("Failed to simulate NDVI data");
        }

        const result = await response.json();

        // Refresh data after simulation
        if (targetFarmId || farmId) {
          await fetchNDVIHistory(targetFarmId || farmId);
          await fetchLatestNDVI(targetFarmId || farmId);
        } else {
          await fetchAllFarmsNDVI();
        }

        return result;
      } catch (err) {
        setError(err.message);
        console.error("Error simulating NDVI:", err);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [farmId, fetchNDVIHistory, fetchLatestNDVI, fetchAllFarmsNDVI],
  );

  /**
   * Inject a disaster scenario
   */
  const injectDisaster = useCallback(
    async (disasterConfig) => {
      const {
        farmId: targetFarmId,
        type = "flood",
        startDay = 10,
        duration = 5,
        severity = 0.8,
      } = disasterConfig;

      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`${API_BASE}/ndvi/disaster`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            farmId: targetFarmId,
            type,
            startDay,
            duration,
            severity,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to inject disaster");
        }

        const result = await response.json();

        // Refresh data after disaster injection
        if (targetFarmId) {
          await fetchNDVIHistory(targetFarmId);
          await fetchLatestNDVI(targetFarmId);
        }

        return result;
      } catch (err) {
        setError(err.message);
        console.error("Error injecting disaster:", err);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [fetchNDVIHistory, fetchLatestNDVI],
  );

  /**
   * Clear all NDVI data
   */
  const clearAllNDVI = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE}/ndvi/clear`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to clear NDVI data");
      }

      const result = await response.json();

      // Clear local state
      setNdviHistory([]);
      setLatestNDVI(null);
      setAllFarmsNDVI([]);

      return result;
    } catch (err) {
      setError(err.message);
      console.error("Error clearing NDVI:", err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Auto-fetch on mount if farmId is provided
  useEffect(() => {
    if (farmId) {
      fetchNDVIHistory(farmId);
      fetchLatestNDVI(farmId);
    }
  }, [farmId, fetchNDVIHistory, fetchLatestNDVI]);

  return {
    // Data
    ndviHistory,
    latestNDVI,
    allFarmsNDVI,
    loading,
    error,

    // Functions
    fetchNDVIHistory,
    fetchLatestNDVI,
    fetchAllFarmsNDVI,
    simulateNDVI,
    injectDisaster,
    clearAllNDVI,
  };
}

export default useNDVI;
