# Square Online Store Setup Guide

## Overview

Square Online provides a **FREE e-commerce platform** with no monthly fees - you only pay transaction fees when you make sales. Perfect for your merchandise store!

## How Square Online Integrates with Your Website

Square Online integrates with your static HTML website in two main ways:

### Method 1: Iframe Embed (Current Implementation - Recommended)

**How it works:**
- Your Square store loads inside an iframe on your website
- Customers can browse and purchase without leaving your site
- Full checkout experience embedded in your page

**Pros:**
- Seamless user experience (stays on your site)
- No redirect to external store
- Integrated shopping experience

**Cons:**
- Some browsers may block iframes (backup link provided)
- May not work on all mobile browsers

### Method 2: Direct Link (Backup - Already Included)

**How it works:**
- If iframe is blocked or fails, a direct link button appears
- Customer clicks to visit your Square store in a new tab

**Pros:**
- Always works (no blocking issues)
- Clean, simple solution
- Good mobile experience

**Cons:**
- Customer leaves your website temporarily
- Less integrated feel

### Method 3: Buy Buttons (Alternative - Not Implemented)

You can also embed individual Square "Buy Buttons" for specific products:
- Create Buy Buttons in Square Dashboard → Items → Share
- Embed individual product buttons
- More granular control per product

**We're using Method 1 (iframe) with Method 2 (backup link) automatically.**

**Cost Structure:**
- **FREE Plan**: No monthly fees ✅
- **Transaction Fees**: 2.9% + $0.30 per transaction (Stripe/Square processing)
- **Perfect For**: Starting out with no upfront costs

## Step 1: Create Square Online Account

1. **Sign Up**:
   - Go to [squareup.com/us/en/online-store](https://squareup.com/us/en/online-store)
   - Click **"Get Started"** or **"Start Free"**
   - Choose **"Online Store"** plan (Free tier)

2. **Create Account**:
   - Enter your email address
   - Create password
   - Complete account setup

3. **Complete Store Setup**:
   - Enter store name: "Locia Farms"
   - Choose business type
   - Set up payment processing (Stripe/Square)

## Step 2: Get Your Store URL

1. **Find Store URL** (Multiple Ways):

   **Option A: From Square Dashboard**
   - Go to Square Dashboard → **Online** → **Website**
   - Your store URL is displayed at the top
   - Format: `https://YOUR-STORE-NAME.square.site`

   **Option B: From Settings**
   - Go to Square Dashboard → **Online** → **Settings** → **Domain**
   - Look for **"Store URL"** or **"Site Address"**
   - Copy the URL shown

   **Option C: Visit Your Store**
   - If you've already created your Square store
   - Visit it in a browser
   - Copy the URL from the address bar

2. **Your Store URL Format:**
   - Looks like: `https://locia-farms.square.site`
   - Or: `https://your-store-name.square.site`
   - Make sure it starts with `https://` and ends with `.square.site`

3. **Save This URL** - You'll need it for the next step!

2. **Custom Domain (Optional)**:
   - You can use a custom domain later if desired
   - For now, use the Square-provided URL

## Step 3: Update Website with Store URL

1. **Open File**:
   - Open `website/merchandise/index.html`
   - This is your merchandise store page

2. **Find Iframe Element** (Line ~165):
   - Look for: `<iframe id="square-store-iframe" src="YOUR_STORE_URL"`
   - Replace `YOUR_STORE_URL` with your actual Square store URL
   - Example: `src="https://locia-farms.square.site"`

3. **Find Backup Link** (Line ~175):
   - Look for: `<a href="YOUR_STORE_URL"`
   - Also replace `YOUR_STORE_URL` here (for backup link)
   - Example: `href="https://locia-farms.square.site"`

4. **Example of Updated Code**:
   ```html
   <!-- Replace this: -->
   <iframe src="YOUR_STORE_URL" ...>
   
   <!-- With this: -->
   <iframe src="https://locia-farms.square.site" ...>
   ```

5. **Save File**:
   - Save `merchandise/index.html`
   - Store will now load on your website

6. **Test It**:
   - Visit `merchandise/index.html` in browser
   - Store should load in iframe
   - If iframe is blocked, backup link button will appear

## Step 4: Integrate Printful with Square

1. **Connect Printful to Square**:
   - Go to [Printful Dashboard](https://www.printful.com/dashboard)
   - Navigate to **"Stores"** → **"Add store"** or **"Connect store"**
   - Choose **"Square"** as your platform
   - Click **"Connect to Square"**

2. **Authorize Connection**:
   - Log in to your Square account
   - Authorize Printful to access your Square store
   - Click **"Allow"** or **"Authorize"**

3. **Verify Connection**:
   - Return to Printful dashboard
   - You should see your Square store listed under "Stores"
   - Connection is now active!

## Step 5: Create Products via Printful

1. **Design Products**:
   - In Printful Dashboard, go to **"Stores"** → Select your Square store
   - Click **"Add product"** or **"Create product"**
   - Choose product type:
     - T-Shirts (Gildan 64000)
     - Hoodies (Gildan 18500)
     - Sweaters/Pullovers
     - Hats (Snapback, Beanie, Trucker)
     - Mugs (11oz, 15oz)
     - Tote Bags

2. **Upload Logo**:
   - Use your Locia Farms logo from Printful design library
   - Or upload `logos/locia_farms_vector.svg` (if not already uploaded)
   - Place logo on product (front, back, etc.)

3. **Customize Product**:
   - Choose product colors
   - Set sizes (S, M, L, XL, 2XL, etc.)
   - Set retail price (Printful cost + your markup)
   - Add product description

4. **Submit to Square**:
   - Click **"Add to Store"** or **"Submit to Square"**
   - Product will sync to your Square Online store
   - Product will appear in your store automatically

## Step 6: Configure Payment Processing

1. **Set Up Payments**:
   - Go to Square Dashboard → **Settings** → **Payments**
   - Enable payment methods:
     - **Square Payments** (default)
     - **Stripe** (optional, can enable both)

2. **Configure Stripe (Optional)**:
   - Square payments use Square's processing (2.9% + $0.30)
   - You can also connect Stripe for additional payment options
   - Both use same transaction fee structure

## Step 7: Configure Shipping

1. **Set Up Shipping**:
   - Go to Square Dashboard → **Online** → **Settings** → **Fulfillment** → **Shipping**
   - Since Printful handles fulfillment:
     - **Option 1**: Use Printful's live shipping rates (if available)
     - **Option 2**: Set flat shipping rates
     - **Option 3**: Free shipping (build into product price)

2. **Shipping Zones**:
   - Configure shipping zones (US, International, etc.)
   - Set shipping rates for each zone

## Step 8: Customize Store Appearance

1. **Store Design**:
   - Go to Square Dashboard → **Online** → **Website** → **Design**
   - Choose theme or customize colors
   - Upload store logo
   - Match your Locia Farms branding

2. **Product Pages**:
   - Customize product page layout
   - Add product descriptions
   - Set up categories (if needed)

## Step 9: Test Your Store

1. **Visit Store**:
   - Go to your Square store URL
   - Or visit `merchandise/index.html` on your website
   - Store should load in iframe

2. **Test Purchase**:
   - Add product to cart
   - Proceed to checkout
   - Use Square's test mode for testing
   - Verify order syncs to Printful

3. **Verify Printful Sync**:
   - Check Printful dashboard
   - Order should appear automatically
   - Printful will fulfill the order

## How It Works

1. **Customer Experience**:
   - Customer visits `merchandise/index.html`
   - Sees Square Online store embedded in iframe
   - Browses products, adds to cart
   - Checks out via Square checkout
   - Receives order confirmation

2. **Behind the Scenes**:
   - Order syncs from Square to Printful automatically
   - Printful prints product with your design
   - Printful ships directly to customer
   - Customer receives tracking number via email

3. **You**:
   - Receive order notification from Square
   - See order in Printful dashboard
   - Pay Printful for product cost + shipping
   - Keep profit margin (your price - Printful cost - fees)

## Pricing Strategy

When setting retail prices:

1. **Printful Base Cost**: Check Printful pricing for each product
2. **Add Markup**: Add your profit margin (e.g., 30-50%)
3. **Final Price**: Customer pays this amount
4. **Transaction Fee**: Square takes 2.9% + $0.30
5. **You Pay Printful**: Product cost + shipping
6. **You Keep**: The difference (profit)

**Example:**
- Printful T-shirt cost: $10
- Shipping: $5
- Your retail price: $24.99
- Square transaction fee: $0.72 (2.9% + $0.30)
- You pay Printful: $15
- **You keep: $9.27 profit per sale**

## Troubleshooting

**Store Not Loading**:
- Verify store URL is correct in `merchandise/index.html`
- Check Square dashboard - is store published?
- Clear browser cache
- Test store URL directly in browser

**Products Not Syncing from Printful**:
- Verify Printful app is connected to Square in Printful dashboard
- Check Printful dashboard - are products published?
- Ensure products are set to sync to Square
- Wait a few minutes for sync (can take 1-2 minutes)

**Payment Issues**:
- Verify Square payment processing is enabled
- Check Square dashboard → Settings → Payments
- Test with small test purchase
- Check Square account status

**Iframe Not Displaying**:
- Check if Square store URL is accessible
- Some browsers block iframes - customer can visit store directly
- Consider adding link to Square store as backup

## Alternative: Direct Link

If iframe embedding doesn't work, you can link directly to your Square store:

```html
<a href="YOUR_STORE_URL" target="_blank" class="buy-button">
    Visit Store
</a>
```

## Support & Resources

- **Square Help Center**: [squareup.com/help](https://squareup.com/help)
- **Square Dashboard**: [squareup.com/dashboard](https://squareup.com/dashboard)
- **Printful-Square Integration**: [help.printful.com/hc/en-us/articles/360019669739](https://help.printful.com/hc/en-us/articles/360019669739)
- **Square Online Plans**: [squareup.com/us/en/online-store/plans](https://squareup.com/us/en/online-store/plans)

## Next Steps

1. ✅ Create Square Online account
2. ✅ Get store URL and update `merchandise/index.html`
3. ✅ Create Printful account (if not already done)
4. ✅ Upload logo to Printful
5. ✅ Connect Printful to Square
6. ✅ Create first product (T-shirt with logo)
7. ✅ Test purchase
8. ✅ Launch store!

## Upgrade Path

If you need more features later:
- **Square Online Paid Plans**: Start at $29/month (only if you need advanced features)
- **For now**: Free plan is perfect for starting out!

