import { useState, useCallback } from "react";
import FarmMap from "./components/FarmMap";
import FarmersList from "./components/FarmersList";
import StatsPanel from "./components/StatsPanel";
import AlertsPanel from "./components/AlertsPanel";
import DivisionSelector from "./components/DivisionSelector";
import SearchBar from "./components/SearchBar";
import NDVIDashboard from "./pages/NDVIDashboard";
import { useFarms } from "./hooks/useFarms";
import toast from "react-hot-toast";
import "./App.css";

function App() {
  const {
    farms,
    loading,
    error,
    updateFilters,
    filters,
    pagination,
    nextPage,
    prevPage,
    searchQuery,
    updateSearch,
  } = useFarms({
    district: "Kolhapur",
  });
  const [visibleFarms, setVisibleFarms] = useState([]);
  const [currentView, setCurrentView] = useState("map"); // 'map' or 'ndvi'
  const [selectedFarmId, setSelectedFarmId] = useState(null);

  const handleVisibleFarmsChange = useCallback((newVisibleFarms) => {
    setVisibleFarms(newVisibleFarms);
  }, []);

  const handleAlertClick = useCallback((alert) => {
    setSelectedFarmId(alert.farmId);
    setCurrentView("ndvi");
    toast.success(`Viewing ${alert.farmerName}'s farm`);
  }, []);

  // Enhanced loading state with agricultural spinner
  if (loading) {
    return (
      <div
        className="flex items-center justify-center h-screen"
        style={{ backgroundColor: "var(--bg-primary)" }}
      >
        <div className="text-center animate-fadeIn">
          {/* Custom agricultural spinner - circular field pattern */}
          <div className="relative w-24 h-24 mx-auto mb-6">
            <div
              className="absolute inset-0 rounded-full border-4 border-t-transparent animate-spin"
              style={{
                borderColor: "var(--color-gold-300)",
                borderTopColor: "transparent",
                animationDuration: "1.2s",
              }}
            ></div>
            <div
              className="absolute inset-2 rounded-full border-4 border-b-transparent animate-spin"
              style={{
                borderColor: "var(--color-green-400)",
                borderBottomColor: "transparent",
                animationDuration: "1.5s",
                animationDirection: "reverse",
              }}
            ></div>
            <div
              className="absolute inset-0 flex items-center justify-center text-2xl"
              style={{ color: "var(--color-brown-600)" }}
            >
              🌾
            </div>
          </div>
          <p
            className="font-display text-xl mb-2"
            style={{ color: "var(--text-primary)" }}
          >
            Loading Farm Data
          </p>
          <p
            className="font-body text-sm"
            style={{ color: "var(--text-muted)" }}
          >
            Connecting to agricultural intelligence system...
          </p>
        </div>
      </div>
    );
  }

  // Enhanced error state
  if (error) {
    return (
      <div
        className="flex items-center justify-center h-screen"
        style={{ backgroundColor: "var(--bg-primary)" }}
      >
        <div
          className="max-w-md p-8 rounded-xl animate-scaleIn"
          style={{
            backgroundColor: "var(--bg-secondary)",
            border: "2px solid var(--color-error)",
            boxShadow: "var(--shadow-lg)",
          }}
        >
          <div className="text-center mb-4 text-4xl">⚠️</div>
          <h2
            className="font-display text-2xl mb-3 text-center"
            style={{ color: "var(--color-error)" }}
          >
            Connection Error
          </h2>
          <p
            className="font-body mb-4 text-center"
            style={{ color: "var(--text-secondary)" }}
          >
            {error}
          </p>
          <div
            className="text-sm p-3 rounded-lg"
            style={{
              backgroundColor: "var(--color-cream-dark)",
              color: "var(--text-muted)",
            }}
          >
            <p className="font-mono">
              💡 Ensure the backend server is running:
            </p>
            <code className="block mt-2 font-mono text-xs">
              cd c:\Documents\sold_projects\PMFBY
              <br />
              npm start
            </code>
          </div>
        </div>
      </div>
    );
  }

  // NDVI Dashboard View
  if (currentView === "ndvi") {
    return (
      <div className="h-screen flex flex-col">
        {/* Navigation Header */}
        <header
          className="relative overflow-hidden field-pattern"
          style={{
            background:
              "linear-gradient(135deg, var(--color-brown-700) 0%, var(--color-brown-600) 50%, var(--color-brown-500) 100%)",
            boxShadow: "var(--shadow-lg)",
            borderBottom: "3px solid var(--color-gold-500)",
          }}
        >
          <div className="container mx-auto px-8 py-4 relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <h1
                  className="font-display text-3xl font-bold tracking-wide"
                  style={{
                    color: "var(--text-inverse)",
                    textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
                  }}
                >
                  PMFBY
                </h1>
                <p
                  className="font-body text-sm opacity-90"
                  style={{ color: "var(--color-gold-200)" }}
                >
                  Phase 1: NDVI Satellite Data Monitoring
                </p>
              </div>

              <button
                onClick={() => setCurrentView("map")}
                className="px-4 py-2 rounded-lg font-medium transition-all hover:scale-105"
                style={{
                  backgroundColor: "var(--color-gold-500)",
                  color: "var(--color-brown-800)",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                }}
              >
                🗺️ View Map
              </button>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-auto">
          <NDVIDashboard />
        </div>
      </div>
    );
  }

  // Map View (default)
  return (
    <div
      className="flex flex-col h-screen"
      style={{ backgroundColor: "var(--bg-primary)" }}
    >
      {/* Enhanced Header with Agricultural Aesthetic */}
      <header
        className="relative overflow-hidden field-pattern animate-slideInDown"
        style={{
          background:
            "linear-gradient(135deg, var(--color-brown-700) 0%, var(--color-brown-600) 50%, var(--color-brown-500) 100%)",
          boxShadow: "var(--shadow-lg)",
          borderBottom: "3px solid var(--color-gold-500)",
        }}
      >
        {/* Decorative overlay */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `repeating-linear-gradient(
              90deg,
              transparent,
              transparent 39px,
              var(--color-gold-300) 39px,
              var(--color-gold-300) 40px
            )`,
          }}
        ></div>

        <div className="container mx-auto px-8 py-6 relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h1
                className="font-display text-4xl font-bold tracking-wide mb-2"
                style={{
                  color: "var(--text-inverse)",
                  textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
                  letterSpacing: "0.02em",
                }}
              >
                PMFBY
              </h1>
              <p
                className="font-display text-lg italic opacity-90"
                style={{ color: "var(--color-gold-200)" }}
              >
                Pradhan Mantri Fasal Bima Yojana
              </p>
              <p
                className="font-body text-sm mt-1 opacity-80 animate-slideInRight"
                style={{
                  color: "var(--text-inverse)",
                  animationDelay: "200ms",
                  animationFillMode: "both",
                }}
              >
                AI-Powered Crop Loss Assessment & Farm Intelligence System
              </p>
            </div>

            {/* Navigation Button */}
            <button
              onClick={() => setCurrentView("ndvi")}
              className="px-6 py-3 rounded-lg font-medium transition-all hover:scale-105 animate-pulse"
              style={{
                backgroundColor: "var(--color-gold-500)",
                color: "var(--color-brown-800)",
                boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
              }}
            >
              🛰️ NDVI Dashboard
            </button>

            {/* Decorative wheat icon */}
            <div
              className="text-6xl opacity-20 animate-float ml-6"
              style={{ animationDelay: "1s" }}
            >
              🌾
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Stats Panel Overlay (top-left) */}
        <StatsPanel farms={visibleFarms} allFarms={farms} />

        {/* Map Section */}
        <div className="flex-1 relative">
          <FarmMap
            farms={farms}
            onVisibleFarmsChange={handleVisibleFarmsChange}
          />
        </div>

        {/* Alerts Panel Overlay (top-right) */}
        <AlertsPanel onAlertClick={handleAlertClick} />

        {/* Sidebar Section - Farmers List & Division Selector */}
        <div
          className="w-96 flex flex-col overflow-hidden animate-slideInRight bg-white/50 backdrop-blur-sm relative z-10"
          style={{
            borderLeft: "1px solid var(--border-color)",
            boxShadow: "var(--shadow-xl)",
          }}
        >
          {/* Division Selector */}
          <div className="p-4 bg-white/80 border-b border-brown-200">
            <DivisionSelector
              onSelectionChange={updateFilters}
              currentFilters={filters}
            />
          </div>

          {/* Search Bar */}
          <div className="p-4 bg-white/80 border-b border-brown-200">
            <SearchBar
              searchQuery={searchQuery}
              onSearchChange={updateSearch}
            />
          </div>

          {/* Farmers List */}
          <div className="flex-1 overflow-hidden">
            <FarmersList
              farms={visibleFarms}
              pagination={pagination}
              onNextPage={nextPage}
              onPrevPage={prevPage}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
