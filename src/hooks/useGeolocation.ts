import { useState, useEffect, useCallback } from 'react';
import { useStore, UserLocation } from '@/store/useStore';
import { toast } from '@/hooks/use-toast';

interface GeolocationState {
  location: UserLocation | null;
  error: string | null;
  loading: boolean;
  permission: PermissionState | null;
}

export function useGeolocation() {
  const [state, setState] = useState<GeolocationState>({
    location: null,
    error: null,
    loading: true,
    permission: null
  });

  const { setUserLocation, setLocationPermission } = useStore();

  const updateLocation = useCallback((position: GeolocationPosition) => {
    const location: UserLocation = {
      lat: position.coords.latitude,
      lng: position.coords.longitude,
      accuracy: position.coords.accuracy
    };
    
    setUserLocation(location);
    setState(prev => ({
      ...prev,
      location,
      error: null,
      loading: false
    }));
  }, [setUserLocation]);

  const updateError = useCallback((error: GeolocationPositionError) => {
    let errorMessage = 'Unable to retrieve your location.';
    
    switch (error.code) {
      case error.PERMISSION_DENIED:
        errorMessage = 'Location permission denied. Please enable location access in your browser settings.';
        setLocationPermission(false);
        break;
      case error.POSITION_UNAVAILABLE:
        errorMessage = 'Location information is unavailable.';
        break;
      case error.TIMEOUT:
        errorMessage = 'Location request timed out.';
        break;
    }

    setState(prev => ({
      ...prev,
      error: errorMessage,
      loading: false
    }));

    toast({
      title: "Location Error",
      description: errorMessage,
      variant: "destructive"
    });
  }, [setLocationPermission]);

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      updateError({
        code: 2,
        message: 'Geolocation is not supported by this browser.',
        PERMISSION_DENIED: 1,
        POSITION_UNAVAILABLE: 2,
        TIMEOUT: 3
      } as GeolocationPositionError);
      return;
    }

    setState(prev => ({ ...prev, loading: true, error: null }));

    const options: PositionOptions = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 300000 // 5 minutes
    };

    navigator.geolocation.getCurrentPosition(
      updateLocation,
      updateError,
      options
    );
  }, [updateLocation, updateError]);

  const watchLocation = useCallback(() => {
    if (!navigator.geolocation) return null;

    const options: PositionOptions = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 60000 // 1 minute
    };

    return navigator.geolocation.watchPosition(
      updateLocation,
      updateError,
      options
    );
  }, [updateLocation, updateError]);

  // Check permission status
  useEffect(() => {
    if ('permissions' in navigator) {
      navigator.permissions.query({ name: 'geolocation' })
        .then(permission => {
          setState(prev => ({ ...prev, permission: permission.state }));
          setLocationPermission(permission.state === 'granted');

          permission.addEventListener('change', () => {
            setState(prev => ({ ...prev, permission: permission.state }));
            setLocationPermission(permission.state === 'granted');
            
            if (permission.state === 'granted') {
              requestLocation();
            }
          });
        });
    }
  }, [requestLocation, setLocationPermission]);

  // Initial location request
  useEffect(() => {
    requestLocation();
  }, [requestLocation]);

  return {
    ...state,
    requestLocation,
    watchLocation
  };
}