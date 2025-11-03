/**
 * YouTube Video Loader for Locia Farms
 * Dynamically loads and displays YouTube videos from videos.json or YouTube API
 */

class VideoLoader {
    constructor() {
        this.videosContainer = null;
        this.videos = [];
        this.init();
    }

    async init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.loadVideos());
        } else {
            this.loadVideos();
        }
    }

    async loadVideos() {
        // Find video containers
        const homeContainer = document.querySelector('#videos .videos-grid');
        const videoPageContainer = document.querySelector('.video-grid');
        
        this.videosContainer = videoPageContainer || homeContainer;
        
        if (!this.videosContainer) return;

        try {
            // Try to load from YouTube API first (if configured)
            if (typeof youtubeAPI !== 'undefined' && youtubeAPI.isConfigured()) {
                try {
                    this.videos = await youtubeAPI.fetchVideos();
                    if (this.videos.length > 0) {
                        this.renderVideos();
                        return;
                    }
                } catch (apiError) {
                    // Silently fall back to videos.json if API fails
                    // Fall through to videos.json loading
                }
            }

            // Fallback to videos.json file
            const videosPath = window.location.pathname.includes('/videos/') 
                ? '../videos.json' 
                : 'videos.json';
            
            const response = await fetch(videosPath);
            if (!response.ok) {
                throw new Error('Failed to load videos.json');
            }
            
            const data = await response.json();
            this.videos = data.videos || [];

            if (this.videos.length === 0) {
                // Don't show empty state if there's already placeholder content
                const existingEmpty = this.videosContainer.querySelector('.empty-state');
                if (!existingEmpty) {
                    this.showEmptyState();
                }
                return;
            }

            // Render videos
            this.renderVideos();
        } catch (error) {
            // Only show empty state if container is empty
            const existingContent = this.videosContainer.querySelector('.empty-state, .video-item, .video-card');
            if (!existingContent) {
                this.showEmptyState();
            }
        }
    }

    renderVideos() {
        if (!this.videosContainer) return;

        // Clear existing placeholder content
        const emptyState = this.videosContainer.querySelector('.empty-state');
        const placeholderCard = this.videosContainer.querySelector('.video-card.empty-state');
        if (emptyState) {
            emptyState.remove();
        }
        if (placeholderCard) {
            placeholderCard.remove();
        }

        // Render each video
        this.videos.forEach(video => {
            const videoElement = this.createVideoElement(video);
            this.videosContainer.appendChild(videoElement);
        });
    }

    createVideoElement(video) {
        // Extract YouTube video ID from URL or use direct ID
        const videoId = this.extractVideoId(video.youtubeUrl || video.id);
        
        const videoItem = document.createElement('div');
        videoItem.className = 'video-item material-card';
        
        videoItem.innerHTML = `
            <div class="video-embed">
                <iframe 
                    src="https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1" 
                    title="${this.escapeHtml(video.title)}"
                    frameborder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowfullscreen
                    loading="lazy">
                </iframe>
            </div>
            <div class="video-info">
                <h3>${this.escapeHtml(video.title)}</h3>
                ${video.date ? `<div class="video-date">${this.formatDate(video.date)}</div>` : ''}
                ${video.description ? `<p>${this.escapeHtml(video.description)}</p>` : ''}
                <a href="${video.youtubeUrl || `https://www.youtube.com/watch?v=${videoId}`}" 
                   target="_blank" 
                   rel="noopener noreferrer" 
                   class="watch-on-youtube">
                    Watch on YouTube
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3"/>
                    </svg>
                </a>
            </div>
        `;

        return videoItem;
    }

    extractVideoId(urlOrId) {
        if (!urlOrId) return '';
        
        // If it's already just an ID, return it
        if (!urlOrId.includes('http') && !urlOrId.includes('/')) {
            return urlOrId;
        }

        // Extract from various YouTube URL formats
        const patterns = [
            /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
            /^([a-zA-Z0-9_-]{11})$/  // Just the ID
        ];

        for (const pattern of patterns) {
            const match = urlOrId.match(pattern);
            if (match) {
                return match[1] || match[0];
            }
        }

        return urlOrId; // Fallback
    }

    formatDate(dateString) {
        if (!dateString) return '';
        
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            });
        } catch (error) {
            return dateString; // Return as-is if parsing fails
        }
    }

    /**
     * Escape HTML to prevent XSS attacks
     * @param {string} text - Text to escape
     * @returns {string} Escaped HTML
     */
    escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    showEmptyState() {
        if (!this.videosContainer) return;
        
        const emptyState = document.createElement('div');
        emptyState.className = 'empty-state';
        emptyState.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polygon points="5 3 19 12 5 21 5 3"/>
            </svg>
            <h3>Coming Soon</h3>
            <p>Our video blog is under development. Check back soon for farm tours, animal updates, and farming tips!</p>
        `;
        
        this.videosContainer.appendChild(emptyState);
    }
}

// Initialize video loader
const videoLoader = new VideoLoader();

