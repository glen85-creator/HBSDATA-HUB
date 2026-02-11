#!/bin/bash

echo "===================================="
echo "HBS DATA HUB - Setup Script"
echo "===================================="
echo ""

# Check if .env file already exists
if [ -f .env ]; then
    echo "[WARNING] .env file already exists!"
    read -p "Do you want to overwrite it? (y/n): " overwrite
    if [ "$overwrite" != "y" ] && [ "$overwrite" != "Y" ]; then
        echo "Setup cancelled."
        exit 0
    fi
fi

# Copy .env.example to .env
echo "Copying .env.example to .env..."
cp .env.example .env

echo ""
echo "===================================="
echo "Setup completed!"
echo "===================================="
echo ""
echo "Next steps:"
echo "1. Edit .env file and add your actual configuration values"
echo "2. Run: npm install"
echo "3. Run: npm run dev"
echo ""
