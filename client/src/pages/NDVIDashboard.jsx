import React, { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import NDVIChart from "../components/NDVIChart";
import SatelliteViewer from "../components/SatelliteViewer";
import useNDVI from "../hooks/useNDVI";
import { useFarms } from "../hooks/useFarms";

/**
 * NDVI Dashboard - Phase 1 Demo
 * Demonstrates satellite data simulation and visualization
 */
export default function NDVIDashboard() {
  const { farms, loading: farmsLoading } = useFarms();
  const [selectedFarmId, setSelectedFarmId] = useState(null);
  const {
    ndviHistory,
    latestNDVI,
    loading,
    simulateNDVI,
    injectDisaster,
    clearAllNDVI,
  } = useNDVI(selectedFarmId);

  // Auto-select first farm
  useEffect(() => {
    if (farms.length > 0 && !selectedFarmId) {
      setSelectedFarmId(farms[0].id);
    }
  }, [farms, selectedFarmId]);

  const selectedFarm = farms.find((f) => f.id === selectedFarmId);

  const handleGenerateData = async () => {
    toast.loading("Generating NDVI data...", { id: "generate" });
    const result = await simulateNDVI();
    if (result) {
      toast.success(
        `Generated ${result.dataPointsGenerated} data points for ${result.farmsProcessed} farms`,
        { id: "generate" },
      );
    } else {
      toast.error("Failed to generate NDVI data", { id: "generate" });
    }
  };

  const handleInjectFlood = async () => {
    if (!selectedFarmId) {
      toast.error("Please select a farm first");
      return;
    }

    toast.loading("Injecting flood scenario...", { id: "disaster" });
    const result = await injectDisaster({
      farmId: selectedFarmId,
      type: "flood",
      startDay: 10,
      duration: 7,
      severity: 0.75,
    });

    if (result) {
      toast.success(`Flood injected for ${result.disaster.farmerName}`, {
        id: "disaster",
      });
    } else {
      toast.error("Failed to inject disaster", { id: "disaster" });
    }
  };

  const handleInjectDrought = async () => {
    if (!selectedFarmId) {
      toast.error("Please select a farm first");
      return;
    }

    toast.loading("Injecting drought scenario...", { id: "disaster" });
    const result = await injectDisaster({
      farmId: selectedFarmId,
      type: "drought",
      startDay: 15,
      duration: 10,
      severity: 0.6,
    });

    if (result) {
      toast.success(`Drought injected for ${result.disaster.farmerName}`, {
        id: "disaster",
      });
    } else {
      toast.error("Failed to inject disaster", { id: "disaster" });
    }
  };

  const handleClearData = async () => {
    if (!confirm("Are you sure you want to clear all NDVI data?")) return;

    toast.loading("Clearing NDVI data...", { id: "clear" });
    const result = await clearAllNDVI();
    if (result) {
      toast.success("All NDVI data cleared", { id: "clear" });
    } else {
      toast.error("Failed to clear data", { id: "clear" });
    }
  };

  if (farmsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600">Loading farms...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-6">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                🛰️ NDVI Dashboard
              </h1>
              <p className="text-gray-600 mt-1">
                Phase 1: Satellite Data Simulation & Visualization
              </p>
            </div>

            {latestNDVI && (
              <div className="text-right">
                <div className="text-sm text-gray-500">Current NDVI</div>
                <div className="text-4xl font-bold text-green-600">
                  {latestNDVI.ndvi.toFixed(3)}
                </div>
              </div>
            )}
          </div>

          {/* Control Buttons */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleGenerateData}
              disabled={loading}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              🌱 Generate NDVI Data (All Farms)
            </button>

            <button
              onClick={handleInjectFlood}
              disabled={loading || !selectedFarmId}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              🌊 Inject Flood
            </button>

            <button
              onClick={handleInjectDrought}
              disabled={loading || !selectedFarmId}
              className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              🌵 Inject Drought
            </button>

            <button
              onClick={handleClearData}
              disabled={loading}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              🗑️ Clear All Data
            </button>
          </div>
        </div>
      </div>

      {/* Farm Selector */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="bg-white rounded-xl shadow-lg p-4 border border-gray-200">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Select Farm
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {farms.map((farm) => (
              <button
                key={farm.id}
                onClick={() => setSelectedFarmId(farm.id)}
                className={`p-4 rounded-lg border-2 transition-all text-left ${
                  selectedFarmId === farm.id
                    ? "border-green-500 bg-green-50"
                    : "border-gray-200 hover:border-gray-300 bg-white"
                }`}
              >
                <div className="font-semibold text-gray-800 capitalize">
                  {farm.farmerName}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {farm.crop} • {farm.area} ha
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  ₹{(farm.insuranceValue / 1000).toFixed(0)}K insured
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      {selectedFarm ? (
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Farm Details */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <h2 className="text-xl font-bold text-gray-800 mb-4 capitalize">
              {selectedFarm.farmerName}'s Farm
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <div className="text-xs text-gray-500">Crop Type</div>
                <div className="text-sm font-semibold text-gray-800">
                  {selectedFarm.cropType}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Area</div>
                <div className="text-sm font-semibold text-gray-800">
                  {selectedFarm.area} hectares
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Baseline NDVI</div>
                <div className="text-sm font-semibold text-green-600">
                  {selectedFarm.baselineNDVI.toFixed(2)}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Insurance Value</div>
                <div className="text-sm font-semibold text-blue-600">
                  ₹{selectedFarm.insuranceValue.toLocaleString("en-IN")}
                </div>
              </div>
            </div>
          </div>

          {/* Satellite Viewer */}
          {latestNDVI && (
            <SatelliteViewer farm={selectedFarm} latestNDVI={latestNDVI} />
          )}

          {/* NDVI Chart */}
          {ndviHistory.length > 0 ? (
            <NDVIChart
              data={ndviHistory}
              baselineNDVI={selectedFarm.baselineNDVI}
              farmerName={selectedFarm.farmerName}
            />
          ) : (
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📊</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  No NDVI Data Available
                </h3>
                <p className="text-gray-600 mb-4">
                  Click "Generate NDVI Data" to simulate satellite readings
                </p>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-12 border border-gray-200 text-center">
            <div className="text-6xl mb-4">🌾</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Select a Farm
            </h3>
            <p className="text-gray-600">
              Choose a farm from above to view NDVI data and satellite imagery
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
