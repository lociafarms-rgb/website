/**
 * Locia Farms Website - Main JavaScript
 * Handles navigation, carousel, lazy loading, and animations
 */

// ============================================================================
// Constants
// ============================================================================
const CONFIG = {
    AUTO_PLAY_DELAY: 5000, // milliseconds
    SWIPE_THRESHOLD: 50, // pixels
    SCROLL_OFFSET: 100, // pixels for header scroll effect
    HEADER_HEIGHT: 80, // pixels for smooth scroll offset
    LAZY_LOAD_MARGIN: '50px', // for IntersectionObserver
    FADE_ANIMATION_THRESHOLD: 0.1
};

// ============================================================================
// Utility Functions
// ============================================================================
const utils = {
    /**
     * Debounce function calls - prevents excessive function execution
     * @param {Function} func - Function to debounce
     * @param {number} wait - Wait time in milliseconds
     * @returns {Function} Debounced function
     */
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func(...args), wait);
        };
    },

    /**
     * Check if element is in viewport
     * @param {HTMLElement} element - Element to check
     * @returns {boolean} True if element is in viewport
     */
    isInViewport(element) {
        if (!element) return false;
        const rect = element.getBoundingClientRect();
        const { innerHeight, innerWidth } = window;
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= innerHeight &&
            rect.right <= innerWidth
        );
    }
};

// ============================================================================
// Navigation Controller
// ============================================================================
class NavigationController {
    constructor() {
        this.mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
        this.navMenu = document.querySelector('.nav-menu');
        this.navLinks = document.querySelectorAll('.nav-menu a');
        this.init();
    }

    init() {
        if (!this.mobileMenuToggle || !this.navMenu) return;

        // Mobile menu toggle
        this.mobileMenuToggle.addEventListener('click', () => {
            this.toggleMobileMenu();
        });

        // Close menu when clicking nav links
        this.navLinks.forEach(link => {
            link.addEventListener('click', () => {
                this.closeMobileMenu();
            });
        });

        // Close menu when clicking outside (optional)
        document.addEventListener('click', (e) => {
            if (this.navMenu.classList.contains('active') &&
                !this.navMenu.contains(e.target) &&
                !this.mobileMenuToggle.contains(e.target)) {
                this.closeMobileMenu();
            }
        });
    }

    toggleMobileMenu() {
        this.navMenu.classList.toggle('active');
        this.mobileMenuToggle.classList.toggle('active');
    }

    closeMobileMenu() {
        this.navMenu.classList.remove('active');
        this.mobileMenuToggle.classList.remove('active');
    }
}

// ============================================================================
// Photo Carousel
// ============================================================================
class PhotoCarousel {
    constructor(container) {
        this.container = container;
        this.track = container.querySelector('.carousel-track');
        this.slides = container.querySelectorAll('.carousel-slide');
        this.prevBtn = container.querySelector('.carousel-btn.prev');
        this.nextBtn = container.querySelector('.carousel-btn.next');
        this.indicatorsContainer = container.querySelector('.carousel-indicators');
        this.images = container.querySelectorAll('.carousel-slide img');
        
        this.currentIndex = 0;
        this.autoPlayInterval = null;
        this.touchStartX = 0;
        this.touchEndX = 0;
        
        this.init();
    }

    init() {
        if (!this.track || !this.slides.length) return;

        this.createIndicators();
        this.attachEventListeners();
        this.startAutoPlay();
        this.updateSlide();
        this.preloadAdjacentImages();
    }

    createIndicators() {
        if (!this.indicatorsContainer) return;

        this.slides.forEach((_, index) => {
            const indicator = document.createElement('button');
            indicator.className = `carousel-indicator ${index === 0 ? 'active' : ''}`;
            indicator.setAttribute('aria-label', `Go to slide ${index + 1}`);
            indicator.addEventListener('click', () => this.goToSlide(index));
            this.indicatorsContainer.appendChild(indicator);
        });

        this.indicators = this.indicatorsContainer.querySelectorAll('.carousel-indicator');
    }

    attachEventListeners() {
        // Navigation buttons
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => this.prevSlide());
        }
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => this.nextSlide());
        }

        // Keyboard navigation
        this.container.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.prevSlide();
            if (e.key === 'ArrowRight') this.nextSlide();
        });

        // Touch/swipe support
        this.track.addEventListener('touchstart', (e) => {
            this.touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        this.track.addEventListener('touchend', (e) => {
            this.touchEndX = e.changedTouches[0].screenX;
            this.handleSwipe();
        }, { passive: true });

        // Pause on hover
        this.container.addEventListener('mouseenter', () => this.stopAutoPlay());
        this.container.addEventListener('mouseleave', () => this.startAutoPlay());
    }

    goToSlide(index) {
        if (index < 0 || index >= this.slides.length) return;
        this.currentIndex = index;
        this.updateSlide();
        this.resetAutoPlay();
        this.preloadAdjacentImages();
    }

    nextSlide() {
        this.currentIndex = (this.currentIndex + 1) % this.slides.length;
        this.updateSlide();
        this.resetAutoPlay();
        this.preloadAdjacentImages();
    }

    prevSlide() {
        this.currentIndex = (this.currentIndex - 1 + this.slides.length) % this.slides.length;
        this.updateSlide();
        this.resetAutoPlay();
        this.preloadAdjacentImages();
    }

    updateSlide() {
        if (!this.track) return;

        const translateX = -this.currentIndex * 100;
        this.track.style.transform = `translateX(${translateX}%)`;

        // Update slide active states
        this.slides.forEach((slide, index) => {
            slide.classList.toggle('active', index === this.currentIndex);
        });

        // Update indicators
        if (this.indicators) {
            this.indicators.forEach((indicator, index) => {
                indicator.classList.toggle('active', index === this.currentIndex);
            });
        }
    }

    handleSwipe() {
        const diff = this.touchStartX - this.touchEndX;
        if (Math.abs(diff) > CONFIG.SWIPE_THRESHOLD) {
            if (diff > 0) {
                this.nextSlide();
            } else {
                this.prevSlide();
            }
        }
    }

    startAutoPlay() {
        this.stopAutoPlay();
        this.autoPlayInterval = setInterval(() => {
            this.nextSlide();
        }, CONFIG.AUTO_PLAY_DELAY);
    }

    stopAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
    }

    resetAutoPlay() {
        this.stopAutoPlay();
        this.startAutoPlay();
    }

    preloadAdjacentImages() {
        if (!this.images || this.images.length === 0) return;

        const total = this.images.length;
        const nextIndex = (this.currentIndex + 1) % total;
        const prevIndex = (this.currentIndex - 1 + total) % total;

        [this.images[nextIndex], this.images[prevIndex]].forEach(img => {
            if (img && img.loading === 'lazy') {
                // Create prefetch link for adjacent images
                const link = document.createElement('link');
                link.rel = 'prefetch';
                link.href = img.src;
                if (!document.querySelector(`link[href="${img.src}"]`)) {
                    document.head.appendChild(link);
                }
            }
        });
    }
}

// ============================================================================
// Lazy Image Loader
// ============================================================================
class LazyImageLoader {
    constructor() {
        this.lazyImages = document.querySelectorAll('img[loading="lazy"]');
        this.init();
    }

    init() {
        if (this.lazyImages.length === 0) return;

        if ('IntersectionObserver' in window) {
            this.initIntersectionObserver();
        } else {
            // Fallback for older browsers
            this.loadAllImages();
        }
    }

    initIntersectionObserver() {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.loadImage(entry.target);
                    imageObserver.unobserve(entry.target);
                }
            });
        }, {
            rootMargin: CONFIG.LAZY_LOAD_MARGIN
        });

        this.lazyImages.forEach(img => {
            imageObserver.observe(img);
            // Mark as loaded if already cached
            if (img.complete) {
                img.classList.add('loaded');
            }
        });
    }

    loadImage(img) {
        // Handle data-src if present (for future use)
        if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
        }

        // Add loaded class when image loads
        if (!img.classList.contains('loaded')) {
            img.addEventListener('load', () => {
                img.classList.add('loaded');
            }, { once: true });

            // If already cached, mark as loaded immediately
            if (img.complete) {
                img.classList.add('loaded');
            }
        }
    }

    loadAllImages() {
        // Fallback for browsers without IntersectionObserver
        this.lazyImages.forEach(img => {
            if (img.dataset.src) {
                img.src = img.dataset.src;
            }
            img.classList.add('loaded');
        });
    }
}

// ============================================================================
// Scroll Effects Controller
// ============================================================================
class ScrollEffectsController {
    constructor() {
        this.header = document.querySelector('header');
        this.init();
    }

    init() {
        if (!this.header) return;

        // Debounced scroll handler for better performance
        const handleScroll = utils.debounce(() => {
            const shouldAddScrolled = window.pageYOffset > CONFIG.SCROLL_OFFSET;
            this.header.classList.toggle('scrolled', shouldAddScrolled);
        }, 16); // ~60fps for smoother performance

        window.addEventListener('scroll', handleScroll, { passive: true });
    }
}

// ============================================================================
// Smooth Scroll Controller
// ============================================================================
class SmoothScrollController {
    constructor() {
        this.init();
    }

    init() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                this.handleAnchorClick(e, anchor);
            });
        });
    }

    handleAnchorClick(e, anchor) {
        const href = anchor.getAttribute('href');
        if (href === '#' || href === '') return;

        const target = document.querySelector(href);
        if (!target) return;

        e.preventDefault();
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - CONFIG.HEADER_HEIGHT;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }
}

// ============================================================================
// Animation Controller
// ============================================================================
class AnimationController {
    constructor() {
        this.init();
    }

    init() {
        const materialCards = document.querySelectorAll('.material-card');
        if (materialCards.length === 0) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, {
            threshold: CONFIG.FADE_ANIMATION_THRESHOLD,
            rootMargin: '0px 0px -50px 0px'
        });

        materialCards.forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(card);
        });
    }
}

// ============================================================================
// Application Initialization
// ============================================================================
class App {
    constructor() {
        this.carousel = null;
        this.init();
    }

    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initializeComponents());
        } else {
            this.initializeComponents();
        }
    }

    initializeComponents() {
        // Initialize all components
        new NavigationController();
        new LazyImageLoader();
        new ScrollEffectsController();
        new SmoothScrollController();
        new AnimationController();

        // Initialize carousel
        const carouselContainer = document.querySelector('.carousel-container');
        if (carouselContainer) {
            this.carousel = new PhotoCarousel(carouselContainer);
        }
    }
}

// ============================================================================
// Start Application
// ============================================================================
const app = new App();
