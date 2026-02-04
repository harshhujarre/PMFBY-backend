/**
 * Generate 4 farms arranged side-by-side in the provided rectangle
 */

// Rectangle boundary coordinates
const boundary = [
  [16.71819415959498, 74.1972283218185],
  [16.718070855465655, 74.19867135023584],
  [16.715008777356477, 74.19675088862466],
  [16.71477757818834, 74.19805444217637],
];

// Calculate bounds
const lats = boundary.map((p) => p[0]);
const lngs = boundary.map((p) => p[1]);
const minLat = Math.min(...lats);
const maxLat = Math.max(...lats);
const minLng = Math.min(...lngs);
const maxLng = Math.max(...lngs);

console.log("Boundary:", { minLat, maxLat, minLng, maxLng });

// Divide rectangle into 4 side-by-side plots (4 columns)
const latRange = maxLat - minLat;
const lngRange = maxLng - minLng;
const lngStep = lngRange / 4; // 4 farms side by side

const farms = [];

for (let i = 0; i < 4; i++) {
  const lngStart = minLng + lngStep * i;
  const lngEnd = minLng + lngStep * (i + 1);

  // Create rectangular plot for each farm
  const farmPolygon = [
    [minLat, lngStart],
    [minLat, lngEnd],
    [maxLat, lngEnd],
    [maxLat, lngStart],
  ];

  farms.push({
    farmId: i + 5, // IDs 5, 6, 7, 8
    polygon: farmPolygon,
  });
}

console.log("\nGenerated 4 farms:");
farms.forEach((farm) => {
  console.log(`\nFarm ${farm.farmId}:`);
  console.log("polygon: [");
  farm.polygon.forEach((coord) => {
    console.log(`  [${coord[0]}, ${coord[1]}],`);
  });
  console.log("],");
});
