var data = sentinel.filterBounds(roi).filterDate('2022-08-07','2022-08-13').median()

var RED = data.select('B4')
var NIR = data.select('B8')

var NDVI = RED.subtract(NIR).divide(RED.add(NIR))
var NDVIc = NDVI.clip(roi)

Map.centerObject(roi,8)
Map.addLayer(NDVIc)

// // // TIFF file 
 Export.image.toDrive({
 image: NDVIc,
description: 'ndvi',
region: roi,
scale: 10,
maxPixels: 1203488517000});