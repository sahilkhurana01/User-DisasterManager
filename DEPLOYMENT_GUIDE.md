# Disaster Management App - Deployment Guide

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git

### Local Development

1. **Clone and Install Dependencies**
   ```bash
   git clone <your-repo-url>
   cd disaster-management
   npm run install:all
   ```

2. **Start Development Servers**
   ```bash
   # Terminal 1 - Backend
   cd Backend
   npm run dev:simple

   # Terminal 2 - Frontend  
   cd Frontend
   npm run dev
   ```

3. **Access the Application**
   - Frontend: http://localhost:8081
   - Backend API: http://localhost:3001
   - Health Check: http://localhost:3001/health

### Docker Development

```bash
# Start both services
docker-compose up

# Or start in background
docker-compose up -d
```

## 🌐 Production Deployment

### Option 1: Render.com (Recommended)

1. **Connect Repository**
   - Connect your GitHub repository to Render
   - The `render.yaml` file will automatically configure both services

2. **Set Environment Variables**
   - Go to your backend service dashboard
   - Add environment variables:
     ```
     NODE_ENV=production
     CORS_ORIGIN=https://your-frontend-url.onrender.com
     GOOGLE_MAPS_API_KEY=your-api-key
     ```

3. **Deploy**
   - Render will automatically build and deploy both services
   - Backend: `https://your-backend-name.onrender.com`
   - Frontend: `https://your-frontend-name.onrender.com`

### Option 2: Vercel (Frontend) + Railway (Backend)

1. **Deploy Frontend to Vercel**
   ```bash
   cd Frontend
   npm install -g vercel
   vercel --prod
   ```

2. **Deploy Backend to Railway**
   ```bash
   cd Backend
   # Connect to Railway and deploy
   ```

### Option 3: Self-Hosted

1. **Build Frontend**
   ```bash
   cd Frontend
   npm run build
   ```

2. **Deploy Backend**
   ```bash
   cd Backend
   npm run start:simple
   ```

3. **Serve Frontend**
   ```bash
   # Use nginx, apache, or any static file server
   # Serve Frontend/dist directory
   ```

## 🔧 Configuration

### Environment Variables

#### Backend (.env)
```env
PORT=3001
NODE_ENV=production
CORS_ORIGIN=https://your-frontend-domain.com
GOOGLE_MAPS_API_KEY=your-google-maps-api-key
```

#### Frontend (.env)
```env
VITE_API_BASE_URL=https://your-backend-domain.com
```

### Google Maps API Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Enable Places API
3. Create API key
4. Restrict API key to your domains
5. Add to environment variables

## 📱 PWA Features

The app includes:
- ✅ Service Worker for offline functionality
- ✅ Web App Manifest for installation
- ✅ Push notifications
- ✅ Background sync
- ✅ Offline data storage

## 🔒 Security Considerations

1. **API Keys**: Never commit API keys to version control
2. **CORS**: Configure CORS origins for production domains
3. **HTTPS**: Always use HTTPS in production
4. **Environment Variables**: Use secure environment variable management

## 🐛 Troubleshooting

### Common Issues

1. **CORS Errors**
   - Ensure backend CORS_ORIGIN includes your frontend URL
   - Check that both services are running

2. **Port Conflicts**
   - Backend: 3001
   - Frontend: 8081
   - Change ports in respective config files if needed

3. **Build Failures**
   - Ensure Node.js 18+ is installed
   - Clear node_modules and reinstall: `rm -rf node_modules && npm install`

### Health Checks

- Backend: `GET /health`
- Frontend: Check if serving static files

## 📊 Monitoring

### Backend Logs
```bash
# View logs
docker-compose logs backend

# Follow logs
docker-compose logs -f backend
```

### Frontend Logs
```bash
# View logs  
docker-compose logs frontend

# Follow logs
docker-compose logs -f frontend
```

## 🚀 Performance Optimization

1. **Frontend**
   - Code splitting (already configured)
   - Image optimization
   - Service worker caching

2. **Backend**
   - Response compression
   - Database connection pooling
   - Rate limiting

## 📝 API Documentation

### Endpoints

- `GET /health` - Health check
- `POST /api/users` - Create/update user
- `GET /api/users/:phone/alerts` - Get user alert status
- `PUT /api/users/:phone/alerts` - Update alert status
- `POST /api/sos` - Send SOS alert
- `GET /api/places/nearby` - Get nearby places

### Example Usage

```javascript
// Send SOS alert
fetch('https://your-backend.com/api/sos', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    phone: '1234567890',
    coordinates: [40.7589, -73.9851],
    accuracy: '10m'
  })
});
```

## 🎯 Next Steps

1. Set up monitoring and logging
2. Implement database persistence
3. Add authentication and authorization
4. Set up CI/CD pipeline
5. Add comprehensive testing
6. Implement backup strategies

---

**Need Help?** Check the troubleshooting section or create an issue in the repository.
