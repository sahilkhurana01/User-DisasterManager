# 🚨 Disaster Management System

> **Real-time Emergency Response & Community Safety Platform**

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)](https://github.com/your-username/disaster-management)
[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/your-username/disaster-management)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](https://github.com/your-username/disaster-management)
[![PWA](https://img.shields.io/badge/PWA-enabled-purple.svg)](https://github.com/your-username/disaster-management)

---

## 📋 Table of Contents

- [🎯 Overview](#-overview)
- [🏗️ Architecture](#️-architecture)
- [🚀 Quick Start](#-quick-start)
- [🔑 Features](#-features)
- [📁 Project Structure](#-project-structure)
- [⚙️ Configuration](#️-configuration)
- [📊 Roadmap](#-roadmap)
- [📜 License](#-license)

---

## 🎯 Overview

### The Problem
Disaster response is often delayed due to:
- ❌ Lack of real-time communication
- ❌ Fragmented emergency systems
- ❌ Poor accessibility during crises

### Our Solution
A **Progressive Web App (PWA)** that provides:
- ✅ Real-time disaster monitoring & alerts
- ✅ One-tap SOS emergency system
- ✅ Safe place discovery & navigation
- ✅ Community-driven emergency coordination

### Impact
- **Target Users**: Emergency responders, citizens, local governments
- **Goal**: Faster response times, safer communities, global scalability

---

## 🏗️ Architecture

### System Overview
```
┌─────────────────────────────────────────────────────────────┐
│                    Disaster Management System               │
├─────────────────────────────────────────────────────────────┤
│  Frontend (React PWA)     │    Backend (Node.js + Express)  │
│  ──────────────────────   │    ──────────────────────────   │
│  • Real-time Map          │    • Emergency Alerts API       │
│  • SOS Emergency          │    • Google Sheets Database     │
│  • Safe Places Finder     │    • Location Services          │
│  • AI Assistant           │    • Authentication System      │
│  • Offline Support        │    • Push Notifications         │
└─────────────────────────────────────────────────────────────┘
```

### Tech Stack

| Category | Technologies |
|----------|-------------|
| **Frontend** | React, TypeScript, Vite, Tailwind CSS, React Leaflet, Zustand |
| **Backend** | Node.js, Express.js, Google Sheets API |
| **Services** | Google Maps, Places, Directions, Geolocation APIs |

---

## 🚀 Quick Start

### Prerequisites
- [ ] Node.js ≥ 18.0.0
- [ ] npm ≥ 8.0.0
- [ ] Google Maps API key
- [ ] Google Cloud credentials

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/disaster-management.git
   cd disaster-management
   ```

2. **Setup Backend**
   ```bash
   cd Backend
   npm install
   npm start
   ```

3. **Setup Frontend**
   ```bash
   cd ../Frontend
   npm install
   npm run dev
   ```

### Environment Configuration

Create `.env.local` in the Frontend directory:

```env
VITE_API_BASE_URL=http://localhost:4000
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
VITE_GOOGLE_SHEET_ID=your_google_sheet_id
```

---

## 🔑 Features

### 🗺️ Real-time Disaster Monitoring
- **Live Interactive Map**: Real-time disaster alerts and updates
- **GPS Tracking**: Automatic location detection and sharing
- **Alert System**: Instant notifications for nearby emergencies

### 🆘 Emergency SOS
- **One-Tap SOS**: Instant emergency button for quick help
- **Auto-Location**: Automatic sharing of your location with emergency services
- **Contact Integration**: Direct calling to emergency numbers

### 🏥 Safe Places Finder
- **Emergency Facilities**: Hospitals, police stations, fire departments
- **Shelters**: Emergency shelters and safe zones
- **Offline Support**: Cached data for offline access

### 🤖 AI Assistant
- **Safety Tips**: Context-aware safety recommendations
- **Multi-language**: Support for multiple languages
- **Smart Guidance**: AI-powered emergency response guidance

---

## 📁 Project Structure

```
disaster-management/
├── 📁 Frontend/                 # React PWA Application
│   ├── 📁 src/
│   │   ├── 📁 components/       # Reusable UI components
│   │   ├── 📁 pages/           # Application pages
│   │   ├── 📁 services/        # API and external services
│   │   └── 📁 utils/           # Utility functions
│   ├── 📄 package.json
│   └── 📄 vite.config.js
├── 📁 Backend/                  # Node.js Server
│   ├── 📄 server.js            # Main server file
│   ├── 📄 package.json
│   └── 📁 routes/              # API routes
├── 📁 docs/                     # Documentation
└── 📄 README.md
```

---

## ⚙️ Configuration

### Google Maps Setup
1. Get API key from [Google Cloud Console](https://console.cloud.google.com/)
2. Enable required APIs:
   - Maps JavaScript API
   - Places API
   - Directions API
   - Geolocation API

### Google Sheets Integration
1. Create a Google Sheet for data storage
2. Enable Google Sheets API
3. Set up service account credentials
4. Share sheet with service account email

---

## 📊 Roadmap

### Phase 1 (Current)
- [x] Basic PWA functionality
- [x] Real-time map integration
- [x] SOS emergency system
- [x] Safe places finder

### Phase 2 (Next)
- [ ] Mobile app with React Native
- [ ] Push notifications for alerts
- [ ] Enhanced offline capabilities
- [ ] User authentication system

### Phase 3 (Future)
- [ ] AI-powered disaster prediction
- [ ] IoT sensor integration
- [ ] Advanced analytics dashboard
- [ ] Multi-tenant support

---

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

```
MIT License © 2025 Disaster Management System
```

---

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

## 📞 Support

For support and questions:
- 📧 Email: support@disastermanagement.com
- 🐛 Issues: [GitHub Issues](https://github.com/your-username/disaster-management/issues)
- 📖 Documentation: [Wiki](https://github.com/your-username/disaster-management/wiki)

---

<div align="center">

**Made with ❤️ for Emergency Response & Community Safety**

[⬆ Back to Top](#-disaster-management-system)

</div> 