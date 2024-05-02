

library(raster)
library(rgdal)
library(ggplot2)
library(stars)
library(scales)
library(RColorBrewer)


create_theme <- function() {
  theme(
    axis.ticks = element_blank(), # Hide axis ticks
    #axis.text = element_blank(), # Hide axis text
    axis.line = element_blank(), # Hide axis line
    panel.border = element_rect(color = "black", fill = NA, size = 0.5),
    panel.grid.major = element_line(color = '#E5E5E5', size = 0.5), # Light dark color for major grid lines
    panel.grid.minor = element_line(color = '#EBEBEB', size = 0.25), # Lighter color for minor grid lines
    panel.background = element_rect(fill = "white", color = NA), # White background for the panel
    plot.background = element_rect(fill = "white", color = NA), # White background for the plot
    legend.title = element_blank(), # Hide legend title
    axis.title = element_blank(), # Hide axis title
    # legend.key.size = unit(.5, 'cm'), # Adjust legend key size
    # legend.key.height = unit(.5, 'cm'), # Adjust legend key height
    # legend.key.width = unit(.5, 'cm'), # Adjust legend key width
    #legend.text = element_text(size = 5) # Adjust legend text size
  )
}


create_plot <- function(raster_file) {
  ndvi_raster <- read_stars(raster_file)
  theme_for_map <- create_theme()
  
  colors <- brewer.pal(5, "Reds")
  
  # Manually create breaks and labels including "<10" and ">14"
  breaks <- c( 6, 7, 8, 9)
  labels <- c("<6", "7", "8", ">9")
  
  ndvi <- ggplot() +
    geom_stars(data = ndvi_raster) +
    scale_x_continuous(expand = c(0, 0)) + 
    scale_y_continuous(expand = c(0, 0)) +
    scale_fill_gradientn(colours = colors, 
                         breaks = breaks, 
                         labels = labels, 
                         #limits = c(9, 15),
                         na.value = NA,
                         guide = guide_legend(reverse = TRUE)) +
    theme_for_map +
    labs( 
      title = 'Soil Organic Carbon Levels in Medak (Telangana), 2022',
      subtitle = '(Tonnes per Hectare)',
      caption = 'Modelled with Landsat 8 (30m)'
    )
    #labs(title = 'Soil Organic Carbon - Bolangir 2022', subtitle = 'In tonnes per hectare')
  
  return(ndvi)
}

raster_file <- "/soc_l8_Medak_22_30m_masked_esri_tons.tif"

plot <- create_plot(raster_file)
#print(plot)

# Save the plot to a file
ggsave(filename = "/soc_l8_Medak_22_30m_masked_tons.png",
       plot = plot, width = 10, height = 8, dpi = 300,bg='#ffffff')




#  Yavatmal (Maharashtra) 
# Bolangir (Odisha),
# Medak (Telangana)


