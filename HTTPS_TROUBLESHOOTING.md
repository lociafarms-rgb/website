# HTTPS Troubleshooting: "Enforce HTTPS Unavailable"

## Error Message
**"Enforce HTTPS — Unavailable for your site because your domain is not properly configured to support HTTPS (www.lociafarms.com)"**

This error means GitHub cannot verify your domain or DNS isn't configured correctly.

## Quick Diagnosis Steps

### Step 1: Verify DNS Records

Check if your DNS records are correct and propagated:

1. **Check CNAME for www**:
   ```bash
   dig www.lociafarms.com +short
   ```
   **Expected result**: Should return `lociafarms-rgb.github.io`

2. **Check A records for root domain**:
   ```bash
   dig lociafarms.com +short
   ```
   **Expected result**: Should return 4 GitHub IP addresses:
   - `185.199.108.153`
   - `185.199.109.153`
   - `185.199.110.153`
   - `185.199.111.153`

3. **Use online DNS checker**:
   - Go to: https://dnschecker.org
   - Enter: `www.lociafarms.com`
   - Check: Should show `lociafarms-rgb.github.io` globally
   - Enter: `lociafarms.com`
   - Check: Should show the 4 GitHub IPs globally

## Common Issues and Solutions

### Issue 1: DNS Records Not Added Yet

**Symptoms**: `dig` returns nothing or wrong values

**Solution**:
1. **Go to Namecheap** → Domain List → Advanced DNS
2. **Add/Verify CNAME record**:
   ```
   Type:    CNAME
   Host:    www
   Value:   lociafarms-rgb.github.io
   ```
3. **Add/Verify 4 A records**:
   ```
   Type:    A
   Host:    @
   Value:   185.199.108.153
   
   Type:    A
   Host:    @
   Value:   185.199.109.153
   
   Type:    A
   Host:    @
   Value:   185.199.110.153
   
   Type:    A
   Host:    @
   Value:   185.199.111.153
   ```
4. **Click "Save All Changes"**
5. **Wait 1-2 hours for DNS to propagate**

---

### Issue 2: DNS Not Propagated Yet

**Symptoms**: DNS records are correct in Namecheap, but `dig` shows old/wrong values

**Solution**:
1. **Check DNS propagation**:
   - Go to: https://dnschecker.org
   - Enter: `www.lociafarms.com`
   - See if it shows `lociafarms-rgb.github.io` globally
   - **Wait**: DNS can take 24-48 hours to fully propagate (usually 1-2 hours)

2. **Clear local DNS cache** (Mac):
   ```bash
   sudo dscacheutil -flushcache
   sudo killall -HUP mDNSResponder
   ```

3. **Clear local DNS cache** (Windows):
   ```bash
   ipconfig /flushdns
   ```

4. **Wait and check again**: Give it 30-60 minutes after making DNS changes

---

### Issue 3: Wrong DNS Values

**Symptoms**: `dig` returns something other than expected values

**Solution**:
1. **Check your Namecheap DNS records**:
   - Login → Domain List → Advanced DNS
   - **CNAME for www** must be: `lociafarms-rgb.github.io` (not `.github.io` without username)
   - **A records** must be exactly: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`

2. **Fix any incorrect records**:
   - Edit the record
   - Update to correct value
   - Save changes

3. **Remove any conflicting records**:
   - Don't have CNAME for root domain (`@`) - use A records instead
   - Don't have multiple CNAMEs for www

---

### Issue 4: CNAME File Mismatch

**Symptoms**: CNAME file doesn't match GitHub Pages settings

**Solution**:
1. **Check CNAME file in repository**:
   - Go to: https://github.com/lociafarms-rgb/website/blob/main/CNAME
   - Should contain exactly: `www.lociafarms.com` (no http://, https://, or trailing slash)

2. **Check GitHub Pages settings**:
   - Go to: https://github.com/lociafarms-rgb/website/settings/pages
   - Under "Custom domain", should show: `www.lociafarms.com`

3. **If they don't match**:
   - Update CNAME file to match GitHub Pages settings
   - OR update GitHub Pages settings to match CNAME file
   - They must match exactly

---

### Issue 5: Domain Not Verified by GitHub

**Symptoms**: DNS is correct, but GitHub hasn't verified yet

**Solution**:
1. **Check GitHub Pages settings**:
   - Go to: https://github.com/lociafarms-rgb/website/settings/pages
   - Look for your domain: `www.lociafarms.com`
   - **Check status**: Should show green checkmark (✓) when verified

2. **If no checkmark**:
   - **Wait**: GitHub can take up to 24 hours to verify after DNS propagates
   - **Remove domain** and **re-add it**:
     - Remove: Clear the "Custom domain" field and save
     - Wait 5 minutes
     - Re-add: Enter `www.lociafarms.com` again and save
     - This forces GitHub to re-check DNS

3. **Check for error messages**:
   - Look for any red error messages in GitHub Pages settings
   - Common errors:
     - "Domain not verified" - DNS not propagated yet
     - "CNAME mismatch" - CNAME file doesn't match settings

---

### Issue 6: Old DNS Records Cached

**Symptoms**: Everything looks correct, but still not working

**Solution**:
1. **Wait longer**: DNS changes can take up to 48 hours
2. **Check from different locations**: Use https://dnschecker.org to check globally
3. **Try from different network**: Check from mobile data, different WiFi
4. **Remove and re-add domain in GitHub** (forces re-verification):
   - Go to GitHub Pages settings
   - Clear "Custom domain" field → Save
   - Wait 5 minutes
   - Re-enter `www.lociafarms.com` → Save
   - Wait for verification

---

## Step-by-Step Fix Process

Follow these steps in order:

### 1. Verify DNS Records in Namecheap
- [ ] Login to Namecheap
- [ ] Go to Domain List → Advanced DNS
- [ ] Verify CNAME record for `www` → `lociafarms-rgb.github.io`
- [ ] Verify 4 A records for `@` → GitHub IPs
- [ ] If wrong, fix and save

### 2. Check DNS Propagation
- [ ] Go to https://dnschecker.org
- [ ] Enter `www.lociafarms.com`
- [ ] Verify it shows `lociafarms-rgb.github.io` globally
- [ ] Enter `lociafarms.com`
- [ ] Verify it shows 4 GitHub IPs globally
- [ ] If not propagated, wait 1-2 hours and check again

### 3. Verify CNAME File
- [ ] Check: https://github.com/lociafarms-rgb/website/blob/main/CNAME
- [ ] Should contain exactly: `www.lociafarms.com`
- [ ] If wrong, update and push

### 4. Verify GitHub Pages Settings
- [ ] Go to: https://github.com/lociafarms-rgb/website/settings/pages
- [ ] Under "Custom domain", should show: `www.lociafarms.com`
- [ ] Check for green checkmark (✓)
- [ ] If no checkmark or error, see Issue 5 above

### 5. Force Re-verification (if needed)
- [ ] Remove domain from GitHub Pages settings
- [ ] Wait 5 minutes
- [ ] Re-add domain: `www.lociafarms.com`
- [ ] Save and wait for verification

### 6. Enable HTTPS (after verification)
- [ ] Once green checkmark appears
- [ ] Find "Enforce HTTPS" checkbox
- [ ] Check the box
- [ ] Save

---

## Verification Commands

Run these commands to check your DNS:

```bash
# Check CNAME for www
dig www.lociafarms.com +short
# Should return: lociafarms-rgb.github.io

# Check A records for root domain
dig lociafarms.com +short
# Should return:
# 185.199.108.153
# 185.199.109.153
# 185.199.110.153
# 185.199.111.153

# Check full DNS records
dig www.lociafarms.com
dig lociafarms.com
```

---

## Timeline Expectations

| Step | Time |
|------|------|
| DNS changes saved | Immediate |
| DNS propagation | 1-24 hours (usually 1-2 hours) |
| GitHub domain verification | 5 minutes - 24 hours after DNS propagates |
| HTTPS certificate provisioning | 5-30 minutes after enabling HTTPS |

**Be patient**: DNS and domain verification can take time!

---

## Still Not Working?

If you've tried everything and it's still not working:

1. **Double-check DNS records** in Namecheap - they must be exactly correct
2. **Wait 24 hours** after DNS changes - propagation can be slow
3. **Check GitHub Pages status**: https://www.githubstatus.com/
4. **Contact GitHub Support**: https://github.com/contact (select "GitHub Pages")
5. **Verify your domain registrar**: Make sure you're managing DNS in the right place

---

## Quick Reference

- **GitHub Pages Settings**: https://github.com/lociafarms-rgb/website/settings/pages
- **CNAME File**: https://github.com/lociafarms-rgb/website/blob/main/CNAME
- **DNS Checker**: https://dnschecker.org
- **Namecheap DNS**: Login → Domain List → Advanced DNS

---

## Most Common Fix

**99% of the time, this error is caused by:**

1. **DNS not propagated yet** → Wait 1-2 hours after adding DNS records
2. **Wrong DNS values** → Double-check CNAME and A records are correct
3. **Domain not verified** → Remove and re-add domain in GitHub Pages settings

**Try removing and re-adding the domain in GitHub Pages settings** - this often fixes it!

