// var tel = ee.FeatureCollection('projects/fire-ashoka/assets/telengana_districts');

// var tel = tel.filter(ee.Filter.eq('New_Dist_4', 'Medak'))

var bdod = ee.Image("projects/soilgrids-isric/bdod_mean").select('bdod_5-15cm_mean')






//var dataset = ee.Image('projects/ee-najah/assets/soc_modis_medak_22_30_masked');


var geos = ['Bolangir', 'Medak', 'Yavatmal'];

geos.forEach(function(geo) {
  var dataset = ee.Image('projects/ee-najah/assets/soc_l8_'+ geo +'_22_masked_esri');

// Perform the calculation
  var bdod_clip = bdod.clip(dataset.geometry());
  // Downsample bdod to 30 meters resolution
  var bdod_repr = bdod_clip.reproject({
    crs: bdod_clip.projection(), // Keep the current projection
    scale: 30 // New resolution in meters
  });
  var result = dataset.multiply(bdod_repr).multiply(0.1);


  Map.addLayer(result, {'min': 0, 'max': 19}, 'result' + geo );



Export.image.toDrive({
  image: result,
  description: 'soc_l8_' + geo + '_22_30m_masked_esri_tons',
  folder : 'ee_exports',
  scale: 30,
  region: result.geometry(),
  maxPixels: 1e10
});
  // Export.image.toAsset({
  // image: result,
  // description: 'soc_l8_' + geo + '_22_30m_masked_esri_tons',
  // scale: 30,
  // assetId: 'soc_l8_' + geo + '_22_30m_masked_esri_tons',
  // region: result.geometry(),
  //   maxPixels: 1e10
  
  // });
});

