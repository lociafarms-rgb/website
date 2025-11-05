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
        this.goatsContainer.className = 'goats-accordion'; // Change to accordion class

        // Render each goat
        this.goats.forEach(goat => {
            const goatCard = this.createGoatCard(goat);
            this.goatsContainer.appendChild(goatCard);
        });
    }

    createGoatCard(goat) {
        const accordionItem = document.createElement('div');
        accordionItem.className = 'goat-accordion-item';
        accordionItem.setAttribute('data-goat-id', goat.id);
        
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
        
        // Debug: Log original path
        console.log('GoatLoader: Original image path:', goat.image, 'on', window.location.hostname);
        
        // Remove any relative path components and /goats/ prefix
        // Convert ../images/... to images/... (relative from root)
        // or to /images/... (absolute)
        if (finalImagePath.startsWith('../')) {
            finalImagePath = finalImagePath.substring(3); // Remove ../
        }
        
        // Remove any /goats/ prefix if it exists
        if (finalImagePath.startsWith('goats/')) {
            finalImagePath = finalImagePath.substring(6); // Remove 'goats/'
        }
        if (finalImagePath.startsWith('/goats/')) {
            finalImagePath = finalImagePath.substring(7); // Remove '/goats/'
        }
        
        // Remove any remaining relative path components
        finalImagePath = finalImagePath.replace(/\.\.\//g, '');
        
        // On main page, paths should be relative to root (images/...) or absolute (/images/...)
        // Ensure path starts with / (absolute path) for consistency
        if (!finalImagePath.startsWith('http') && !finalImagePath.startsWith('//') && !finalImagePath.startsWith('/')) {
            finalImagePath = '/' + finalImagePath;
        }
        
        // For GitHub Pages, add /website/ prefix
        if (isGitHubPages && finalImagePath.startsWith('/') && !finalImagePath.startsWith('/website/')) {
            finalImagePath = '/website' + finalImagePath;
        }
        
        // Final validation - ensure path is absolute
        if (!finalImagePath.startsWith('http') && !finalImagePath.startsWith('//') && !finalImagePath.startsWith('/')) {
            console.warn('GoatLoader: Image path was not converted to absolute:', goat.image, '->', finalImagePath);
            finalImagePath = '/' + finalImagePath;
        }
        
        console.log('GoatLoader: Final image path:', finalImagePath);
        
        // Create image element directly to ensure path is set correctly
        // This prevents browser from resolving relative paths in innerHTML
        const img = document.createElement('img');
        img.alt = `${goat.name} - ${goat.breed}`;
        // Use 'eager' for first few images to ensure they load immediately
        // Use 'lazy' for rest to improve performance
        img.loading = 'lazy';
        img.decoding = 'async';
        
        // Log when image loads or fails
        img.onload = function() {
            console.log('GoatLoader: ✅ Image loaded successfully:', finalImagePath);
            console.log('GoatLoader: Image naturalWidth:', this.naturalWidth, 'naturalHeight:', this.naturalHeight);
        };
        
        img.onerror = function(event) {
            console.error('GoatLoader: ❌ Image failed to load:', finalImagePath);
            console.error('GoatLoader: Error event:', event);
            console.error('GoatLoader: Current src:', this.src);
            console.error('GoatLoader: Attempting fallback image');
            this.onerror = null;
            const fallbackPath = window.location.hostname.includes('github.io') 
                ? '/website/images/splash-home-goat-01.jpeg' 
                : '/images/splash-home-goat-01.jpeg';
            console.log('GoatLoader: Setting fallback to:', fallbackPath);
            this.src = fallbackPath;
        };
        
        // Set src AFTER setting up error handlers to ensure they're in place
        console.log('GoatLoader: Setting image src to:', finalImagePath);
        img.src = finalImagePath;
        
        // Verify image element was created
        console.log('GoatLoader: Image element created:', img);
        console.log('GoatLoader: Image src attribute:', img.src);
        console.log('GoatLoader: Image complete:', img.complete);
        console.log('GoatLoader: Image naturalWidth:', img.naturalWidth);
        
        // If image is already loaded (cached), manually trigger onload
        if (img.complete && img.naturalWidth > 0) {
            console.log('GoatLoader: Image already loaded from cache');
            img.onload();
        }
        
        // Create accordion header (always visible)
        const accordionHeader = document.createElement('div');
        accordionHeader.className = 'goat-accordion-header';
        accordionHeader.setAttribute('role', 'button');
        accordionHeader.setAttribute('tabindex', '0');
        accordionHeader.setAttribute('aria-expanded', 'false');
        accordionHeader.innerHTML = `
            <div class="goat-accordion-header-content">
                <div class="goat-accordion-image">
                    <img src="${finalImagePath}" alt="${this.escapeHtml(goat.name)}" loading="lazy" decoding="async">
                </div>
                <div class="goat-accordion-header-text">
                    <h3 class="goat-accordion-name">${this.escapeHtml(goat.name)}</h3>
                    <div class="goat-accordion-meta">
                        <span class="goat-breed">${this.escapeHtml(goat.breed)}</span>
                        <span class="goat-age">${this.escapeHtml(goat.age)}</span>
                    </div>
                    <p class="goat-accordion-bio-preview">${this.escapeHtml(goat.bio)}</p>
                </div>
                <div class="goat-accordion-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M6 9l6 6 6-6"/>
                    </svg>
                </div>
            </div>
        `;
        
        // Create accordion content (collapsible)
        const accordionContent = document.createElement('div');
        accordionContent.className = 'goat-accordion-content';
        accordionContent.innerHTML = `
            <div class="goat-accordion-body">
                <div class="goat-accordion-image-full">
                    <img src="${finalImagePath}" alt="${this.escapeHtml(goat.name)} - ${this.escapeHtml(goat.breed)}" loading="lazy" decoding="async">
                </div>
                <div class="goat-accordion-details">
                    <div class="goat-story">
                        <h4>Background Story</h4>
                        <p>${this.escapeHtml(goat.backgroundStory)}</p>
                    </div>
                    <div class="goat-traits">
                        <h4>Personality</h4>
                        <div class="personality-tags">
                            ${personalityTags}
                        </div>
                    </div>
                    ${goat.favoriteActivity ? `
                    <div class="goat-activity">
                        <h4>Favorite Activity</h4>
                        <p>${this.escapeHtml(goat.favoriteActivity)}</p>
                    </div>
                    ` : ''}
                </div>
            </div>
        `;
        
        // Set up click handler for accordion
        accordionHeader.addEventListener('click', () => {
            const isExpanded = accordionHeader.getAttribute('aria-expanded') === 'true';
            accordionHeader.setAttribute('aria-expanded', !isExpanded);
            accordionItem.classList.toggle('expanded');
        });
        
        // Keyboard navigation
        accordionHeader.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                accordionHeader.click();
            }
        });
        
        // Append header and content
        accordionItem.appendChild(accordionHeader);
        accordionItem.appendChild(accordionContent);
        
        // Replace the image src in accordion header with the actual img element
        const headerImg = accordionHeader.querySelector('img');
        if (headerImg) {
            headerImg.src = finalImagePath;
            headerImg.onerror = function() {
                this.onerror = null;
                const fallbackPath = window.location.hostname.includes('github.io') 
                    ? '/website/images/splash-home-goat-01.jpeg' 
                    : '/images/splash-home-goat-01.jpeg';
                this.src = fallbackPath;
            };
        }
        
        // Replace the image src in accordion content
        const contentImg = accordionContent.querySelector('img');
        if (contentImg) {
            contentImg.src = finalImagePath;
            contentImg.onerror = function() {
                this.onerror = null;
                const fallbackPath = window.location.hostname.includes('github.io') 
                    ? '/website/images/splash-home-goat-01.jpeg' 
                    : '/images/splash-home-goat-01.jpeg';
                this.src = fallbackPath;
            };
        }

        return accordionItem;
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

