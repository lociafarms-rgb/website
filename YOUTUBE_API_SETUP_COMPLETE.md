# YouTube API Setup - Almost Complete! ✅

## ✅ What's Already Done

1. **✅ API Key Found**: Retrieved from `marketing/pipeline/.env`
   - API Key: `AIzaSyCZbXgkdfrwesjNZgSkB_b5V8KUjS-ADiI`
   - Project: `winged-signal-476920-m1`
   - ✅ Added to `youtube-api-config.js`

2. **✅ Configuration Updated**: API key is now in the config file

## ⚠️ What You Need to Do

### Step 1: Enable YouTube Data API v3 (2 minutes)

Your API key needs YouTube Data API v3 enabled:

1. Go to: [Enable YouTube Data API v3](https://console.cloud.google.com/apis/library/youtube.googleapis.com?project=winged-signal-476920-m1)
2. Click **Enable**
3. Wait for it to enable (usually instant)

### Step 2: Restrict Your API Key (Security - Recommended)

Since this API key will be public in GitHub Pages, restrict it:

1. Go to: [API Keys](https://console.cloud.google.com/apis/credentials?project=winged-signal-476920-m1)
2. Find your API key: `AIzaSyCZbXgkdfrwesjNZgSkB_b5V8KUjS-ADiI`
3. Click on it to edit
4. Under "API restrictions":
   - Select "Restrict key"
   - Choose "YouTube Data API v3"
   - Click **Save**
5. Under "Application restrictions":
   - Select "HTTP referrers (web sites)"
   - Click "Add an item"
   - Add: `https://lociafarms-rgb.github.io/*`
   - (If you have a custom domain, also add: `https://www.lociafarms.com/*`)
   - Click **Save**

### Step 3: Get Your YouTube Channel ID

1. Go to [YouTube Studio](https://studio.youtube.com/)
2. Click **Settings** (gear icon)
3. Click **Channel** → **Advanced settings**
4. Copy your **Channel ID** (starts with `UC...`)
   - Example: `UCxxxxxxxxxxxxxxxxxxxxxxxxxx`
   - Or use your channel handle: `@lociafarms` (if you have one)

### Step 4: Update the Config File

Edit `website/youtube-api-config.js`:

```javascript
const YOUTUBE_API_CONFIG = {
    API_KEY: 'AIzaSyCZbXgkdfrwesjNZgSkB_b5V8KUjS-ADiI', // ✅ Already set
    CHANNEL_ID: 'YOUR_CHANNEL_ID_HERE', // ⚠️ Replace with your Channel ID
    MAX_RESULTS: 12,
    CACHE_DURATION: 24 * 60 * 60 * 1000,
    USE_API: true // ⚠️ Change to true
};
```

### Step 5: Test It!

1. Save the file
2. Open `index.html` in your browser
3. Check the browser console (F12) for any errors
4. Videos should load automatically from your YouTube channel!

## Quick Links

- **Enable YouTube Data API**: [Click Here](https://console.cloud.google.com/apis/library/youtube.googleapis.com?project=winged-signal-476920-m1)
- **Restrict API Key**: [Click Here](https://console.cloud.google.com/apis/credentials?project=winged-signal-476920-m1)
- **Find Channel ID**: [YouTube Studio Settings](https://studio.youtube.com/channel/advanced_settings)

## Security Notes

✅ **API Key is Public**: Since this is a client-side JavaScript file, the API key will be visible in the browser. This is normal and acceptable **IF** you:
- Restrict the key to specific HTTP referrers (your domain)
- Only enable YouTube Data API v3 for this key
- Monitor usage in Google Cloud Console

The key is restricted to your domain, so even if someone sees it, they can't use it from other websites.

## Current Status

- ✅ API Key: Configured
- ⏳ YouTube Data API v3: Needs to be enabled
- ⏳ API Key Restrictions: Should be configured
- ⏳ Channel ID: Needs to be added
- ⏳ USE_API: Needs to be set to `true`

Once you complete these steps, your website will automatically fetch and display videos from your YouTube channel!

