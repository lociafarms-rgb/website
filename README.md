# Locia Farms Website

Static website for Locia Farms - a family farm providing fresh goats, chickens, and produce.

## Setup

This website is hosted on GitHub Pages. To enable GitHub Pages:

1. Go to your repository settings on GitHub
2. Navigate to "Pages" in the left sidebar
3. Under "Source", select the `main` branch
4. Click "Save"
5. Your site will be available at: `https://lociafarms-rgb.github.io/website/`

## Local Development

Simply open `index.html` in a web browser, or use a local server:

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000`

## Repository Structure

```
website/
├── index.html          # Main homepage
├── styles.css          # Stylesheet
├── images/             # Website images
│   └── splash-*.jpg
└── logos/              # Logo files
    ├── logo.png
    ├── favicon.png
    └── locia_farms_vector.svg
```

