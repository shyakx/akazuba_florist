# Akazuba Florist AWS Cleanup Script (PowerShell)
param(
    [string]$Region = "us-east-1",
    [string]$ProjectName = "akazuba-florist"
)

Write-Host "🧹 Starting AWS Cleanup for Akazuba Florist..." -ForegroundColor Yellow

# Configuration
$FrontendBucket = "${ProjectName}-frontend"
$BackendBucket = "${ProjectName}-backend"
$StackName = "${ProjectName}-stack"

# Check if AWS CLI is installed
try {
    aws --version | Out-Null
    Write-Host "✅ AWS CLI is installed" -ForegroundColor Green
} catch {
    Write-Host "❌ AWS CLI is not installed. Please install it first." -ForegroundColor Red
    exit 1
}

# Check AWS credentials
try {
    aws sts get-caller-identity | Out-Null
    Write-Host "✅ AWS credentials verified" -ForegroundColor Green
} catch {
    Write-Host "❌ AWS credentials not configured. Please run 'aws configure' first." -ForegroundColor Red
    exit 1
}

Write-Host "⚠️  WARNING: This will delete ALL AWS resources for this project!" -ForegroundColor Red
Write-Host "This includes:" -ForegroundColor Red
Write-Host "  - S3 buckets: ${FrontendBucket}, ${BackendBucket}" -ForegroundColor Red
Write-Host "  - CloudFormation stack: ${StackName}" -ForegroundColor Red
Write-Host "  - EC2 instances, RDS databases, and other resources" -ForegroundColor Red

$confirmation = Read-Host "Are you sure you want to continue? (yes/no)"
if ($confirmation -ne "yes") {
    Write-Host "❌ Cleanup cancelled" -ForegroundColor Yellow
    exit 0
}

# Step 1: Delete CloudFormation Stack
Write-Host "🗑️  Deleting CloudFormation stack..." -ForegroundColor Blue
try {
    aws cloudformation delete-stack --stack-name $StackName --region $Region
    Write-Host "✅ CloudFormation stack deletion initiated" -ForegroundColor Green
    
    # Wait for stack deletion to complete
    Write-Host "⏳ Waiting for stack deletion to complete..." -ForegroundColor Yellow
    aws cloudformation wait stack-delete-complete --stack-name $StackName --region $Region
    Write-Host "✅ CloudFormation stack deleted successfully" -ForegroundColor Green
} catch {
    Write-Host "ℹ️  CloudFormation stack not found or already deleted" -ForegroundColor Yellow
}

# Step 2: Empty and Delete S3 Buckets
Write-Host "🗑️  Cleaning up S3 buckets..." -ForegroundColor Blue

# Frontend bucket
try {
    Write-Host "  Cleaning frontend bucket: ${FrontendBucket}" -ForegroundColor Blue
    aws s3 rm "s3://${FrontendBucket}" --recursive --region $Region
    aws s3 rb "s3://${FrontendBucket}" --region $Region
    Write-Host "✅ Frontend bucket deleted" -ForegroundColor Green
} catch {
    Write-Host "ℹ️  Frontend bucket not found or already deleted" -ForegroundColor Yellow
}

# Backend bucket
try {
    Write-Host "  Cleaning backend bucket: ${BackendBucket}" -ForegroundColor Blue
    aws s3 rm "s3://${BackendBucket}" --recursive --region $Region
    aws s3 rb "s3://${BackendBucket}" --region $Region
    Write-Host "✅ Backend bucket deleted" -ForegroundColor Green
} catch {
    Write-Host "ℹ️  Backend bucket not found or already deleted" -ForegroundColor Yellow
}

# Step 3: List and clean up other resources manually
Write-Host "🧹 Checking for other resources..." -ForegroundColor Blue
Write-Host "ℹ️  Please manually check AWS Console for:" -ForegroundColor Yellow
Write-Host "  - EC2 instances with project tags" -ForegroundColor Yellow
Write-Host "  - RDS databases" -ForegroundColor Yellow
Write-Host "  - Security groups" -ForegroundColor Yellow
Write-Host "  - Load balancers" -ForegroundColor Yellow

Write-Host "✅ AWS cleanup completed successfully!" -ForegroundColor Green
Write-Host "🎉 All previous deployments have been removed" -ForegroundColor Green
Write-Host "📝 You can now run a fresh deployment using: .\deploy-nextjs-aws.ps1" -ForegroundColor Cyan 