# YouTube Video Integration Setup

## Quick Start

Your YouTube API key is already configured! You just need to:

1. **Enable YouTube Data API v3**: [Enable API](https://console.cloud.google.com/apis/library/youtube.googleapis.com?project=winged-signal-476920-m1)

2. **Get your YouTube Channel ID**:
   - Go to [YouTube Studio](https://studio.youtube.com/)
   - Settings → Channel → Advanced settings
   - Copy your Channel ID (starts with `UC...`)

3. **Update `youtube-api-config.js`**:
   ```javascript
   CHANNEL_ID: 'YOUR_CHANNEL_ID_HERE',
   USE_API: true  // Change from false to true
   ```

4. **Restrict API Key** (Security - Recommended):
   - Go to [API Keys](https://console.cloud.google.com/apis/credentials?project=winged-signal-476920-m1)
   - Edit your key: `AIzaSyCZbXgkdfrwesjNZgSkB_b5V8KUjS-ADiI`
   - **API restrictions**: Restrict to "YouTube Data API v3"
   - **Application restrictions**: Add HTTP referrer: `https://lociafarms-rgb.github.io/*`

## How It Works

- **Automatic**: Fetches latest videos from your YouTube channel
- **Cached**: Results cached for 24 hours (performance)
- **Fallback**: Uses `videos.json` if API fails or is disabled

## Manual Method (Alternative)

If you prefer manual control, edit `videos.json` and add videos manually. The system will use the JSON file when `USE_API: false` in `youtube-api-config.js`.

## Support

- **API Key**: Already configured from marketing repository
- **Project**: `winged-signal-476920-m1`
- **Quick Links**: See inline comments in `youtube-api-config.js`

