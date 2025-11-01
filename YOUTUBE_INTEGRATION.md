# YouTube Video Integration Guide

## Overview
This guide explains how to add your published YouTube videos to the Locia Farms website video blog.

## How It Works

The website automatically loads YouTube videos from a JSON file (`videos.json`). When you publish a new video on YouTube, simply add it to this file.

## Adding a New YouTube Video

### Step 1: Get Your YouTube Video Information

When you publish a video on YouTube, you'll get a URL like:
- `https://www.youtube.com/watch?v=VIDEO_ID`
- Or: `https://youtu.be/VIDEO_ID`

### Step 2: Edit `videos.json`

Open `videos.json` in the website folder and add your video information:

```json
{
  "videos": [
    {
      "id": "your-video-id",
      "title": "Farm Tour - Spring 2025",
      "description": "Join us for a tour of the farm in spring, meet our animals, and see how we care for them.",
      "date": "2025-04-15",
      "thumbnail": "https://img.youtube.com/vi/your-video-id/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=your-video-id"
    }
  ]
}
```

### Step 3: Video Data Fields

- **id**: Your YouTube video ID (the part after `v=` in the URL, or after `youtu.be/`)
- **title**: The title of your video
- **description**: A short description of the video
- **date**: Publication date in YYYY-MM-DD format
- **thumbnail**: (Optional) YouTube thumbnail URL - auto-generated if not provided
- **youtubeUrl**: Full YouTube URL or just the video ID

### Example with Multiple Videos

```json
{
  "videos": [
    {
      "id": "abc123xyz",
      "title": "Farm Tour - Spring 2025",
      "description": "Join us for a tour of the farm in spring, meet our animals, and see how we care for them.",
      "date": "2025-04-15",
      "youtubeUrl": "https://www.youtube.com/watch?v=abc123xyz"
    },
    {
      "id": "def456uvw",
      "title": "Goat Care Tips",
      "description": "Learn about how we care for our goats at Locia Farms.",
      "date": "2025-04-20",
      "youtubeUrl": "https://www.youtube.com/watch?v=def456uvw"
    }
  ]
}
```

## Video Order

Videos are displayed in the order they appear in the `videos.json` array. Most recent videos should be listed first.

## Quick Steps to Add a Video

1. Publish your video on YouTube
2. Copy the video URL or ID
3. Open `website/videos.json`
4. Add a new entry to the `videos` array with:
   - Video ID (from URL)
   - Title
   - Description
   - Date
   - YouTube URL
5. Save the file
6. Commit and push to GitHub
7. Your video will automatically appear on the website!

## Where Videos Appear

- **Homepage**: The `#videos` section shows videos (limited display)
- **Video Blog Page**: `videos/index.html` shows all videos in a grid layout

## Technical Details

- Videos are loaded dynamically using JavaScript
- YouTube embeds use responsive 16:9 aspect ratio
- Videos use lazy loading for performance
- Each video card includes:
  - Embedded YouTube player
  - Title and description
  - Publication date
  - "Watch on YouTube" link

## Tips

1. **Keep descriptions short** - Aim for 1-2 sentences for best display
2. **Use consistent date format** - YYYY-MM-DD format is recommended
3. **Order matters** - Put newest videos first in the array
4. **Test locally** - You can test by editing `videos.json` and opening `index.html` in your browser before pushing to GitHub

## Support

If you need help adding videos or have questions, refer to this guide or check the example entry in `videos.json`.

