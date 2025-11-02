# HTTPS Setup for www.lociafarms.com

## Overview

GitHub Pages **automatically provisions SSL certificates** for custom domains. You don't need to purchase or configure certificates manually - GitHub handles everything.

## How HTTPS Works with GitHub Pages

1. **Automatic SSL**: GitHub uses Let's Encrypt to automatically generate SSL certificates for your custom domain
2. **Free**: No additional cost
3. **Auto-renewal**: Certificates automatically renew before expiration
4. **Both domains**: HTTPS works for both `www.lociafarms.com` and `lociafarms.com`

## Setup Process

### Step 1: DNS Must Be Configured First

HTTPS **requires** DNS to be fully propagated and verified by GitHub.

- ✅ DNS records added in Namecheap
- ✅ DNS propagated globally (check at [dnschecker.org](https://dnschecker.org))
- ✅ Domain verified in GitHub Pages settings (green checkmark ✓)

### Step 2: Enable HTTPS in GitHub

1. **Go to repository Settings**:
   - Navigate to: https://github.com/lociafarms-rgb/website/settings/pages

2. **Find "Enforce HTTPS" checkbox**:
   - This option appears **after** GitHub verifies your domain
   - Look under the "Custom domain" section
   - If you don't see it yet, wait for DNS to propagate and domain verification

3. **Enable HTTPS**:
   - ✅ Check the **"Enforce HTTPS"** checkbox
   - Click **Save** (if there's a save button)

4. **Wait for certificate provisioning**:
   - **Timeline**: Usually 5-30 minutes, can take up to 24 hours
   - GitHub automatically requests and installs the SSL certificate
   - No action needed from you during this time

### Step 3: Verify HTTPS is Working

After certificate provisioning:

1. **Test your website**:
   - Visit: `https://www.lociafarms.com`
   - Visit: `https://lociafarms.com` (if configured)
   - Browser should show a **green lock icon** 🔒

2. **Check certificate**:
   - Click the lock icon in your browser's address bar
   - View certificate details
   - Should show "Let's Encrypt" or "DigiCert" as issuer

3. **Verify HTTP redirects**:
   - Visit: `http://www.lociafarms.com` (HTTP, not HTTPS)
   - Should automatically redirect to `https://www.lociafarms.com`
   - This happens automatically when "Enforce HTTPS" is enabled

## Timeline

| Step | Duration |
|------|----------|
| DNS propagation | 5 minutes - 24 hours (usually 1-2 hours) |
| Domain verification by GitHub | A few minutes after DNS propagates |
| SSL certificate provisioning | 5-30 minutes after enabling HTTPS (up to 24 hours) |
| **Total** | **Typically 2-3 hours, maximum 48 hours** |

## What "Enforce HTTPS" Does

When enabled:

1. **Redirects HTTP → HTTPS**: All `http://` requests automatically redirect to `https://`
2. **SSL Certificate**: Provides encryption for all data transmitted between visitors and your website
3. **Browser Security**: Prevents browser warnings about insecure connections
4. **SEO Benefits**: HTTPS is a ranking factor for search engines (Google, etc.)

## Troubleshooting HTTPS

### "Enforce HTTPS" checkbox not appearing

**Cause**: Domain not yet verified by GitHub

**Solutions**:
1. Wait for DNS to fully propagate (check at [dnschecker.org](https://dnschecker.org))
2. Verify DNS records are correct:
   - CNAME for `www` should point to `lociafarms-rgb.github.io`
   - A records for root domain should be the 4 GitHub IP addresses
3. Check GitHub Pages settings for any error messages
4. Wait up to 24 hours for full propagation

### HTTPS checkbox is grayed out / can't enable

**Cause**: Certificate provisioning in progress or domain not verified

**Solutions**:
1. Wait a few more minutes (provisioning can take up to 30 minutes)
2. Refresh the GitHub Pages settings page
3. Ensure domain is verified (green checkmark ✓)
4. Check for error messages in GitHub Pages settings

### HTTPS not working after 24 hours

**Possible causes**:
1. DNS not fully propagated
2. DNS records incorrect
3. Certificate provisioning failed

**Solutions**:
1. **Verify DNS**:
   ```bash
   dig www.lociafarms.com +short
   # Should return: lociafarms-rgb.github.io
   ```

2. **Check GitHub Pages settings**:
   - Look for error messages
   - Verify domain shows as "Verified" with green checkmark

3. **Contact GitHub Support** (if DNS is correct and domain is verified):
   - Go to: https://github.com/contact
   - Select "GitHub Pages" as the topic

### Mixed content warnings

**Cause**: Website loading resources over HTTP instead of HTTPS

**Solutions**:
1. Update all external links to use `https://`
2. Check images, CSS, JavaScript files - ensure they use HTTPS URLs
3. Check browser console for mixed content errors
4. Your website is already configured with relative paths, so this shouldn't be an issue

### Certificate shows as "not secure" or warnings

**Cause**: Certificate not yet fully provisioned or domain mismatch

**Solutions**:
1. Wait for certificate to fully provision (can take up to 24 hours)
2. Clear browser cache and cookies
3. Try incognito/private browsing mode
4. Ensure CNAME file matches the domain you're using

## Security Best Practices

✅ **Always enable "Enforce HTTPS"**: Protects your visitors' data

✅ **Check certificate periodically**: Click the lock icon in browser to verify it's valid

✅ **Use HTTPS everywhere**: All links and resources should use HTTPS

✅ **Keep DNS records correct**: Incorrect DNS can cause certificate issues

## Current Status

- **Domain**: `www.lociafarms.com`
- **CNAME File**: ✅ Created and committed
- **DNS Configuration**: ⏳ To be configured in Namecheap
- **Domain Verification**: ⏳ Waiting for DNS propagation
- **HTTPS Enabled**: ⏳ Will be enabled after domain verification
- **SSL Certificate**: ⏳ Auto-provisioned by GitHub after HTTPS enabled

## Additional Resources

- **GitHub Pages HTTPS Docs**: [docs.github.com/en/pages/getting-started-with-github-pages/securing-your-github-pages-site-with-https](https://docs.github.com/en/pages/getting-started-with-github-pages/securing-your-github-pages-site-with-https)
- **Let's Encrypt**: [letsencrypt.org](https://letsencrypt.org/) (Certificate authority GitHub uses)
- **SSL Labs Test**: [ssllabs.com/ssltest](https://www.ssllabs.com/ssltest/) (Test your SSL configuration after setup)

## Summary

**HTTPS Setup is Simple:**

1. ⏳ Configure DNS in Namecheap
2. ⏳ Wait for DNS propagation
3. ⏳ Enable "Enforce HTTPS" in GitHub Pages settings
4. ⏳ Wait for certificate provisioning (5-30 min, max 24 hours)
5. ✅ HTTPS automatically works for your website!

**No manual certificate management required** - GitHub handles everything automatically! 🎉

