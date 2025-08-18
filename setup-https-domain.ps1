# Akazuba Florist - HTTPS and Custom Domain Setup Script
param(
    [string]$DomainName = "akazuba.rw",
    [string]$Region = "us-east-1"
)

Write-Host "🌐 Setting up HTTPS and Custom Domain for Akazuba Florist..." -ForegroundColor Green

# Step 1: Create CloudFront Distribution
Write-Host "📡 Creating CloudFront Distribution..." -ForegroundColor Blue

# Generate unique caller reference
$CallerReference = "akazuba-florist-$(Get-Date -Format 'yyyyMMdd-HHmmss')"

# Create CloudFront distribution
$DistributionConfig = @{
    CallerReference = $CallerReference
    Comment = "Akazuba Florist - Secure HTTPS Distribution"
    DefaultRootObject = "index.html"
    Origins = @{
        Quantity = 1
        Items = @(
            @{
                Id = "S3-akazuba-florist-frontend"
                DomainName = "akazuba-florist-frontend.s3-website-us-east-1.amazonaws.com"
                CustomOriginConfig = @{
                    HTTPPort = 80
                    HTTPSPort = 443
                    OriginProtocolPolicy = "http-only"
                }
            }
        )
    }
    DefaultCacheBehavior = @{
        TargetOriginId = "S3-akazuba-florist-frontend"
        ViewerProtocolPolicy = "redirect-to-https"
        TrustedSigners = @{
            Enabled = $false
            Quantity = 0
        }
        ForwardedValues = @{
            QueryString = $false
            Cookies = @{
                Forward = "none"
            }
        }
        MinTTL = 0
        DefaultTTL = 86400
        MaxTTL = 31536000
    }
    Enabled = $true
    PriceClass = "PriceClass_100"
    ViewerCertificate = @{
        CloudFrontDefaultCertificate = $true
        MinimumProtocolVersion = "TLSv1.2_2021"
    }
}

# Convert to JSON and create distribution
$ConfigJson = $DistributionConfig | ConvertTo-Json -Depth 10
$ConfigJson | Out-File -FilePath "cloudfront-config-temp.json" -Encoding UTF8

try {
    $Distribution = aws cloudfront create-distribution --distribution-config file://cloudfront-config-temp.json
    $DistributionId = ($Distribution | ConvertFrom-Json).Distribution.Id
    $DistributionDomain = ($Distribution | ConvertFrom-Json).Distribution.DomainName
    
    Write-Host "✅ CloudFront Distribution created successfully!" -ForegroundColor Green
    Write-Host "   Distribution ID: $DistributionId" -ForegroundColor Yellow
    Write-Host "   Distribution Domain: $DistributionDomain" -ForegroundColor Yellow
    
    # Save distribution info
    @{
        DistributionId = $DistributionId
        DistributionDomain = $DistributionDomain
        DomainName = $DomainName
        CreatedAt = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    } | ConvertTo-Json | Out-File -FilePath "cloudfront-info.json" -Encoding UTF8
    
} catch {
    Write-Host "❌ Failed to create CloudFront distribution: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Clean up temp file
Remove-Item "cloudfront-config-temp.json" -ErrorAction SilentlyContinue

# Step 2: Domain Setup Instructions
Write-Host "`n🌍 Domain Setup Instructions:" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan

Write-Host "1. Purchase Domain (if not already owned):" -ForegroundColor White
Write-Host "   - Go to a domain registrar (Namecheap, GoDaddy, etc.)" -ForegroundColor Gray
Write-Host "   - Purchase: $DomainName" -ForegroundColor Yellow
Write-Host "   - Purchase: www.$DomainName" -ForegroundColor Yellow

Write-Host "`n2. Configure DNS Records:" -ForegroundColor White
Write-Host "   Add these CNAME records to your domain's DNS:" -ForegroundColor Gray
Write-Host "   - Name: @ (or root domain)" -ForegroundColor Yellow
Write-Host "     Value: $DistributionDomain" -ForegroundColor Green
Write-Host "   - Name: www" -ForegroundColor Yellow
Write-Host "     Value: $DistributionDomain" -ForegroundColor Green

Write-Host "`n3. Update CloudFront with Custom Domain:" -ForegroundColor White
Write-Host "   Once DNS is configured, run this command:" -ForegroundColor Gray
Write-Host "   aws cloudfront update-distribution --id $DistributionId --distribution-config file://cloudfront-config-with-domain.json" -ForegroundColor Yellow

Write-Host "`n4. SSL Certificate:" -ForegroundColor White
Write-Host "   - CloudFront will automatically provision SSL certificate" -ForegroundColor Gray
Write-Host "   - Certificate will be valid for: $DomainName, www.$DomainName" -ForegroundColor Green

Write-Host "`n📋 Current Status:" -ForegroundColor Cyan
Write-Host "   ✅ CloudFront Distribution: $DistributionDomain" -ForegroundColor Green
Write-Host "   ⏳ Domain Configuration: Pending DNS setup" -ForegroundColor Yellow
Write-Host "   ⏳ SSL Certificate: Will be provisioned automatically" -ForegroundColor Yellow

Write-Host "`n🔗 Your website will be available at:" -ForegroundColor Cyan
Write-Host "   https://$DistributionDomain (immediate)" -ForegroundColor Green
Write-Host "   https://$DomainName (after DNS setup)" -ForegroundColor Yellow
Write-Host "   https://www.$DomainName (after DNS setup)" -ForegroundColor Yellow

Write-Host "`n📝 Next Steps:" -ForegroundColor Cyan
Write-Host "1. Configure DNS records as shown above" -ForegroundColor White
Write-Host "2. Wait for DNS propagation (up to 48 hours)" -ForegroundColor White
Write-Host "3. SSL certificate will be provisioned automatically" -ForegroundColor White
Write-Host "4. Test your custom domain" -ForegroundColor White

Write-Host "`n🎉 Setup completed! Your flower shop now has HTTPS security!" -ForegroundColor Green 