# Update CloudFront Distribution with Proper Routing
param(
    [string]$DistributionId = "EBRNRUCWZSG3P"
)

Write-Host "🌐 Updating CloudFront Distribution with proper routing..." -ForegroundColor Green

# Step 1: Create CloudFront Function
Write-Host "📝 Creating CloudFront Function for routing..." -ForegroundColor Blue

$FunctionCode = Get-Content "cloudfront-function.js" -Raw

# Create the function
aws cloudfront create-function --name "akazuba-routing-function" --function-config "FunctionCode=$FunctionCode,Comment='Routing function for Akazuba Florist',Runtime='cloudfront-js-1.0'" --query "FunctionSummary.Name" --output text

Write-Host "✅ CloudFront Function created successfully" -ForegroundColor Green

# Step 2: Get current distribution config
Write-Host "📥 Getting current distribution configuration..." -ForegroundColor Blue
aws cloudfront get-distribution-config --id $DistributionId > current-dist-config.json

Write-Host "✅ Current configuration saved to current-dist-config.json" -ForegroundColor Green

Write-Host "`n📝 Next Steps:" -ForegroundColor Cyan
Write-Host "1. Edit current-dist-config.json" -ForegroundColor White
Write-Host "2. Add the function association to DefaultCacheBehavior:" -ForegroundColor White
Write-Host "   'FunctionAssociations': {" -ForegroundColor Yellow
Write-Host "     'Quantity': 1," -ForegroundColor Yellow
Write-Host "     'Items': [" -ForegroundColor Yellow
Write-Host "       {" -ForegroundColor Yellow
Write-Host "         'FunctionARN': 'arn:aws:cloudfront::ACCOUNT:function/akazuba-routing-function'," -ForegroundColor Yellow
Write-Host "         'EventType': 'viewer-request'" -ForegroundColor Yellow
Write-Host "       }" -ForegroundColor Yellow
Write-Host "     ]" -ForegroundColor Yellow
Write-Host "   }" -ForegroundColor Yellow
Write-Host "3. Run: aws cloudfront update-distribution --id $DistributionId --distribution-config file://current-dist-config.json --if-match ETAG" -ForegroundColor White 