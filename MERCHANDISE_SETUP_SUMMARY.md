# Merchandise Store Setup Summary

## Quick Start Guide

Your merchandise store is now integrated with **Square Online** (FREE - no monthly fees) and **Printful** (dropshipping fulfillment).

## Cost Breakdown

### ✅ FREE Setup
- **Square Online Free Plan**: No monthly fees
- **Square Transaction Fees**: 2.9% + $0.30 per transaction (only when sales happen)

### 💰 You Pay Only When Sales Happen
- **Payment Processor Fees**: 2.9% + $0.30 per transaction (Square Payments)
- **Printful Costs**: Only when product is ordered (product cost + shipping)

### Example Pricing
- Customer buys T-shirt for **$24.99**
- Square takes: **$0.72** (2.9% + $0.30 transaction fee)
- Printful costs: **$15** (product + shipping)
- **You keep: $9.27 profit**

## Setup Steps (In Order)

### 1. Create Square Online Account
1. Go to [squareup.com/us/en/online-store](https://squareup.com/us/en/online-store)
2. Click "Get Started" or "Start Free"
3. Choose "Online Store" plan (Free tier)
4. Create account
5. Get your **Store URL** from: Square Dashboard → Online → Settings → Store URL

### 2. Update Website
1. Open `website/merchandise/index.html`
2. Find `<iframe id="square-store-iframe" src="YOUR_STORE_URL"`
3. Replace `YOUR_STORE_URL` with your actual Square store URL (e.g., `https://locia-farms.square.site`)

### 3. Create Printful Account
1. Go to [www.printful.com](https://www.printful.com)
2. Create account
3. Upload your logo: `logos/locia_farms_vector.svg` to Printful design library

### 4. Connect Printful to Square
1. In Printful Dashboard → **Stores** → **Add store**
2. Choose **Square** as platform
3. Click **Connect to Square**
4. Log in to Square and authorize connection

### 5. Create Products
1. In Printful Dashboard → Select your Square store → **Add product**
2. Choose product type (T-shirt, Hoodie, Hat, etc.)
3. Select your uploaded logo
4. Customize design
5. Set retail price
6. Click **Add to Store** - product syncs to Square automatically

### 6. Configure Payments
1. Square Dashboard → **Settings** → **Payments**
2. Square Payments is enabled by default (2.9% + $0.30 per transaction)
3. Optional: Connect Stripe for additional payment options

### 7. Test Store
1. Visit `merchandise/index.html` on your site
2. Store should load automatically
3. Place test order
4. Verify order syncs to Printful

## File Structure

```
website/
├── merchandise/
│   └── index.html          # Store page with Square Online embed
├── SQUARE_SETUP.md          # Complete Square Online setup guide
├── PRINTFUL_SETUP.md       # Complete Printful setup guide
└── MERCHANDISE_SETUP_SUMMARY.md  # This file
```

## How It Works

1. **Customer visits** `merchandise/index.html`
2. **Sees Square Online store** embedded with your products
3. **Adds to cart** and checks out via Square checkout
4. **Order automatically syncs** from Square to Printful
5. **Printful prints** product with your design
6. **Printful ships** directly to customer
7. **You pay** Printful for product cost + shipping
8. **You keep** profit (retail price - Printful cost - fees)

## Support Resources

- **Square Help**: [squareup.com/help](https://squareup.com/help)
- **Square Dashboard**: [squareup.com/dashboard](https://squareup.com/dashboard)
- **Printful Help**: [help.printful.com](https://help.printful.com)
- **Printful Dashboard**: [www.printful.com/dashboard](https://www.printful.com/dashboard)
- **Square-Printful Integration**: [help.printful.com/hc/en-us/articles/360019669739](https://help.printful.com/hc/en-us/articles/360019669739)

## Troubleshooting

**Store not showing?**
- Verify store URL is correct in `merchandise/index.html`
- Check Square dashboard - is store published?
- Test store URL directly in browser
- Clear browser cache

**Products not syncing from Printful?**
- Verify Printful is connected to Square in Printful dashboard
- Check Printful dashboard - are products published?
- Ensure products are set to sync to Square
- Wait a few minutes for sync

**Payment issues?**
- Verify Square payment processing is enabled
- Check Square dashboard → Settings → Payments
- Test with small test purchase

## Next Steps

1. ✅ Create Square Online account
2. ✅ Get store URL and update `merchandise/index.html`
3. ✅ Create Printful account
4. ✅ Upload logo to Printful
5. ✅ Connect Printful to Square
6. ✅ Create first product (T-shirt with logo)
7. ✅ Test purchase
8. ✅ Launch!

## Product Recommendations

Start with bestsellers (Square Online free plan has no product limits):
- T-Shirt (multiple colors)
- Hoodie
- Hat
- Mug
- Tote Bag
- Sweaters
- More as needed!

Square Online free plan has no product limits - perfect for growing!

