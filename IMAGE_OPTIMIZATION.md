# Image Optimization Guide

## Current Issue
Some images are very large (10MB+), which causes slow loading times. Images should be optimized for web use.

## Recommended Image Sizes
- **Profile images**: Max 500KB, 800x600px or smaller
- **Carousel images**: Max 800KB, 1200x900px or smaller
- **Thumbnail images**: Max 100KB, 200x200px or smaller

## How to Optimize Images

### Option 1: Using Online Tools (Easiest)
1. Visit https://tinypng.com/ or https://squoosh.app/
2. Upload your images
3. Download optimized versions
4. Replace the original files

### Option 2: Using ImageMagick (Command Line)
```bash
# Install ImageMagick (if not installed)
# macOS: brew install imagemagick
# Linux: sudo apt-get install imagemagick

# Compress JPEG images
cd website/images
find . -name "*.jpeg" -o -name "*.jpg" | while read img; do
    magick "$img" -quality 85 -resize 1200x900\> "$img"
done

# Compress PNG images
find . -name "*.png" | while read img; do
    magick "$img" -quality 85 -resize 1200x900\> "$img"
done
```

### Option 3: Using Python (Pillow)
```python
from PIL import Image
import os

def optimize_image(input_path, output_path, max_size=(1200, 900), quality=85):
    img = Image.open(input_path)
    img.thumbnail(max_size, Image.Resampling.LANCZOS)
    img.save(output_path, optimize=True, quality=quality)

# Usage
optimize_image('large_image.jpg', 'optimized_image.jpg')
```

## Target File Sizes
- `images/splash-home-goat-01.jpeg`: Currently 10MB → Target: <800KB
- `images/goats/caramella_profile.jpeg`: Currently 1.2MB → Target: <500KB

## Quick Fix Script
Run this in the website directory:
```bash
# Install jpegoptim and optipng (optional but recommended)
# macOS: brew install jpegoptim optipng

# Optimize all JPEGs
find images -name "*.jpeg" -o -name "*.jpg" | xargs jpegoptim --max=85 --strip-all

# Optimize all PNGs
find images -name "*.png" | xargs optipng -o7
```

