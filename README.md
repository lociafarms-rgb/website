# Locia Farms Website

Modern farmcore-styled website for Locia Farms - a peaceful family farm providing fresh goats, chickens, and produce.

## Features

- ✅ Responsive design with farmcore aesthetic
- ✅ Apple Glass material effects
- ✅ Photo reel carousel
- ✅ Events section
- ✅ Video blog with YouTube integration
- ✅ Products & services section
- ✅ Contact information
- ✅ Performance optimized (lazy loading, caching)

## Setup

### GitHub Pages

This website is hosted on GitHub Pages. Your site is available at:
- **Live URL**: `https://lociafarms-rgb.github.io/website/`

To update settings:
1. Go to repository settings → Pages
2. Select `main` branch as source
3. Save changes

### Local Development

```bash
# Simple HTTP server
python3 -m http.server 8000

# Or use any local server
# Then visit: http://localhost:8000
```

## YouTube Integration

The website automatically fetches videos from your YouTube channel. See `YOUTUBE_SETUP.md` for configuration.

## Repository Structure

```
website/
├── index.html              # Main homepage
├── styles.css              # Stylesheet
├── script.js              # Main JavaScript
├── video-loader.js         # YouTube video loader
├── youtube-api-config.js   # YouTube API configuration
├── videos.json             # Manual video entries (fallback)
├── videos/
│   └── index.html          # Video blog page
├── images/                 # Website images
├── logos/                  # Logo files
└── README.md               # This file
```
