# Seasonal Bulletin Images Guide

This guide provides information about the seasonal bulletin images used on the Locia Farms website.

## Image Structure

The website now supports seasonal event images displayed in the Events section. Each seasonal event card features a stock image representing that season.

## Image Files

The following seasonal bulletin images are referenced in the website:

### Current Seasonal Images

1. **Spring 2025** - `images/seasonal-spring-2025.jpg`
   - Used for: Spring Farm Tour event
   - Recommended: Images representing spring on a farm (flowers blooming, baby animals, green fields, etc.)

2. **Summer 2025** - `images/seasonal-summer-2025.jpg`
   - Used for: Summer Harvest Festival event
   - Recommended: Images representing summer harvest (sunny fields, harvesting, fresh produce, vibrant colors, etc.)

3. **Fall 2025** - `images/seasonal-fall-2025.jpg`
   - Used for: Fall Open House event
   - Recommended: Images representing autumn on a farm (fall foliage, pumpkins, corn stalks, autumn harvest, etc.)

## Image Specifications

### Technical Requirements

- **Format**: JPG or JPEG (recommended for photographs)
- **Aspect Ratio**: 16:9 (wide format works well for cards)
- **Recommended Dimensions**: 
  - Minimum: 800x450 pixels
  - Ideal: 1200x675 pixels or larger
  - Maximum: 1920x1080 pixels (for web optimization)
- **File Size**: Optimized for web (under 500KB recommended)
- **Color Space**: sRGB

### Style Guidelines

- Images should represent the season and farm activities
- Maintain consistency in style across all seasonal images
- Consider the website's farmcore aesthetic (warm, earthy, natural tones)
- Images should be family-friendly and appropriate for a farm setting
- Stock photos or professional photography work well

## Where to Find Images

You can use stock images from:
- Unsplash (unsplash.com) - Free, high-quality stock photos
- Pexels (pexels.com) - Free stock photos
- Pixabay (pixabay.com) - Free stock photos
- Adobe Stock - Premium stock photos (requires subscription)
- Shutterstock - Premium stock photos (requires subscription)

### Search Keywords

- **Spring**: "farm spring", "farm animals spring", "green field farm", "baby animals farm"
- **Summer**: "farm harvest summer", "vegetable harvest", "sunny farm field", "fresh produce farm"
- **Fall**: "farm autumn", "pumpkin farm", "fall harvest", "farm autumn foliage"

## Adding Images

1. Download or create images matching the specifications above
2. Name them according to the pattern: `seasonal-[season]-[year].jpg`
   - Example: `seasonal-spring-2025.jpg`
3. Place them in the `/website/images/` directory
4. Ensure images are optimized for web (compressed, proper dimensions)

## Future Seasons

To add images for future years or additional seasons:

1. Update the HTML in `index.html` with new image paths
2. Add new image files to the `images/` directory
3. Follow the same naming convention: `seasonal-[season]-[year].jpg`

## Image Optimization

Before uploading, consider:

1. **Compression**: Use tools like TinyPNG, ImageOptim, or Photoshop to compress images
2. **Format**: JPG for photographs, PNG for graphics (use JPG for seasonal photos)
3. **Responsive**: The website will automatically scale images, but starting with appropriate dimensions helps

## Notes

- The website uses lazy loading for these images, so they won't load until the user scrolls near them
- Images have a hover effect that slightly zooms in on the image
- All images should include proper alt text for accessibility (already included in HTML)

## Current Status

✅ Image structure added to HTML
✅ CSS styling implemented
✅ Responsive design configured
⏳ Images need to be added to `/website/images/` directory

Once you add the actual image files with the correct names, they will automatically appear on the website.
