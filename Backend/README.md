# Disaster Management Backend

Backend server for the Disaster Management PWA with Google Sheets integration.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set environment variables:
```bash
export GOOGLE_SHEET_ID=1W82kmjNEDbnUPtyc1rjz24CjUn5V1RKZmlF6Ym9B2_A
export GOOGLE_APPLICATION_CREDENTIALS=./disaster-management312-be80c55826f0.json
export PORT=3000
```

3. Start the server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

## API Endpoints

- `GET /health` - Health check
- `POST /api/users` - Create/update user data
- `GET /api/users/:phone` - Get user data by phone
- `PUT /api/users/:phone` - Update user data
- `GET /api/users` - Get all users (admin)

## Google Sheets Integration

The server automatically creates a "Users Info" sheet with the following columns:
- Phone
- Email
- City
- Locality
- Full Address
- Timestamp

## Environment Variables

- `GOOGLE_SHEET_ID` - Google Sheets document ID
- `GOOGLE_APPLICATION_CREDENTIALS` - Path to service account JSON file
- `PORT` - Server port (default: 3000)
