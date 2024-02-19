// Define the region of interest (ROI)
var roi = ee.Geometry.Polygon(
  [[[longitude1, latitude1],
    [longitude2, latitude2],
    [longitude3, latitude3],
    [longitude4, latitude4]]]);

// Define the time range
var startDate = '2021-01-01';
var endDate = '2021-12-31';

// Load Sentinel-2 data
var sentinel2 = ee.ImageCollection('COPERNICUS/S2')
  .filterBounds(roi)
  .filterDate(startDate, endDate)
  .select(['B4', 'B8']); // Select bands B4 (Red) and B8 (NIR)

// Function to calculate NDVI
var calculateNDVI = function(image) {
  var ndvi = image.normalizedDifference(['B8', 'B4']).rename('NDVI');
  return image.addBands(ndvi);
};

// Map the function over the Sentinel-2 collection
var sentinel2WithNDVI = sentinel2.map(calculateNDVI);

// Function to add date property to the images
var addDate = function(image) {
  return image.set('date', image.date().format('YYYY-MM-dd'));
};

// Map the function over the collection to add date property
var sentinel2WithDate = sentinel2WithNDVI.map(addDate);

// Chart NDVI over time
var chart = ui.Chart.image.series({
  imageCollection: sentinel2WithDate.select(['NDVI']),
  region: roi,
  reducer: ee.Reducer.mean(),
  scale: 10, // Adjust the scale based on your requirements
}).setOptions({
  title: 'Sentinel-2 NDVI Time Series',
  hAxis: {title: 'Date'},
  vAxis: {title: 'NDVI'},
});

// Display the chart
print(chart);
