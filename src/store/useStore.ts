import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

export interface DisasterZone {
  id: string;
  type: 'flood' | 'earthquake' | 'wildfire' | 'hurricane' | 'tornado';
  severity: 'low' | 'medium' | 'high' | 'critical';
  coordinates: [number, number][];
  title: string;
  description: string;
  lastUpdated: string;
}

export interface SafeZone {
  id: string;
  name: string;
  type: string;
  coordinates: [number, number];
  capacity: number;
  available: boolean;
  distance?: number;
  tags: string[];
  contact?: string;
}

export interface UserLocation {
  lat: number;
  lng: number;
  accuracy?: number;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  severity: 'info' | 'warning' | 'critical';
  timestamp: string;
  read: boolean;
  location?: [number, number];
}

export interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  type: 'emergency' | 'family' | 'medical' | 'authority';
  icon?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  emergencyContact: string;
  medicalInfo: string;
  lastUpdated: string;
}

interface AppState {
  // Location & Map
  userLocation: UserLocation | null;
  disasterZones: DisasterZone[];
  safeZones: SafeZone[];
  
  // UI State
  isLocationPermissionGranted: boolean;
  isOffline: boolean;
  
  // Emergency
  emergencyContacts: EmergencyContact[];
  notifications: Notification[];
  unreadCount: number;
  
  // User Profile
  userProfile: UserProfile | null;
  
  // Actions
  setUserLocation: (location: UserLocation | null) => void;
  setLocationPermission: (granted: boolean) => void;
  setDisasterZones: (zones: DisasterZone[]) => void;
  setSafeZones: (zones: SafeZone[]) => void;
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  markNotificationRead: (id: string) => void;
  setOfflineStatus: (offline: boolean) => void;
  
  // User Profile Actions
  setUserProfile: (profile: UserProfile | null) => void;
  updateUserProfile: (profile: Partial<UserProfile>) => void;
}

export const useStore = create<AppState>()(
  subscribeWithSelector((set, get) => ({
    // Initial State
    userLocation: null,
    disasterZones: [],
    safeZones: [],
    isLocationPermissionGranted: false,
    isOffline: false,
    emergencyContacts: [
      {
        id: '1',
        name: 'Emergency Services',
        phone: '911',
        type: 'emergency',
        icon: '🚨'
      },
      {
        id: '2',
        name: 'Fire Department',
        phone: '911',
        type: 'emergency',
        icon: '🚒'
      },
      {
        id: '3',
        name: 'Police',
        phone: '911',
        type: 'emergency',
        icon: '👮‍♂️'
      },
      {
        id: '4',
        name: 'Poison Control',
        phone: '1-800-222-1222',
        type: 'medical',
        icon: '☠️'
      }
    ],
    notifications: [],
    unreadCount: 0,
    userProfile: null,

    // Actions
    setUserLocation: (location) => set({ userLocation: location }),
    
    setLocationPermission: (granted) => set({ isLocationPermissionGranted: granted }),
    
    setDisasterZones: (zones) => set({ disasterZones: zones }),
    
    setSafeZones: (zones) => set({ safeZones: zones }),
    
    addNotification: (notification) => set((state) => {
      const newNotification: Notification = {
        ...notification,
        id: Date.now().toString(),
      };
      return {
        notifications: [newNotification, ...state.notifications],
        unreadCount: state.unreadCount + 1
      };
    }),
    
    markNotificationRead: (id) => set((state) => ({
      notifications: state.notifications.map(n => 
        n.id === id ? { ...n, read: true } : n
      ),
      unreadCount: Math.max(0, state.unreadCount - 1)
    })),
    
    setOfflineStatus: (offline) => set({ isOffline: offline }),
    
    // User Profile Actions
    setUserProfile: (profile) => set({ userProfile: profile }),
    
    updateUserProfile: (profile) => set((state) => ({
      userProfile: state.userProfile ? { ...state.userProfile, ...profile } : null
    }))
  }))
);

// Derived selectors
export const useLocationPermission = () => useStore((state) => state.isLocationPermissionGranted);
export const useUserLocation = () => useStore((state) => state.userLocation);
export const useDisasterZones = () => useStore((state) => state.disasterZones);
export const useSafeZones = () => useStore((state) => state.safeZones);
export const useNotifications = () => useStore((state) => state.notifications);
export const useUnreadCount = () => useStore((state) => state.unreadCount);
export const useEmergencyContacts = () => useStore((state) => state.emergencyContacts);
export const useOfflineStatus = () => useStore((state) => state.isOffline);
export const useUserProfile = () => useStore((state) => state.userProfile);