/**
 * YouTube API Configuration
 * This file contains the YouTube API setup and video fetching logic
 * 
 * To use automatic YouTube video fetching:
 * 1. Get a YouTube Data API key from Google Cloud Console
 * 2. Set your YouTube channel ID or username
 * 3. Update the config below
 */

const YOUTUBE_API_CONFIG = {
    // Your YouTube Data API v3 key
    // Get one at: https://console.cloud.google.com/apis/credentials
    API_KEY: 'YOUR_YOUTUBE_API_KEY_HERE',
    
    // Your YouTube Channel ID or Username
    // Find it at: https://www.youtube.com/account_advanced
    CHANNEL_ID: 'YOUR_CHANNEL_ID_OR_USERNAME',
    
    // Number of videos to fetch (max 50 per request)
    MAX_RESULTS: 12,
    
    // Cache duration in milliseconds (24 hours default)
    CACHE_DURATION: 24 * 60 * 60 * 1000,
    
    // Use API instead of videos.json file
    USE_API: false // Set to true to enable automatic fetching
};

/**
 * YouTube API Service
 * Handles fetching videos from YouTube Data API
 */
class YouTubeAPIService {
    constructor(config) {
        this.config = config;
        this.cache = null;
        this.cacheTimestamp = null;
    }

    /**
     * Check if API is configured and enabled
     */
    isConfigured() {
        return this.config.USE_API && 
               this.config.API_KEY && 
               this.config.API_KEY !== 'YOUR_YOUTUBE_API_KEY_HERE' &&
               this.config.CHANNEL_ID && 
               this.config.CHANNEL_ID !== 'YOUR_CHANNEL_ID_OR_USERNAME';
    }

    /**
     * Check if cache is still valid
     */
    isCacheValid() {
        if (!this.cache || !this.cacheTimestamp) {
            return false;
        }
        const now = Date.now();
        return (now - this.cacheTimestamp) < this.config.CACHE_DURATION;
    }

    /**
     * Get channel ID from username if needed
     */
    async getChannelId(username) {
        if (!username.startsWith('UC')) {
            // It's a username, need to convert to channel ID
            const url = `https://www.googleapis.com/youtube/v3/channels?part=id&forUsername=${username}&key=${this.config.API_KEY}`;
            
            try {
                const response = await fetch(url);
                const data = await response.json();
                
                if (data.items && data.items.length > 0) {
                    return data.items[0].id;
                }
            } catch (error) {
                console.error('Error fetching channel ID:', error);
            }
        }
        
        return username; // Assume it's already a channel ID
    }

    /**
     * Fetch videos from YouTube API
     */
    async fetchVideos() {
        if (!this.isConfigured()) {
            throw new Error('YouTube API is not configured');
        }

        // Return cached data if valid
        if (this.isCacheValid()) {
            return this.cache;
        }

        try {
            // Get channel ID if username was provided
            const channelId = await this.getChannelId(this.config.CHANNEL_ID);
            
            // Fetch videos from YouTube API
            const apiUrl = `https://www.googleapis.com/youtube/v3/search?` +
                `part=snippet&` +
                `channelId=${channelId}&` +
                `type=video&` +
                `order=date&` +
                `maxResults=${this.config.MAX_RESULTS}&` +
                `key=${this.config.API_KEY}`;

            const response = await fetch(apiUrl);
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`YouTube API error: ${errorData.error?.message || response.statusText}`);
            }

            const data = await response.json();
            
            // Transform YouTube API response to our video format
            const videos = data.items.map(item => ({
                id: item.id.videoId,
                title: item.snippet.title,
                description: item.snippet.description.substring(0, 200) + (item.snippet.description.length > 200 ? '...' : ''),
                date: item.snippet.publishedAt.split('T')[0], // Extract date from ISO string
                thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.default?.url,
                youtubeUrl: `https://www.youtube.com/watch?v=${item.id.videoId}`
            }));

            // Cache the results
            this.cache = videos;
            this.cacheTimestamp = Date.now();

            return videos;
        } catch (error) {
            console.error('Error fetching videos from YouTube API:', error);
            throw error;
        }
    }

    /**
     * Clear cache (force refresh on next request)
     */
    clearCache() {
        this.cache = null;
        this.cacheTimestamp = null;
    }
}

// Create singleton instance
const youtubeAPI = new YouTubeAPIService(YOUTUBE_API_CONFIG);

