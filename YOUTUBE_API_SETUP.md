# YouTube API Setup Guide

## Overview

This guide will help you set up automatic YouTube video fetching from your YouTube channel. Once configured, your website will automatically display your latest YouTube videos without manually editing `videos.json`.

## Benefits

✅ **Automatic Updates**: New videos appear automatically when published  
✅ **No Manual Editing**: No need to edit JSON files  
✅ **Always Up-to-Date**: Website stays in sync with your YouTube channel  
✅ **Fallback Support**: Falls back to `videos.json` if API fails  

## Setup Steps

### Step 1: Get Your YouTube Channel ID

1. Go to [YouTube Studio](https://studio.youtube.com/)
2. Click on **Settings** (gear icon)
3. Click on **Channel** → **Advanced settings**
4. Your **Channel ID** is listed under "Channel URL"
   - It looks like: `UCxxxxxxxxxxxxxxxxxxxxxxxxxx`
   - Or use your channel username: `@lociafarms` (if you have a custom URL)

### Step 2: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or select existing one)
   - Click **Select a project** → **New Project**
   - Name it "Locia Farms Website" (or similar)
   - Click **Create**

### Step 3: Enable YouTube Data API v3

1. In your Google Cloud project, go to **APIs & Services** → **Library**
2. Search for "YouTube Data API v3"
3. Click on it and click **Enable**

### Step 4: Create API Key

1. Go to **APIs & Services** → **Credentials**
2. Click **Create Credentials** → **API Key**
3. Copy the API key (you'll use this in the next step)
4. (Optional) Click **Restrict Key** to secure it:
   - Under "API restrictions", select "Restrict key"
   - Choose "YouTube Data API v3"
   - Click **Save**

### Step 5: Configure the Website

1. Open `website/youtube-api-config.js`
2. Update the configuration:

```javascript
const YOUTUBE_API_CONFIG = {
    API_KEY: 'YOUR_ACTUAL_API_KEY_HERE',      // Paste your API key
    CHANNEL_ID: 'UCxxxxxxxxxxxxxxxxxxxx',      // Your Channel ID
    MAX_RESULTS: 12,                            // Number of videos to show
    USE_API: true                              // Enable automatic fetching
};
```

### Step 6: Test the Configuration

1. Save the file
2. Open `index.html` in your browser
3. Open browser console (F12 → Console tab)
4. Check for any errors
5. Videos should automatically load from your YouTube channel!

## Configuration Options

### YOUTUBE_API_CONFIG

```javascript
{
    API_KEY: 'your-api-key',           // Required: Your YouTube Data API key
    CHANNEL_ID: 'your-channel-id',     // Required: Your YouTube Channel ID
    MAX_RESULTS: 12,                   // Optional: Number of videos (1-50)
    CACHE_DURATION: 24*60*60*1000,    // Optional: Cache duration (24 hours)
    USE_API: true                      // Required: Enable/disable API fetching
}
```

### Channel ID Formats

- **Channel ID**: `UCxxxxxxxxxxxxxxxxxxxxxxxxxx` (recommended)
- **Channel Username**: `@lociafarms` or `lociafarms`
- **Channel Handle**: Works automatically

## How It Works

1. **Automatic Fetching**: Website checks YouTube API for latest videos
2. **Smart Caching**: Results are cached for 24 hours (configurable)
3. **Fallback**: If API fails, falls back to `videos.json`
4. **No Manual Updates**: New videos appear automatically when published

## Security Best Practices

### 1. Restrict Your API Key

In Google Cloud Console:
- Go to **Credentials** → Click on your API key
- Under "API restrictions", select "Restrict key"
- Choose "YouTube Data API v3"
- Click **Save**

### 2. HTTP Referrer Restrictions (Optional)

- Under "Application restrictions", select "HTTP referrers"
- Add your website domains:
  - `https://lociafarms-rgb.github.io/*`
  - `https://www.lociafarms.com/*` (if you have a custom domain)

### 3. Rate Limits

YouTube API has quotas:
- **Default**: 10,000 units per day
- **Per video fetch**: ~100 units
- **Estimated**: ~100 videos per day (plenty for a website)

## Troubleshooting

### Videos Not Showing

1. **Check API Key**: Make sure API key is correct
2. **Check Channel ID**: Verify channel ID is correct
3. **Check Console**: Look for errors in browser console
4. **Check API Status**: Verify YouTube Data API v3 is enabled
5. **Fallback**: Check if `videos.json` has videos (will use as fallback)

### Common Errors

**Error: "YouTube API error: API key not valid"**
- Solution: Check your API key is correct and not restricted incorrectly

**Error: "YouTube API error: Channel not found"**
- Solution: Verify your Channel ID is correct

**Error: "Quota exceeded"**
- Solution: You've hit the daily quota limit (very rare)
- Wait 24 hours or request quota increase in Google Cloud Console

## Manual Override

You can always use `videos.json` manually:
- Set `USE_API: false` in `youtube-api-config.js`
- Edit `videos.json` manually as before

## Example Configuration

```javascript
const YOUTUBE_API_CONFIG = {
    API_KEY: 'AIzaSyCxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    CHANNEL_ID: 'UCxxxxxxxxxxxxxxxxxxxxxxxxxx',
    MAX_RESULTS: 12,
    CACHE_DURATION: 24 * 60 * 60 * 1000, // 24 hours
    USE_API: true
};
```

## Next Steps

1. ✅ Get YouTube Channel ID
2. ✅ Create Google Cloud project
3. ✅ Enable YouTube Data API v3
4. ✅ Create API key
5. ✅ Update `youtube-api-config.js`
6. ✅ Test and verify videos load
7. ✅ Commit and push to GitHub

Once configured, your website will automatically stay in sync with your YouTube channel!

