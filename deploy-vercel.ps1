# PowerShell script to deploy to Vercel
# This script creates a clean deployment directory without .pem files

Write-Host "Creating clean deployment directory..." -ForegroundColor Green

# Create a temporary deployment directory
$deployDir = "vercel-deploy-temp"
if (Test-Path $deployDir) {
    Remove-Item -Recurse -Force $deployDir
}
New-Item -ItemType Directory -Name $deployDir

# Copy all files except .pem files
Write-Host "Copying project files..." -ForegroundColor Yellow
Get-ChildItem -Path "." -Exclude "*.pem", "temp-pem-files", "vercel-deploy-temp", ".git", "node_modules" | Copy-Item -Destination $deployDir -Recurse

# Change to deployment directory
Set-Location $deployDir

Write-Host "Deploying to Vercel..." -ForegroundColor Green
# Deploy to Vercel
npx vercel --prod

# Return to original directory
Set-Location ..

# Clean up
Write-Host "Cleaning up..." -ForegroundColor Yellow
Remove-Item -Recurse -Force $deployDir

Write-Host "Deployment completed!" -ForegroundColor Green
