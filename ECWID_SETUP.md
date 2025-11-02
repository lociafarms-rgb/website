# Ecwid Store Setup Guide

## Overview

Ecwid provides a FREE e-commerce platform with no monthly fees - you only pay transaction fees when you make sales. This is the cheapest option for your merchandise store.

**Cost Structure:**
- **FREE Plan**: No monthly fees
- **Transaction Fees**: None from Ecwid (only payment processor fees like Stripe/PayPal: 2.9% + $0.30)
- **Limitations**: Free plan supports up to 10 products
- **Perfect For**: Starting out - you can upgrade later if needed

## Step 1: Create Ecwid Account

1. **Sign Up**:
   - Go to [www.ecwid.com](https://www.ecwid.com)
   - Click "Start Free" or "Get Started"
   - Create account with your email

2. **Complete Setup**:
   - Choose "Add to existing website" (your static HTML site)
   - Set store name: "Locia Farms"
   - Complete initial setup wizard

## Step 2: Get Your Store ID

1. **Find Store ID**:
   - After account creation, Ecwid will show your Store ID
   - It looks like: `12345678` (8-digit number)
   - You can also find it in: Ecwid Dashboard → Settings → General → Store ID
   - **Save this Store ID** - you'll need it for embedding

2. **Update Website**:
   - Open `merchandise/index.html`
   - Find the Ecwid embed code section
   - Replace `YOUR_STORE_ID` with your actual Store ID

## Step 3: Integrate Printful with Ecwid

1. **Install Printful App in Ecwid**:
   - Go to Ecwid Dashboard
   - Navigate to **"Apps"** or **"App Market"**
   - Search for **"Printful"**
   - Click **"Install"** or **"Add"**

2. **Connect Printful Account**:
   - Open the Printful app in Ecwid
   - Click **"Connect Printful Account"**
   - Log in to your Printful account (create one if needed)
   - Authorize the connection

3. **Create Products via Printful**:
   - In Ecwid → Printful app, click **"Create Product"**
   - Choose product type (T-shirt, Hoodie, Hat, etc.)
   - Upload your Locia Farms logo from Printful design library
   - Customize product (placement, size, colors)
   - Set your retail price (Printful base cost + your markup)
   - Click **"Add to Store"** - product will sync to Ecwid automatically

## Step 4: Configure Payment Methods

1. **Set Up Payments**:
   - Go to Ecwid Dashboard → **Settings** → **Payment**
   - Enable payment methods:
     - **Stripe** (recommended) - 2.9% + $0.30 per transaction
     - **PayPal** - 2.9% + $0.30 per transaction
     - Both can be enabled

2. **Configure Stripe**:
   - Click **"Connect Stripe"**
   - Sign in or create Stripe account
   - Authorize connection
   - Stripe handles all payment processing

## Step 5: Configure Shipping

1. **Set Up Shipping**:
   - Go to Ecwid Dashboard → **Settings** → **Shipping & Pickup**
   - Since Printful handles fulfillment, set up shipping rates:
     - **Option 1**: Use Printful's live shipping rates (requires Printful app configuration)
     - **Option 2**: Set flat rates or calculated shipping
   - Configure shipping zones (US, International, etc.)

2. **Printful Fulfillment**:
   - Orders placed in Ecwid will automatically sync to Printful
   - Printful prints and ships products
   - Customer receives tracking information automatically

## Step 6: Customize Store Appearance

1. **Store Design**:
   - Go to Ecwid Dashboard → **Design** → **Storefront**
   - Choose color scheme to match Locia Farms branding
   - Upload store logo
   - Customize fonts and layout

2. **Product Pages**:
   - Customize product page layout
   - Add product descriptions
   - Set up product categories (if needed)

## Step 7: Add Products Manually (Alternative to Printful App)

If you prefer to add products directly in Ecwid:

1. **Add Product**:
   - Go to Ecwid Dashboard → **Catalog** → **Add Product**
   - Enter product name, description, price
   - Upload product images (you can use Printful mockup images)
   - Add variants (sizes, colors)
   - Save product

2. **For Printful Integration**:
   - You'll still need to create corresponding products in Printful
   - Link them manually or use Printful app for automatic sync

## Step 8: Embed Store on Website

The store is already embedded in `merchandise/index.html`. Just:

1. **Update Store ID**:
   - Open `website/merchandise/index.html`
   - Find `window.ecwidStoreId = 'YOUR_STORE_ID';`
   - Replace `YOUR_STORE_ID` with your actual Ecwid Store ID

2. **Test Store**:
   - Open `merchandise/index.html` in browser
   - Store widget should load and display your products

## How It Works

1. **Customer Experience**:
   - Customer visits `merchandise/index.html`
   - Sees Ecwid store widget with your products
   - Clicks product, selects size/color
   - Adds to cart and checks out via Stripe/PayPal
   - Receives order confirmation

2. **Behind the Scenes**:
   - Order syncs from Ecwid to Printful automatically (via Printful app)
   - Printful prints product with your design
   - Printful ships directly to customer
   - Customer receives tracking number via email

3. **You**:
   - Receive order notification from Ecwid
   - See order in Printful dashboard
   - Pay Printful for product cost + shipping
   - Keep profit margin (your price - Printful cost)

## Product Recommendations

Based on farm-themed merchandise:

**Apparel (Create via Printful in Ecwid):**
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

**Free Plan Limit**: 10 products total - start with bestsellers, upgrade later if needed

## Pricing Strategy

When setting retail prices:

1. **Printful Base Cost**: Check Printful pricing for each product
2. **Add Markup**: Add your profit margin (e.g., 30-50%)
3. **Final Price**: Customer pays this amount
4. **You Pay**: Only Printful base cost + shipping
5. **You Keep**: The difference (profit)

Example:
- Printful T-shirt cost: $10
- Shipping: $5
- Your retail price: $24.99
- You keep: $9.99 profit per sale

## Troubleshooting

**Store Not Loading**:
- Verify Store ID is correct
- Check Ecwid dashboard - is store published?
- Clear browser cache

**Products Not Syncing from Printful**:
- Verify Printful app is installed and connected
- Check Printful dashboard - are products published?
- Ensure products are set to sync to Ecwid

**Payment Issues**:
- Verify Stripe/PayPal is connected in Ecwid settings
- Check payment method is enabled
- Test with a small test purchase

## Support & Resources

- **Ecwid Help Center**: [support.ecwid.com](https://support.ecwid.com)
- **Ecwid Dashboard**: [my.ecwid.com](https://my.ecwid.com)
- **Printful-Ecwid Integration**: [help.printful.com/hc/en-us/articles/360006838900](https://help.printful.com/hc/en-us/articles/360006838900)
- **Ecwid App Market**: [apps.ecwid.com](https://apps.ecwid.com)

## Next Steps

1. ✅ Create Ecwid account
2. ✅ Get Store ID and update `merchandise/index.html`
3. ✅ Install Printful app in Ecwid
4. ✅ Create first product with your logo
5. ✅ Set up payment method (Stripe/PayPal)
6. ✅ Test purchase
7. ✅ Launch store!

## Upgrade Path

If you outgrow the free plan (need more than 10 products):
- **Ecwid Venture Plan**: $19/month - Unlimited products, advanced features
- Still no transaction fees from Ecwid!

