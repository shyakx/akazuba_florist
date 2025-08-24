# Simple Backend Deployment Script
Write-Host "🚀 Deploying Backend Infrastructure..." -ForegroundColor Green

# Create backend deployment package
Write-Host "📦 Creating backend deployment package..." -ForegroundColor Blue
Set-Location backend
Compress-Archive -Path * -DestinationPath ../backend-deployment.zip -Force
Set-Location ..

# Upload backend to S3
Write-Host "📤 Uploading backend to S3..." -ForegroundColor Blue
aws s3 cp backend-deployment.zip s3://akazuba-florist-backend/

# Create CloudFormation template
Write-Host "🏗️ Creating CloudFormation template..." -ForegroundColor Blue

$template = @"
AWSTemplateFormatVersion: '2010-09-09'
Description: 'Akazuba Florist Infrastructure'

Resources:
  VPC:
    Type: AWS::EC2::VPC
    Properties:
      CidrBlock: 10.0.0.0/16
      EnableDnsHostnames: true
      EnableDnsSupport: true
      Tags:
        - Key: Name
          Value: Akazuba-VPC

  InternetGateway:
    Type: AWS::EC2::InternetGateway

  AttachGateway:
    Type: AWS::EC2::VPCGatewayAttachment
    Properties:
      VpcId: !Ref VPC
      InternetGatewayId: !Ref InternetGateway

  PublicSubnet:
    Type: AWS::EC2::Subnet
    Properties:
      VpcId: !Ref VPC
      AvailabilityZone: !Select [0, !GetAZs '']
      CidrBlock: 10.0.1.0/24
      MapPublicIpOnLaunch: true

  PublicRouteTable:
    Type: AWS::EC2::RouteTable
    Properties:
      VpcId: !Ref VPC

  PublicRoute:
    Type: AWS::EC2::Route
    DependsOn: AttachGateway
    Properties:
      RouteTableId: !Ref PublicRouteTable
      DestinationCidrBlock: 0.0.0.0/0
      GatewayId: !Ref InternetGateway

  PublicSubnetRouteTableAssociation:
    Type: AWS::EC2::SubnetRouteTableAssociation
    Properties:
      SubnetId: !Ref PublicSubnet
      RouteTableId: !Ref PublicRouteTable

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
"@

$template | Out-File -FilePath "cloudformation-template.yaml" -Encoding UTF8

# Deploy CloudFormation stack
Write-Host "🚀 Deploying CloudFormation stack..." -ForegroundColor Blue
aws cloudformation create-stack --stack-name "akazuba-florist-infrastructure" --template-body file://cloudformation-template.yaml --capabilities CAPABILITY_IAM --region us-east-1

Write-Host "⏳ Waiting for CloudFormation stack to complete..." -ForegroundColor Blue
aws cloudformation wait stack-create-complete --stack-name "akazuba-florist-infrastructure" --region us-east-1

# Get outputs
Write-Host "📋 Getting deployment outputs..." -ForegroundColor Blue
$EC2_IP = aws cloudformation describe-stacks --stack-name "akazuba-florist-infrastructure" --query 'Stacks[0].Outputs[?OutputKey==`EC2PublicIP`].OutputValue' --output text --region us-east-1
$RDS_ENDPOINT = aws cloudformation describe-stacks --stack-name "akazuba-florist-infrastructure" --query 'Stacks[0].Outputs[?OutputKey==`RDSEndpoint`].OutputValue' --output text --region us-east-1

Write-Host "🎉 Deployment completed successfully!" -ForegroundColor Green
Write-Host "📊 Deployment Summary:" -ForegroundColor Yellow
Write-Host "Frontend URL: http://akazuba-florist-frontend.s3-website-us-east-1.amazonaws.com" -ForegroundColor Cyan
Write-Host "Backend API: http://${EC2_IP}:5000" -ForegroundColor Cyan
Write-Host "Database Endpoint: ${RDS_ENDPOINT}" -ForegroundColor Cyan
Write-Host "Admin Dashboard: http://akazuba-florist-frontend.s3-website-us-east-1.amazonaws.com/admin" -ForegroundColor Cyan
Write-Host "Admin Email: admin@akazubaflorist.com" -ForegroundColor Cyan
Write-Host "Admin Password: akazuba2024" -ForegroundColor Cyan 