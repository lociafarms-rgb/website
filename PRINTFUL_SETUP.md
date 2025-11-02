# Printful Merchandise Store Setup

## Quick Start

Set up your Printful account and API integration for programmatic merchandise management.

## Step 1: Create Printful Account

1. **Sign up at Printful**: [www.printful.com](https://www.printful.com)
   - Click "Sign Up" or "Start Selling"
   - Create account with your email

2. **Verify Your Email**: Check your email and verify your account

3. **Set Up Store**: 
   - Choose "I want to connect my own store" (we'll integrate via API)
   - Or skip for now - we can create products via API

## Step 2: Generate API Key

1. **Navigate to API Section**:
   - Go to [Printful Dashboard](https://www.printful.com/dashboard)
   - Click on your profile/account (top right)
   - Go to **"Stores"** → **"API"** or **"Developer"** section

2. **Generate API Key**:
   - Click **"Generate API Key"** or **"Create API Key"**
   - Copy the API key immediately (you'll only see it once!)
   - Save it securely (e.g., `printful-api-key.txt`)

3. **API Key Security**:
   - Keep your API key private
   - Never commit it to public repositories
   - For GitHub Pages, we'll use it in the config file (see security notes below)

## Step 3: Get Store ID (Optional but Recommended)

1. **Find Store ID**:
   - In Printful dashboard, go to **"Stores"**
   - If you've connected a store, you'll see your Store ID
   - If not connected, you can still use API with just the API key
   - Store ID format: Usually a number (e.g., `123456`)

## Step 4: Upload Your Logo

1. **Navigate to Design Library**:
   - In Printful dashboard, go to **"Designs"** or **"Design Library"**
   - Click **"Add Design"** or **"Upload"**

2. **Upload Logo**:
   - Upload `logos/locia_farms_vector.svg` (preferred - vector format)
   - Or upload `logos/logo.png` (raster format)
   - Name it "Locia Farms Logo" for easy identification
   - Note the Design ID for later use (if needed for programmatic creation)

3. **Design Requirements**:
   - Vector files (.svg) work best for scaling
   - PNG files should be high resolution (at least 300 DPI)
   - Transparent background recommended
   - Logo will be automatically placed on products

## Step 5: Create Initial Products (Dashboard Method)

**Option A: Create via Dashboard (Easier for first-time setup)**

1. **Go to Catalog**:
   - In Printful dashboard, go to **"Products"** or **"Catalog"**
   - Click **"Add Product"** or **"Create Product"**

2. **Choose Product Type**:
   - **T-Shirts**: Gildan 64000 (Unisex Heavy Cotton T-Shirt)
   - **Hoodies**: Gildan 18500 (Unisex Heavy Blend Hoodie)
   - **Sweaters**: Search for "pullover" or "sweater"
   - **Hats**: 
     - Baseball Cap (Snapback)
     - Beanie (Winter Hat)
     - Trucker Hat
   - **Mugs**: Ceramic Mug (11oz or 15oz)
   - **Totes**: Tote Bag

3. **Design Placement**:
   - Select your uploaded "Locia Farms Logo"
   - Choose placement (front, back, etc.)
   - Adjust size and position
   - Save design

4. **Set Variants**:
   - Select sizes (S, M, L, XL, 2XL, etc.)
   - Select colors (if applicable)
   - Set retail price (optional - can be managed via API)

5. **Save Product**:
   - Click **"Save"** or **"Publish"**
   - Note the Product ID for API access

**Option B: Create via API (Programmatic)**

Products can be created programmatically using the `PrintfulAPIService` class. See `printful-api-config.js` for API methods.

## Step 6: Configure Website

1. **Update `printful-api-config.js`**:
   ```javascript
   API_KEY: 'YOUR_PRINTFUL_API_KEY_HERE',
   STORE_ID: 'YOUR_STORE_ID_HERE', // Optional
   USE_API: true  // Change from false to true
   ```

2. **Security Notes**:
   - Since this is a public GitHub Pages site, the API key will be visible in the JavaScript file
   - Printful API keys should be restricted to specific HTTP referrers if possible
   - Consider using server-side proxy for production (if you add a backend later)
   - For now, Printful API supports CORS for direct browser access

3. **Test Connection**:
   - Open `merchandise/index.html` in browser
   - Check browser console for any API errors
   - Products should load automatically if API is configured

## How It Works

- **Automatic**: Fetches products from Printful API
- **Cached**: Results cached for 24 hours (performance)
- **Fallback**: Uses `merchandise.json` if API fails or is disabled
- **Dropshipping**: Printful handles inventory, printing, and shipping automatically
- **Orders**: When customers purchase, Printful automatically fulfills the order

## API Endpoints Used

- `GET /store/products` - List all products
- `GET /store/products/{id}` - Get product details  
- `GET /store/products/{id}/variants` - Get product variants (sizes, colors)
- `POST /store/products` - Create new product (programmatic)
- `PUT /store/products/{id}` - Update product (programmatic)

## Product Catalog Recommendations

Based on farm-themed merchandise:

**Apparel:**
- Unisex T-Shirts (Gildan 64000) - Multiple colors
- Hoodies (Gildan 18500) - Multiple colors
- Pullover Sweaters
- Long Sleeve T-Shirts

**Accessories:**
- Baseball Caps (Snapback)
- Beanies (Winter Hats)
- Trucker Hats
- Tote Bags

**Home Goods:**
- Ceramic Mugs (11oz, 15oz)
- Travel Mugs
- Optional: Stickers, Coasters, Aprons

## Support & Resources

- **Printful API Docs**: [developers.printful.com](https://developers.printful.com/)
- **Printful Help Center**: [help.printful.com](https://help.printful.com/)
- **Printful Dashboard**: [www.printful.com/dashboard](https://www.printful.com/dashboard)

## Troubleshooting

**API Key Not Working:**
- Verify API key is correct (no extra spaces)
- Check that API key is enabled in Printful dashboard
- Ensure `USE_API: true` in config

**No Products Showing:**
- Verify products exist in Printful dashboard
- Check browser console for errors
- Ensure Store ID is correct (if using)
- Try fallback JSON file if API issues persist

**Products Not Loading:**
- Check CORS errors in browser console
- Verify Printful API status
- Clear browser cache
- Check network tab for API requests

## Next Steps

Once products are created and API is configured:

1. Products will automatically display on `merchandise/index.html`
2. Customers can select variants (size, color)
3. Clicking "Buy Now" redirects to Printful checkout
4. Printful handles order fulfillment automatically
5. You receive notifications for each order

