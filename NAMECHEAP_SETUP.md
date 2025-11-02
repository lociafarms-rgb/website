# Namecheap Domain Setup for www.lociafarms.com

## Quick Setup Steps for Namecheap

Follow these steps to connect your `www.lociafarms.com` domain to your GitHub Pages website.

## Step 1: Add CNAME File to Repository ✅

The CNAME file has been created with your domain. It's already committed and pushed to GitHub.

**File**: `website/CNAME`
**Content**: `www.lociafarms.com`

## Step 2: Configure Domain in GitHub

1. Go to your repository: [lociafarms-rgb/website](https://github.com/lociafarms-rgb/website)
2. Click **Settings** (top menu)
3. Click **Pages** (left sidebar)
4. Under **"Custom domain"**, enter: `www.lociafarms.com`
5. Click **Save**
6. Wait for GitHub to verify the domain (may take a few minutes)

## Step 3: Configure DNS in Namecheap

1. **Login to Namecheap**
   - Go to [namecheap.com](https://www.namecheap.com)
   - Click **Sign In** (top right)
   - Enter your credentials

2. **Navigate to Domain List**
   - After logging in, click **Domain List** (left sidebar or top menu)
   - Find your domain: `lociafarms.com`
   - Click **Manage** (or click on the domain name)

3. **Go to Advanced DNS**
   - In the domain management page, find **"Advanced DNS"** tab
   - Click on it
   - You'll see a section for **"Host Records"** or **"DNS Records"**

4. **Add DNS Records**

   **Remove any existing A records** for the root domain (if they exist)

   **Add/Update CNAME Record:**
   ```
   Type:    CNAME Record
   Host:    www
   Value:   lociafarms-rgb.github.io
   TTL:     Automatic (or 30 min)
   ```

   **Add A Records** (for root domain - so lociafarms.com also works):
   
   Add these **4 A records**:
   ```
   Type:    A Record
   Host:    @
   Value:   185.199.108.153
   TTL:     Automatic
   
   Type:    A Record
   Host:    @
   Value:   185.199.109.153
   TTL:     Automatic
   
   Type:    A Record
   Host:    @
   Value:   185.199.110.153
   TTL:     Automatic
   
   Type:    A Record
   Host:    @
   Value:   185.199.111.153
   TTL:     Automatic
   ```

5. **Save Changes**
   - Click the **"Save All Changes"** button (usually at top right)
   - Wait for confirmation

## Step 4: Verify DNS Configuration

After adding DNS records, verify they're correct:

1. **Check CNAME Record:**
   ```bash
   dig www.lociafarms.com +short
   # Should return: lociafarms-rgb.github.io
   ```

2. **Check A Records:**
   ```bash
   dig lociafarms.com +short
   # Should return the 4 GitHub IP addresses
   ```

3. **Use Online Tools:**
   - [What's My DNS](https://www.whatsmydns.net/)
   - [DNS Checker](https://dnschecker.org/)
   - Enter `www.lociafarms.com` and `lociafarms.com` to check propagation

## Step 5: Wait for DNS Propagation

- **Typical wait time**: 5 minutes to 24 hours
- **Usually**: Within 1-2 hours
- DNS changes propagate globally at different speeds

## Step 6: Verify in GitHub

1. Go back to repository **Settings** → **Pages**
2. Under **"Custom domain"**, you should see:
   - Your domain: `www.lociafarms.com`
   - Status: Green checkmark (✓) when verified
   - **"Enforce HTTPS"** option should appear

3. **Enable HTTPS:**
   - Check the **"Enforce HTTPS"** checkbox
   - GitHub will automatically provision SSL certificate
   - This may take up to 24 hours after DNS propagates

## Visual Guide for Namecheap DNS Setup

### Namecheap Advanced DNS Interface

Once in **Advanced DNS**, you'll see a table like this. Add these records:

| Type | Host | Value | TTL |
|------|------|-------|-----|
| CNAME | www | lociafarms-rgb.github.io | Automatic |
| A | @ | 185.199.108.153 | Automatic |
| A | @ | 185.199.109.153 | Automatic |
| A | @ | 185.199.110.153 | Automatic |
| A | @ | 185.199.111.153 | Automatic |

### Important Notes:

- **Host `@`** = root domain (lociafarms.com)
- **Host `www`** = www subdomain (www.lociafarms.com)
- **Do NOT** add CNAME for root domain (`@`) - use A records instead
- Keep TTL as **Automatic** or **30 min** (default is fine)

## Troubleshooting

### Domain not working after 24 hours

1. **Verify DNS records are correct:**
   - Use online DNS checker tools
   - Ensure CNAME points to `lociafarms-rgb.github.io`
   - Ensure all 4 A records are added

2. **Check GitHub Pages settings:**
   - Ensure domain is entered correctly in Settings → Pages
   - Look for any error messages

3. **Clear browser cache:**
   - Try incognito/private browsing mode
   - Hard refresh: Ctrl+F5 (Windows) or Cmd+Shift+R (Mac)

### HTTPS not working

- Wait 24-48 hours for GitHub to provision SSL certificate
- Ensure "Enforce HTTPS" is checked in GitHub Pages settings
- DNS must be fully propagated before HTTPS works

### Only www works, not root domain

- Ensure all 4 A records are added for root domain (`@`)
- Wait for DNS propagation
- Both `www.lociafarms.com` and `lociafarms.com` should work

## Current Configuration

- **GitHub Repository**: `lociafarms-rgb/website`
- **GitHub Pages URL**: `https://lociafarms-rgb.github.io/website/`
- **Custom Domain**: `www.lociafarms.com` (to be configured)
- **CNAME File**: ✅ Created and committed

## Next Steps After DNS Setup

Once your domain is working:

1. **Update Analytics** (if needed):
   - Add `www.lociafarms.com` to Google Analytics if restricting API keys
   - Update any hardcoded URLs in analytics

2. **Test Your Website**:
   - Visit `https://www.lociafarms.com`
   - Visit `https://lociafarms.com` (should redirect or work)
   - Verify all pages load correctly
   - Check HTTPS is working (green lock icon)

3. **Update Links** (optional):
   - If you have any hardcoded `github.io` URLs, update them to use your custom domain

## Support Links

- **Namecheap Support**: [namecheap.com/support](https://www.namecheap.com/support/)
- **GitHub Pages Docs**: [docs.github.com/en/pages](https://docs.github.com/en/pages)
- **DNS Checker**: [dnschecker.org](https://dnschecker.org/)

