// get the points

var points = ee.FeatureCollection('projects/ee-najah/assets/soc_training_all')

print(points.size())

//filter to india

var india = ee.FeatureCollection('FAO/GAUL/2015/level0').filter(
    ee.Filter.eq('ADM0_NAME', 'India'))
    
points = points.filterBounds(india)

//print(points.size())




// log soc


// // Assume you have a feature collection named fc
// // and a column named soc that you want to log and remove

// // First, create a function that takes a feature and returns a new feature
// // with the logged value of soc as a new property
// var logCol = function(feature) {
//   // Get the value of soc from the feature
//   var value = feature.get('oc');
//   // Compute the natural logarithm of the value
//   var logValue = ee.Number(value).log();
//   // Return a new feature with the logValue as a new property
//   return feature.set('oc', logValue);
// };

// // Then, map the function over the feature collection
// var points = points.map(logCol);

// // Next, create a function that removes a property from a feature
// var removeProperty = function(feature, property) {
//   // Get the property names from the feature
//   var properties = feature.propertyNames();
//   // Filter out the property that you want to remove
//   var selectProperties = properties.filter(ee.Filter.neq('item', property));
//   // Return a new feature with only the selected properties
//   return feature.select(selectProperties);
// };

// // Finally, map the function over the feature collection to remove soc
// var points = points.map(function(feature) {
//   return removeProperty(feature, 'oc');
// });

//  the result to the console
//(finalFc);




// add lat long as a feature


var getLatLong = function(feature){
  var coordinates = feature.geometry().coordinates();  // Assuming feature has a geometry with coordinates

  var longitude = coordinates.get(0);  // Access longitude within the nested list
  var latitude = coordinates.get(1);   // Access latitude within the nested list

  // Add latitude and longitude as new columns to the existing feature properties
  return feature.set({
    latitude: latitude,
    longitude: longitude
  })
  
}

var points = points.map(getLatLong)

// get the data for each dataset for each years

//filter to icraf 2023

var icraf_23 = points
  .filter(ee.Filter.and(
    ee.Filter.eq('year', 2023),
    ee.Filter.eq('provider', 'ICRAF')
  ));
  
//print(icraf_23.size())  
  
var icraf_21 = points
  .filter(ee.Filter.and(
    ee.Filter.eq('year', 2021),
    ee.Filter.eq('provider', 'ICRAF')
  ));
  
var icraf = points
  .filter(ee.Filter.eq('provider', 'ICRAF'));  
var cimmyt_18 = points
  .filter(ee.Filter.and(
    ee.Filter.eq('year', 2018),
    ee.Filter.eq('provider', 'CIMMYT')
  ));  


var cimmyt_19 = points
  .filter(ee.Filter.and(
    ee.Filter.eq('year', 2019),
    ee.Filter.eq('provider', 'CIMMYT')
  ));  
    
    
var cimmyt_20 = points
  .filter(ee.Filter.and(
    ee.Filter.eq('year', 2020),
    ee.Filter.eq('provider', 'CIMMYT')
  ));  
        
var cimmyt = points
  .filter(ee.Filter.eq('provider', 'CIMMYT'));     
  
var wrms_hr = points
  .filter(ee.Filter.and(
    ee.Filter.eq('year', 2020),
    ee.Filter.eq('provider', 'WRMS'),
    ee.Filter.eq('state', 'Haryana')
    
  ));    
  
var wrms_tel = points
  .filter(ee.Filter.and(
    ee.Filter.eq('year', 2023),
    ee.Filter.eq('provider', 'WRMS'),
    ee.Filter.eq('state', 'Telangana')
    
  ));    
  
var wrms = points
  .filter(ee.Filter.eq('provider', 'WRMS'));  
  
//biaf  

var biaf = points
  .filter(ee.Filter.eq('provider', 'BAIF'));
  
var fes = points
  .filter(ee.Filter.eq('provider', 'FES'));

//filter to soc greater than zero


biaf = biaf.filter(ee.Filter.gt('oc', 0));
  
    
// datasets


var s2 = ee.ImageCollection('COPERNICUS/S2_SR')
    .filterBounds(points)
    //.filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE',5))
    .select('B.*')


//print(s2.size())

// var castToFloat = function (image) {
//   return image.cast (ee.Image (image).bandTypes ());
// };

//var imageCollection = imageCollection.map (castToFloat);

var scale = function(image){return image.divide(10000)}
var s3 = ee.ImageCollection('COPERNICUS/S3/OLCI')    
          .filterBounds(points)
          .select('Oa.*')
          .map(scale);
          // .filter(
          //     ee.Filter.eq('system:index', 'S3B_20180521T044445_20180521T044745').not()
          //   );
          //.map (castToFloat)



var modis250 = ee.ImageCollection('MODIS/061/MOD09GQ')
                  .filterBounds(points)
                  .select("sur.*")
var modis500 = ee.ImageCollection('MODIS/061/MCD43A4')
                  .select("Nadir.*")
                  .filterBounds(points)
var l8= ee.ImageCollection('LANDSAT/LC08/C02/T1_TOA')
    .filterBounds(points)
    .filter(ee.Filter.lt('CLOUD_COVER', 5))
    .select('B.*')         
    

// Load a precipitation image
var precipitation =ee.ImageCollection('JAXA/GPM_L3/GSMaP/v6/operational')
                    .select('hourlyPrecipRate')
                    .filterBounds(points)
                    
                    
                    
// print(precipitation23.bandNames())
                      

// Load a temperature image
var temperature = ee.ImageCollection('MODIS/061/MOD11A1')
                  .select('LST_Day_1km')
                  .filterBounds(points)
                  //.mean()
                    
var srtm = ee.Image('USGS/SRTMGL1_003')
var elevation = srtm.select('elevation')
//var slope = ee.Terrain.slope(elevation);
var slope = ee.Terrain.slope(srtm);


// Calculate aspect
var aspect = ee.Terrain.aspect(srtm);

// Calculate hillshade
var hillshade = ee.Terrain.hillshade(srtm);


// phenology
var bandsToExclude = ['QA_Detailed_1', 'QA_Detailed_2', 'QA_Overall_1', 'QA_Overall_2', 'QA_Overall_3', 'MidGreenup_1'];

var phenology18 = ee.Image('MODIS/061/MCD12Q2/2018_01_01').select(['Peak_1']).clip(india)
//var phenology18 = phenology18.select(phenology18.bandNames().filter(ee.Filter.inList('item', bandsToExclude).not()));


var phenology20 = ee.Image('MODIS/061/MCD12Q2/2020_01_01').select(['Peak_1']).clip(india)
//var phenology20 = phenology20.select(phenology20.bandNames().filter(ee.Filter.inList('item', bandsToExclude).not()));



var phenology22 = ee.Image('MODIS/061/MCD12Q2/2022_01_01').select(['Peak_1']).clip(india)
//var phenology22 = phenology18.select(phenology22.bandNames().filter(ee.Filter.inList('item', bandsToExclude).not()));



//var phenology = phenology.select(nameOfBands)


//print(phenology18.bandNames())
//extract training



// function get_training(dataset, points, startDate, endDate ){
  
//   var image=  dataset.filterDate(startDate, endDate)
//         .mean()
//   var training_data = image.sampleRegions({
//       'collection': points,
//       'properties': ['oc', 'longitude', 'latitude'],
//       'scale': 250,
//       'tileScale': 16
      
// })  
// return training_data    
// }

// var icrafModis23 = get_training(modis250,icraf_23, '2021-05-01', '2021-06-30')

// print(icrafModis23.limit(5))


//***************//
//function to loop

function get_training(config) {
  var dataset = config.dataset;
  var points = config.points;
  var startDate = config.startDate;
  var endDate = config.endDate;
  var res = config.res;

  var image = dataset.filterDate(startDate, endDate).mean();
  var latlon = ee.Image.pixelLonLat();
  
  
  // get other bands
  
  var precip = precipitation.filterDate(startDate, endDate).mean()
                  .resample('bilinear')
                  .reproject({
                    crs: 'EPSG:4326',
                    scale: res
                  }); 
  var temp = temperature.reduce(ee.Reducer.percentile([25, 50, 75]))
                  .resample('bilinear')
                  .reproject({
                    crs: 'EPSG:4326',
                    scale: res
                  });     
                   
  var asp = aspect
  .resample('bilinear')
                  .reproject({
                    crs: 'EPSG:4326',
                    scale: res
                  });  
  var hills = hillshade
  . resample('bilinear')
                  .reproject({
                    crs: 'EPSG:4326',
                    scale: res
                  });                    
  
  image = image.addBands([latlon, precip, temp,  asp, hills]);
  var training_data = image.sampleRegions({
    'collection': points,
    'properties': ['oc', 'longitude', 'latitude'],
    'scale': res,
    'tileScale': 16
  })
  
  return [training_data, image];
}

// Set the ID of each training_data feature


var resultList = [];


// Create separate dictionaries for datasets at different resolutions
var datasets = {
  'modis250': modis250,
  'modis500': modis500,
  's3': s3,
  'l8': l8,
  's2': s2
};

var resolutions = {
  'modis250': 250,
  'modis500': 500,
  's3': 300,
  'l8': 30,
  's2': 250
};

// Create configurations for all datasets and points
var modis250Configs = [
  { dataset: datasets.modis250, points: icraf_21, id: 'icraf_21modis250', startDate: '2021-05-01', endDate: '2021-06-30', res: resolutions.modis250 },
  //{ dataset: datasets.modis250, points: icraf_23, id: 'icraf_23modis250', startDate: '2023-05-01', endDate: '2023-06-30', res: resolutions.modis250 },
  { dataset: datasets.modis250, points: cimmyt_18, id: 'cimmyt_18modis250', startDate: '2018-05-01', endDate: '2018-06-30', res: resolutions.modis250 },
  //{ dataset: datasets.modis250, points: cimmyt_19, id: 'cimmyt_19modis250', startDate: '2019-05-01', endDate: '2019-06-30', res: resolutions.modis250 },
  //{ dataset: datasets.modis250, points: cimmyt_20, id: 'cimmyt_20modis250', startDate: '2020-05-01', endDate: '2020-06-30', res: resolutions.modis250 },
  { dataset: datasets.modis250, points: wrms_hr, id: 'wrms_hrmodis250', startDate: '2020-05-01', endDate: '2020-06-30', res: resolutions.modis250 },
  { dataset: datasets.modis250, points: wrms_tel, id: 'wrms_telmodis250', startDate: '2023-05-01', endDate: '2023-06-30', res: resolutions.modis250 },
  //{ dataset: datasets.modis250, points: biaf, id: 'biafmodis250', startDate: '2020-05-01', endDate: '2020-06-30', res: resolutions.modis250 },
  { dataset: datasets.modis250, points: fes, id: 'fesmodis250', startDate: '2020-05-01', endDate: '2020-06-30', res: resolutions.modis250 },
];



// var l8Configs = [
//   { dataset: datasets.l8, points: icraf_21, id: 'icraf_21l8', startDate: '2021-05-01', endDate: '2021-06-30', res: resolutions.l8 },
//   { dataset: datasets.l8, points: icraf_23, id: 'icraf_23l8', startDate: '2023-05-01', endDate: '2023-06-30', res: resolutions.l8 },
//   { dataset: datasets.l8, points: cimmyt_18, id: 'cimmyt_18l8', startDate: '2018-05-01', endDate: '2018-06-30', res: resolutions.l8 },
//   { dataset: datasets.l8, points: cimmyt_19, id: 'cimmyt_19l8', startDate: '2019-05-01', endDate: '2019-06-30', res: resolutions.l8 },
//   { dataset: datasets.l8, points: cimmyt_20, id: 'cimmyt_20l8', startDate: '2020-05-01', endDate: '2020-06-30', res: resolutions.l8 },
//   { dataset: datasets.l8, points: wrms_hr, id: 'wrms_hrl8', startDate: '2020-05-01', endDate: '2020-06-30', res: resolutions.l8 },
//   { dataset: datasets.l8, points: wrms_tel, id: 'wrms_tell8', startDate: '2023-05-01', endDate: '2023-06-30', res: resolutions.l8 },
//   { dataset: datasets.l8, points: biaf, id: 'biafl8', startDate: '2020-05-01', endDate: '2020-06-30', res: resolutions.l8 },
//   { dataset: datasets.l8, points: fes, id: 'fesl8', startDate: '2020-05-01', endDate: '2020-06-30', res: resolutions.l8 },
// ];

// var modis500Configs = [
//   { dataset: datasets.modis500, points: icraf_21, id: 'icraf_21modis500', startDate: '2021-05-01', endDate: '2021-06-30', res: resolutions.modis500 },
//   { dataset: datasets.modis500, points: icraf_23, id: 'icraf_23modis500', startDate: '2023-05-01', endDate: '2023-06-30', res: resolutions.modis500 },
//   { dataset: datasets.modis500, points: cimmyt_18, id: 'cimmyt_18modis500', startDate: '2018-05-01', endDate: '2018-06-30', res: resolutions.modis500 },
//   { dataset: datasets.modis500, points: cimmyt_19, id: 'cimmyt_19modis500', startDate: '2019-05-01', endDate: '2019-06-30', res: resolutions.modis500 },
//   { dataset: datasets.modis500, points: cimmyt_20, id: 'cimmyt_20modis500', startDate: '2020-05-01', endDate: '2020-06-30', res: resolutions.modis500 },
//   { dataset: datasets.modis500, points: wrms_hr, id: 'wrms_hrmodis500', startDate: '2020-05-01', endDate: '2020-06-30', res: resolutions.modis500 },
//   { dataset: datasets.modis500, points: wrms_tel, id: 'wrms_telmodis500', startDate: '2023-05-01', endDate: '2023-06-30', res: resolutions.modis500 },
//   { dataset: datasets.modis500, points: biaf, id: 'biafmodis500', startDate: '2020-05-01', endDate: '2020-06-30', res: resolutions.modis500 },
//   { dataset: datasets.modis500, points: fes, id: 'fesmodis500', startDate: '2020-05-01', endDate: '2020-06-30', res: resolutions.modis500 },
// ];

// var s3Configs = [
//   { dataset: datasets.s3, points: icraf_21, id: 'icraf_21s3', startDate: '2021-05-01', endDate: '2021-06-30', res: resolutions.s3 },
//   { dataset: datasets.s3, points: icraf_23, id: 'icraf_23s3', startDate: '2023-05-01', endDate: '2023-06-30', res: resolutions.s3 },
//   { dataset: datasets.s3, points: cimmyt_18, id: 'cimmyt_18s3', startDate: '2018-05-01', endDate: '2018-06-30', res: resolutions.s3 },
//   { dataset: datasets.s3, points: cimmyt_19, id: 'cimmyt_19s3', startDate: '2019-05-01', endDate: '2019-06-30', res: resolutions.s3 },
//   { dataset: datasets.s3, points: cimmyt_20, id: 'cimmyt_20s3', startDate: '2020-05-01', endDate: '2020-06-30', res: resolutions.s3 },
//   { dataset: datasets.s3, points: wrms_hr, id: 'wrms_hrs3', startDate: '2020-05-01', endDate: '2020-06-30', res: resolutions.s3 },
//   { dataset: datasets.s3, points: wrms_tel, id: 'wrms_tels3', startDate: '2023-05-01', endDate: '2023-06-30', res: resolutions.s3 },
//   { dataset: datasets.s3, points: biaf, id: 'biafs3', startDate: '2020-05-01', endDate: '2020-06-30', res: resolutions.s3 },
//   { dataset: datasets.s3, points: fes, id: 'fess3', startDate: '2020-05-01', endDate: '2020-06-30', res: resolutions.s3 },
// ];
// // Create configurations for 's2' dataset
// var s2Configs = [
//   { dataset: datasets.s2, points: icraf_21, id: 'icraf_21s2', startDate: '2021-05-01', endDate: '2021-06-30', res: resolutions.s2 },
//   { dataset: datasets.s2, points: icraf_23, id: 'icraf_23s2', startDate: '2023-05-01', endDate: '2023-06-30', res: resolutions.s2 },
//   { dataset: datasets.s2, points: cimmyt_18, id: 'cimmyt_18s2', startDate: '2018-05-01', endDate: '2018-06-30', res: resolutions.s2 },
//   { dataset: datasets.s2, points: cimmyt_19, id: 'cimmyt_19s2', startDate: '2019-05-01', endDate: '2019-06-30', res: resolutions.s2 },
//   { dataset: datasets.s2, points: cimmyt_20, id: 'cimmyt_20s2', startDate: '2020-05-01', endDate: '2020-06-30', res: resolutions.s2 },
//   { dataset: datasets.s2, points: wrms_hr, id: 'wrms_hrs2', startDate: '2020-05-01', endDate: '2020-06-30', res: resolutions.s2 },
//   { dataset: datasets.s2, points: wrms_tel, id: 'wrms_tels2', startDate: '2023-05-01', endDate: '2023-06-30', res: resolutions.s2 },
//   { dataset: datasets.s2, points: biaf, id: 'biafs2', startDate: '2020-05-01', endDate: '2020-06-30', res: resolutions.s2 },
//   { dataset: datasets.s2, points: fes, id: 'fess2', startDate: '2020-05-01', endDate: '2020-06-30', res: resolutions.s2 }
// ];

// var s2Configs = [
//   { dataset: datasets.s2, points: icraf_21, id: 'icraf_21s2', startDate: '2021-05-01', endDate: '2021-06-30', res: resolutions.s2 },
//   { dataset: datasets.s2, points: icraf_23, id: 'icraf_23s2', startDate: '2023-05-01', endDate: '2023-06-30', res: resolutions.s2 },
//   { dataset: datasets.s2, points: cimmyt_18, id: 'cimmyt_18s2', startDate: '2018-05-01', endDate: '2018-06-30', res: resolutions.s2 },
//   { dataset: datasets.s2, points: cimmyt_19, id: 'cimmyt_19s2', startDate: '2019-05-01', endDate: '2019-06-30', res: resolutions.s2 },
//   { dataset: datasets.s2, points: cimmyt_20, id: 'cimmyt_20s2', startDate: '2020-05-01', endDate: '2020-06-30', res: resolutions.s2 },
//   { dataset: datasets.s2, points: wrms_hr, id: 'wrms_hrs2', startDate: '2020-05-01', endDate: '2020-06-30', res: resolutions.s2 },
//   { dataset: datasets.s2, points: wrms_tel, id: 'wrms_tels2', startDate: '2023-05-01', endDate: '2023-06-30', res: resolutions.s2 },
//   { dataset: datasets.s2, points: biaf, id: 'biafs2', startDate: '2020-05-01', endDate: '2020-06-30', res: resolutions.s2 },
//   { dataset: datasets.s2, points: fes, id: 'fess2', startDate: '2020-05-01', endDate: '2020-06-30', res: resolutions.s2 }
// ];

// Combine all configurations into a single list called 'configs'

var configs = [
  modis250Configs,
  //modis500Configs,
  //l8Configs,
  //s2Configs,
  //s3Configs
];

var finalResult = ee.FeatureCollection([]);
var r2rmseResults = []; 
var r2List = []
var dataList = []

var rmseList = [];

// Loop over configurations and apply the function
for (var i = 0; i < configs.length; i++) {
  var configList = configs[i];

  for (var j = 0; j < configList.length; j++) {
    var config = configList[j];

    // Get both training_data and image from the function result
    var result = get_training(config);
    var training_data = result[0];
    var image = result[1];
    
    finalResult = finalResult.merge(training_data);
    

    // result = training_data.randomColumn();

    // var training = result.filter(ee.Filter.lt('random', 0.8));
    // var validation = result.filter(ee.Filter.gte('random', 0.8));

    // // Train the classifier
    // var RF_regressor = ee.Classifier.smileRandomForest({
    //   numberOfTrees: 1000,
    //   bagFraction: 0.3
    // }).setOutputMode('REGRESSION')
    //   .train({
    //     'features': training,
    //     'classProperty': 'oc',
    //     'inputProperties': image.bandNames()
    //   });

    // // Apply the trained model on the validation set
    // var test = validation.classify(RF_regressor);

    // // Get the R^2 value
    // var r2 = test.select(['classification', 'oc'])
    //   .reduceColumns({
    //     reducer: ee.Reducer.pearsonsCorrelation().setOutputs(['correlation', 'p-value']),
    //     selectors: ['classification', 'oc']
    //   })
    //   .get('correlation');
      
    //   r2 = ee.Number(r2).pow(2)

    // //Get array of observation and prediction values
    // var observationValidation = ee.Array(test.aggregate_array('oc'));
    // var predictionValidation = ee.Array(test.aggregate_array('classification'));
    // // Compute residuals
    // var residualsValidation = observationValidation.subtract(predictionValidation);
    // // Compute RMSE with equation, print it
    // var rmse = residualsValidation.pow(2).reduce('mean', [0]).sqrt();
    // rmse = rmse.get([0]);

    // var dataName = config['id'];

    // dataList.push(dataName);
    // r2List.push(r2);
    // rmseList.push(rmse);
  }
  
  
// Randomly assign 'random' column
result = finalResult.randomColumn();

var training = result.filter(ee.Filter.lt('random', 0.8));
var validation = result.filter(ee.Filter.gte('random', 0.8));

// Train the classifier
var RF_regressor = ee.Classifier.smileRandomForest({
  numberOfTrees: 1000,
  bagFraction: 0.3
}).setOutputMode('REGRESSION')
  .train({
    'features': training, 
    'classProperty': 'oc', 
    'inputProperties': image.bandNames()
});

// Apply the trained model on the validation set
var test = validation.classify(RF_regressor);

// apply the train model on full data for export


var output = result.classify(RF_regressor)

print(output.size())

//print(image.bandNames())

// Get the R^2 value
var r2 = test.select(['classification', 'oc'])
  .reduceColumns({
    reducer: ee.Reducer.pearsonsCorrelation().setOutputs(['correlation', 'p-value']),
    selectors: ['classification', 'oc']
  })
  .get('correlation');

// Print the R^2 value
print('R^2 all :', ee.Number(r2).pow(2));
}



//print(finalResult.size())

//Print or use dataList, r2List, rmseList as needed
print("Data List: ", dataList);
print("R^2 List: ", r2List);
print("RMSE List: ", rmseList);





// // Create an empty dictionary
// var trainingDict = ee.Dictionary({});

// var finalResult = ee.FeatureCollection([]);

// var r2rmseResults = []; 
// var r2List = []
// var dataList = []

// var rmseList = [];
// // Loop over configurations and apply the function
// for (var i = 0; i < configs.length; i++) {
//   var config = configs[i];

  
//   // Get both training_data and image from the function result
//   var result = get_training(config);
//   var training_data = result[0];
//   var image = result[1];

//   finalResult = finalResult.merge(training_data);

//   result = training_data.randomColumn();
  
//   var training = result.filter(ee.Filter.lt('random', 0.8));
//   var validation = result.filter(ee.Filter.gte('random', 0.8));
  
//   // Train the classifier
//   var RF_regressor = ee.Classifier.smileRandomForest({
//     numberOfTrees: 1000,
//     bagFraction: 0.3
//   }).setOutputMode('REGRESSION')
//     .train({
//       'features': training, 
//       'classProperty': 'oc', 
//       'inputProperties': image.bandNames()
//   });
  
//   //print(image.bandNames())
  
//   // Apply the trained model on the validation set
//   var test = validation.classify(RF_regressor);

  
//   // Get the R^2 value
//   var r2 = test.select(['classification', 'oc'])
//     .reduceColumns({
//       reducer: ee.Reducer.pearsonsCorrelation().setOutputs(['correlation', 'p-value']),
//       selectors: ['classification', 'oc']
//     })
//     .get('correlation');
    
//     // Get array of observation and prediction values 
//   var observationValidation = ee.Array(test.aggregate_array('oc'));
//   var predictionValidation = ee.Array(test.aggregate_array('classification'));
//   // Compute residuals
//   var residualsValidation = observationValidation.subtract(predictionValidation);
//   // Compute RMSE with equation, print it
//   var rmse = residualsValidation.pow(2).reduce('mean', [0]).sqrt();
//   var rmse = rmse.get([0])
//   //print(rmse)
  
//   var dataName = config['id']

  
//   dataList.push(dataName)
//   r2List.push(r2)
//   rmseList.push(rmse)


// }
// //var r2rmseCollection = ee.FeatureCollection(r2rmseResults);


// // Export.table.toDrive({
// //   collection: r2rmseResults,
// //   folder: 'ee_exports',
// //   description: 'list_to_table',
// //   fileFormat: 'CSV'
// // });


// // var featureCollection = ee.FeatureCollection(r2rmseResults
// //                         .map(function(element){
// //                         return ee.Feature(null,{prop:element})}))

// // var convert = function(element){
// //                       return ee.Feature(null,{prop:element})}

// // var resultsFC = ee.FeatureCollection([
// //   ee.Feature(null, {
// //     'r2':r2List,
// //     'rmse': rmseList,
// //     'dataset': dataList
// //   })
// // ]);

// // print( resultsFC )

// // // Create a FeatureCollection with properties from the lists
// var resultsFC = ee.FeatureCollection(
//   r2List.map(function(r2, index) {
//     return ee.Feature(null, {
//       'r2': r2,
//       'rmse': rmseList[index],
//       'dataset': dataList[index]
//     });
//   })
// );

// //print(resultsFC.limit(10))

// Export.table.toDrive({
//   collection:  resultsFC ,
//   description: 'soc_results_r2_rmse',
//   fileFormat: 'csv',
//   folder: 'ee_exports'
// });

// // // Print the resulting FeatureCollection
// // print(resultsFC);

// Export.table.toDrive({
//   collection: finalResult,
//   folder: 'ee_exports',
//   description:'final_results_all',
//   fileFormat: 'CSV'
// });

 //r2_list.push([r2,rmse]); 

  // Print the R^2 value

// print(finalResult.limit(1));
// print(r2rmseResults)

//print(finalResult.size());
// Print the dictionary of training data
//print(trainingDict);

// Print the training data for biaf
//Get the training data for icraf_21 and icraf_23 by their names
// var icraf_21_data = ee.FeatureCollection(trainingDict.get('icraf_21modis250'));
// var icraf_23_data = ee.FeatureCollection(trainingDict.get('icraf_23modis250'));

// //Merge the two feature collections into one
// var mergedData = icraf_21_data.merge(icraf_23_data);
// //print(mergedData.size())


// //var modis_data =  ee.FeatureCollection(trainingDict.get('modis250'))

// //print(modis_data.size())

// // a;; data accuracy

// // Randomly assign 'random' column
// result = finalResult.randomColumn();

// var training = result.filter(ee.Filter.lt('random', 0.8));
// var validation = result.filter(ee.Filter.gte('random', 0.8));

// // Train the classifier
// var RF_regressor = ee.Classifier.smileRandomForest({
//   numberOfTrees: 1000,
//   bagFraction: 0.3
// }).setOutputMode('REGRESSION')
//   .train({
//     'features': training, 
//     'classProperty': 'oc', 
//     'inputProperties': image.bandNames()
// });

// // Apply the trained model on the validation set
// var test = validation.classify(RF_regressor);

// //print(image.bandNames())

// // Get the R^2 value
// var r2 = test.select(['classification', 'oc'])
//   .reduceColumns({
//     reducer: ee.Reducer.pearsonsCorrelation().setOutputs(['correlation', 'p-value']),
//     selectors: ['classification', 'oc']
//   })
//   .get('correlation');

// // Print the R^2 value
// print('R^2 all :', ee.Number(r2).pow(2));
// var chartValidation = ui.Chart.feature.byFeature(validation, 'classification', 'oc')
// .setChartType('ScatterChart').setOptions({
//   title: 'Predicted vs Observed - Validation data',
//   hAxis: {'title': 'predicted'},
//   vAxis: {'title': 'observed'},
//   pointSize: 3,
//   trendlines: { 0: {showR2: true, visibleInLegend: true} ,
//   1: {showR2: true, visibleInLegend: true}}});
// print(chartValidation);





//*******************************//

//predicting images

///******************//



/// call telengana images and apply the model

// call the telengana shapefile

var tel = ee.FeatureCollection('projects/fire-ashoka/assets/telengana_districts');

///var tel = tel.filter(ee.Filter.eq('New_Dist_4', 'Medak'))
var startDate = '2022-04-01';
var endDate = '2022-05-30';

var image = ee.ImageCollection('MODIS/061/MOD09GQ')
                  .filterDate(startDate, endDate)
                  .filterBounds(tel)
                  .select("sur.*")
                  .median()
                  .clip(tel);
                  
                  
                  
                  

var latlon = ee.Image.pixelLonLat();


// get other bands

var res = 250

var precip = precipitation.filterDate( '2021-01-01', '2022-05-01').mean()
                .resample('bilinear')
                .reproject({
                  crs: 'EPSG:4326',
                  scale: res
                }); 
var temp = temperature.reduce(ee.Reducer.percentile([25, 50, 75]))
                .resample('bilinear')
                .reproject({
                  crs: 'EPSG:4326',
                  scale: res
                });     
                 
var asp = aspect
.resample('bilinear')
                .reproject({
                  crs: 'EPSG:4326',
                  scale: res
                });  
var hills = hillshade
. resample('bilinear')
                .reproject({
                  crs: 'EPSG:4326',
                  scale: res
                });                    

image = image.addBands([latlon, precip, temp,  asp, hills]);

print(image.bandNames())


var falseColorVis = {
  min: -100.0,
  max: 8000.0,
  bands: ['sur_refl_b02', 'sur_refl_b02', 'sur_refl_b01'],
};           
           
//var dataset = get_training(modis250_tel)  


Map.addLayer(image,falseColorVis, 'image' )                  
var classified = image.classify(RF_regressor);    

//print(classified21)

//Map.addLayer(classified,{min: .33, max: 1.05}, 'classified')
                  



// Export.image.toDrive({
//   image: classified21,
//   description: 'soc_modis_medak_21',
//   folder : 'ee_exports',
//   scale: 250,
//   region: tel,
//   maxPixels: 1e10
// });

Export.image.toAsset({
 image: classified,
  description: 'soc_modis_telangana_22',
  scale: 250,
  assetId: 'soc_modis_telangana_22',
  region: tel,
  
});

