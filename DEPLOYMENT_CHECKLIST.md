# Deployment Checklist for Disaster Management App

## Pre-Deployment Checklist

### ✅ Frontend Configuration
- [x] Vite config updated with proper build output directory (`../dist`)
- [x] Bundle size optimization with manual chunks
- [x] Build scripts configured in root package.json
- [x] Router context issue fixed (OnboardingPage wrapped in BrowserRouter)

### ✅ Backend Configuration
- [x] Environment variable handling improved
- [x] CORS configuration added
- [x] Health check endpoint added
- [x] Error handling improved for production

### ✅ Deployment Files Created
- [x] `render.yaml` - Render deployment configuration
- [x] `DEPLOYMENT.md` - Detailed deployment guide
- [x] `build.sh` / `build.bat` - Build scripts
- [x] `Backend/env.example` - Environment variables template

## Render Deployment Steps

### 1. Frontend Deployment (Static Site)
1. Go to Render Dashboard
2. Click "New +" → "Static Site"
3. Connect your GitHub repository
4. Configure:
   - **Name**: `disaster-management-frontend`
   - **Build Command**: `npm run build`
   - **Publish Directory**: `dist`
   - **Node Version**: 18 (or latest)

### 2. Backend Deployment (Web Service)
1. Go to Render Dashboard
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: `disaster-management-backend`
   - **Build Command**: `cd Backend && npm install`
   - **Start Command**: `cd Backend && npm start`
   - **Node Version**: 18 (or latest)
5. Set Environment Variables:
   - `NODE_ENV`: `production`
   - `GOOGLE_SHEET_ID`: Your Google Sheet ID
   - `GOOGLE_SERVICE_ACCOUNT_EMAIL`: Your service account email
   - `GOOGLE_PRIVATE_KEY`: Your service account private key
   - `CORS_ORIGIN`: Your frontend URL (e.g., `https://your-frontend.onrender.com`)

## Testing Deployment

### Frontend
- [ ] Visit the deployed frontend URL
- [ ] Check that the app loads without errors
- [ ] Test onboarding flow
- [ ] Verify all pages are accessible

### Backend
- [ ] Visit `https://your-backend.onrender.com/health`
- [ ] Should return: `{"status": "OK", "timestamp": "...", "environment": "production"}`
- [ ] Test API endpoints if available

## Troubleshooting

### Common Issues
1. **Build fails**: Check that all dependencies are installed
2. **Frontend not loading**: Verify publish directory is set to `dist`
3. **Backend not starting**: Check environment variables are set correctly
4. **CORS errors**: Ensure `CORS_ORIGIN` is set to your frontend URL

### Environment Variables
Make sure these are set in Render dashboard:
- `NODE_ENV`: `production`
- `GOOGLE_SHEET_ID`: Your actual Google Sheet ID
- `GOOGLE_SERVICE_ACCOUNT_EMAIL`: Your service account email
- `GOOGLE_PRIVATE_KEY`: Your service account private key (with proper formatting)

## Post-Deployment
- [ ] Update frontend API configuration to point to backend URL
- [ ] Test full application flow
- [ ] Monitor logs for any errors
- [ ] Set up monitoring/alerting if needed
