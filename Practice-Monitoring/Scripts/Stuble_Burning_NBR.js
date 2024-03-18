// Define your study area geometry
// var geometry = geo;

// Import the Sentinel-2 image collection
var s2 = ee.ImageCollection('COPERNICUS/S2');

// Filter Sentinel-2 imagery by date and location
var image2023 = ee.Image(
  s2.filterBounds(geometry)
    .filterDate('2023-05-10', '2023-05-30')
    .sort('CLOUDY_PIXEL_PERCENTAGE')
    .mean().clip(geometry)
);

// Select necessary bands from Sentinel-2 image
var b8 = image2023.select('B8'); // NIR band
var b12 = image2023.select('B12'); // SWIR band

// Compute the Normalized Burn Ratio (NBR)
var nbr2023 = b8.subtract(b12).divide(b8.add(b12)).rename('NBR');

// Display the NBR image
Map.centerObject(geometry, 10);
var nbrParams = {min: -1, max: +1, palette:['red','yellow','green']};
Map.addLayer(nbr2023, nbrParams, 'NBR image 2023');

// Export the NBR image to Google Drive
Export.image.toDrive({
  image: nbr2023.toFloat(),
  description: 'NBR_image2023_polygon',
  scale: 10,
  region: geometry,
  maxPixels: 1e13
});
