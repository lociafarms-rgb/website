/**
 * Merchandise Loader for Locia Farms
 * Dynamically loads and displays merchandise products from Printful API or fallback JSON
 */

class MerchandiseLoader {
    constructor() {
        this.productsContainer = null;
        this.products = [];
        this.init();
    }

    async init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.loadProducts());
        } else {
            this.loadProducts();
        }
    }

    async loadProducts() {
        // Find products containers
        const homeContainer = document.querySelector('#merchandise .merchandise-grid');
        const merchPageContainer = document.querySelector('.merchandise-grid');
        
        this.productsContainer = merchPageContainer || homeContainer;
        
        if (!this.productsContainer) return;

        try {
            // Try to load from Printful API first (if configured)
            if (typeof printfulAPI !== 'undefined' && printfulAPI.isConfigured()) {
                try {
                    this.products = await printfulAPI.fetchProducts();
                    if (this.products.length > 0) {
                        this.renderProducts();
                        return;
                    }
                } catch (apiError) {
                    // Silently fall back to merchandise.json if API fails
                    // Fall through to JSON loading
                }
            }

            // Fallback to merchandise.json file
            const merchPath = window.location.pathname.includes('/merchandise/') 
                ? '../merchandise.json' 
                : 'merchandise.json';
            
            const response = await fetch(merchPath);
            if (!response.ok) {
                throw new Error('Failed to load merchandise.json');
            }
            
            const data = await response.json();
            this.products = data.products || [];

            if (this.products.length === 0) {
                // Show empty state if there's no placeholder content
                const existingEmpty = this.productsContainer.querySelector('.empty-state');
                if (!existingEmpty) {
                    this.showEmptyState();
                }
                return;
            }

            // Render products
            this.renderProducts();
        } catch (error) {
            // Only show empty state if container is empty
            const existingContent = this.productsContainer.querySelector('.empty-state, .product-card, .merchandise-item');
            if (!existingContent) {
                this.showEmptyState();
            }
        }
    }

    renderProducts() {
        if (!this.productsContainer) return;

        // Clear existing placeholder content
        const emptyState = this.productsContainer.querySelector('.empty-state');
        if (emptyState) {
            emptyState.remove();
        }

        // Render each product
        this.products.forEach(product => {
            const productElement = this.createProductElement(product);
            this.productsContainer.appendChild(productElement);
        });
    }

    createProductElement(product) {
        const productCard = document.createElement('div');
        productCard.className = 'merchandise-item material-card product-card';
        
        // Get primary variant for price and image
        const primaryVariant = product.variants && product.variants.length > 0 
            ? product.variants[0] 
            : null;
        
        const price = primaryVariant 
            ? this.formatPrice(primaryVariant.retail_price, primaryVariant.currency || 'USD')
            : 'Contact for Price';
        
        const imageUrl = product.thumbnail || primaryVariant?.preview_url || 'images/placeholder-product.jpg';
        
        // Build variant options
        const sizes = this.getUniqueSizes(product.variants);
        const colors = this.getUniqueColors(product.variants);
        
        productCard.innerHTML = `
            <div class="card-image">
                <img src="${this.escapeHtml(imageUrl)}" 
                     alt="${this.escapeHtml(product.name)}" 
                     loading="lazy" 
                     decoding="async" 
                     width="400" 
                     height="300"
                     onerror="this.src='images/splash-home-02.jpeg'">
            </div>
            <div class="card-content">
                <h3>${this.escapeHtml(product.name)}</h3>
                ${product.description ? `<p class="product-description">${this.escapeHtml(product.description.substring(0, 150))}${product.description.length > 150 ? '...' : ''}</p>` : ''}
                
                <div class="product-variants">
                    ${sizes.length > 1 ? `
                        <div class="variant-selector">
                            <label for="size-${product.id}">Size:</label>
                            <select id="size-${product.id}" class="variant-select" data-product-id="${product.id}">
                                ${sizes.map(size => `<option value="${this.escapeHtml(size)}">${this.escapeHtml(size)}</option>`).join('')}
                            </select>
                        </div>
                    ` : ''}
                    
                    ${colors.length > 1 ? `
                        <div class="variant-selector">
                            <label for="color-${product.id}">Color:</label>
                            <select id="color-${product.id}" class="variant-select" data-product-id="${product.id}">
                                ${colors.map(color => `<option value="${this.escapeHtml(color)}">${this.escapeHtml(color)}</option>`).join('')}
                            </select>
                        </div>
                    ` : ''}
                </div>
                
                <div class="product-price">
                    <span class="price-display">${price}</span>
                </div>
                
                <div class="card-actions">
                    <a href="${this.getCheckoutUrl(product, primaryVariant)}" 
                       target="_blank" 
                       rel="noopener noreferrer" 
                       class="buy-button cta-button primary"
                       data-product-id="${product.id}">
                        Buy Now
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4H6zM3 6h18M16 10a4 4 0 1 1-8 0"/>
                        </svg>
                    </a>
                </div>
            </div>
        `;

        // Add variant change handlers
        this.attachVariantHandlers(productCard, product);

        return productCard;
    }

    attachVariantHandlers(productCard, product) {
        const variantSelects = productCard.querySelectorAll('.variant-select');
        const buyButton = productCard.querySelector('.buy-button');
        const priceDisplay = productCard.querySelector('.price-display');
        
        variantSelects.forEach(select => {
            select.addEventListener('change', () => {
                // Update price based on selected variant
                const selectedSize = productCard.querySelector(`#size-${product.id}`)?.value || null;
                const selectedColor = productCard.querySelector(`#color-${product.id}`)?.value || null;
                
                const matchingVariant = product.variants.find(variant => {
                    const sizeMatch = !selectedSize || variant.size === selectedSize;
                    const colorMatch = !selectedColor || variant.color === selectedColor;
                    return sizeMatch && colorMatch && variant.is_available;
                });
                
                if (matchingVariant && priceDisplay) {
                    priceDisplay.textContent = this.formatPrice(
                        matchingVariant.retail_price, 
                        matchingVariant.currency || 'USD'
                    );
                    
                    // Update buy button URL
                    if (buyButton) {
                        buyButton.href = this.getCheckoutUrl(product, matchingVariant);
                    }
                }
            });
        });
    }

    getUniqueSizes(variants) {
        if (!variants || variants.length === 0) return [];
        const sizes = variants
            .filter(v => v.size && v.is_available)
            .map(v => v.size)
            .filter((size, index, self) => self.indexOf(size) === index)
            .sort((a, b) => {
                // Sort sizes logically: XS, S, M, L, XL, 2XL, etc.
                const order = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL'];
                const aIndex = order.indexOf(a);
                const bIndex = order.indexOf(b);
                if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
                if (aIndex !== -1) return -1;
                if (bIndex !== -1) return 1;
                return a.localeCompare(b);
            });
        return sizes.length > 0 ? sizes : ['One Size'];
    }

    getUniqueColors(variants) {
        if (!variants || variants.length === 0) return [];
        const colors = variants
            .filter(v => v.color && v.is_available)
            .map(v => v.color)
            .filter((color, index, self) => self.indexOf(color) === index);
        return colors;
    }

    formatPrice(price, currency = 'USD') {
        if (!price || price === '0.00') {
            return 'Contact for Price';
        }
        
        const numPrice = typeof price === 'string' ? parseFloat(price) : price;
        if (isNaN(numPrice)) {
            return 'Contact for Price';
        }
        
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency || 'USD'
        }).format(numPrice);
    }

    getCheckoutUrl(product, variant) {
        // For now, redirect to Printful's hosted checkout
        // In the future, this could be a custom checkout URL or embedded checkout
        if (variant && variant.id) {
            // Use Printful store checkout if available
            // Update this URL once you set up your Printful store
            const storeUrl = 'https://www.printful.com/store/locia-farms'; // Update with your store URL
            return `${storeUrl}?product=${product.id}&variant=${variant.id}`;
        }
        
        // Fallback: link to product in Printful store
        return `https://www.printful.com/store/locia-farms?product=${product.id}`;
    }

    escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    showEmptyState() {
        if (!this.productsContainer) return;
        
        const emptyState = document.createElement('div');
        emptyState.className = 'empty-state';
        emptyState.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="64" height="64">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4H6zM3 6h18M16 10a4 4 0 1 1-8 0"/>
            </svg>
            <h3>Coming Soon</h3>
            <p>Our merchandise store is under development. Check back soon for Locia Farms apparel and accessories!</p>
            ${typeof printfulAPI !== 'undefined' && !printfulAPI.isConfigured() ? `
                <p class="setup-note">To enable merchandise, configure Printful API in <code>printful-api-config.js</code></p>
            ` : ''}
        `;
        
        this.productsContainer.appendChild(emptyState);
    }
}

// Initialize merchandise loader
const merchandiseLoader = new MerchandiseLoader();

