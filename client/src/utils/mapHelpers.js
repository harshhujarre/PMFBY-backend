/**
 * Converts farm data to GeoJSON format for MapLibre
 */
export const farmsToGeoJSON = (farms) => {
  return {
    type: "FeatureCollection",
    features: farms.map((farm) => ({
      type: "Feature",
      id: farm.id,
      geometry: {
        type: "Polygon",
        coordinates: [
          farm.polygon.map(([lat, lng]) => [lng, lat]), // Convert [lat, lng] to [lng, lat]
        ],
      },
      properties: {
        id: farm.id,
        farmerName: farm.farmerName,
        crop: farm.crop,
        location: farm.location,
      },
    })),
  };
};

/**
 * Checks if a polygon is within the map bounds
 */
export const isPolygonInBounds = (polygon, bounds) => {
  // Check if any point of the polygon is within bounds
  return polygon.some(([lat, lng]) => {
    return (
      lng >= bounds.getWest() &&
      lng <= bounds.getEast() &&
      lat >= bounds.getSouth() &&
      lat <= bounds.getNorth()
    );
  });
};

/**
 * Filters farms that are visible in the current map viewport
 */
export const getVisibleFarms = (farms, mapBounds) => {
  if (!mapBounds || !farms || farms.length === 0) return [];

  return farms.filter((farm) => isPolygonInBounds(farm.polygon, mapBounds));
};
