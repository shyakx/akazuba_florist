#!/bin/bash

# Akazuba Florist AWS Deployment Script
set -e

echo "🚀 Starting AWS Deployment for Akazuba Florist..."

# Configuration
PROJECT_NAME="akazuba-florist"
REGION="us-east-1"
FRONTEND_BUCKET="${PROJECT_NAME}-frontend"
BACKEND_BUCKET="${PROJECT_NAME}-backend"

# Check AWS CLI
if ! command -v aws &> /dev/null; then
    echo "❌ AWS CLI is not installed. Please install it first."
    exit 1
fi

# Check AWS credentials
if ! aws sts get-caller-identity &> /dev/null; then
    echo "❌ AWS credentials not configured. Please run 'aws configure' first."
    exit 1
fi

echo "✅ AWS CLI and credentials verified"

# Step 1: Create S3 buckets
echo "📦 Creating S3 buckets..."
aws s3 mb s3://${FRONTEND_BUCKET} --region ${REGION} || echo "Frontend bucket already exists"
aws s3 mb s3://${BACKEND_BUCKET} --region ${REGION} || echo "Backend bucket already exists"

# Configure frontend bucket for static website hosting
aws s3 website s3://${FRONTEND_BUCKET} --index-document index.html --error-document error.html

echo "✅ S3 buckets created"

# Step 2: Build and deploy frontend
echo "🏗️ Building frontend..."
npm run build

echo "📤 Uploading frontend to S3..."
aws s3 sync .next s3://${FRONTEND_BUCKET} --delete

echo "✅ Frontend deployed to S3"

# Step 3: Create deployment package for backend
echo "📦 Creating backend deployment package..."
cd backend
zip -r ../backend-deployment.zip . -x "node_modules/*" ".git/*"
cd ..

# Step 4: Upload backend to S3
echo "📤 Uploading backend to S3..."
aws s3 cp backend-deployment.zip s3://${BACKEND_BUCKET}/

echo "✅ Backend uploaded to S3"

# Step 5: Create CloudFormation template
echo "🏗️ Creating CloudFormation template..."

cat > cloudformation-template.yaml << 'EOF'
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
    Value: !Ref FrontendBucket

  BackendBucket:
    Description: S3 bucket for backend
    Value: !Ref BackendBucket
EOF

echo "✅ CloudFormation template created"

# Step 6: Deploy CloudFormation stack
echo "🚀 Deploying CloudFormation stack..."
aws cloudformation create-stack \
    --stack-name ${PROJECT_NAME}-infrastructure \
    --template-body file://cloudformation-template.yaml \
    --capabilities CAPABILITY_IAM \
    --region ${REGION}

echo "⏳ Waiting for CloudFormation stack to complete..."
aws cloudformation wait stack-create-complete \
    --stack-name ${PROJECT_NAME}-infrastructure \
    --region ${REGION}

echo "✅ CloudFormation stack deployment completed"

# Step 7: Get deployment outputs
echo "📋 Getting deployment outputs..."
EC2_IP=$(aws cloudformation describe-stacks \
    --stack-name ${PROJECT_NAME}-infrastructure \
    --query 'Stacks[0].Outputs[?OutputKey==`EC2PublicIP`].OutputValue' \
    --output text \
    --region ${REGION})

RDS_ENDPOINT=$(aws cloudformation describe-stacks \
    --stack-name ${PROJECT_NAME}-infrastructure \
    --query 'Stacks[0].Outputs[?OutputKey==`RDSEndpoint`].OutputValue' \
    --output text \
    --region ${REGION})

echo "🎉 Deployment completed successfully!"
echo "📊 Deployment Summary:"
echo "Frontend URL: http://${FRONTEND_BUCKET}.s3-website-${REGION}.amazonaws.com"
echo "Backend API: http://${EC2_IP}:5000"
echo "Database Endpoint: ${RDS_ENDPOINT}"
echo "Admin Dashboard: http://${FRONTEND_BUCKET}.s3-website-${REGION}.amazonaws.com/admin"
echo "Admin Email: admin@akazubaflorist.com"
echo "Admin Password: akazuba2024" 