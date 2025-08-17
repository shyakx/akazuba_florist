# 🚀 AWS Deployment Guide for Akazuba Florist

This guide will walk you through deploying the Akazuba Florist application to AWS using our automated deployment scripts.

## 📋 Prerequisites

### 1. AWS Account Setup
- [ ] Create an AWS account at https://aws.amazon.com
- [ ] Set up billing and payment method
- [ ] Create an IAM user with appropriate permissions

### 2. AWS CLI Installation
- [ ] Install AWS CLI v2 from https://aws.amazon.com/cli/
- [ ] Configure AWS credentials: `aws configure`

### 3. Required AWS Permissions
Your IAM user needs the following permissions:
- EC2 (Full access)
- S3 (Full access)
- RDS (Full access)
- CloudFormation (Full access)
- IAM (Limited - for CloudFormation)

## 🏗️ Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Database      │
│   (S3 + CDN)    │◄──►│   (EC2)         │◄──►│   (RDS)         │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Components:
- **Frontend**: S3 bucket with static website hosting
- **Backend**: EC2 instance running Node.js/Express
- **Database**: RDS PostgreSQL instance
- **Networking**: VPC with public subnets and security groups

## 🚀 Quick Deployment

### Option 1: Automated Deployment (Recommended)

#### For Windows (PowerShell):
```powershell
# Run the deployment script
.\deploy-aws.ps1

# Or with custom parameters
.\deploy-aws.ps1 -Region "us-east-1" -ProjectName "akazuba-florist"
```

#### For Linux/Mac (Bash):
```bash
# Make script executable
chmod +x deploy-aws.sh

# Run the deployment script
./deploy-aws.sh
```

### Option 2: Manual Deployment

If you prefer to deploy manually, follow these steps:

#### Step 1: Prepare the Application
```bash
# Build frontend
npm run build

# Build backend
cd backend
npm run build
cd ..
```

#### Step 2: Create S3 Buckets
```bash
# Create frontend bucket
aws s3 mb s3://akazuba-florist-frontend --region us-east-1

# Create backend bucket
aws s3 mb s3://akazuba-florist-backend --region us-east-1

# Configure frontend bucket for static hosting
aws s3 website s3://akazuba-florist-frontend --index-document index.html --error-document error.html
```

#### Step 3: Deploy Frontend
```bash
# Upload frontend to S3
aws s3 sync .next s3://akazuba-florist-frontend --delete
```

#### Step 4: Deploy Backend
```bash
# Create deployment package
cd backend
zip -r ../backend-deployment.zip . -x "node_modules/*" ".git/*"
cd ..

# Upload to S3
aws s3 cp backend-deployment.zip s3://akazuba-florist-backend/
```

#### Step 5: Deploy Infrastructure
```bash
# Deploy CloudFormation stack
aws cloudformation create-stack \
    --stack-name akazuba-florist-infrastructure \
    --template-body file://cloudformation-template.yaml \
    --capabilities CAPABILITY_IAM \
    --region us-east-1
```

## 📊 Deployment Outputs

After successful deployment, you'll get:

### URLs and Endpoints:
- **Frontend URL**: `http://akazuba-florist-frontend.s3-website-us-east-1.amazonaws.com`
- **Backend API**: `http://[EC2-IP]:5000`
- **Database Endpoint**: `[RDS-ENDPOINT]:5432`
- **Admin Dashboard**: `http://akazuba-florist-frontend.s3-website-us-east-1.amazonaws.com/admin`

### Default Credentials:
- **Admin Email**: `admin@akazubaflorist.com`
- **Admin Password**: `akazuba2024`

## 🔧 Post-Deployment Configuration

### 1. Environment Variables
Update the backend environment variables on the EC2 instance:

```bash
# SSH into EC2 instance
ssh -i your-key.pem ec2-user@[EC2-IP]

# Edit environment file
sudo nano /opt/akazuba-florist/backend/.env
```

Required environment variables:
```env
DATABASE_URL="postgresql://akazuba_admin:Akazuba2024!@[RDS-ENDPOINT]:5432/akazuba_florist"
PORT=5000
NODE_ENV=production
FRONTEND_URL="http://akazuba-florist-frontend.s3-website-us-east-1.amazonaws.com"
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=your-super-secret-refresh-key-here
JWT_REFRESH_EXPIRES_IN=30d
MOMO_API_URL=https://sandbox.momodeveloper.mtn.com
MOMO_API_KEY=0be3ff189893407780db7c277b1c3aed
MOMO_API_USER=93d37add511f4f3a927628a2470b11c1
MOMO_ENVIRONMENT=sandbox
SENDGRID_API_KEY=your-sendgrid-api-key
SENDGRID_FROM_EMAIL=noreply@akazubaflorist.com
SENDGRID_FROM_NAME=Akazuba Florist
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
REDIS_URL=redis://localhost:6379
LOG_LEVEL=info
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
ADMIN_EMAIL=admin@akazubaflorist.com
ADMIN_PASSWORD=akazuba2024
```

### 2. Database Setup
```bash
# Run database migrations
cd /opt/akazuba-florist/backend
npx prisma migrate deploy

# Seed the database
npx prisma db seed
```

### 3. Restart Services
```bash
# Restart the backend service
pm2 restart akazuba-backend
pm2 save
```

## 🌐 Custom Domain Setup

### 1. Register a Domain
- Register your domain (e.g., `akazubaflorist.com`) with a domain registrar

### 2. Configure Route 53
```bash
# Create hosted zone
aws route53 create-hosted-zone \
    --name akazubaflorist.com \
    --caller-reference $(date +%s) \
    --region us-east-1
```

### 3. Update DNS Records
Add the following records to your domain:
- **A Record**: Point to your EC2 instance IP
- **CNAME Record**: Point frontend to S3 bucket

### 4. SSL Certificate
```bash
# Request SSL certificate
aws acm request-certificate \
    --domain-name akazubaflorist.com \
    --subject-alternative-names *.akazubaflorist.com \
    --region us-east-1
```

## 📈 Monitoring and Logging

### 1. CloudWatch Setup
```bash
# Create CloudWatch log group
aws logs create-log-group --log-group-name /aws/ec2/akazuba-backend

# Configure log retention
aws logs put-retention-policy \
    --log-group-name /aws/ec2/akazuba-backend \
    --retention-in-days 30
```

### 2. Application Monitoring
```bash
# Install monitoring tools on EC2
sudo yum install -y htop iotop

# Monitor application logs
pm2 logs akazuba-backend
```

## 🔒 Security Best Practices

### 1. Security Groups
- Restrict SSH access to your IP only
- Close unnecessary ports
- Use least privilege principle

### 2. IAM Roles
- Use IAM roles instead of access keys
- Implement least privilege access
- Regularly rotate credentials

### 3. Database Security
- Enable encryption at rest
- Use SSL connections
- Regular security updates

## 💰 Cost Optimization

### Estimated Monthly Costs:
- **EC2 t3.medium**: ~$30/month
- **RDS db.t3.micro**: ~$15/month
- **S3 Storage**: ~$5/month
- **Data Transfer**: ~$10/month
- **Total**: ~$60/month

### Cost Optimization Tips:
- Use Reserved Instances for long-term deployments
- Enable S3 lifecycle policies
- Monitor and optimize data transfer
- Use CloudWatch alarms for cost monitoring

## 🚨 Troubleshooting

### Common Issues:

#### 1. EC2 Instance Not Starting
```bash
# Check instance status
aws ec2 describe-instances --instance-ids [INSTANCE-ID]

# Check system logs
aws ec2 get-console-output --instance-id [INSTANCE-ID]
```

#### 2. Database Connection Issues
```bash
# Check RDS status
aws rds describe-db-instances --db-instance-identifier akazuba-db

# Test database connectivity
psql -h [RDS-ENDPOINT] -U akazuba_admin -d akazuba_florist
```

#### 3. Frontend Not Loading
```bash
# Check S3 bucket configuration
aws s3 website s3://akazuba-florist-frontend

# Verify bucket policy
aws s3api get-bucket-policy --bucket akazuba-florist-frontend
```

#### 4. Backend API Not Responding
```bash
# SSH into EC2 and check service status
pm2 status
pm2 logs akazuba-backend

# Check application logs
tail -f /opt/akazuba-florist/backend/logs/app.log
```

## 🔄 CI/CD Pipeline

### GitHub Actions Setup
Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to AWS

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Configure AWS credentials
      uses: aws-actions/configure-aws-credentials@v1
      with:
        aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
        aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
        aws-region: us-east-1
    
    - name: Deploy to AWS
      run: |
        chmod +x deploy-aws.sh
        ./deploy-aws.sh
```

## 📞 Support

If you encounter any issues during deployment:

1. Check the AWS CloudFormation console for stack events
2. Review CloudWatch logs for application errors
3. Verify security group configurations
4. Test connectivity between components

## 🎉 Success!

Once deployed, your Akazuba Florist application will be live on AWS with:
- ✅ Scalable infrastructure
- ✅ High availability
- ✅ Security best practices
- ✅ Monitoring and logging
- ✅ Cost optimization

Your e-commerce platform is now ready to serve customers in Rwanda! 🌸 