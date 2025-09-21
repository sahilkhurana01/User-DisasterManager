# Deployment Guide for Disaster Management App

## Overview
This project consists of two main parts:
- **Frontend**: React + Vite application in the `Frontend/` directory
- **Backend**: Node.js + Express server in the `Backend/` directory

## Render Deployment

### Frontend Deployment (Static Site)

1. **Create a new Static Site on Render**
2. **Repository**: Connect your GitHub repository
3. **Build Command**: `npm run build`
4. **Publish Directory**: `dist`
5. **Environment Variables**: None required for frontend

### Backend Deployment (Web Service)

**Option 1: Deploy Backend Separately (Recommended)**
1. **Create a new Web Service on Render**
2. **Repository**: Connect your GitHub repository
3. **Root Directory**: `Backend` (set this in Render dashboard)
4. **Build Command**: `npm install`
5. **Start Command**: `npm start`
6. **Environment Variables**:
   - `NODE_ENV`: `production`
   - `PORT`: `10000` (or let Render assign)
   - `GOOGLE_SHEET_ID`: Your Google Sheets ID
   - `GOOGLE_SERVICE_ACCOUNT_EMAIL`: Your service account email
   - `GOOGLE_PRIVATE_KEY`: Your service account private key

**Option 2: Use render.yaml (Alternative)**
1. **Create a new Web Service on Render**
2. **Repository**: Connect your GitHub repository
3. **Use the `Backend/render.yaml` configuration file**
4. **Set Environment Variables** in Render dashboard

## Local Development

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Setup
```bash
# Install all dependencies
npm run install:all

# Start frontend development server
npm run dev

# Start backend development server (in another terminal)
npm run backend:dev
```

### Build for Production
```bash
# Build the entire project
npm run build

# The built files will be in the dist/ directory
```

## Project Structure

```
├── Frontend/           # React + Vite frontend
│   ├── src/           # Source code
│   ├── public/         # Static assets
│   ├── package.json    # Frontend dependencies
│   └── vite.config.ts  # Vite configuration
├── Backend/            # Node.js backend
│   ├── server.js       # Express server
│   ├── package.json    # Backend dependencies
│   └── *.json          # Google Sheets credentials
├── dist/               # Built frontend files (created during build)
├── package.json        # Root package.json with build scripts
├── render.yaml         # Render deployment configuration
└── DEPLOYMENT.md       # This file
```

## Troubleshooting

### Build Issues
- Ensure all dependencies are installed: `npm run install:all`
- Check that the Frontend directory has all required files
- Verify Vite configuration in `Frontend/vite.config.ts`

### Deployment Issues
- Make sure the `dist` directory is created and contains built files
- Check that Render is looking for the correct publish directory (`dist`)
- Verify environment variables are set correctly in Render dashboard

### Google Sheets Integration
- Ensure service account credentials are properly configured
- Check that the Google Sheet ID is correct
- Verify the service account has access to the Google Sheet

## Environment Variables

### Frontend
No environment variables required for basic deployment.

### Backend
- `NODE_ENV`: Set to `production` for production deployment
- `PORT`: Port number for the server (Render will set this automatically)
- `GOOGLE_SHEET_ID`: ID of your Google Sheet
- `GOOGLE_SERVICE_ACCOUNT_EMAIL`: Email of your Google service account
- `GOOGLE_PRIVATE_KEY`: Private key of your Google service account

## Security Notes
- Never commit Google Sheets credentials to version control
- Use environment variables for sensitive data
- The `disaster-management312-be80c55826f0.json` file should be in `.gitignore`
