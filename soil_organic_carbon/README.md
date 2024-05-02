# Soil Organic Carbon Prediction

This repository contains a collection of scripts and notebooks aimed at predicting and analyzing soil organic carbon (SOC) levels using various data science techniques. The files include JavaScript for use with Google Earth Engine, R scripts for data visualization, and Jupyter notebooks for statistical analysis.

## Overview

Soil organic carbon is a critical component of soil matter that promotes fertility, structure, biological activity, and water retention. By predicting SOC levels, we can better understand carbon dynamics and help inform soil management and climate change mitigation strategies.

## Repository Structure

- `soc_1_prediction.js`: Script for predicting SOC using satellite imagery and machine learning models.
- `soc_2_downsample.js`: Script to downsample the results to match with masks.
- `soc_3_esri_lulc.js`: Uses ESRI landcover maps to mask out the irrelavant areas.
- `soc_5_bdoc_conversion.js`: Script for converting the soc percentage measurements into SOC tonnes per hectare.
- `soc_maps_visualisation.R`: R script for creating visualizations of SOC distributions across different geographic regions.
- `soc_zonal_stats_district.ipynb`: Jupyter notebook for performing zonal statistical analysis on district-level SOC data.


