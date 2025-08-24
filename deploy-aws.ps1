# Akazuba Florist AWS Deployment Script (PowerShell)
# This script deploys the entire application to AWS

param(
    [string]$Region = "us-east-1",
    [string]$ProjectName = "akazuba-florist"
)

Write-Host "🚀 Starting AWS Deployment for Akazuba Florist..." -ForegroundColor Green

# Configuration
$FrontendBucket = "${ProjectName}-frontend"
$BackendBucket = "${ProjectName}-backend"

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

# Step 1: Create S3 buckets
Write-Host "📦 Creating S3 buckets..." -ForegroundColor Blue

try {
    aws s3 mb "s3://${FrontendBucket}" --region $Region
    Write-Host "✅ Frontend bucket created" -ForegroundColor Green
} catch {
    Write-Host "ℹ️ Frontend bucket already exists" -ForegroundColor Yellow
}

try {
    aws s3 mb "s3://${BackendBucket}" --region $Region
    Write-Host "✅ Backend bucket created" -ForegroundColor Green
} catch {
    Write-Host "ℹ️ Backend bucket already exists" -ForegroundColor Yellow
}

# Configure frontend bucket for static website hosting
aws s3 website "s3://${FrontendBucket}" --index-document index.html --error-document error.html

Write-Host "✅ S3 buckets configured" -ForegroundColor Green

# Step 2: Build and deploy frontend
Write-Host "🏗️ Building frontend..." -ForegroundColor Blue
npm run build

Write-Host "📤 Uploading frontend to S3..." -ForegroundColor Blue
aws s3 sync .next "s3://${FrontendBucket}" --delete

Write-Host "✅ Frontend deployed to S3" -ForegroundColor Green

# Step 3: Create deployment package for backend
Write-Host "📦 Creating backend deployment package..." -ForegroundColor Blue

# Create deployment package for backend
Set-Location backend
Compress-Archive -Path * -DestinationPath ../backend-deployment.zip -Force
Set-Location ..

Write-Host "✅ Backend deployment package created" -ForegroundColor Green

# Step 4: Upload backend to S3
Write-Host "📤 Uploading backend to S3..." -ForegroundColor Blue
aws s3 cp backend-deployment.zip "s3://${BackendBucket}/"

Write-Host "✅ Backend uploaded to S3" -ForegroundColor Green

# Step 5: Create CloudFormation template
Write-Host "🏗️ Creating CloudFormation template..." -ForegroundColor Blue

$CloudFormationTemplate = @"
AWSTemplateFormatVersion: '2010-09-09'
Description: 'Akazuba Florist Infrastructure'

Resources:
  # VPC
  VPC:
    Type: AWS::EC2::VPC
    Properties:
      CidrBlock: 10.0.0.0/16
      EnableDnsHostnames: true
      EnableDnsSupport: true
      Tags:
        - Key: Name
          Value: Akazuba-VPC

  # Internet Gateway
  InternetGateway:
    Type: AWS::EC2::InternetGateway

  # Attach Internet Gateway to VPC
  AttachGateway:
    Type: AWS::EC2::VPCGatewayAttachment
    Properties:
      VpcId: !Ref VPC
      InternetGatewayId: !Ref InternetGateway

  # Public Subnet
  PublicSubnet:
    Type: AWS::EC2::Subnet
    Properties:
      VpcId: !Ref VPC
      AvailabilityZone: !Select [0, !GetAZs '']
      CidrBlock: 10.0.1.0/24
      MapPublicIpOnLaunch: true

  # Route Table
  PublicRouteTable:
    Type: AWS::EC2::RouteTable
    Properties:
      VpcId: !Ref VPC

  # Route
  PublicRoute:
    Type: AWS::EC2::Route
    DependsOn: AttachGateway
    Properties:
      RouteTableId: !Ref PublicRouteTable
      DestinationCidrBlock: 0.0.0.0/0
      GatewayId: !Ref InternetGateway

  # Route Table Association
  PublicSubnetRouteTableAssociation:
    Type: AWS::EC2::SubnetRouteTableAssociation
    Properties:
      SubnetId: !Ref PublicSubnet
      RouteTableId: !Ref PublicRouteTable

  # Security Group
  SecurityGroup:
    Type: AWS::EC2::SecurityGroup
    Properties:
      GroupDescription: Security group for Akazuba Florist
      VpcId: !Ref VPC
      SecurityGroupIngress:
        - IpProtocol: tcp
          FromPort: 22
          ToPort: 22
          CidrIp: 0.0.0.0/0
        - IpProtocol: tcp
          FromPort: 80
          ToPort: 80
          CidrIp: 0.0.0.0/0
        - IpProtocol: tcp
          FromPort: 443
          ToPort: 443
          CidrIp: 0.0.0.0/0
        - IpProtocol: tcp
          FromPort: 5000
          ToPort: 5000
          CidrIp: 0.0.0.0/0

  # EC2 Instance
  EC2Instance:
    Type: AWS::EC2::Instance
    Properties:
      ImageId: ami-0c02fb55956c7d316
      InstanceType: t3.medium
      SecurityGroupIds:
        - !Ref SecurityGroup
      SubnetId: !Ref PublicSubnet
      UserData:
        Fn::Base64: !Sub |
          #!/bin/bash
          yum update -y
          yum install -y nodejs npm git
          npm install -g pm2
          git clone https://github.com/shyakx/akazuba_florist.git /opt/akazuba-florist
          cd /opt/akazuba-florist/backend
          npm install
          npm run build
          pm2 start dist/index.js --name "akazuba-backend"
          pm2 startup
          pm2 save
      Tags:
        - Key: Name
          Value: Akazuba-Backend

  # RDS Instance
  RDSInstance:
    Type: AWS::RDS::DBInstance
    Properties:
      DBInstanceIdentifier: akazuba-db
      DBInstanceClass: db.t3.micro
      Engine: postgres
      MasterUsername: akazuba_admin
      MasterUserPassword: Akazuba2024!
      AllocatedStorage: 20
      VPCSecurityGroups:
        - !Ref SecurityGroup
      BackupRetentionPeriod: 7
      MultiAZ: false
      PubliclyAccessible: true

Outputs:
  EC2PublicIP:
    Description: Public IP of EC2 instance
    Value: !GetAtt EC2Instance.PublicIp

  RDSEndpoint:
    Description: RDS instance endpoint
    Value: !GetAtt RDSInstance.Endpoint.Address

  FrontendBucket:
    Description: S3 bucket for frontend
    Value: $FrontendBucket

  BackendBucket:
    Description: S3 bucket for backend
    Value: $BackendBucket
"@

$CloudFormationTemplate | Out-File -FilePath "cloudformation-template.yaml" -Encoding UTF8

Write-Host "✅ CloudFormation template created" -ForegroundColor Green

# Step 6: Deploy CloudFormation stack
Write-Host "🚀 Deploying CloudFormation stack..." -ForegroundColor Blue

try {
    aws cloudformation create-stack `
        --stack-name "${ProjectName}-infrastructure" `
        --template-body file://cloudformation-template.yaml `
        --capabilities CAPABILITY_IAM `
        --region $Region

    Write-Host "⏳ Waiting for CloudFormation stack to complete..." -ForegroundColor Blue
    aws cloudformation wait stack-create-complete `
        --stack-name "${ProjectName}-infrastructure" `
        --region $Region

    Write-Host "✅ CloudFormation stack deployment completed" -ForegroundColor Green
} catch {
    Write-Host "ℹ️ Stack already exists or deployment in progress" -ForegroundColor Yellow
}

# Step 7: Get deployment outputs
Write-Host "📋 Getting deployment outputs..." -ForegroundColor Blue

try {
    $EC2_IP = aws cloudformation describe-stacks `
        --stack-name "${ProjectName}-infrastructure" `
        --query 'Stacks[0].Outputs[?OutputKey==`EC2PublicIP`].OutputValue' `
        --output text `
        --region $Region

    $RDS_ENDPOINT = aws cloudformation describe-stacks `
        --stack-name "${ProjectName}-infrastructure" `
        --query 'Stacks[0].Outputs[?OutputKey==`RDSEndpoint`].OutputValue' `
        --output text `
        --region $Region

    Write-Host "🎉 Deployment completed successfully!" -ForegroundColor Green
    Write-Host "📊 Deployment Summary:" -ForegroundColor Yellow
    Write-Host "Frontend URL: http://${FrontendBucket}.s3-website-${Region}.amazonaws.com" -ForegroundColor Cyan
    Write-Host "Backend API: http://${EC2_IP}:5000" -ForegroundColor Cyan
    Write-Host "Database Endpoint: ${RDS_ENDPOINT}" -ForegroundColor Cyan
    Write-Host "Admin Dashboard: http://${FrontendBucket}.s3-website-${Region}.amazonaws.com/admin" -ForegroundColor Cyan
    Write-Host "Admin Email: admin@akazubaflorist.com" -ForegroundColor Cyan
    Write-Host "Admin Password: akazuba2024" -ForegroundColor Cyan

    Write-Host "`n🔧 Next Steps:" -ForegroundColor Yellow
    Write-Host "1. Wait 5-10 minutes for EC2 instance to fully initialize" -ForegroundColor White
    Write-Host "2. Test the backend API: http://${EC2_IP}:5000/health" -ForegroundColor White
    Write-Host "3. Configure custom domain and SSL certificate" -ForegroundColor White
    Write-Host "4. Set up monitoring and logging" -ForegroundColor White
    Write-Host "5. Configure backup and disaster recovery" -ForegroundColor White

} catch {
    Write-Host "⚠️ Could not retrieve deployment outputs. Check AWS Console for details." -ForegroundColor Yellow
}

Write-Host "✅ AWS deployment script completed!" -ForegroundColor Green 