import React, { useState } from "react";

/**
 * Satellite Viewer Component
 * Displays simulated satellite imagery and NDVI visualization
 * @param {Object} farm - Farm data
 * @param {Object} latestNDVI - Latest NDVI reading
 */
export default function SatelliteViewer({ farm, latestNDVI }) {
  const [viewMode, setViewMode] = useState("ndvi"); // 'ndvi' or 'rgb'

  if (!farm || !latestNDVI) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Satellite View
        </h3>
        <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
          <p className="text-gray-500">No satellite data available</p>
        </div>
      </div>
    );
  }

  const getNDVIColor = (ndvi) => {
    // NDVI color scale from red (low) to green (high)
    if (ndvi < 0.2) return "#8b4513"; // Brown (bare soil)
    if (ndvi < 0.4) return "#ef4444"; // Red (critical)
    if (ndvi < 0.6) return "#f59e0b"; // Orange/Yellow (warning)
    if (ndvi < 0.7) return "#84cc16"; // Light green
    return "#10b981"; // Green (healthy)
  };

  const currentColor = getNDVIColor(latestNDVI.ndvi);

  // Generate a gradient visualization for NDVI heatmap
  const generateNDVIGradient = () => {
    return `radial-gradient(circle at 50% 50%, ${currentColor} 0%, ${currentColor}cc 30%, ${currentColor}88 60%, transparent 100%)`;
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            Satellite View
          </h3>
          <p className="text-sm text-gray-600">
            {farm.farmerName} • {farm.location}
          </p>
        </div>

        {/* View mode toggle */}
        <div className="flex gap-2 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setViewMode("ndvi")}
            className={`px-3 py-1.5 rounded text-sm font-medium transition-all ${
              viewMode === "ndvi"
                ? "bg-white shadow-sm text-green-700"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            NDVI
          </button>
          <button
            onClick={() => setViewMode("rgb")}
            className={`px-3 py-1.5 rounded text-sm font-medium transition-all ${
              viewMode === "rgb"
                ? "bg-white shadow-sm text-blue-700"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            RGB
          </button>
        </div>
      </div>

      {/* Satellite imagery simulation */}
      <div className="relative aspect-video bg-gradient-to-br from-green-900 to-green-700 rounded-lg overflow-hidden mb-4">
        {viewMode === "ndvi" ? (
          // NDVI Heatmap view
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className="w-full h-full"
              style={{
                background: generateNDVIGradient(),
                opacity: 0.8,
              }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center bg-black/50 backdrop-blur-sm rounded-lg p-4">
                <div className="text-6xl font-bold text-white mb-2">
                  {latestNDVI.ndvi.toFixed(3)}
                </div>
                <div className="text-sm text-white/80 uppercase tracking-wider">
                  NDVI Index
                </div>
                <div
                  className="mt-2 px-3 py-1 rounded-full text-xs font-semibold"
                  style={{
                    backgroundColor: currentColor,
                    color: "white",
                  }}
                >
                  {latestNDVI.weatherCondition}
                </div>
              </div>
            </div>
          </div>
        ) : (
          // RGB satellite view (simulated)
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-green-800 to-green-600">
            <div className="text-center">
              <div className="text-white/60 text-sm mb-2">
                📡 Simulated RGB Satellite Imagery
              </div>
              <div className="text-white/40 text-xs">
                Farm ID: {farm.id} • Area: {farm.area} ha
              </div>
            </div>
          </div>
        )}
      </div>

      {/* NDVI color scale reference */}
      {viewMode === "ndvi" && (
        <div className="space-y-3">
          <div>
            <p className="text-xs font-semibold text-gray-700 mb-2">
              NDVI Color Scale
            </p>
            <div className="h-3 rounded-full overflow-hidden flex">
              <div className="flex-1 bg-gradient-to-r from-red-500 via-yellow-500 to-green-500"></div>
            </div>
            <div className="flex justify-between mt-1 text-xs text-gray-500">
              <span>0.0 (Bare)</span>
              <span>0.5</span>
              <span>1.0 (Healthy)</span>
            </div>
          </div>

          {/* Metadata */}
          <div className="grid grid-cols-3 gap-3 pt-3 border-t border-gray-200">
            <div className="text-center">
              <div className="text-xs text-gray-500">Cloud Cover</div>
              <div className="text-sm font-semibold text-gray-800">
                {latestNDVI.metadata.cloudCover.toFixed(1)}%
              </div>
            </div>
            <div className="text-center">
              <div className="text-xs text-gray-500">Temperature</div>
              <div className="text-sm font-semibold text-gray-800">
                {latestNDVI.metadata.temperature.toFixed(1)}°C
              </div>
            </div>
            <div className="text-center">
              <div className="text-xs text-gray-500">Rainfall</div>
              <div className="text-sm font-semibold text-gray-800">
                {latestNDVI.metadata.rainfall.toFixed(1)} mm
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Warning for disasters */}
      {latestNDVI.weatherCondition !== "normal" && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
          <span className="text-red-600 text-lg">⚠️</span>
          <div className="flex-1">
            <p className="text-sm font-semibold text-red-800">
              Disaster Detected:{" "}
              {latestNDVI.weatherCondition.replace("_", " ").toUpperCase()}
            </p>
            <p className="text-xs text-red-600 mt-1">
              Immediate assessment and intervention recommended
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
