            
// var tel = ee.FeatureCollection('projects/fire-ashoka/assets/telengana_districts');

// var tel = tel.filter(ee.Filter.eq('New_Dist_4', 'Medak'))
var esri_lulc_ts= ee.ImageCollection("projects/sat-io/open-datasets/landcover/ESRI_Global-LULC_10m_TS");
var lulc_all = esri_lulc_ts
            .filterDate('2022-01-01','2022-12-31')
            .mosaic()
            //.clip(tel)
            
            
            
// Resample the land cover image to 30 meters
var lulc_all = lulc_all.reproject({
  crs: lulc_all.projection(), // Use the original projection
  scale: 30 // Resample to 30 meters
});            
// var lulc_all = esri_lulc_ts
//             .filterDate('2021-04-01','2022-05-31')
            
      
//print(lulc_all.size())            
            

// // // Define class values for water and built-up areas
// var waterClass =1; // Replace <water_class_value> with the actual class value
// var builtUpClass =7 ; // Replace <built_up_class_value> with the actual class value

// // // Create masks
// var waterMask = lulc.select('b1').eq(waterClass);
// var builtUpMask = lulc.select('b1').eq(builtUpClass);

// // // Combine masks (example: masking out water and built-up areas)
// var combinedMask = waterMask.or(builtUpMask);

// var stats = combinedMask.reduceRegion({
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

// // Apply mask to the image

// var dataset = ee.Image('projects/ee-najah/assets/soc_modis_medak_22_30m')
// var maskedImage = dataset.updateMask(combinedMask.not());

// // // Add layers to the map

// Map.addLayer( maskedImage,{} ,'masked')

// Export.image.toAsset({
// image: maskedImage,
//   description: 'soc_modis_medak_22_30m_masked',
//   scale: 30,
//   assetId: 'soc_modis_medak_22_30_masked',
//   region: tel,
  
// });


///




var geos = ['Bolangir', 'Medak', 'Yavatmal'];

geos.forEach(function(geo) {
  
  var dataset = ee.Image('projects/ee-najah/assets/soc_l8_'+ geo +'_22')
  var lulc = lulc_all.clip(dataset.geometry())
  // // Define class values for water and built-up areas
  // var waterClass =1; // Replace <water_class_value> with the actual class value
  // var builtUpClass =7 ; // Replace <built_up_class_value> with the actual class value
  
  // // // Create masks
  // var waterMask = lulc.select('b1').eq(waterClass);
  // var builtUpMask = lulc.select('b1').eq(builtUpClass);
  
  // // // Combine masks (example: masking out water and built-up areas)
  // var combinedMask = waterMask.or(builtUpMask);
  // var maskedImage = dataset.updateMask(combinedMask.not());
  
    // Define class value for cropland
  var croplandClass = 5; // Assuming cropland is represented by the value 4
  
  // Create mask for cropland
  var croplandMask = lulc.select('b1').eq(croplandClass);
  
  // Apply the cropland mask to the dataset
  var maskedImage = dataset.updateMask(croplandMask);
  




  Map.addLayer( maskedImage,{} ,'masked'+ geo)
  Map.centerObject(maskedImage)
//   //var region = dataset.geometry();

  
  Export.image.toAsset({
  image: maskedImage,
  description: 'soc_l8_' + geo + '_22_masked_esri',
  scale: 30,
  assetId: 'soc_l8_' + geo + '_22_masked_esri',
  region: maskedImage.geometry(),
    maxPixels: 1e10
  
  });
});
