import { useState } from "react";

const MapControls = ({ onZoomIn, onZoomOut, onResetView, onToggleLayer }) => {
  const [activeLayer, setActiveLayer] = useState("satellite");

  const handleLayerToggle = () => {
    const newLayer = activeLayer === "satellite" ? "osm" : "satellite";
    setActiveLayer(newLayer);
    if (onToggleLayer) {
      onToggleLayer(newLayer);
    }
  };

  const buttonBaseStyle = {
    width: "44px",
    height: "44px",
    borderRadius: "var(--radius-md)",
    backgroundColor: "var(--bg-secondary)",
    border: "1px solid var(--border-color)",
    boxShadow: "var(--shadow-md)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    transition: "all var(--transition-base)",
    fontSize: "18px",
    color: "var(--color-brown-600)",
    backdropFilter: "blur(8px)",
    WebkitBackdropFilter: "blur(8px)",
    background: "rgba(255, 255, 255, 0.9)",
  };

  const handleMouseEnter = (e) => {
    e.currentTarget.style.transform = "scale(1.05)";
    e.currentTarget.style.boxShadow = "var(--shadow-lg)";
    e.currentTarget.style.borderColor = "var(--color-gold-400)";
    e.currentTarget.style.backgroundColor = "var(--color-gold-50, #FFF)";
  };

  const handleMouseLeave = (e) => {
    e.currentTarget.style.transform = "scale(1)";
    e.currentTarget.style.boxShadow = "var(--shadow-md)";
    e.currentTarget.style.borderColor = "var(--border-color)";
    e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.9)";
  };

  return (
    <div
      className="absolute top-6 right-6 z-40 flex flex-col gap-2 animate-scaleIn"
      style={{ animationDelay: "300ms", animationFillMode: "both" }}
    >
      {/* Zoom In */}
      <button
        style={buttonBaseStyle}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={onZoomIn}
        title="Zoom In"
        aria-label="Zoom in"
      >
        ➕
      </button>

      {/* Zoom Out */}
      <button
        style={buttonBaseStyle}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={onZoomOut}
        title="Zoom Out"
        aria-label="Zoom out"
      >
        ➖
      </button>

      {/* Layer Toggle */}
      <button
        style={{
          ...buttonBaseStyle,
          borderTop: "2px solid var(--color-gold-400)",
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleLayerToggle}
        title={
          activeLayer === "satellite"
            ? "Switch to Street Map"
            : "Switch to Satellite"
        }
        aria-label="Toggle map layer"
      >
        {activeLayer === "satellite" ? "🛰️" : "🗺️"}
      </button>

      {/* Reset View */}
      <button
        style={buttonBaseStyle}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={onResetView}
        title="Reset View"
        aria-label="Reset to default view"
      >
        🏠
      </button>

      {/* Label */}
      <div
        className="text-center mt-1 font-mono text-xs px-2 py-1 rounded"
        style={{
          color: "var(--text-muted)",
          backgroundColor: "rgba(255, 255, 255, 0.8)",
          backdropFilter: "blur(4px)",
        }}
      >
        Controls
      </div>
    </div>
  );
};

export default MapControls;
