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
            const goatsPath = window.location.pathname.includes('/goats/') 
                ? 'goats.json' 
                : 'goats/goats.json';
            const response = await fetch(goatsPath);
            
            // Helper function to normalize image paths
            const normalizeImagePath = (path) => {
                // If path already starts with http or /, return as-is
                if (path.startsWith('http') || path.startsWith('/')) {
                    return path;
                }
                // If path starts with ../, remove it and use root-relative path
                if (path.startsWith('../')) {
                    return path.substring(3); // Remove '../'
                }
                // If path starts with ./, remove it
                if (path.startsWith('./')) {
                    return path.substring(2);
                }
                return path;
            };
            if (!response.ok) {
                throw new Error('Failed to load goats.json');
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

        // Normalize image path for GitHub Pages compatibility
        // Since we're in a subdirectory (goats/), we need to handle paths correctly
        let imagePath = goat.image;
        
        // If path already starts with http or //, use as-is
        if (imagePath.startsWith('http') || imagePath.startsWith('//')) {
            // Absolute URL, use as-is
        }
        // If path starts with '/', it's absolute from root - remove leading '/' for root-relative
        else if (imagePath.startsWith('/')) {
            imagePath = imagePath.substring(1);
        }
        // If path starts with '../', convert to root-relative by removing '../'
        else if (imagePath.startsWith('../')) {
            imagePath = imagePath.substring(3);
        }
        // If path is already root-relative (starts with 'images/', 'logos/', etc.), use as-is
        // Otherwise, assume it needs to be root-relative
        else if (!imagePath.startsWith('images/') && !imagePath.startsWith('logos/')) {
            // If it's a bare filename or relative path, we might need to prepend
            // But since our JSON has full paths, this shouldn't happen
        }
        
        // Ensure the path is correct for the current page location
        // For GitHub Pages with custom domain, root-relative paths work
        // For subdirectories, we need to ensure the path resolves correctly
        // The path should work if it's root-relative from the website root
        
        card.innerHTML = `
            <div class="goat-image">
                <img 
                    src="${this.escapeHtml(imagePath)}" 
                    alt="${this.escapeHtml(goat.name)} - ${this.escapeHtml(goat.breed)}"
                    loading="lazy"
                    decoding="async"
                    onerror="this.onerror=null; this.src=window.location.pathname.includes('/goats/') ? '../images/splash-home-goat-01.jpeg' : 'images/splash-home-goat-01.jpeg';"
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

