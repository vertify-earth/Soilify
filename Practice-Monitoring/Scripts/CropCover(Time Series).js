// Create image collection of S-2 imagery for the perdiod 2016-2018
var S2 = ee.ImageCollection('COPERNICUS/S2')

//filter start and end date
.filterDate('2020-09-10', '2021-10-30')

.filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 1))

//filter according to drawn boundary
.filterBounds(geometry);

var maskcloud1 = function(image) {
var QA60 = image.select(['QA60']);
return image.updateMask(QA60.lt(1));
};

// Function to calculate and add an NDVI band
var addNDVI = function(image) {
return image.addBands(image.normalizedDifference(['B8', 'B4']));
};

// Add NDVI band to image collection
var S2 = S2.map(addNDVI);
// Extract NDVI band and create NDVI median composite image
var NDVI = S2.select(['nd']);
var NDVImed = NDVI.median(); //I just changed the name of this variable ;)

// Create palettes for display of NDVI
var ndvi_pal = ['#d73027', '#f46d43', '#fdae61', '#fee08b', '#d9ef8b',
'#a6d96a'];

// Create a time series chart.
var plotNDVI = ui.Chart.image.seriesByRegion(S2, table2,ee.Reducer.mean(),
'nd',500,'system:time_start', 'system:index')
              .setChartType('LineChart').setOptions({
                title: 'Crop Health term time series',
                hAxis: {title: 'Date'},
                vAxis: {title: 'NDVI'}
});


// Display.
print(plotNDVI);



var clip = NDVImed.clip(geometry);
Map.addLayer(clip, {min:-0.5, max:0.9, palette: ndvi_pal}, 'NDVI');








