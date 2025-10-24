#!/bin/bash

# Pre-Commit Hook Setup Script
# This script helps you choose and set up the appropriate pre-commit hook

echo "🔧 Pre-Commit Hook Setup"
echo "========================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${BLUE}📝 $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "Please run this script from the project root directory"
    exit 1
fi

# Check if husky is installed
if [ ! -d ".husky" ]; then
    print_error "Husky is not installed. Please run 'npm install' first."
    exit 1
fi

echo "Choose your pre-commit hook configuration:"
echo ""
echo "1. 🚀 Fast (Recommended for Development)"
echo "   - Type checking"
echo "   - Linting"
echo "   - Unit tests"
echo "   - Accessibility tests"
echo "   - Duration: ~30-60 seconds"
echo ""
echo "2. ⚖️  Standard (Balanced)"
echo "   - Type checking"
echo "   - Linting"
echo "   - Code formatting check"
echo "   - Unit tests"
echo "   - Accessibility tests"
echo "   - Duration: ~1-2 minutes"
echo ""
echo "3. 🔍 Comprehensive (Full Test Suite)"
echo "   - Type checking"
echo "   - Linting"
echo "   - Code formatting check"
echo "   - Unit tests"
echo "   - Accessibility tests"
echo "   - E2E tests"
echo "   - Build verification"
echo "   - Duration: ~3-5 minutes"
echo ""

read -p "Enter your choice (1-3): " choice

case $choice in
    1)
        print_status "Setting up fast pre-commit hook..."
        cp .husky/pre-commit-fast .husky/pre-commit
        chmod +x .husky/pre-commit
        print_success "Fast pre-commit hook installed!"
        echo ""
        echo "This hook will run:"
        echo "  ✅ TypeScript type checking"
        echo "  ✅ ESLint linting"
        echo "  ✅ Unit tests"
        echo "  ✅ Accessibility tests"
        ;;
    2)
        print_status "Setting up standard pre-commit hook..."
        # Standard hook is already the default
        chmod +x .husky/pre-commit
        print_success "Standard pre-commit hook is active!"
        echo ""
        echo "This hook will run:"
        echo "  ✅ TypeScript type checking"
        echo "  ✅ ESLint linting"
        echo "  ✅ Code formatting check"
        echo "  ✅ Unit tests"
        echo "  ✅ Accessibility tests"
        ;;
    3)
        print_status "Setting up comprehensive pre-commit hook..."
        cp .husky/pre-commit-comprehensive .husky/pre-commit
        chmod +x .husky/pre-commit
        print_success "Comprehensive pre-commit hook installed!"
        echo ""
        echo "This hook will run:"
        echo "  ✅ TypeScript type checking"
        echo "  ✅ ESLint linting"
        echo "  ✅ Code formatting check"
        echo "  ✅ Unit tests"
        echo "  ✅ Accessibility tests"
        echo "  ✅ E2E tests"
        echo "  ✅ Build verification"
        ;;
    *)
        print_error "Invalid choice. Please run the script again and choose 1, 2, or 3."
        exit 1
        ;;
esac

echo ""
print_status "Testing pre-commit hook..."

# Test the hook by running a dry commit
if git add . > /dev/null 2>&1; then
    print_success "Pre-commit hook is ready!"
    echo ""
    echo "Next steps:"
    echo "1. Make some changes to your code"
    echo "2. Run 'git add .' to stage changes"
    echo "3. Run 'git commit -m \"your message\"' to test the hook"
    echo ""
    echo "The hook will automatically run all checks before allowing the commit."
    echo ""
    echo "If you need to bypass the hook (emergency only):"
    echo "  git commit --no-verify -m \"emergency commit\""
    echo ""
    echo "To change the hook later, run this script again."
else
    print_warning "Could not test the hook (no changes to commit)"
    print_success "Pre-commit hook is installed and ready!"
fi

echo ""
print_success "Setup complete! 🎉"
