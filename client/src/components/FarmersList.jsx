const FarmersList = ({ farms, pagination, onNextPage, onPrevPage }) => {
  return (
    <div
      className="h-full flex flex-col overflow-hidden"
      style={{ backgroundColor: "var(--bg-secondary)" }}
    >
      {/* Enhanced Header */}
      <div
        className="relative overflow-hidden p-6"
        style={{
          background:
            "linear-gradient(135deg, var(--color-green-700) 0%, var(--color-green-600) 100%)",
          boxShadow: "var(--shadow-md)",
          borderBottom: "2px solid var(--color-gold-500)",
        }}
      >
        {/* Decorative pattern */}
        <div className="absolute inset-0 opacity-10 field-pattern-vertical"></div>

        <div className="relative z-10">
          <h2
            className="font-display text-2xl font-bold mb-1"
            style={{
              color: "var(--text-inverse)",
              textShadow: "1px 1px 2px rgba(0,0,0,0.2)",
            }}
          >
            Farmers Registry
          </h2>
          <div
            className="flex items-center gap-2 font-body text-sm"
            style={{ color: "var(--color-green-100)" }}
          >
            {pagination && pagination.total > 0 ? (
              <>
                <span className="font-semibold">
                  Showing {(pagination.page - 1) * pagination.limit + 1}-
                  {Math.min(
                    pagination.page * pagination.limit,
                    pagination.total,
                  )}
                </span>
                <span>of</span>
                <span className="font-semibold">{pagination.total}</span>
                <span>{pagination.total === 1 ? "farmer" : "farmers"}</span>
              </>
            ) : (
              <>
                <span className="font-semibold">{farms.length}</span>
                <span>{farms.length === 1 ? "farmer" : "farmers"}</span>
                <span className="opacity-60">in current view</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Farmers List - Scrollable */}
      <div
        className="flex-1 overflow-y-auto p-4"
        style={{
          backgroundColor: "var(--bg-primary)",
        }}
      >
        {farms.length === 0 ? (
          // Enhanced Empty State
          <div className="text-center py-12 px-6 animate-fadeIn">
            <div className="text-6xl mb-4 opacity-20">🗺️</div>
            <p
              className="font-display text-xl mb-2"
              style={{ color: "var(--text-secondary)" }}
            >
              No Farms Found
            </p>
            <p
              className="font-body text-sm mb-4"
              style={{ color: "var(--text-muted)" }}
            >
              Try adjusting your filters or zoom out on the map
            </p>
            <div
              className="inline-block px-4 py-2 rounded-lg text-xs font-mono"
              style={{
                backgroundColor: "var(--color-cream-dark)",
                color: "var(--text-muted)",
              }}
            >
              💡 Try selecting a different region
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {farms.map((farm, index) => (
              <div
                key={farm.id}
                className="group p-5 rounded-xl transition-all duration-300 hover:scale-[1.02] cursor-pointer animate-slideInUp"
                style={{
                  backgroundColor: "var(--bg-secondary)",
                  border: "1px solid var(--border-color)",
                  boxShadow: "var(--shadow-base)",
                  animationDelay: `${index * 50}ms`,
                  animationFillMode: "both",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = "var(--shadow-lg)";
                  e.currentTarget.style.borderColor = "var(--color-gold-400)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = "var(--shadow-base)";
                  e.currentTarget.style.borderColor = "var(--border-color)";
                }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3
                      className="font-display text-xl font-semibold capitalize mb-1"
                      style={{ color: "var(--color-brown-700)" }}
                    >
                      {farm.farmerName}
                    </h3>
                  </div>

                  {/* Farm ID Badge */}
                  <div
                    className="flex items-center justify-center w-10 h-10 rounded-full font-display font-bold text-sm transition-all duration-300"
                    style={{
                      backgroundColor: "var(--color-gold-100)",
                      color: "var(--color-brown-700)",
                      border: "2px solid var(--color-gold-400)",
                    }}
                  >
                    {farm.id}
                  </div>
                </div>

                {/* Farm Details */}
                <div className="space-y-2">
                  {/* Crop Information */}
                  <div
                    className="flex items-center gap-3 p-2 rounded-lg"
                    style={{ backgroundColor: "var(--color-green-100)" }}
                  >
                    <span className="text-lg">🌾</span>
                    <div>
                      <div
                        className="text-xs font-body uppercase tracking-wide"
                        style={{ color: "var(--text-muted)" }}
                      >
                        Crop
                      </div>
                      <div
                        className="font-body font-semibold capitalize"
                        style={{ color: "var(--color-green-800)" }}
                      >
                        {farm.crop}
                      </div>
                    </div>
                  </div>

                  {/* Location Information */}
                  <div
                    className="flex items-center gap-3 p-2 rounded-lg"
                    style={{ backgroundColor: "var(--color-cream-dark)" }}
                  >
                    <span className="text-lg">📍</span>
                    <div>
                      <div
                        className="text-xs font-body uppercase tracking-wide"
                        style={{ color: "var(--text-muted)" }}
                      >
                        Location
                      </div>
                      <div
                        className="font-body font-medium"
                        style={{ color: "var(--color-brown-700)" }}
                      >
                        {farm.location}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Farm Area Footer */}
                <div
                  className="mt-4 pt-3 flex items-center justify-between"
                  style={{ borderTop: "1px solid var(--border-color)" }}
                >
                  <span
                    className="text-xs font-mono"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {farm.polygon.length} boundary points
                  </span>
                  <div
                    className="text-xs font-body px-2 py-1 rounded"
                    style={{
                      backgroundColor: "var(--color-green-100)",
                      color: "var(--color-green-700)",
                    }}
                  >
                    ✓ Active
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      {pagination && pagination.totalPages > 1 && (
        <div
          className="p-4 border-t"
          style={{
            backgroundColor: "var(--bg-secondary)",
            borderColor: "var(--border-color)",
          }}
        >
          <div className="flex items-center justify-between">
            <button
              onClick={onPrevPage}
              disabled={pagination.page === 1}
              className="px-4 py-2 rounded-lg font-body text-sm font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              style={{
                backgroundColor:
                  pagination.page === 1
                    ? "var(--color-neutral-200)"
                    : "var(--color-green-600)",
                color:
                  pagination.page === 1
                    ? "var(--text-muted)"
                    : "var(--text-inverse)",
              }}
            >
              ← Previous
            </button>

            <div
              className="font-body text-sm"
              style={{ color: "var(--text-secondary)" }}
            >
              Page <span className="font-bold">{pagination.page}</span> of{" "}
              <span className="font-bold">{pagination.totalPages}</span>
            </div>

            <button
              onClick={onNextPage}
              disabled={pagination.page >= pagination.totalPages}
              className="px-4 py-2 rounded-lg font-body text-sm font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              style={{
                backgroundColor:
                  pagination.page >= pagination.totalPages
                    ? "var(--color-neutral-200)"
                    : "var(--color-green-600)",
                color:
                  pagination.page >= pagination.totalPages
                    ? "var(--text-muted)"
                    : "var(--text-inverse)",
              }}
            >
              Next →
            </button>
          </div>
        </div>
      )}

      {/* Footer Info */}
      {farms.length > 0 && !pagination && (
        <div
          className="p-4"
          style={{
            backgroundColor: "var(--bg-secondary)",
            borderTop: "1px solid var(--border-color)",
            boxShadow: "var(--shadow-sm)",
          }}
        >
          <div
            className="text-xs text-center font-body flex items-center justify-center gap-2"
            style={{ color: "var(--text-muted)" }}
          >
            <span>💡</span>
            <span>Pan and zoom the map to filter visible farms</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default FarmersList;
