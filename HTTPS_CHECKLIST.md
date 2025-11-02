# HTTPS Setup Checklist for www.lociafarms.com

Follow this checklist step-by-step to properly set up HTTPS for your website.

## ✅ Step 1: Verify CNAME File (COMPLETED)

- [x] CNAME file exists in repository root
- [x] CNAME file contains: `www.lociafarms.com`
- [x] CNAME file is committed and pushed to GitHub

**Status**: ✅ **DONE** - CNAME file is configured correctly.

## ⏳ Step 2: Configure DNS in Namecheap

**Action Required**: You need to do this in Namecheap.

1. **Login to Namecheap**:
   - Go to: https://www.namecheap.com
   - Click **Sign In**

2. **Navigate to Domain List**:
   - Click **Domain List** (left sidebar)
   - Find `lociafarms.com`
   - Click **Manage** (or click on domain name)

3. **Go to Advanced DNS**:
   - Click **Advanced DNS** tab

4. **Add CNAME Record**:
   ```
   Type:    CNAME Record
   Host:    www
   Value:   lociafarms-rgb.github.io
   TTL:     Automatic
   ```

5. **Add 4 A Records** (for root domain):
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

6. **Click "Save All Changes"**

**Verification**: Check DNS propagation at [dnschecker.org](https://dnschecker.org) - enter `www.lociafarms.com`

---

## ⏳ Step 3: Configure Domain in GitHub Pages

**Action Required**: Do this after DNS is configured (Step 2).

1. **Go to GitHub Repository Settings**:
   - Navigate to: https://github.com/lociafarms-rgb/website/settings/pages
   - Or: Go to repository → **Settings** tab → **Pages** (left sidebar)

2. **Add Custom Domain**:
   - Under **"Custom domain"** field, enter: `www.lociafarms.com`
   - Click **Save**

3. **Wait for Domain Verification**:
   - GitHub will verify your domain (usually takes a few minutes)
   - You should see a green checkmark (✓) next to your domain when verified
   - Status will show "Verified"

**Verification**: Look for green checkmark (✓) next to your domain in GitHub Pages settings.

---

## ⏳ Step 4: Enable HTTPS

**Action Required**: Do this after domain is verified (Step 3).

1. **Go back to GitHub Pages Settings**:
   - Navigate to: https://github.com/lociafarms-rgb/website/settings/pages

2. **Enable "Enforce HTTPS"**:
   - Find **"Enforce HTTPS"** checkbox
   - This option appears **after** GitHub verifies your domain
   - ✅ **Check the box**
   - Click **Save** (if there's a save button)

3. **Wait for Certificate Provisioning**:
   - GitHub automatically requests SSL certificate from Let's Encrypt
   - **Timeline**: Usually 5-30 minutes, can take up to 24 hours
   - No action needed from you during this time

**Verification**: 
- The checkbox should stay checked
- After provisioning, visit `https://www.lociafarms.com` - should show 🔒 lock icon

---

## ⏳ Step 5: Verify HTTPS is Working

**Action Required**: Test after certificate provisioning (Step 4).

1. **Test HTTPS Connection**:
   - Visit: `https://www.lociafarms.com`
   - Browser should show a **green lock icon** 🔒 in address bar
   - Should **NOT** show any security warnings

2. **Test HTTP Redirect**:
   - Visit: `http://www.lociafarms.com` (HTTP, not HTTPS)
   - Should automatically redirect to `https://www.lociafarms.com`
   - This confirms "Enforce HTTPS" is working

3. **Check Certificate**:
   - Click the lock icon in your browser's address bar
   - Click "Certificate" or "Connection is secure"
   - Should show:
     - **Issuer**: Let's Encrypt or DigiCert
     - **Valid**: Current date to expiration date
     - **Domain**: www.lociafarms.com

4. **Test Root Domain** (if configured):
   - Visit: `https://lociafarms.com`
   - Should also work with HTTPS

**Verification**: All tests pass - ✅ HTTPS is properly configured!

---

## ✅ Step 6: Website Code (COMPLETED)

- [x] Canonical URL set to HTTPS: `https://www.lociafarms.com/`
- [x] All external resources use HTTPS (Google Fonts, Google Analytics, etc.)
- [x] No mixed content issues (no HTTP resources on HTTPS pages)

**Status**: ✅ **DONE** - Website code is HTTPS-ready.

---

## Troubleshooting

### "Enforce HTTPS" checkbox not appearing

**Cause**: Domain not yet verified by GitHub

**Solution**:
1. Wait for DNS to fully propagate (check at [dnschecker.org](https://dnschecker.org))
2. Verify DNS records are correct
3. Check GitHub Pages settings for any error messages
4. Wait up to 24 hours for full propagation

### HTTPS checkbox is grayed out

**Cause**: Certificate provisioning in progress

**Solution**:
1. Wait a few more minutes (can take up to 30 minutes)
2. Refresh the GitHub Pages settings page
3. Ensure domain is verified (green checkmark ✓)

### Mixed content warnings

**Cause**: Website loading some resources over HTTP

**Solution**:
- All resources should use HTTPS URLs
- Your website is already configured correctly ✅

### Certificate shows as "not secure"

**Cause**: Certificate not yet fully provisioned

**Solution**:
1. Wait for certificate to fully provision (can take up to 24 hours)
2. Clear browser cache
3. Try incognito/private browsing mode

---

## Current Status Summary

| Item | Status |
|------|--------|
| CNAME File | ✅ Created and committed |
| DNS Configuration | ⏳ **Action Required** - Configure in Namecheap |
| Domain in GitHub | ⏳ **Action Required** - Add after DNS configured |
| Domain Verification | ⏳ Waiting for DNS and GitHub configuration |
| HTTPS Enabled | ⏳ **Action Required** - Enable after domain verified |
| SSL Certificate | ⏳ Auto-provisioned after HTTPS enabled |
| Website Code | ✅ HTTPS-ready |

---

## Quick Reference Links

- **GitHub Pages Settings**: https://github.com/lociafarms-rgb/website/settings/pages
- **Namecheap DNS**: Login → Domain List → Advanced DNS
- **DNS Checker**: https://dnschecker.org
- **SSL Test**: https://www.ssllabs.com/ssltest/ (after HTTPS is enabled)

---

## Next Actions for You

1. ✅ **DONE**: CNAME file configured
2. ⏳ **TODO**: Configure DNS in Namecheap (see Step 2 above)
3. ⏳ **TODO**: Add domain in GitHub Pages settings (see Step 3 above)
4. ⏳ **TODO**: Enable "Enforce HTTPS" checkbox (see Step 4 above)
5. ⏳ **TODO**: Verify HTTPS is working (see Step 5 above)

**Estimated Time**: 30-60 minutes of active setup, then 2-24 hours for DNS/certificate propagation.

---

## Support

If you encounter issues:

1. Check DNS propagation: [dnschecker.org](https://dnschecker.org)
2. Review GitHub Pages settings for error messages
3. Check GitHub Pages status: https://www.githubstatus.com/
4. Consult detailed guides:
   - `HTTPS_SETUP.md` - Complete HTTPS documentation
   - `NAMECHEAP_SETUP.md` - Namecheap DNS setup guide
   - `DOMAIN_SETUP.md` - General domain setup guide

