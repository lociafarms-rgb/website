/**
 * Google Analytics & Google Ads Configuration
 * Centralized tracking configuration for the website
 */

const ANALYTICS_CONFIG = {
    // Google Analytics 4 (GA4) Measurement ID
    // Get from: Google Analytics → Admin → Data Streams → Web Stream → Measurement ID
    // Format: G-XXXXXXXXXX
    // Create GA4 property: https://analytics.google.com → Admin → Create Property
    GA4_MEASUREMENT_ID: 'G-J4R8TKD3PE', // ✅ Configured
    
    // Google Ads Conversion ID (already configured)
    GOOGLE_ADS_CONVERSION_ID: 'AW-17696537147',
    
    // Link Google Ads and Analytics (set to true when accounts are linked)
    LINK_ANALYTICS_AND_ADS: false, // ⚠️ Set to true after linking accounts
    
    // Enhanced Conversions (requires user data)
    ENHANCED_CONVERSIONS: false, // ⚠️ Enable after setting up enhanced conversions
};

/**
 * Initialize Google Analytics and Google Ads tracking
 */
function initializeAnalytics() {
    // Initialize dataLayer
    window.dataLayer = window.dataLayer || [];
    
    function gtag() {
        dataLayer.push(arguments);
    }
    
    // Load GA4 script if configured
    if (ANALYTICS_CONFIG.GA4_MEASUREMENT_ID && ANALYTICS_CONFIG.GA4_MEASUREMENT_ID !== 'G-XXXXXXXXXX' && ANALYTICS_CONFIG.GA4_MEASUREMENT_ID.length > 0) {
        // Load GA4 script dynamically
        const ga4Script = document.createElement('script');
        ga4Script.async = true;
        ga4Script.src = `https://www.googletagmanager.com/gtag/js?id=${ANALYTICS_CONFIG.GA4_MEASUREMENT_ID}`;
        document.head.appendChild(ga4Script);
        
        gtag('js', new Date());
        gtag('config', ANALYTICS_CONFIG.GA4_MEASUREMENT_ID, {
            'send_page_view': true,
            'page_path': window.location.pathname,
            'page_title': document.title
        });
    }
    
    // Configure Google Ads (already loaded in index.html)
    if (ANALYTICS_CONFIG.GOOGLE_ADS_CONVERSION_ID) {
        gtag('config', ANALYTICS_CONFIG.GOOGLE_ADS_CONVERSION_ID);
    }
    
    // Link Analytics and Ads if configured
    if (ANALYTICS_CONFIG.LINK_ANALYTICS_AND_ADS && ANALYTICS_CONFIG.GA4_MEASUREMENT_ID && ANALYTICS_CONFIG.GA4_MEASUREMENT_ID !== 'G-XXXXXXXXXX' && ANALYTICS_CONFIG.GA4_MEASUREMENT_ID.length > 0) {
        gtag('config', ANALYTICS_CONFIG.GOOGLE_ADS_CONVERSION_ID, {
            'allow_enhanced_conversions_for_personal_information': ANALYTICS_CONFIG.ENHANCED_CONVERSIONS
        });
    }
    
    // Make gtag available globally
    window.gtag = gtag;
    
    // Set up event tracking
    setupEventTracking();
}

/**
 * Track custom events
 */
function trackEvent(eventName, eventParams = {}) {
    if (typeof window.gtag === 'function') {
        window.gtag('event', eventName, eventParams);
    }
}

/**
 * Track conversions
 */
function trackConversion(conversionLabel, value = null, currency = 'USD') {
    if (typeof window.gtag === 'function') {
        const params = {
            'send_to': `${ANALYTICS_CONFIG.GOOGLE_ADS_CONVERSION_ID}/${conversionLabel}`
        };
        
        if (value) {
            params.value = value;
            params.currency = currency;
        }
        
        window.gtag('event', 'conversion', params);
    }
}

/**
 * Track page views (manual tracking if needed)
 */
function trackPageView(pagePath, pageTitle = null) {
    if (typeof window.gtag === 'function') {
        const params = {
            'page_path': pagePath
        };
        
        if (pageTitle) {
            params.page_title = pageTitle;
        }
        
        if (ANALYTICS_CONFIG.GA4_MEASUREMENT_ID && ANALYTICS_CONFIG.GA4_MEASUREMENT_ID !== 'G-XXXXXXXXXX' && ANALYTICS_CONFIG.GA4_MEASUREMENT_ID.length > 0) {
            window.gtag('event', 'page_view', params);
        }
    }
}

/**
 * Set up automatic event tracking for user interactions
 */
function setupEventTracking() {
    // Track contact link clicks
    document.querySelectorAll('a[href="#contact"], a[href*="contact"]').forEach(link => {
        link.addEventListener('click', () => {
            trackEvent('contact_interest', {
                'event_category': 'engagement',
                'event_label': 'contact_link_click'
            });
        });
    });
    
    // Track product interest clicks
    document.querySelectorAll('.btn-text[href="#contact"], a[href="#products"]').forEach(link => {
        link.addEventListener('click', () => {
            trackEvent('product_interest', {
                'event_category': 'engagement',
                'event_label': 'product_inquiry'
            });
        });
    });
    
    // Track video engagement
    document.querySelectorAll('.video-embed iframe').forEach(iframe => {
        iframe.addEventListener('load', () => {
            trackEvent('video_view', {
                'event_category': 'engagement',
                'event_label': 'video_loaded'
            });
        });
    });
    
    // Track external link clicks (YouTube, etc.)
    document.querySelectorAll('a[target="_blank"], a[rel*="noopener"]').forEach(link => {
        link.addEventListener('click', () => {
            trackEvent('external_link', {
                'event_category': 'outbound',
                'event_label': link.href
            });
        });
    });
    
    // Track section scrolls (when sections come into view)
    if ('IntersectionObserver' in window) {
        const sections = document.querySelectorAll('section[id]');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const sectionId = entry.target.id;
                    trackEvent('section_view', {
                        'event_category': 'engagement',
                        'event_label': sectionId,
                        'non_interaction': true
                    });
                    observer.unobserve(entry.target); // Track once per session
                }
            });
        }, { threshold: 0.5 });
        
        sections.forEach(section => observer.observe(section));
    }
}

// Initialize on load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeAnalytics);
} else {
    initializeAnalytics();
}

