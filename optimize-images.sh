#!/bin/bash

# Image Optimization Script for Locia Farms Website
# This script optimizes images for web use

echo "🔧 Starting image optimization..."

# Check if ImageMagick is installed
if ! command -v magick &> /dev/null && ! command -v convert &> /dev/null; then
    echo "❌ ImageMagick not found. Installing..."
    if [[ "$OSTYPE" == "darwin"* ]]; then
        echo "Run: brew install imagemagick"
    else
        echo "Run: sudo apt-get install imagemagick"
    fi
    exit 1
fi

# Use 'convert' if 'magick' is not available
CONVERT_CMD=$(command -v magick || command -v convert)

# Backup directory
BACKUP_DIR="images_backup_$(date +%Y%m%d_%H%M%S)"
mkdir -p "$BACKUP_DIR"

echo "📦 Creating backup in $BACKUP_DIR..."
cp -r images/* "$BACKUP_DIR/" 2>/dev/null || true

# Optimize JPEG images
echo "🖼️  Optimizing JPEG images..."
find images -type f \( -name "*.jpg" -o -name "*.jpeg" \) | while read img; do
    echo "  Processing: $img"
    # Resize to max 1200px width, maintain aspect ratio, quality 85
    $CONVERT_CMD "$img" -resize 1200x900\> -quality 85 -strip "$img"
done

# Optimize PNG images
echo "🖼️  Optimizing PNG images..."
find images -type f -name "*.png" | while read img; do
    echo "  Processing: $img"
    # Resize to max 1200px width, maintain aspect ratio, convert to JPEG if possible
    # For PNGs, we'll optimize them
    $CONVERT_CMD "$img" -resize 1200x900\> -quality 85 -strip "$img"
done

echo "✅ Image optimization complete!"
echo "📊 Checking new file sizes..."
find images -type f \( -name "*.jpg" -o -name "*.jpeg" -o -name "*.png" \) -exec ls -lh {} \; | awk '{print $5, $9}' | sort -hr | head -10

echo ""
echo "💾 Original images backed up to: $BACKUP_DIR"
echo "🚀 You can now commit and push the optimized images!"

