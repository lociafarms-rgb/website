/**
 * Goat Profile Loader for Locia Farms
 * Dynamically loads and displays goat profiles from goats.json
 */

class GoatLoader {
    constructor() {
        this.goatsContainer = null;
        this.goats = [];
        this.init();
    }

    async init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.loadGoats());
        } else {
            this.loadGoats();
        }
    }

    async loadGoats() {
        // Find goats container
        this.goatsContainer = document.getElementById('goats-grid');
        
        if (!this.goatsContainer) return;

        try {
            // Load goats from JSON file
            // Try multiple possible paths based on GitHub Pages structure
            const pathname = window.location.pathname;
            const possiblePaths = [];
            
            // If we're in goats/ subdirectory
            if (pathname.includes('/goats/') || pathname.endsWith('/goats')) {
                possiblePaths.push('goats.json');  // Same directory
                possiblePaths.push('../goats/goats.json');  // Parent/goats/
            } else {
                possiblePaths.push('goats/goats.json');  // From root
                possiblePaths.push('../goats/goats.json');  // From parent
            }
            
            // Also try with /website/ prefix for GitHub Pages
            if (pathname.includes('/website/')) {
                possiblePaths.push('/website/goats/goats.json');
            }
            
            // For custom domain, try without /website/ prefix
            if (!pathname.includes('/website/')) {
                possiblePaths.push('/goats/goats.json');
            }
            
            let response = null;
            let lastError = null;
            
            // Try each path until one works
            for (const path of possiblePaths) {
                try {
                    response = await fetch(path);
                    if (response.ok) {
                        break; // Found working path
                    }
                } catch (err) {
                    lastError = err;
                    continue; // Try next path
                }
            }
            
            if (!response || !response.ok) {
                throw new Error(`Failed to load goats.json. Tried paths: ${possiblePaths.join(', ')}`);
            }
            
            const data = await response.json();
            this.goats = data.goats || [];

            if (this.goats.length === 0) {
                this.showEmptyState();
                return;
            }

            // Render goats
            this.renderGoats();
        } catch (error) {
            console.error('Error loading goats:', error);
            console.error('Current pathname:', window.location.pathname);
            console.error('Current hostname:', window.location.hostname);
            this.showErrorState();
        }
    }

    renderGoats() {
        if (!this.goatsContainer) return;

        // Clear loading state
        this.goatsContainer.innerHTML = '';

        // Render each goat
        this.goats.forEach(goat => {
            const goatCard = this.createGoatCard(goat);
            this.goatsContainer.appendChild(goatCard);
        });
    }

    createGoatCard(goat) {
        const card = document.createElement('div');
        card.className = 'goat-card material-card';
        
        // Create personality tags
        const personalityTags = goat.personality
            .map(trait => `<span class="personality-tag">${this.escapeHtml(trait)}</span>`)
            .join('');

        // Normalize image path for GitHub Pages hosting
        // Custom domain (www.lociafarms.com) serves from root: /images/...
        // GitHub Pages (github.io) serves from /website/ subdirectory: /website/images/...
        // IMPORTANT: Always convert relative paths to absolute to prevent browser from resolving them relative to current page
        let finalImagePath = goat.image;
        const isGitHubPages = window.location.hostname.includes('github.io');
        
        // Always convert relative paths (../images/...) to absolute paths
        // This prevents the browser from resolving them relative to the current page URL
        if (finalImagePath.startsWith('../')) {
            // Remove ../ prefix to get images/... or goats/images/...
            finalImagePath = finalImagePath.substring(3);
            // Add absolute prefix
            if (isGitHubPages) {
                finalImagePath = '/website/' + finalImagePath;
            } else {
                finalImagePath = '/' + finalImagePath;
            }
        } else if (!finalImagePath.startsWith('http') && !finalImagePath.startsWith('//') && !finalImagePath.startsWith('/')) {
            // Path is relative but doesn't start with ../
            if (isGitHubPages) {
                finalImagePath = '/website/' + finalImagePath;
            } else {
                finalImagePath = '/' + finalImagePath;
            }
        } else if (finalImagePath.startsWith('/') && isGitHubPages && !finalImagePath.startsWith('/website/')) {
            // Absolute path on GitHub Pages needs /website/ prefix
            finalImagePath = '/website' + finalImagePath;
        }
        
        // Final validation - ensure path is absolute (starts with /, http://, or //)
        if (!finalImagePath.startsWith('http') && !finalImagePath.startsWith('//') && !finalImagePath.startsWith('/')) {
            console.warn('GoatLoader: Image path was not converted to absolute:', goat.image, '->', finalImagePath);
            if (isGitHubPages) {
                finalImagePath = '/website/' + finalImagePath;
            } else {
                finalImagePath = '/' + finalImagePath;
            }
        }
        
        card.innerHTML = `
            <div class="goat-image">
                <img 
                    src="${this.escapeHtml(finalImagePath)}" 
                    alt="${this.escapeHtml(goat.name)} - ${this.escapeHtml(goat.breed)}"
                    loading="lazy"
                    decoding="async"
                    onerror="this.onerror=null; this.src=(window.location.hostname.includes('github.io') ? '/website/images/splash-home-goat-01.jpeg' : '/images/splash-home-goat-01.jpeg');"
                >
            </div>
            <div class="goat-content">
                <div class="goat-header">
                    <h2 class="goat-name">${this.escapeHtml(goat.name)}</h2>
                    <div class="goat-meta">
                        <span class="goat-breed">${this.escapeHtml(goat.breed)}</span>
                        <span class="goat-age">${this.escapeHtml(goat.age)}</span>
                    </div>
                </div>
                <p class="goat-bio">${this.escapeHtml(goat.bio)}</p>
                <div class="goat-details">
                    <div class="goat-story">
                        <h3>Background Story</h3>
                        <p>${this.escapeHtml(goat.backgroundStory)}</p>
                    </div>
                    <div class="goat-traits">
                        <h3>Personality</h3>
                        <div class="personality-tags">
                            ${personalityTags}
                        </div>
                    </div>
                    ${goat.favoriteActivity ? `
                    <div class="goat-activity">
                        <h3>Favorite Activity</h3>
                        <p>${this.escapeHtml(goat.favoriteActivity)}</p>
                    </div>
                    ` : ''}
                </div>
            </div>
        `;

        return card;
    }

    escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    showEmptyState() {
        if (!this.goatsContainer) return;
        
        this.goatsContainer.innerHTML = `
            <div class="empty-state">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                </svg>
                <h3>Coming Soon</h3>
                <p>Our goat profiles are being prepared. Check back soon to meet our herd!</p>
            </div>
        `;
    }

    showErrorState() {
        if (!this.goatsContainer) return;
        
        this.goatsContainer.innerHTML = `
            <div class="empty-state">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="8" x2="12" y2="12"/>
                    <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                <h3>Unable to Load Goat Profiles</h3>
                <p>We're having trouble loading our goat profiles. Please refresh the page or try again later.</p>
            </div>
        `;
    }
}

// Initialize goat loader
const goatLoader = new GoatLoader();

