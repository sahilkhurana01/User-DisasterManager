# 🚨 Disaster Management PWA

A comprehensive Progressive Web Application for disaster management with real-time alerts, emergency contacts, and location-based services.

## ✨ Features

- 🚨 **SOS Emergency Alerts** - Send emergency alerts with GPS coordinates
- 📍 **Location Services** - Find nearby safe places and emergency services
- 📱 **PWA Support** - Install as a native app, works offline
- 🔔 **Real-time Notifications** - Push notifications for emergency alerts
- 📞 **Emergency Contacts** - Quick access to emergency services
- 🗺️ **Interactive Maps** - Visualize disaster zones and safe areas
- 🤖 **AI Assistant** - Get disaster preparedness advice
- 📊 **Dashboard** - Monitor alerts and emergency status

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd disaster-management
   ```

2. **Install dependencies**
   ```bash
   npm run install:all
   ```

3. **Start development servers**
   
   **Option A: Using startup scripts**
   ```bash
   # Windows
   start-dev.bat
   
   # Linux/Mac
   chmod +x start-dev.sh
   ./start-dev.sh
   ```
   
   **Option B: Manual start**
   ```bash
   # Terminal 1 - Backend
   cd Backend
   npm run dev:simple
   
   # Terminal 2 - Frontend
   cd Frontend
   npm run dev
   ```

4. **Access the application**
   - Frontend: http://localhost:8081
   - Backend API: http://localhost:3001

## 🏗️ Architecture

### Frontend (React + Vite)
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **UI Library**: Radix UI + Tailwind CSS
- **State Management**: Zustand
- **Routing**: React Router
- **Maps**: Leaflet
- **PWA**: Service Worker + Web App Manifest

### Backend (Node.js + Express)
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **CORS**: Configured for cross-origin requests
- **Storage**: In-memory (can be extended to database)
- **API**: RESTful endpoints

## 📁 Project Structure

```
disaster-management/
├── Frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Application pages
│   │   ├── services/        # API services
│   │   ├── hooks/           # Custom React hooks
│   │   ├── store/           # State management
│   │   └── lib/             # Utility functions
│   ├── public/              # Static assets
│   └── dist/                # Build output
├── Backend/                 # Node.js backend server
│   ├── server.js            # Main server (with Google Sheets)
│   ├── server-simple.js     # Simplified server (in-memory)
│   └── package.json
├── docker-compose.yml       # Docker development setup
├── render.yaml              # Render.com deployment config
├── DEPLOYMENT_GUIDE.md      # Detailed deployment instructions
└── start-dev.*              # Development startup scripts
```

## 🔧 Configuration

### Environment Variables

#### Backend
```env
PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:8081,http://localhost:8080
GOOGLE_MAPS_API_KEY=your-api-key
```

#### Frontend
```env
VITE_API_BASE_URL=http://localhost:3001
```

## 📱 PWA Features

- ✅ **Offline Support** - Works without internet connection
- ✅ **App Installation** - Install as native app on mobile/desktop
- ✅ **Push Notifications** - Real-time emergency alerts
- ✅ **Background Sync** - Sync data when connection restored
- ✅ **Responsive Design** - Works on all device sizes

## 🚀 Deployment

### Option 1: Render.com (Recommended)
1. Connect GitHub repository to Render
2. The `render.yaml` file auto-configures both services
3. Set environment variables in Render dashboard
4. Deploy automatically on git push

### Option 2: Docker
```bash
docker-compose up
```

### Option 3: Manual Deployment
See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed instructions.

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| POST | `/api/users` | Create/update user |
| GET | `/api/users/:phone/alerts` | Get user alert status |
| PUT | `/api/users/:phone/alerts` | Update alert status |
| POST | `/api/sos` | Send SOS alert |
| GET | `/api/places/nearby` | Get nearby places |

## 🧪 Testing

```bash
# Test backend health
curl http://localhost:3001/health

# Test SOS endpoint
curl -X POST http://localhost:3001/api/sos \
  -H "Content-Type: application/json" \
  -d '{"phone":"1234567890","coordinates":[40.7589,-73.9851]}'
```

## 🛠️ Development

### Available Scripts

#### Root Level
- `npm run dev` - Start frontend development server
- `npm run build` - Build frontend for production
- `npm run install:all` - Install all dependencies

#### Backend
- `npm run dev` - Start with nodemon (Google Sheets)
- `npm run dev:simple` - Start simplified server (in-memory)
- `npm run start` - Start production server
- `npm run start:simple` - Start simplified production server

#### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## 🔒 Security

- ✅ CORS properly configured
- ✅ Environment variables for sensitive data
- ✅ Input validation on all endpoints
- ✅ HTTPS enforced in production
- ✅ API key restrictions recommended

## 📊 Performance

- ✅ Code splitting for optimal loading
- ✅ Service worker caching
- ✅ Image optimization
- ✅ Bundle size optimization
- ✅ Lazy loading components

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

- 📖 Check [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for deployment help
- 🐛 Report issues in the GitHub repository
- 💬 Join our community discussions

## 🎯 Roadmap

- [ ] Database integration (PostgreSQL/MongoDB)
- [ ] User authentication and authorization
- [ ] Real-time chat for emergency coordination
- [ ] Advanced mapping features
- [ ] Mobile app (React Native)
- [ ] Multi-language support
- [ ] Advanced analytics dashboard

---

**Built with ❤️ for emergency preparedness and disaster management**