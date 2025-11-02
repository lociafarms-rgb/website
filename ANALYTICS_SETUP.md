# Google Analytics & Google Ads Setup Guide

## ✅ What's Already Configured

- **Google Ads Conversion Tag**: `AW-17696537147` ✅ Installed
- **Event Tracking**: ✅ Automatic tracking for user interactions
- **Analytics Configuration**: ✅ Centralized in `analytics-config.js`

## Next Steps: Set Up Google Analytics 4

### Step 1: Create Google Analytics 4 Property

1. Go to [Google Analytics](https://analytics.google.com/)
2. Sign in with your Google account
3. Click **Admin** (gear icon, bottom left)
4. In **Account** column, select or create an account
5. In **Property** column, click **Create Property**
6. Enter property details:
   - **Property name**: "Locia Farms Website"
   - **Reporting time zone**: Eastern Time (US & Canada)
   - **Currency**: USD
7. Click **Next** → **Next** → **Create**
8. Accept terms and continue

### Step 2: Set Up Data Stream

1. After creating property, click **Web** under **Data streams**
2. Enter website details:
   - **Website URL**: `https://lociafarms-rgb.github.io/website/`
   - **Stream name**: "Locia Farms Website"
3. Click **Create stream**
4. **Copy your Measurement ID** (format: `G-J4R8TKD3PE`)

### Step 3: Configure the Website

1. Open `website/analytics-config.js`
2. Update the GA4 Measurement ID:

```javascript
GA4_MEASUREMENT_ID: 'G-XXXXXXXXXX', // Replace with your actual ID
```

3. Save the file
4. Commit and push to GitHub

### Step 4: Link Google Ads and Analytics

1. **In Google Analytics:**
   - Go to **Admin** → **Product Links** → **Google Ads Links**
   - Click **Link**
   - Select your Google Ads account (Customer ID: `9634660250`)
   - Enable "All website data"
   - Click **Next** → **Link accounts**

2. **In Google Ads:**
   - Go to **Tools & Settings** → **Linked accounts
   - Verify Google Analytics is linked
   - Click **Details** → Enable "Import site metrics"

3. **Update `analytics-config.js`:**
   ```javascript
   LINK_ANALYTICS_AND_ADS: true, // Change from false to true
   ```

## Automatic Event Tracking

The website automatically tracks:

- ✅ **Page views** - All page loads
- ✅ **Contact interest** - Clicks on contact links
- ✅ **Product interest** - Clicks on product inquiry links
- ✅ **Video engagement** - Video loads
- ✅ **External links** - Outbound link clicks
- ✅ **Section views** - When sections come into view

## Conversion Tracking Setup

### Create Conversion Actions in Google Ads

1. Go to [Google Ads](https://ads.google.com)
2. Click **Tools & Settings** → **Conversions**
3. Click **+ New conversion action**
4. Select **Website**
5. Configure your conversion:
   - **Category**: Choose appropriate (e.g., "Contact")
   - **Conversion name**: e.g., "Website Contact"
   - **Value**: Set if applicable
   - **Count**: "One" (count once per conversion)

6. **Installation**: Since you already have the global tag (`AW-17696537147`), select **"Use existing tag"**

7. **Track conversions in code** (if needed):
   ```javascript
   // When a form is submitted or action completed:
   trackConversion('conversion_label_from_google_ads');
   ```

### Example: Track Contact Form Submission

If you add a contact form later, track conversions like this:

```javascript
document.getElementById('contactForm').addEventListener('submit', (e) => {
    trackConversion('contact_form_submission', 0, 'USD');
    // Your form submission code here
});
```

## Enhanced Conversions (Optional)

For better conversion tracking accuracy:

1. In Google Ads: **Tools & Settings** → **Conversions**
2. Select your conversion action → **Edit settings**
3. Enable **"Enhanced conversions"**
4. Update `analytics-config.js`:
   ```javascript
   ENHANCED_CONVERSIONS: true, // Change from false to true
   ```

## Verification

### Test Google Analytics

1. Visit your website: `https://lociafarms-rgb.github.io/website/`
2. Open browser DevTools → Network tab
3. Filter for "collect" or "gtag"
4. You should see requests to `google-analytics.com` and `googleadservices.com`

### Test Google Ads

1. Visit your website
2. Check DevTools → Network tab
3. Look for requests to `googleadservices.com` with ID `AW-17696537147`

### Real-Time Reports

1. **Google Analytics**: 
   - Go to **Reports** → **Realtime**
   - Visit your website
   - You should see your visit appear within seconds

2. **Google Ads**:
   - Go to **Tools & Settings** → **Conversions**
   - Check conversion actions are receiving data

## Quick Reference

- **GA4 Property**: [Create Here](https://analytics.google.com/)
- **Google Ads**: [Account Dashboard](https://ads.google.com)
- **Google Ads Customer ID**: `9634660250`
- **Conversion Tag**: `AW-17696537147`
- **Config File**: `website/analytics-config.js`

## Current Configuration

```javascript
GA4_MEASUREMENT_ID: 'G-J4R8TKD3PE', // ✅ Configured
GOOGLE_ADS_CONVERSION_ID: 'AW-17696537147', // ✅ Already set
LINK_ANALYTICS_AND_ADS: false, // ⚠️ Set to true after linking accounts
ENHANCED_CONVERSIONS: false, // Optional
```

## Support

- **Analytics Help**: [Google Analytics Support](https://support.google.com/analytics)
- **Google Ads Help**: [Google Ads Support](https://support.google.com/google-ads)

