/**
 * Goat Profile Loader for Locia Farms
 * Dynamically loads and displays goat profiles from goats.json
 */

class GoatLoader {
    constructor() {
        this.goatsContainer = null;
        this.goats = [];
        this.ensureInquiryModal();
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

            // Cache-buster to avoid stale goats.json on some CDNs/browsers.
            // Update this string when goats.json changes significantly.
            const cacheBuster = 'v=2026-02-21-1';
            
            // Try each path until one works
            for (const path of possiblePaths) {
                try {
                    const url = `${path}${path.includes('?') ? '&' : '?'}${cacheBuster}`;
                    response = await fetch(url, { cache: 'no-store' });
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
        this.goatsContainer.className = 'goats-accordion';

        // Ensure filters are wired (idempotent)
        this.initFilters();

        // Render based on current filter state
        this.applyFiltersAndRender();
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
                    <img 
                        src="${finalImagePath}" 
                        alt="${this.escapeHtml(goat.name)}" 
                        loading="eager" 
                        decoding="async"
                        width="120"
                        height="120"
                        fetchpriority="high"
                    >
                </div>
                <div class="goat-accordion-header-text">
                    <h3 class="goat-accordion-name">${this.escapeHtml(goat.name)}</h3>
                    <div class="goat-accordion-meta">
                        <span class="goat-breed">${this.escapeHtml(goat.breed)}</span>
                        <span class="goat-age">${this.escapeHtml(this.renderBirthOrAge(goat))}</span>
                        ${this.renderStatusBadge(goat)}
                        ${this.renderPriceBadge(goat)}
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
        
        // Get images array - support both single image and images array
        const images = goat.images || [goat.image];
        const normalizedImages = images.map(img => {
            let path = img;
            if (path.startsWith('../')) path = path.substring(3);
            if (path.startsWith('goats/')) path = path.substring(6);
            if (path.startsWith('/goats/')) path = path.substring(7);
            path = path.replace(/\.\.\//g, '');
            if (!path.startsWith('http') && !path.startsWith('//') && !path.startsWith('/')) {
                path = '/' + path;
            }
            if (isGitHubPages && path.startsWith('/') && !path.startsWith('/website/')) {
                path = '/website' + path;
            }
            return path;
        });
        
        // Create accordion content (collapsible) with carousel
        const accordionContent = document.createElement('div');
        accordionContent.className = 'goat-accordion-content';
        accordionContent.innerHTML = `
            <div class="goat-accordion-body">
                <div class="goat-carousel-container">
                    <button class="goat-carousel-btn prev" aria-label="Previous image">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M15 18l-6-6 6-6"/>
                        </svg>
                    </button>
                    <div class="goat-carousel-wrapper">
                        <div class="goat-carousel-track">
                            ${normalizedImages.map((imgPath, idx) => `
                                <div class="goat-carousel-slide ${idx === 0 ? 'active' : ''}">
                                    <img 
                                        src="${imgPath}" 
                                        alt="${this.escapeHtml(goat.name)} - ${this.escapeHtml(goat.breed)}" 
                                        loading="${idx === 0 ? 'eager' : 'lazy'}" 
                                        decoding="async"
                                        width="800"
                                        height="600"
                                        fetchpriority="${idx === 0 ? 'high' : 'low'}"
                                        style="max-width: 100%; height: auto;"
                                    >
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    <button class="goat-carousel-btn next" aria-label="Next image">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M9 18l6-6-6-6"/>
                        </svg>
                    </button>
                    ${normalizedImages.length > 1 ? `
                    <div class="goat-carousel-indicators">
                        ${normalizedImages.map((_, idx) => `
                            <button class="goat-carousel-indicator ${idx === 0 ? 'active' : ''}" data-index="${idx}" aria-label="Go to image ${idx + 1}"></button>
                        `).join('')}
                    </div>
                    ` : ''}
                </div>
                <div class="goat-accordion-details">
                    ${this.renderInquiryActions(goat)}
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
        const headerImg = accordionHeader.querySelector('.goat-accordion-image img');
        if (headerImg) {
            // Use first image from normalized images array
            const thumbnailPath = normalizedImages.length > 0 ? normalizedImages[0] : finalImagePath;
            headerImg.src = thumbnailPath;
            headerImg.setAttribute('width', '120');
            headerImg.setAttribute('height', '120');
            headerImg.onerror = function() {
                console.error('GoatLoader: Thumbnail image failed to load:', this.src);
                this.onerror = null;
                const fallbackPath = window.location.hostname.includes('github.io') 
                    ? '/website/images/splash-home-goat-01.jpeg' 
                    : '/images/splash-home-goat-01.jpeg';
                this.src = fallbackPath;
            };
            headerImg.onload = function() {
                console.log('GoatLoader: Thumbnail loaded successfully:', this.src);
            };
        }
        
        // Initialize carousel for this goat
        if (normalizedImages.length > 1) {
            this.initGoatCarousel(accordionContent, normalizedImages.length);
        }
        
        // Preload first image for faster display
        if (normalizedImages.length > 0) {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'image';
            link.href = normalizedImages[0];
            link.fetchPriority = 'high';
            document.head.appendChild(link);
        }
        
        // Set up error handlers + ensure lazy images become visible
        // NOTE: styles.css sets img[loading="lazy"] { opacity: 0 } until the "loaded" class is added.
        // Goat profiles are injected dynamically, so we attach the same "loaded" behavior here.
        const allImages = accordionItem.querySelectorAll('img');
        allImages.forEach((img, idx) => {
            // Set up error handler
            img.onerror = function() {
                this.onerror = null;
                const fallbackPath = window.location.hostname.includes('github.io')
                    ? '/website/images/splash-home-goat-01.jpeg'
                    : '/images/splash-home-goat-01.jpeg';
                this.src = fallbackPath;
            };

            // Ensure image has proper attributes for layout stability
            if (!img.hasAttribute('width')) {
                img.setAttribute('width', img.closest('.goat-accordion-image') ? '120' : '800');
            }
            if (!img.hasAttribute('height')) {
                img.setAttribute('height', img.closest('.goat-accordion-image') ? '120' : '600');
            }

            // Visibility: add "loaded" on load (and immediately if cached)
            const markLoaded = () => img.classList.add('loaded');
            img.addEventListener('load', markLoaded, { once: true });
            if (img.complete && img.naturalWidth > 0) {
                markLoaded();
            }
        });

        return accordionItem;
    }

    initGoatCarousel(container, imageCount) {
        const carouselContainer = container.querySelector('.goat-carousel-container');
        const track = container.querySelector('.goat-carousel-track');
        const slides = container.querySelectorAll('.goat-carousel-slide');
        const prevBtn = container.querySelector('.goat-carousel-btn.prev');
        const nextBtn = container.querySelector('.goat-carousel-btn.next');
        const indicators = container.querySelectorAll('.goat-carousel-indicator');
        
        let currentIndex = 0;
        
        const goToSlide = (index) => {
            if (index < 0) index = imageCount - 1;
            if (index >= imageCount) index = 0;
            
            currentIndex = index;
            
            // Update slides
            slides.forEach((slide, idx) => {
                slide.classList.toggle('active', idx === currentIndex);
            });
            
            // Update indicators
            indicators.forEach((indicator, idx) => {
                indicator.classList.toggle('active', idx === currentIndex);
            });
        };
        
        // Navigation buttons
        if (prevBtn) {
            prevBtn.addEventListener('click', () => goToSlide(currentIndex - 1));
        }
        if (nextBtn) {
            nextBtn.addEventListener('click', () => goToSlide(currentIndex + 1));
        }
        
        // Indicator clicks
        indicators.forEach((indicator, idx) => {
            indicator.addEventListener('click', () => goToSlide(idx));
        });
        
        // Touch/swipe support
        let touchStartX = 0;
        let touchEndX = 0;
        
        track.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });
        
        track.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            const diff = touchStartX - touchEndX;
            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    goToSlide(currentIndex + 1); // Swipe left - next
                } else {
                    goToSlide(currentIndex - 1); // Swipe right - prev
                }
            }
        }, { passive: true });
    }

    renderStatusBadge(goat) {
        const rawStatus = (goat && (goat.status || (goat.sold ? 'sold' : null))) || null;
        if (!rawStatus) return '';

        const status = String(rawStatus).toLowerCase().trim();

        if (status === 'sold') {
            return '<span class="goat-status-badge sold">Sold</span>';
        }
        if (status === 'available') {
            return '<span class="goat-status-badge available">Available</span>';
        }
        if (status === 'retained' || status === 'keep') {
            return '<span class="goat-status-badge retained">Retained</span>';
        }

        // Fallback: render the raw status text
        return `<span class="goat-status-badge other">${this.escapeHtml(rawStatus)}</span>`;
    }

    renderPriceBadge(goat) {
        if (!goat || goat.price == null) return '';

        const priceNum = Number(goat.price);
        const priceText = Number.isFinite(priceNum) ? `$${priceNum.toFixed(0)}` : `$${String(goat.price)}`;

        return `<span class="goat-price-badge">${this.escapeHtml(priceText)}</span>`;
    }

    renderBirthOrAge(goat) {
        // Prefer explicit birthDate when present.
        // Display as: Born (approx.) Feb 02, 2026
        const bd = goat && (goat.birthDate || goat.birthdate || goat.dob);
        if (bd) {
            try {
                const d = new Date(bd);
                if (!isNaN(d.getTime())) {
                    const month = d.toLocaleString('en-US', { month: 'short' });
                    const day = String(d.getDate()).padStart(2, '0');
                    const year = d.getFullYear();
                    const approx = (goat.birthDateApprox === false) ? '' : ' (approx.)';
                    return `Born${approx} ${month} ${day}, ${year}`;
                }
            } catch (e) {
                // fallthrough
            }
            // If not parseable, show raw
            return `Born (approx.) ${String(bd)}`;
        }

        return goat && goat.age ? goat.age : '';
    }

    renderInquiryActions(goat) {
        // Only show inquiry actions for goats that are clearly available
        const status = String((goat && (goat.status || (goat.sold ? 'sold' : ''))) || '').toLowerCase().trim();
        if (status && status !== 'available') return '';

        const cfg = (window && window.LOCIA_GOAT_INQUIRY) ? window.LOCIA_GOAT_INQUIRY : {};
        const schedUrl = cfg.PICKUP_SCHED_URL || '';

        const schedLink = schedUrl
            ? `<a class="goat-inquiry-link" href="${this.escapeHtml(schedUrl)}" target="_blank" rel="noopener">Schedule pickup</a>`
            : '';

        return `
            <div class="goat-inquiry-actions">
              <button class="goat-inquiry-btn" type="button" data-inquiry="1" data-goat-id="${this.escapeHtml(goat.id || '')}" data-goat-name="${this.escapeHtml(goat.name || '')}">Request / Ask about ${this.escapeHtml(goat.name || 'this goat')}</button>
              ${schedLink}
            </div>
        `;
    }

    ensureInquiryModal() {
        // Create once per page
        if (document.getElementById('goat-inquiry-modal-overlay')) return;

        const overlay = document.createElement('div');
        overlay.id = 'goat-inquiry-modal-overlay';
        overlay.className = 'goat-inquiry-modal-overlay';
        overlay.innerHTML = `
          <div class="goat-inquiry-modal" role="dialog" aria-modal="true" aria-labelledby="goat-inquiry-title">
            <div class="goat-inquiry-modal-header">
              <h3 class="goat-inquiry-modal-title" id="goat-inquiry-title">Goat inquiry</h3>
              <button class="goat-inquiry-modal-close" type="button" aria-label="Close">×</button>
            </div>
            <div class="goat-inquiry-modal-body">
              <form class="goat-inquiry-form" id="goat-inquiry-form" method="POST">
                <input type="hidden" name="goat_id" id="goat_inquiry_goat_id" value="">
                <input type="hidden" name="goat_name" id="goat_inquiry_goat_name" value="">
                <input type="text" name="goat" id="goat_inquiry_goat" value="" readonly style="background:#fafafa;">

                <div class="row">
                  <div>
                    <label for="goat_inquiry_name">Your name</label>
                    <input id="goat_inquiry_name" name="name" type="text" required>
                  </div>
                  <div>
                    <label for="goat_inquiry_email">Email</label>
                    <input id="goat_inquiry_email" name="email" type="email" required>
                  </div>
                </div>

                <div>
                  <label for="goat_inquiry_phone">Phone (optional)</label>
                  <input id="goat_inquiry_phone" name="phone" type="tel">
                </div>

                <div>
                  <label for="goat_inquiry_message">Message</label>
                  <textarea id="goat_inquiry_message" name="message" placeholder="Tell us what you’d like to know, or when you’re hoping to pick up."></textarea>
                </div>

                <!-- Honeypot spam trap -->
                <input type="text" name="company" tabindex="-1" autocomplete="off" style="display:none;">

                <div class="actions">
                  <button class="submit" type="submit">Send inquiry</button>
                  <a class="goat-inquiry-link" id="goat_inquiry_schedule_link" href="#" target="_blank" rel="noopener" style="display:none;">Schedule pickup</a>
                </div>

                <div class="note" id="goat_inquiry_note"></div>
              </form>
            </div>
          </div>
        `;

        const addHandlers = () => {
            // Close logic
            const close = () => overlay.classList.remove('open');
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) close();
            });
            const closeBtn = overlay.querySelector('.goat-inquiry-modal-close');
            if (closeBtn) closeBtn.addEventListener('click', close);
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') close();
            });

            // Open handler (delegated)
            document.addEventListener('click', (e) => {
                const btn = e.target && e.target.closest ? e.target.closest('button[data-inquiry="1"]') : null;
                if (!btn) return;
                e.preventDefault();
                const goatId = btn.getAttribute('data-goat-id') || '';
                const goatName = btn.getAttribute('data-goat-name') || '';
                this.openInquiryModal(goatId, goatName);
            });

            // Submit handler
            const form = overlay.querySelector('#goat-inquiry-form');
            if (form) {
                form.addEventListener('submit', async (e) => {
                    e.preventDefault();
                    const cfg = (window && window.LOCIA_GOAT_INQUIRY) ? window.LOCIA_GOAT_INQUIRY : {};
                    const action = cfg.FORM_ACTION || '';
                    const note = overlay.querySelector('#goat_inquiry_note');

                    if (!action) {
                        if (note) note.textContent = 'Form is not yet configured. Please email lociafarms@gmail.com for now.';
                        return;
                    }

                    try {
                        const fd = new FormData(form);
                        const resp = await fetch(action, {
                            method: 'POST',
                            body: fd,
                            headers: { 'Accept': 'application/json' }
                        });
                        if (resp.ok) {
                            if (note) note.textContent = 'Sent. We’ll get back to you soon.';
                            form.reset();
                            // Keep goat fields visible
                            const goatDisplay = overlay.querySelector('#goat_inquiry_goat');
                            const goatIdEl = overlay.querySelector('#goat_inquiry_goat_id');
                            const goatNameEl = overlay.querySelector('#goat_inquiry_goat_name');
                            // no-op; openInquiryModal sets again on next open
                            setTimeout(() => overlay.classList.remove('open'), 900);
                        } else {
                            if (note) note.textContent = 'Could not send. Please try again or email lociafarms@gmail.com.';
                        }
                    } catch (err) {
                        if (note) note.textContent = 'Could not send. Please try again or email lociafarms@gmail.com.';
                    }
                });
            }
        };

        // Ensure added after DOM ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                document.body.appendChild(overlay);
                addHandlers();
            });
        } else {
            document.body.appendChild(overlay);
            addHandlers();
        }
    }

    openInquiryModal(goatId, goatName) {
        const overlay = document.getElementById('goat-inquiry-modal-overlay');
        if (!overlay) return;

        const cfg = (window && window.LOCIA_GOAT_INQUIRY) ? window.LOCIA_GOAT_INQUIRY : {};
        const schedUrl = cfg.PICKUP_SCHED_URL || '';

        const goatDisplay = overlay.querySelector('#goat_inquiry_goat');
        const goatIdEl = overlay.querySelector('#goat_inquiry_goat_id');
        const goatNameEl = overlay.querySelector('#goat_inquiry_goat_name');
        const note = overlay.querySelector('#goat_inquiry_note');
        const schedLink = overlay.querySelector('#goat_inquiry_schedule_link');

        const label = goatName ? `${goatName} (${goatId || 'id'})` : (goatId || '');

        if (goatDisplay) goatDisplay.value = label;
        if (goatIdEl) goatIdEl.value = goatId || '';
        if (goatNameEl) goatNameEl.value = goatName || '';
        if (note) note.textContent = '';

        if (schedLink) {
            if (schedUrl) {
                schedLink.href = schedUrl;
                schedLink.style.display = 'inline-flex';
            } else {
                schedLink.style.display = 'none';
            }
        }

        overlay.classList.add('open');
        const nameField = overlay.querySelector('#goat_inquiry_name');
        if (nameField) nameField.focus();
    }

    initFilters() {
        if (this._filtersInitialized) return;

        const searchEl = document.getElementById('goat-filter-search');
        const statusEl = document.getElementById('goat-filter-status');
        const ageEl = document.getElementById('goat-filter-age');
        const clearEl = document.getElementById('goat-filter-clear');

        if (!searchEl || !statusEl || !ageEl || !clearEl) {
            // Filters not present on this page
            this._filtersInitialized = true;
            return;
        }

        const apply = () => this.applyFiltersAndRender();

        // Restore from query param (optional)
        const params = new URLSearchParams(window.location.search);
        const status = params.get('status');
        if (status && ['available','all','sold','retained'].includes(status)) statusEl.value = status;

        searchEl.addEventListener('input', apply);
        statusEl.addEventListener('change', apply);
        ageEl.addEventListener('change', apply);

        clearEl.addEventListener('click', () => {
            searchEl.value = '';
            statusEl.value = 'available';
            ageEl.value = 'all';
            this.applyFiltersAndRender();
        });

        this._filtersInitialized = true;
    }

    applyFiltersAndRender() {
        if (!this.goatsContainer) return;

        const searchEl = document.getElementById('goat-filter-search');
        const statusEl = document.getElementById('goat-filter-status');
        const ageEl = document.getElementById('goat-filter-age');
        const countEl = document.getElementById('goat-filter-count');

        const q = (searchEl && searchEl.value ? searchEl.value : '').trim().toLowerCase();
        const status = statusEl ? statusEl.value : 'all';
        const age = ageEl ? ageEl.value : 'all';

        const isKid = (g) => String(g && g.age || '').toLowerCase().includes('kid');
        const isAdult = (g) => !isKid(g);

        const matches = (g) => {
            // Status
            const s = String((g && (g.status || (g.sold ? 'sold' : ''))) || '').toLowerCase().trim();
            if (status !== 'all' && s !== status) return false;

            // Age
            if (age === 'kid' && !isKid(g)) return false;
            if (age === 'adult' && !isAdult(g)) return false;

            // Search
            if (q) {
                const hay = [g.id, g.name, g.breed, g.age, g.bio, g.backgroundStory].filter(Boolean).join(' ').toLowerCase();
                if (!hay.includes(q)) return false;
            }

            return true;
        };

        const filtered = (this.goats || []).filter(matches);

        // Render
        this.goatsContainer.innerHTML = '';
        filtered.forEach(g => this.goatsContainer.appendChild(this.createGoatCard(g)));

        // Count
        if (countEl) countEl.textContent = `Showing ${filtered.length} of ${(this.goats || []).length}`;

        // Keep status in URL (nice for sharing)
        try {
            const u = new URL(window.location.href);
            u.searchParams.set('status', status);
            window.history.replaceState({}, '', u);
        } catch (e) {
            // ignore
        }

        // Empty state
        if (filtered.length === 0) {
            this.goatsContainer.innerHTML = `
              <div class="empty-state">
                <p>No goats match your filters.</p>
              </div>
            `;
        }
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

