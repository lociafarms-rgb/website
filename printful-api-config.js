/**
 * Printful API Configuration
 * This file contains the Printful API setup and product fetching logic
 * 
 * SECURITY NOTE: This file will be public on GitHub Pages. The API key will be visible.
 * - Printful API keys should ideally be restricted server-side for production
 * - For GitHub Pages (static site), we use direct API calls (CORS supported by Printful)
 * - Consider adding server-side proxy in future if needed
 * 
 * To complete setup:
 * 1. Create Printful account at www.printful.com
 * 2. Generate API key from Printful dashboard → API section
 * 3. Upload logo to Printful design library
 * 4. Create products in Printful dashboard (or via API)
 * 5. Add API key and Store ID below
 * 6. Set USE_API to true
 */

const PRINTFUL_API_CONFIG = {
    // Your Printful API key
    // Get it from: https://www.printful.com/dashboard → API section
    // ⚠️ UPDATE THIS with your API key
    API_KEY: 'YOUR_PRINTFUL_API_KEY_HERE',
    
    // Your Printful Store ID (optional but recommended)
    // Find it in: Printful dashboard → Stores
    // ⚠️ UPDATE THIS with your Store ID (if you have one)
    STORE_ID: null, // e.g., '123456' or null if not using store
    
    // Printful API base URL
    API_BASE_URL: 'https://api.printful.com',
    
    // Cache duration in milliseconds (24 hours default)
    CACHE_DURATION: 24 * 60 * 60 * 1000,
    
    // Use API instead of merchandise.json file
    // ⚠️ Set to true after adding your API key above
    USE_API: false
};

/**
 * Printful API Service
 * Handles fetching products from Printful API
 */
class PrintfulAPIService {
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
               this.config.API_KEY !== 'YOUR_PRINTFUL_API_KEY_HERE' &&
               this.config.API_BASE_URL;
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
     * Make authenticated API request
     * Printful API uses Basic Auth with API key as username and empty password
     */
    async apiRequest(endpoint, options = {}) {
        const url = `${this.config.API_BASE_URL}${endpoint}`;
        // Printful uses Basic Auth: base64(api_key:)
        const authHeader = btoa(`${this.config.API_KEY}:`);
        
        const defaultOptions = {
            method: 'GET',
            headers: {
                'Authorization': `Basic ${authHeader}`,
                'Content-Type': 'application/json'
            }
        };

        // Merge with provided options
        const finalOptions = {
            ...defaultOptions,
            ...options,
            headers: {
                ...defaultOptions.headers,
                ...(options.headers || {})
            }
        };

        // Handle body if present
        if (options.body && typeof options.body === 'object') {
            finalOptions.body = JSON.stringify(options.body);
        } else if (options.body) {
            finalOptions.body = options.body;
        }

        const response = await fetch(url, finalOptions);
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(`Printful API error: ${errorData.error?.message || response.statusText}`);
        }

        return response.json();
    }

    /**
     * Fetch all products from Printful store
     */
    async fetchProducts() {
        if (!this.isConfigured()) {
            throw new Error('Printful API is not configured');
        }

        // Return cached data if valid
        if (this.isCacheValid()) {
            return this.cache;
        }

        try {
            // Build endpoint - use store products if Store ID provided, otherwise use catalog
            const endpoint = this.config.STORE_ID 
                ? `/store/products`
                : `/store/products`; // Default to store products
            
            const data = await this.apiRequest(endpoint);
            
            // Transform Printful API response to our product format
            const products = (data.result?.data || data.result || []).map(item => {
                const product = item.sync_product || item;
                const syncVariants = item.sync_variants || [];
                
                return {
                    id: product.id?.toString() || item.id?.toString(),
                    name: product.name || 'Unnamed Product',
                    thumbnail: product.thumbnail_url || syncVariants[0]?.files?.[0]?.preview_url || null,
                    variants: syncVariants.map(variant => ({
                        id: variant.id?.toString(),
                        product_id: variant.product_id?.toString(),
                        variant_id: variant.variant_id?.toString(),
                        name: variant.name || 'Default',
                        retail_price: variant.retail_price || '0.00',
                        currency: variant.currency || 'USD',
                        size: variant.size || null,
                        color: variant.color || null,
                        is_available: variant.is_available !== false
                    })),
                    sync_product_id: product.id?.toString(),
                    description: product.description || ''
                };
            });

            // Cache the results
            this.cache = products;
            this.cacheTimestamp = Date.now();

            return products;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Fetch single product details by ID
     */
    async fetchProduct(productId) {
        if (!this.isConfigured()) {
            throw new Error('Printful API is not configured');
        }

        try {
            const data = await this.apiRequest(`/store/products/${productId}`);
            const product = data.result?.sync_product || data.result;
            const syncVariants = data.result?.sync_variants || [];
            
            return {
                id: product.id?.toString(),
                name: product.name || 'Unnamed Product',
                thumbnail: product.thumbnail_url || syncVariants[0]?.files?.[0]?.preview_url || null,
                variants: syncVariants.map(variant => ({
                    id: variant.id?.toString(),
                    product_id: variant.product_id?.toString(),
                    variant_id: variant.variant_id?.toString(),
                    name: variant.name || 'Default',
                    retail_price: variant.retail_price || '0.00',
                    currency: variant.currency || 'USD',
                    size: variant.size || null,
                    color: variant.color || null,
                    is_available: variant.is_available !== false
                })),
                sync_product_id: product.id?.toString(),
                description: product.description || ''
            };
        } catch (error) {
            throw error;
        }
    }

    /**
     * Get product variants (sizes, colors, etc.)
     */
    async getProductVariants(productId) {
        const product = await this.fetchProduct(productId);
        return product.variants || [];
    }

    /**
     * Create product programmatically (requires design file URL or ID)
     * 
     * @param {Object} productData - Product creation data
     * @param {string} productData.name - Product name
     * @param {number} productData.catalog_product_id - Printful catalog product ID
     * @param {Array} productData.variants - Array of variant objects with size, color, etc.
     * @param {string} productData.thumbnail_url - Thumbnail image URL
     */
    async createProduct(productData) {
        if (!this.isConfigured()) {
            throw new Error('Printful API is not configured');
        }

        try {
            const response = await this.apiRequest('/store/products', {
                method: 'POST',
                body: JSON.stringify(productData)
            });

            return response.result;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Update product programmatically
     */
    async updateProduct(productId, updateData) {
        if (!this.isConfigured()) {
            throw new Error('Printful API is not configured');
        }

        try {
            const response = await this.apiRequest(`/store/products/${productId}`, {
                method: 'PUT',
                body: JSON.stringify(updateData)
            });

            return response.result;
        } catch (error) {
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

    /**
     * Get Printful checkout URL for a product variant
     */
    getCheckoutUrl(productId, variantId) {
        // Printful checkout URLs can be generated or you can redirect to store
        // For now, we'll use Printful's hosted store checkout
        const baseUrl = 'https://www.printful.com';
        return `${baseUrl}/store/your-store-name`; // Update with your store URL
    }
}

// Create singleton instance
const printfulAPI = new PrintfulAPIService(PRINTFUL_API_CONFIG);

