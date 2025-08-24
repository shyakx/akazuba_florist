# Update CloudFront Distribution with Custom Domain
param(
    [string]$DomainName = "akazuba.rw",
    [string]$DistributionId = "EBRNRUCWZSG3P"
)

Write-Host "🌐 Updating CloudFront Distribution with Custom Domain..." -ForegroundColor Green

# Get current distribution config
Write-Host "📥 Getting current distribution configuration..." -ForegroundColor Blue
aws cloudfront get-distribution-config --id $DistributionId > current-config.json

Write-Host "✅ Current configuration saved to current-config.json" -ForegroundColor Green

Write-Host "`n📝 Next Steps:" -ForegroundColor Cyan
Write-Host "1. Edit current-config.json" -ForegroundColor White
Write-Host "2. Add your domain to the Aliases section:" -ForegroundColor White
Write-Host "   'Aliases': {" -ForegroundColor Yellow
Write-Host "     'Quantity': 2," -ForegroundColor Yellow
Write-Host "     'Items': ['$DomainName', 'www.$DomainName']" -ForegroundColor Yellow
Write-Host "   }" -ForegroundColor Yellow
Write-Host "3. Run: aws cloudfront update-distribution --id $DistributionId --distribution-config file://current-config.json" -ForegroundColor Green

Write-Host "`n⚠️  Important Notes:" -ForegroundColor Yellow
Write-Host "- Make sure your DNS is configured first" -ForegroundColor White
Write-Host "- SSL certificate will be provisioned automatically" -ForegroundColor White
Write-Host "- Certificate validation takes 15-30 minutes" -ForegroundColor White

Write-Host "`n🔗 Your website will be available at:" -ForegroundColor Cyan
Write-Host "   https://$DomainName" -ForegroundColor Green
Write-Host "   https://www.$DomainName" -ForegroundColor Green 