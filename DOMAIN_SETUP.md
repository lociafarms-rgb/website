# Custom Domain Setup for GitHub Pages

This guide will help you connect your custom domain name (e.g., `lociafarms.com` or `www.lociafarms.com`) to your GitHub Pages website.

## Overview

Your website is currently available at:
- **GitHub Pages URL**: `https://lociafarms-rgb.github.io/website/`

After setting up a custom domain, it will also be available at:
- **Custom Domain**: `https://www.lociafarms.com` (or your chosen domain)

## Prerequisites

1. ✅ GitHub Pages enabled (already done)
2. ⏳ Own a domain name (purchase from registrar like Namecheap, Google Domains, GoDaddy, etc.)
3. ⏳ Access to domain DNS settings

## Step 1: Add CNAME File to Repository

1. Create a file named `CNAME` in your website repository root:
   ```
   www.lociafarms.com
   ```
   
   Or if you want to use the root domain:
   ```
   lociafarms.com
   ```

2. The CNAME file should contain **only** your domain name (no `http://` or `https://`)

3. Commit and push the CNAME file:
   ```bash
   cd website
   echo "www.lociafarms.com" > CNAME
   git add CNAME
   git commit -m "Add custom domain CNAME file"
   git push origin main
   ```

## Step 2: Configure Domain in GitHub

1. Go to your repository on GitHub: [lociafarms-rgb/website](https://github.com/lociafarms-rgb/website)
2. Click **Settings** → **Pages** (in left sidebar)
3. Under **Custom domain**, enter your domain (e.g., `www.lociafarms.com`)
4. Click **Save**
5. GitHub will automatically generate a certificate for HTTPS (may take a few minutes)

## Step 3: Configure DNS Records

Configure DNS with your domain registrar. The exact steps depend on your registrar.

### Option A: Using www subdomain (Recommended)

**DNS Records to Add:**

1. **CNAME Record**:
   - **Name/Type**: `www`
   - **Value/Target**: `lociafarms-rgb.github.io`
   - **TTL**: 3600 (or default)

2. **A Records** (for root domain):
   - **Name/Type**: `@` or blank
   - **Value/Target**: One of GitHub's IP addresses:
     - `185.199.108.153`
     - `185.199.109.153`
     - `185.199.110.153`
     - `185.199.111.153`
   - Add all 4 A records

**Example for www.lociafarms.com:**
```
Type    Name    Value
CNAME   www     lociafarms-rgb.github.io
A       @       185.199.108.153
A       @       185.199.109.153
A       @       185.199.110.153
A       @       185.199.111.153
```

### Option B: Using root domain only

**DNS Records:**

1. **A Records** (add all 4):
   - **Name**: `@` or blank
   - **Value**: 
     - `185.199.108.153`
     - `185.199.109.153`
     - `185.199.110.153`
     - `185.199.111.153`
   - **TTL**: 3600 (or default)

2. **CNAME Record** (for www):
   - **Name**: `www`
   - **Value**: `your-username.github.io`

**Note**: Some registrars don't allow CNAME on root domain. Use A records for root domain, CNAME for www.

## Step 4: Verify DNS Configuration

After adding DNS records, verify they're working:

1. **Check DNS propagation:**
   ```bash
   # Check A records
   dig lociafarms.com +short
   
   # Check CNAME records
   dig www.lociafarms.com +short
   ```

2. **Wait for propagation** (can take 24-48 hours, usually less)

3. **Verify in GitHub:**
   - Go to repository Settings → Pages
   - Look for green checkmark next to your domain
   - Status should show "Verified"

## Step 5: Enable HTTPS (Automatic)

GitHub automatically provisions SSL certificates for custom domains:

1. After DNS is configured, go to repository Settings → Pages
2. Check **"Enforce HTTPS"** checkbox
3. Wait for certificate provisioning (usually a few minutes to a few hours)

## Step 6: Update Website Configuration (Optional)

You may want to update your website to handle both domains:

1. Update canonical URLs in HTML if needed
2. Ensure relative paths work correctly
3. Test both www and non-www versions

## Common Domain Registrars Setup

### Namecheap
1. Login to Namecheap
2. Go to **Domain List** → Select your domain
3. Click **Advanced DNS**
4. Add the DNS records as described above

### Google Domains
1. Login to Google Domains
2. Select your domain
3. Go to **DNS**
4. Add the DNS records

### GoDaddy
1. Login to GoDaddy
2. Go to **My Products** → **DNS**
3. Add the DNS records

### Cloudflare
1. Add domain to Cloudflare
2. Go to **DNS** → **Records**
3. Add the DNS records
4. Ensure **Proxy status** is set to **DNS only** (grey cloud)

## Verification Checklist

- [ ] CNAME file added to repository root
- [ ] CNAME file committed and pushed
- [ ] Domain configured in GitHub Pages settings
- [ ] DNS records added at domain registrar
- [ ] DNS propagation verified
- [ ] Domain verified in GitHub (green checkmark)
- [ ] HTTPS enabled and enforced
- [ ] Website accessible at custom domain

## Troubleshooting

### Domain not working
- **Check DNS propagation**: Wait 24-48 hours for DNS to propagate
- **Verify DNS records**: Use `dig` or online DNS checkers
- **Check CNAME file**: Ensure it contains only the domain name
- **GitHub Pages status**: Check repository Settings → Pages for errors

### HTTPS not working
- Wait for GitHub to provision SSL certificate (can take up to 24 hours)
- Ensure "Enforce HTTPS" is checked in GitHub Pages settings
- Clear browser cache

### Both www and non-www
- You can support both by adding DNS records for both
- Configure one as primary and set up redirect if needed
- GitHub Pages can handle both automatically

## Current Repository Status

- **GitHub Pages URL**: `https://lociafarms-rgb.github.io/website/`
- **Repository**: `lociafarms-rgb/website`
- **Branch**: `main`
- **CNAME File**: Not yet created (create in Step 1)

## Next Steps

1. Decide on your domain name (www or root domain)
2. Purchase domain if you haven't already
3. Create CNAME file with your domain
4. Configure DNS records at your registrar
5. Wait for DNS propagation
6. Enable HTTPS in GitHub

## Additional Resources

- [GitHub Pages Custom Domain Docs](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site)
- [DNS Checker Tool](https://dnschecker.org/)
- [What's My DNS](https://www.whatsmydns.net/)

