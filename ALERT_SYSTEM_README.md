# Disaster Management Alert System

## Overview
This alert system monitors user alert status from Google Sheets and provides real-time notifications and danger visualization in the disaster management app.

## Features Implemented

### 1. Logout Functionality ✅
- Added logout button in Settings page
- Clears all local storage and redirects to onboarding
- Allows switching between different users on the same device

### 2. Alert Monitoring System ✅
- Monitors Google Sheets "Alerts" column every 30 seconds
- Checks for changes from "green" to "red" status
- Automatically starts monitoring when user completes onboarding

### 3. Toast Notifications ✅
- Shows emergency toast when alert status changes to "red"
- Toast appears for 10 seconds with destructive styling
- Includes browser notifications (if permission granted)

### 4. Notification Page Integration ✅
- Real-time notifications added to notification page
- Combines mock notifications with live alert notifications
- Critical severity notifications for emergency alerts

### 5. Danger Zone Visualization ✅
- Animated red circles/waves on map when danger is active
- Expanding circle animation effect
- Visual indicator in map legend
- Automatically clears when alert returns to "green"

## How to Test

### Method 1: Using the App Interface
1. Complete onboarding with a phone number
2. Go to Settings page
3. Use the "Alert Testing Panel" to:
   - Enter a phone number
   - Click "Set Red Alert" to trigger danger mode
   - Click "Set Green Alert" to clear danger mode

### Method 2: Using Backend API
```bash
# Set alert to RED (triggers danger mode)
curl -X PUT http://localhost:4000/api/users/1234567890/alerts \
  -H "Content-Type: application/json" \
  -d '{"alertStatus": "red"}'

# Set alert to GREEN (clears danger mode)
curl -X PUT http://localhost:4000/api/users/1234567890/alerts \
  -H "Content-Type: application/json" \
  -d '{"alertStatus": "green"}'
```

### Method 3: Using Test Script
```bash
cd Backend
node test-alerts.js
```

## Google Sheets Structure
The system expects a "Users Info" sheet with these columns:
- Phone No.
- Area
- City
- Alerts (green/red)
- Email
- Full Address
- Timestamp

## Technical Implementation

### Backend Endpoints
- `GET /api/users/:phone/alerts` - Get current alert status
- `PUT /api/users/:phone/alerts` - Update alert status

### Frontend Services
- `alertService.ts` - Handles alert monitoring and API calls
- `useStore.ts` - Manages alert state and danger zones
- `MapComponent.tsx` - Renders danger zone visualization

### Key Components
- Alert monitoring runs every 30 seconds
- Toast notifications use react-toastify
- Danger zones use Leaflet circles with animation
- Browser notifications require user permission

## Alert Flow
1. User completes onboarding → Alert monitoring starts
2. System checks Google Sheets every 30 seconds
3. If alert changes from green → red:
   - Toast notification appears
   - Browser notification (if permitted)
   - Danger zone added to map
   - Notification added to notifications page
4. If alert changes from red → green:
   - Danger zones cleared
   - Danger mode deactivated

## Testing Different Users
1. Complete onboarding with User A
2. Go to Settings → Click "Logout & Switch User"
3. Complete onboarding with User B
4. Test alerts for User B
5. Repeat for additional users

## Notes
- Alert monitoring automatically starts for logged-in users
- Danger visualization uses default coordinates (can be customized)
- All alert changes are logged to console
- System handles network errors gracefully
