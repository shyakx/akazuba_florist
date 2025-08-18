# Akazuba Florist Next.js AWS Deployment Script (PowerShell)
param(
    [string]$Region = "us-east-1",
    [string]$ProjectName = "akazuba-florist"
)

Write-Host "Starting Next.js AWS Deployment for Akazuba Florist..." -ForegroundColor Green

# Configuration
$FrontendBucket = "${ProjectName}-frontend"
$BackendBucket = "${ProjectName}-backend"

# Check if AWS CLI is installed
try {
    aws --version | Out-Null
    Write-Host "AWS CLI is installed" -ForegroundColor Green
} catch {
    Write-Host "AWS CLI is not installed. Please install it first." -ForegroundColor Red
    exit 1
}

# Check AWS credentials
try {
    aws sts get-caller-identity | Out-Null
    Write-Host "AWS credentials verified" -ForegroundColor Green
} catch {
    Write-Host "AWS credentials not configured. Please run 'aws configure' first." -ForegroundColor Red
    exit 1
}

# Step 1: Install dependencies and build Next.js app
Write-Host "Installing dependencies..." -ForegroundColor Blue
npm install

Write-Host "Building Next.js application..." -ForegroundColor Blue
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "Build failed. Please fix the errors and try again." -ForegroundColor Red
    exit 1
}

Write-Host "Next.js build completed successfully" -ForegroundColor Green

# Step 2: Create S3 buckets
Write-Host "Creating S3 buckets..." -ForegroundColor Blue

try {
    aws s3 mb "s3://${FrontendBucket}" --region $Region
    Write-Host "Frontend bucket created" -ForegroundColor Green
} catch {
    Write-Host "Frontend bucket already exists" -ForegroundColor Yellow
}

try {
    aws s3 mb "s3://${BackendBucket}" --region $Region
    Write-Host "Backend bucket created" -ForegroundColor Green
} catch {
    Write-Host "Backend bucket already exists" -ForegroundColor Yellow
}

# Configure frontend bucket for static website hosting
aws s3 website "s3://${FrontendBucket}" --index-document index.html --error-document 404.html

Write-Host "S3 buckets configured" -ForegroundColor Green

# Step 3: Deploy Next.js static export
Write-Host "Deploying Next.js static export..." -ForegroundColor Blue

# Create a temporary directory for static export
$ExportDir = "out"
if (Test-Path $ExportDir) {
    Remove-Item $ExportDir -Recurse -Force
}

# Export Next.js to static files
Write-Host "  Exporting Next.js to static files..." -ForegroundColor Blue
npx next export --outdir $ExportDir

if ($LASTEXITCODE -ne 0) {
    Write-Host "Static export failed. Trying alternative approach..." -ForegroundColor Yellow
    
    # Alternative: Deploy the .next folder directly
    Write-Host "  Deploying .next folder directly..." -ForegroundColor Blue
    aws s3 sync .next "s3://${FrontendBucket}" --delete --exclude "*.map" --exclude "trace"
} else {
    # Upload static export to S3
    Write-Host "  Uploading static files to S3..." -ForegroundColor Blue
    aws s3 sync $ExportDir "s3://${FrontendBucket}" --delete
    
    # Clean up export directory
    Remove-Item $ExportDir -Recurse -Force
}

Write-Host "Frontend deployed to S3" -ForegroundColor Green

# Step 4: Configure bucket policy for public access
Write-Host "Configuring bucket policy for public access..." -ForegroundColor Blue

$BucketPolicy = @{
    Version = "2012-10-17"
    Statement = @(
        @{
            Sid = "PublicReadGetObject"
            Effect = "Allow"
            Principal = "*"
            Action = "s3:GetObject"
            Resource = "arn:aws:s3:::${FrontendBucket}/*"
        }
    )
} | ConvertTo-Json -Depth 10

$BucketPolicy | Out-File -FilePath "bucket-policy.json" -Encoding UTF8
aws s3api put-bucket-policy --bucket $FrontendBucket --policy file://bucket-policy.json --region $Region

Write-Host "Bucket policy configured" -ForegroundColor Green

# Step 5: Deploy backend (if exists)
if (Test-Path "backend") {
    Write-Host "Creating backend deployment package..." -ForegroundColor Blue

    Set-Location backend
    if (Test-Path "package.json") {
        npm install --production
    }
    Compress-Archive -Path * -DestinationPath ../backend-deployment.zip -Force
    Set-Location ..

    Write-Host "Uploading backend to S3..." -ForegroundColor Blue
    aws s3 cp backend-deployment.zip "s3://${BackendBucket}/"
    Write-Host "Backend uploaded to S3" -ForegroundColor Green
} else {
    Write-Host "No backend directory found, skipping backend deployment" -ForegroundColor Yellow
}

# Step 6: Get the website URL
$FullUrl = "http://${FrontendBucket}.s3-website-${Region}.amazonaws.com"

Write-Host "Deployment completed successfully!" -ForegroundColor Green
Write-Host "Your website is available at: $FullUrl" -ForegroundColor Cyan
Write-Host "Frontend bucket: ${FrontendBucket}" -ForegroundColor Cyan
Write-Host "Backend bucket: ${BackendBucket}" -ForegroundColor Cyan

# Optional: Create CloudFront distribution for HTTPS
Write-Host "Optional: To enable HTTPS, you can create a CloudFront distribution:" -ForegroundColor Yellow
Write-Host "   aws cloudfront create-distribution --origin-domain-name ${FrontendBucket}.s3-website-${Region}.amazonaws.com" -ForegroundColor Gray

# Clean up temporary files
if (Test-Path "bucket-policy.json") {
    Remove-Item "bucket-policy.json"
}

Write-Host "Deployment script completed!" -ForegroundColor Green 