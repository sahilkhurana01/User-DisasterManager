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

class ProfileService {
  private readonly STORAGE_KEY = 'userProfile';
  private readonly API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

  /**
   * Load user profile from storage (localStorage for PWA or API)
   */
  async loadProfile(): Promise<UserProfile | null> {
    try {
      // Try localStorage first (for PWA offline support)
      const localData = localStorage.getItem(this.STORAGE_KEY);
      if (localData) {
        try {
          const profile = JSON.parse(localData);
          console.log('Profile loaded from localStorage:', profile);
          return profile;
        } catch (parseError) {
          console.warn('Failed to parse localStorage profile data:', parseError);
          // Clear corrupted data
          localStorage.removeItem(this.STORAGE_KEY);
        }
      }

      // If no local data, try API (with timeout)
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

        const response = await fetch(`${this.API_BASE_URL}/profile`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            // Add authentication headers here if needed
            // 'Authorization': `Bearer ${token}`
          },
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (response.ok) {
          const profile = await response.json();
          // Cache in localStorage for offline access
          localStorage.setItem(this.STORAGE_KEY, JSON.stringify(profile));
          return profile;
        } else {
          console.warn('API returned non-ok status:', response.status);
        }
      } catch (apiError) {
        if (apiError.name === 'AbortError') {
          console.warn('API request timed out');
        } else {
          console.warn('API request failed:', apiError);
        }
      }

      return null;
    } catch (error) {
      console.error('Error loading profile:', error);
      // Don't throw error, return null instead to allow graceful fallback
      return null;
    }
  }

  /**
   * Save user profile to storage and API
   */
  async saveProfile(profile: UserProfile): Promise<UserProfile> {
    try {
      const updatedProfile = {
        ...profile,
        lastUpdated: new Date().toISOString()
      };

      // Save to localStorage immediately for PWA persistence
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedProfile));

      // Try to sync with API
      try {
        const response = await fetch(`${this.API_BASE_URL}/profile`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            // Add authentication headers here if needed
            // 'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(updatedProfile),
        });

        if (response.ok) {
          const savedProfile = await response.json();
          // Update localStorage with server response
          localStorage.setItem(this.STORAGE_KEY, JSON.stringify(savedProfile));
          console.log('Profile saved to API:', savedProfile);
          return savedProfile;
        } else {
          console.warn('API save failed, but profile saved locally');
        }
      } catch (apiError) {
        console.warn('API unavailable, profile saved locally:', apiError);
      }

      return updatedProfile;
    } catch (error) {
      console.error('Error saving profile:', error);
      throw new Error('Failed to save profile');
    }
  }

  /**
   * Create default profile if none exists
   */
  createDefaultProfile(): UserProfile {
    return {
      id: '1',
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '+1 (555) 123-4567',
      address: '123 Main St, City, State 12345',
      emergencyContact: '+1 (555) 987-6543',
      medicalInfo: 'No known allergies. Blood type: O+',
      lastUpdated: new Date().toISOString()
    };
  }

  /**
   * Validate profile data
   */
  validateProfile(profile: Partial<UserProfile>): { isValid: boolean; errors: Record<string, string> } {
    const errors: Record<string, string> = {};

    if (!profile.name?.trim()) {
      errors.name = 'Name is required';
    }

    if (!profile.email?.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!profile.phone?.trim()) {
      errors.phone = 'Phone number is required';
    } else if (!/^[\+]?[1-9][\d]{0,15}$/.test(profile.phone.replace(/[\s\-\(\)]/g, ''))) {
      errors.phone = 'Please enter a valid phone number';
    }

    if (!profile.address?.trim()) {
      errors.address = 'Address is required';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }

  /**
   * Clear profile data (for logout or reset)
   */
  clearProfile(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }

  /**
   * Check if profile exists
   */
  hasProfile(): boolean {
    return localStorage.getItem(this.STORAGE_KEY) !== null;
  }
}

export const profileService = new ProfileService();
