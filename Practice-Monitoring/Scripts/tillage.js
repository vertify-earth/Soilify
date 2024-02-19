// Define the region of interest (ROI)
var roi = ee.Geometry.Polygon(
  [[[longitude1, latitude1],
    [longitude2, latitude2],
    [longitude3, latitude3],
    [longitude4, latitude4]]]);

// Define the time range
var startDate = '2021-01-01';
var endDate = '2021-12-31';

// Load Sentinel-1 GRD data
var sentinel1 = ee.ImageCollection('COPERNICUS/S1_GRD')
  .filterBounds(roi)
  .filterDate(startDate, endDate)
  .select(['VV', 'VH']); // Select VV and VH polarization

// Function to calculate backscatter statistics
var calculateBackscatterStatistics = function(image) {
  // Calculate mean and standard deviation
  var stats = image.reduceRegion({
    reducer: ee.Reducer.mean().combine(ee.Reducer.stdDev(), '', true),
    geometry: roi,
    scale: 10, // Adjust the scale based on your requirements
    maxPixels: 1e9
  });
  
  // Add the statistics as properties to the image
  return image.set(stats);
};

// Map the function over the Sentinel-1 collection
var sentinel1WithStats = sentinel1.map(calculateBackscatterStatistics);

// Print the resulting collection
print(sentinel1WithStats);

// Create a chart to visualize backscatter over time
var chart = ui.Chart.image.series({
  imageCollection: sentinel1WithStats.select(['VV_mean', 'VH_mean']),
  region: roi,
  scale: 10, // Adjust the scale based on your requirements
});

// Display the chart
print(chart);
