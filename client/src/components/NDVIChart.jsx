import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
  Area,
  AreaChart,
} from "recharts";
import { format } from "date-fns";

/**
 * NDVI Chart Component
 * Displays NDVI time series with color-coded health zones
 * @param {Array} data - NDVI time series data
 * @param {number} baselineNDVI - Healthy crop baseline
 * @param {string} farmerName - Farmer name for title
 */
export default function NDVIChart({
  data = [],
  baselineNDVI = 0.75,
  farmerName = "",
}) {
  // Format data for Recharts
  const chartData = data.map((point) => ({
    date: new Date(point.timestamp).getTime(),
    dateFormatted: format(new Date(point.timestamp), "MMM dd"),
    ndvi: point.ndvi,
    weather: point.weatherCondition,
    baseline: baselineNDVI,
    // Color zones
    critical: 0.4,
    warning: 0.6,
    healthy: 0.9,
  }));

  // Custom tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const ndviValue = data.ndvi;
      const dropPercent = (
        ((baselineNDVI - ndviValue) / baselineNDVI) *
        100
      ).toFixed(1);

      let status = "Healthy";
      let statusColor = "#10b981";

      if (ndviValue < 0.4) {
        status = "Critical";
        statusColor = "#ef4444";
      } else if (ndviValue < 0.6) {
        status = "Warning";
        statusColor = "#f59e0b";
      }

      return (
        <div className="bg-white/95 backdrop-blur-sm border border-gray-200 rounded-lg p-3 shadow-lg">
          <p className="text-sm font-semibold text-gray-800">
            {data.dateFormatted}
          </p>
          <p className="text-lg font-bold mt-1" style={{ color: statusColor }}>
            NDVI: {ndviValue.toFixed(3)}
          </p>
          <p className="text-xs text-gray-600">{dropPercent}% below baseline</p>
          <p
            className="text-xs mt-1 px-2 py-1 rounded-full inline-block"
            style={{ backgroundColor: `${statusColor}20`, color: statusColor }}
          >
            {status}
          </p>
          {data.weather !== "normal" && (
            <p className="text-xs mt-2 text-red-600 font-semibold">
              ⚠️ {data.weather.replace("_", " ").toUpperCase()}
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  // Custom dot for disaster events
  const CustomDot = (props) => {
    const { cx, cy, payload } = props;

    if (payload.weather && payload.weather !== "normal") {
      return (
        <g>
          <circle
            cx={cx}
            cy={cy}
            r={6}
            fill="#ef4444"
            stroke="#fff"
            strokeWidth={2}
          />
          <circle
            cx={cx}
            cy={cy}
            r={8}
            fill="none"
            stroke="#ef4444"
            strokeWidth={1}
            opacity={0.5}
          />
        </g>
      );
    }
    return null;
  };

  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          NDVI Time Series {farmerName && `- ${farmerName}`}
        </h3>
        <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
          <p className="text-gray-500">No NDVI data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          NDVI Time Series {farmerName && `- ${farmerName}`}
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          Baseline: {baselineNDVI.toFixed(2)} • Data points: {data.length}
        </p>
      </div>

      {/* Color zone legend */}
      <div className="flex gap-4 mb-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-red-500"></div>
          <span className="text-gray-600">Critical (&lt; 0.4)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-yellow-500"></div>
          <span className="text-gray-600">Warning (0.4-0.6)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-green-500"></div>
          <span className="text-gray-600">Healthy (&gt; 0.6)</span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={chartData}>
          <defs>
            {/* Gradient for the NDVI line */}
            <linearGradient id="ndviGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />

          <XAxis
            dataKey="dateFormatted"
            stroke="#6b7280"
            fontSize={12}
            tickLine={false}
          />

          <YAxis
            domain={[0, 1]}
            stroke="#6b7280"
            fontSize={12}
            tickLine={false}
            label={{
              value: "NDVI",
              angle: -90,
              position: "insideLeft",
              style: { fontSize: 12 },
            }}
          />

          <Tooltip content={<CustomTooltip />} />

          {/* Threshold lines */}
          <ReferenceLine
            y={0.4}
            stroke="#ef4444"
            strokeDasharray="3 3"
            label={{
              value: "Critical",
              position: "right",
              fontSize: 10,
              fill: "#ef4444",
            }}
          />
          <ReferenceLine
            y={0.6}
            stroke="#f59e0b"
            strokeDasharray="3 3"
            label={{
              value: "Warning",
              position: "right",
              fontSize: 10,
              fill: "#f59e0b",
            }}
          />
          <ReferenceLine
            y={baselineNDVI}
            stroke="#10b981"
            strokeDasharray="5 5"
            strokeWidth={2}
            label={{
              value: "Baseline",
              position: "right",
              fontSize: 10,
              fill: "#10b981",
            }}
          />

          {/* NDVI line with gradient fill */}
          <Area
            type="monotone"
            dataKey="ndvi"
            stroke="#10b981"
            strokeWidth={3}
            fill="url(#ndviGradient)"
            dot={<CustomDot />}
            activeDot={{ r: 6 }}
          />
        </AreaChart>
      </ResponsiveContainer>

      {/* Disaster events summary */}
      {data.some((d) => d.weatherCondition !== "normal") && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm font-semibold text-red-800">
            ⚠️ Disaster Events Detected
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {[
              ...new Set(
                data
                  .filter((d) => d.weatherCondition !== "normal")
                  .map((d) => d.weatherCondition),
              ),
            ].map((event) => (
              <span
                key={event}
                className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded-full"
              >
                {event.replace("_", " ").toUpperCase()}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
