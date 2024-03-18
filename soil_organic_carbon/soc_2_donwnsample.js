// Load the predicted results image (assuming it's already loaded or generated)
var predictedResults = ee.Image("path_to_predicted_results_image");

// Define the projection and scale for the output image (30 meters)
var newProjection = predictedResults.projection();
var newScale = 30; // meters

// Reproject the image to the new resolution using bilinear interpolation
var downsampledResults = predictedResults
  .reproject({
    crs: newProjection,
    scale: newScale
  });

// Display the downsampled results
Map.addLayer(downsampledResults, {}, 'Downsampled Predicted Results');
