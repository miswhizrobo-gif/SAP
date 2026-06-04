#!/bin/bash

# This script sets up and runs the entire application

echo "================================"
echo "Employee Task Tracking System"
echo "Setup Script"
echo "================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Error: Node.js is not installed. Please install Node.js first."
    exit 1
fi

echo "✓ Node.js version: $(node --version)"
echo "✓ npm version: $(npm --version)"
echo ""

# Create .env file for backend if it doesn't exist
if [ ! -f "backend/.env" ]; then
    echo "Creating backend/.env file..."
    cp backend/.env.example backend/.env
    echo "✓ Created backend/.env - Please update with your email credentials"
else
    echo "✓ backend/.env already exists"
fi

echo ""
echo "================================"
echo "Installing Backend Dependencies"
echo "================================"
cd backend
npm install
cd ..

echo ""
echo "================================"
echo "Installing Frontend Dependencies"
echo "================================"
cd frontend
npm install
cd ..

echo ""
echo "================================"
echo "Setup Complete!"
echo "================================"
echo ""
echo "To run the application:"
echo ""
echo "1. Make sure MongoDB is running:"
echo "   mongod"
echo ""
echo "2. In one terminal, start the backend:"
echo "   cd backend && npm start"
echo ""
echo "3. In another terminal, start the frontend:"
echo "   cd frontend && npm start"
echo ""
echo "4. Open http://localhost:3000 in your browser"
echo ""
echo "For more details, see QUICKSTART.md"
