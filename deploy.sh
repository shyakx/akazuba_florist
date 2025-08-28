#!/bin/bash

echo "🚀 Akazuba Florist Deployment Script"
echo "======================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if git is installed
if ! command -v git &> /dev/null; then
    print_error "Git is not installed. Please install Git first."
    exit 1
fi

# Check if we're in a git repository
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    print_error "Not in a git repository. Please initialize git and commit your changes first."
    exit 1
fi

print_status "Checking git status..."
if [[ -n $(git status --porcelain) ]]; then
    print_warning "You have uncommitted changes. Please commit them before deploying."
    echo "Current changes:"
    git status --short
    read -p "Do you want to continue anyway? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        print_error "Deployment cancelled."
        exit 1
    fi
fi

print_status "Checking if you have a remote repository..."
if ! git remote get-url origin &> /dev/null; then
    print_error "No remote repository found. Please add a remote origin first."
    echo "Example: git remote add origin https://github.com/shyakx/akazuba_florist.git"
    exit 1
fi

print_status "Pushing latest changes to remote repository..."
git push origin main

if [ $? -eq 0 ]; then
    print_success "Code pushed to remote repository successfully!"
else
    print_error "Failed to push code to remote repository."
    exit 1
fi

echo
echo "📋 Next Steps:"
echo "=============="
echo
echo "1. 🗄️  Deploy Database on Render:"
echo "   - Go to https://dashboard.render.com"
echo "   - Create a new PostgreSQL database"
echo "   - Note down the connection string"
echo
echo "2. 🔧 Deploy Backend on Render:"
echo "   - Create a new Web Service"
echo "   - Set root directory to 'backend'"
echo "   - Configure environment variables (see DEPLOYMENT.md)"
echo
echo "3. 🌐 Deploy Frontend on Vercel:"
echo "   - Go to https://vercel.com/dashboard"
echo "   - Import your GitHub repository"
echo "   - Configure environment variables"
echo
echo "4. 🔄 Update CORS settings after getting your frontend URL"
echo
echo "📖 For detailed instructions, see DEPLOYMENT.md"
echo
print_success "Deployment script completed successfully!"
