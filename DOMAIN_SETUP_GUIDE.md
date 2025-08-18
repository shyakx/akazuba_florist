# 🌐 Akazuba Florist - HTTPS & Custom Domain Setup Guide

## ✅ **Current Status**
- **CloudFront Distribution Created**: ✅
- **Distribution ID**: `EBRNRUCWZSG3P`
- **CloudFront Domain**: `d238m8iiglcoij.cloudfront.net`
- **HTTPS Status**: ✅ Enabled (redirect-to-https)
- **SSL Certificate**: ✅ CloudFront Default Certificate

## 🔗 **Immediate Access**
Your website is now available with HTTPS at:
**https://d238m8iiglcoij.cloudfront.net**

## 🌍 **Custom Domain Setup**

### Step 1: Purchase Domain (if not already owned)
1. Go to a domain registrar:
   - **Namecheap** (recommended for .rw domains)
   - **GoDaddy**
   - **Google Domains**
   - **AWS Route 53**

2. Purchase your domain:
   - **Primary**: `akazuba.rw`
   - **Subdomain**: `www.akazuba.rw`

### Step 2: Configure DNS Records
Add these CNAME records to your domain's DNS settings:

| Type | Name | Value |
|------|------|-------|
| CNAME | @ (or root) | `d238m8iiglcoij.cloudfront.net` |
| CNAME | www | `d238m8iiglcoij.cloudfront.net` |

**Note**: Some registrars don't allow CNAME for root domain (@). In that case:
- Use an A record with ALIAS/ANAME pointing to the CloudFront domain
- Or use a redirect from root to www

### Step 3: Update CloudFront with Custom Domain
Once DNS is configured, update your CloudFront distribution:

```bash
# Get current distribution config
aws cloudfront get-distribution-config --id EBRNRUCWZSG3P > current-config.json

# Edit the config to add your domain to Aliases
# Then update the distribution
aws cloudfront update-distribution --id EBRNRUCWZSG3P --distribution-config file://updated-config.json
```

### Step 4: SSL Certificate
- CloudFront will automatically provision an SSL certificate
- Certificate will be valid for: `akazuba.rw`, `www.akazuba.rw`
- Certificate provisioning takes 15-30 minutes

## 📋 **DNS Configuration Examples**

### Namecheap DNS Settings:
```
Type: CNAME Record
Host: @
Value: d238m8iiglcoij.cloudfront.net
TTL: Automatic

Type: CNAME Record  
Host: www
Value: d238m8iiglcoij.cloudfront.net
TTL: Automatic
```

### GoDaddy DNS Settings:
```
Type: CNAME
Name: @
Value: d238m8iiglcoij.cloudfront.net
TTL: 600

Type: CNAME
Name: www  
Value: d238m8iiglcoij.cloudfront.net
TTL: 600
```

## ⏱️ **Timeline**
1. **DNS Propagation**: 15 minutes to 48 hours
2. **SSL Certificate**: 15-30 minutes after domain verification
3. **Full Setup**: 1-2 hours typically

## 🔍 **Testing Your Setup**

### Check DNS Propagation:
```bash
# Check if DNS is resolving
nslookup akazuba.rw
nslookup www.akazuba.rw

# Check SSL certificate
openssl s_client -connect akazuba.rw:443 -servername akazuba.rw
```

### Test URLs:
- ✅ **Immediate**: https://d238m8iiglcoij.cloudfront.net
- ⏳ **After DNS**: https://akazuba.rw
- ⏳ **After DNS**: https://www.akazuba.rw

## 🛠️ **Troubleshooting**

### Common Issues:
1. **DNS Not Resolving**: Wait for propagation (up to 48 hours)
2. **SSL Certificate Pending**: Wait 15-30 minutes after DNS setup
3. **Mixed Content**: Ensure all resources use HTTPS

### Useful Commands:
```bash
# Check CloudFront distribution status
aws cloudfront get-distribution --id EBRNRUCWZSG3P

# Check distribution configuration
aws cloudfront get-distribution-config --id EBRNRUCWZSG3P

# Invalidate cache (if needed)
aws cloudfront create-invalidation --distribution-id EBRNRUCWZSG3P --paths "/*"
```

## 📞 **Support**
If you encounter issues:
1. Check AWS CloudFront console
2. Verify DNS settings with your registrar
3. Use AWS support if needed

## 🎉 **Benefits of This Setup**
- ✅ **HTTPS Security**: All traffic encrypted
- ✅ **Global CDN**: Fast loading worldwide
- ✅ **Automatic SSL**: Free SSL certificates
- ✅ **Custom Domain**: Professional branding
- ✅ **SEO Friendly**: HTTPS improves search rankings

---

**Your flower shop is now secure and ready for the world! 🌸🇷🇼** 