# Fix Category Routing for Akazuba Florist
Write-Host "🔧 Fixing category routing..." -ForegroundColor Green

# List of categories
$categories = @(
    "roses", "tulips", "lilies", "sunflowers", "orchids", "carnations", 
    "daisies", "peonies", "red", "pink", "white", "yellow", "purple", 
    "orange", "blue", "colors", "mixed"
)

foreach ($category in $categories) {
    Write-Host "📁 Creating directory structure for $category..." -ForegroundColor Blue
    
    # Copy the HTML file to create the directory structure
    aws s3 cp "s3://akazuba-florist-frontend/category/$category.html" "s3://akazuba-florist-frontend/category/$category/index.html"
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Created $category/index.html" -ForegroundColor Green
    } else {
        Write-Host "❌ Failed to create $category/index.html" -ForegroundColor Red
    }
}

Write-Host "`n🎉 Category routing fix completed!" -ForegroundColor Green
Write-Host "Now creating CloudFront invalidation..." -ForegroundColor Blue

# Create CloudFront invalidation
aws cloudfront create-invalidation --distribution-id EBRNRUCWZSG3P --paths "/*"

Write-Host "✅ CloudFront invalidation created!" -ForegroundColor Green
Write-Host "`n🌐 Your category pages should now be accessible at:" -ForegroundColor Cyan
Write-Host "   https://d238m8iiglcoij.cloudfront.net/category/roses/" -ForegroundColor White
Write-Host "   https://d238m8iiglcoij.cloudfront.net/category/mixed/" -ForegroundColor White
Write-Host "   https://d238m8iiglcoij.cloudfront.net/category/colors/" -ForegroundColor White
Write-Host "   And all other categories..." -ForegroundColor White 