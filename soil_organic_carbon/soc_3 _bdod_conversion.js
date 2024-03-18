var tel = ee.FeatureCollection('projects/fire-ashoka/assets/telengana_districts');

var tel = tel.filter(ee.Filter.eq('New_Dist_4', 'Medak'))

var bdod = ee.Image("projects/soilgrids-isric/bdod_mean").select('bdod_15-30cm_mean').clip(tel);

// Downsample bdod to 30 meters resolution
bdod = bdod.reproject({
  crs: bdod.projection(), // Keep the current projection
  scale: 30 // New resolution in meters
});


var dataset = ee.Image('projects/ee-najah/assets/soc_modis_medak_22_30_masked');





// Perform the calculation
var result = dataset.multiply(bdod).multiply(0.15);

// print("a")

// var stats = result.reduceRegion({
//   reducer: ee.Reducer.minMax(),
//   geometry: tel, // Use the image's geometry
//   scale: 250, // Adjust based on your data resolution
//   maxPixels: 1e9,
//   bestEffort: true // This option allows GEE to automatically adjust the scale if the request is too large
// });

// // Extract the min and max values
// var min = stats.getInfo()['min'];
// var max = stats.getInfo()['max'];

// var visualization = {
//   min:min,
//   max:max,
// };

// print(min)
// print(max)

Map.addLayer(result, {'min': 0, 'max': 19}, 'result');


Export.image.toDrive({
  image: result,
  description: 'soc_modis_medak_22_30m_masked_converted',
  folder : 'ee_exports',
  scale: 30,
  region: tel,
  maxPixels: 1e10
});

