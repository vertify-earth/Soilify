// Define geometry for Telangana
var geometry = Telangana

// Define date range
var startDate = '2023-06-01';
var endDate = '2023-06-30';

// Load Sentinel-2 imagery
var s2 = ee.ImageCollection('COPERNICUS/S2')
          .filterBounds(geometry)
          .filterDate(startDate, endDate)
          .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 20));

// Median composite of Sentinel-2 imagery
var medianComposite = s2.median().clip(Telangana);

// Function to calculate all salinity indices
var calculateSalinityIndices = function(image) {
  var R = image.select('B4'); // Red band
  var NIR = image.select('B8'); // Near Infrared band
  var B = image.select('B2'); // Blue band
  var G = image.select('B3'); // Green band
  
  // Calculate salinity indices
  var NDSI = R.subtract(NIR).divide(R.add(NIR)).rename('NDSI');
  var SI1 = (G.multiply(R)).sqrt().rename('SI1');
  var SI2 = (B.multiply(R)).sqrt().rename('SI2');
  var SI3 = B.subtract(R).divide(B.add(R)).rename('SI3');
  var SI4 = NIR.subtract(R).rename('SI4');
  var SI5 = R.multiply(NIR).divide(G).rename('SI5');
  var SI6 = B.multiply(R).divide(G).rename('SI6');
  
  return image.addBands([NDSI, SI1, SI2, SI3, SI4, SI5, SI6]);
};

// Apply salinity indices calculation to the median composite
var medianComposite_withSalinityIndices = calculateSalinityIndices(medianComposite);
print(medianComposite_withSalinityIndices);
// Visualization parameters for the selected salinity index
var salinityVisParams = {
  min: -1,
  max: 1,
  palette: ['blue', 'white', 'green']
};

// Select true color bands
var trueColor = {
  bands: ['B4', 'B3', 'B2'],
  min: 0,
  max: 3000
};

// Add true color composite and the selected salinity index layer to the map
Map.centerObject(geometry, 8);
Map.addLayer(medianComposite.select(['B4', 'B3', 'B2']), trueColor, 'True Color (June 2023)');
Map.addLayer(medianComposite_withSalinityIndices.select('NDSI'), salinityVisParams, 'Normalized Different Salinity Index (June 2023)');
