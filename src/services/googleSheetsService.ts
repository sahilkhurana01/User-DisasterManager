import { UserProfile } from '@/store/useStore';

export interface OnboardingData {
  phone: string;
  email: string;
  city: string;
  locality: string;
  fullAddress: string;
}

export interface PunjabCity {
  name: string;
  localities: string[];
}

// Punjab cities and their localities
export const PUNJAB_CITIES: PunjabCity[] = [
  {
    name: "Amritsar",
    localities: ["Golden Temple", "Hall Bazaar", "Lawrence Road", "Ranjit Avenue", "Green Avenue", "Batala Road", "Ajnala Road", "Verka"]
  },
  {
    name: "Ludhiana",
    localities: ["Model Town", "Civil Lines", "Gill Road", "Ferozepur Road", "Dugri", "Sarabha Nagar", "BRS Nagar", "Punjabi Bagh"]
  },
  {
    name: "Jalandhar",
    localities: ["Model Town", "Civil Lines", "Nakodar Road", "Phagwara Road", "Adampur", "Kartarpur", "Nawanshahr", "Phillaur"]
  },
  {
    name: "Patiala",
    localities: ["Model Town", "Civil Lines", "Rajpura Road", "Sangrur Road", "Nabha", "Samana", "Rajpura", "Dudhansadhan"]
  },
  {
    name: "Bathinda",
    localities: ["Model Town", "Civil Lines", "Mansa Road", "Sangrur Road", "Rampura", "Talwandi Sabo", "Maur", "Bhucho"]
  },
  {
    name: "Mohali",
    localities: ["Phase 1", "Phase 2", "Phase 3A", "Phase 3B", "Phase 4", "Phase 5", "Phase 6", "Phase 7", "Phase 8", "Phase 9", "Phase 10", "Kharar", "Zirakpur"]
  },
  {
    name: "Firozpur",
    localities: ["Civil Lines", "Guru Gobind Singh Nagar", "Railway Road", "Basti Sheikh", "Basti Nau", "Makhu", "Zira", "Moga"]
  },
  {
    name: "Batala",
    localities: ["Civil Lines", "Railway Road", "Batala Road", "Qadian", "Dera Baba Nanak", "Kalanaur", "Dhariwal", "Fatehgarh Churian"]
  },
  {
    name: "Moga",
    localities: ["Civil Lines", "Railway Road", "Baghapurana", "Nihal Singh Wala", "Dharamkot", "Kot Ise Khan", "Badhni", "Muktsar"]
  },
  {
    name: "Abohar",
    localities: ["Civil Lines", "Railway Road", "Fazilka", "Malout", "Gidderbaha", "Lambi", "Muktsar", "Kotkapura"]
  },
  {
    name: "Malerkotla",
    localities: ["Civil Lines", "Railway Road", "Ahmedgarh", "Raikot", "Payal", "Doraha", "Khanna", "Samrala"]
  },
  {
    name: "Khanna",
    localities: ["Civil Lines", "Railway Road", "Samrala", "Payal", "Doraha", "Ahmedgarh", "Malerkotla", "Raikot"]
  },
  {
    name: "Phagwara",
    localities: ["Civil Lines", "Railway Road", "Nakodar", "Mehatpur", "Banga", "Nawanshahr", "Rahon", "Balachaur"]
  },
  {
    name: "Muktsar",
    localities: ["Civil Lines", "Railway Road", "Malout", "Gidderbaha", "Lambi", "Kotkapura", "Faridkot", "Jaito"]
  },
  {
    name: "Barnala",
    localities: ["Civil Lines", "Railway Road", "Tapa", "Sehna", "Mehal Kalan", "Handiaya", "Dhanaula", "Bhadaur"]
  },
  {
    name: "Rajpura",
    localities: ["Civil Lines", "Railway Road", "Patiala Road", "Chandigarh Road", "Dudhansadhan", "Samana", "Nabha", "Patiala"]
  },
  {
    name: "Fatehgarh Sahib",
    localities: ["Civil Lines", "Railway Road", "Sirhind", "Bassi Pathana", "Khamano", "Mandi Gobindgarh", "Amloh", "Malaud"]
  },
  {
    name: "Kapurthala",
    localities: ["Civil Lines", "Railway Road", "Sultanpur Lodhi", "Phagwara", "Nakodar", "Banga", "Mehatpur", "Rahon"]
  },
  {
    name: "Sangrur",
    localities: ["Civil Lines", "Railway Road", "Sunam", "Lehra", "Dirba", "Bhawanigarh", "Longowal", "Ahmedgarh"]
  },
  {
    name: "Faridkot",
    localities: ["Civil Lines", "Railway Road", "Kotkapura", "Jaitu", "Jaito", "Muktsar", "Malout", "Gidderbaha"]
  }
];

class GoogleSheetsService {
  private readonly SHEET_ID = '1W82kmjNEDbnUPtyc1rjz24CjUn5V1RKZmlF6Ym9B2_A';
  private readonly USERS_SHEET_NAME = 'Users Info';
  private readonly API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

  async saveUserData(data: OnboardingData): Promise<boolean> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/api/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone: data.phone,
          email: data.email,
          city: data.city,
          locality: data.locality,
          fullAddress: data.fullAddress,
          timestamp: new Date().toISOString()
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('User data saved to Google Sheets:', result);
      return true;
    } catch (error) {
      console.error('Error saving user data to Google Sheets:', error);
      return false;
    }
  }

  async getUserData(phone: string): Promise<OnboardingData | null> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/api/users/${encodeURIComponent(phone)}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          return null; // User not found
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return {
        phone: data.phone,
        email: data.email,
        city: data.city,
        locality: data.locality,
        fullAddress: data.fullAddress
      };
    } catch (error) {
      console.error('Error fetching user data from Google Sheets:', error);
      return null;
    }
  }

  async updateUserData(phone: string, data: Partial<OnboardingData>): Promise<boolean> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/api/users/${encodeURIComponent(phone)}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          timestamp: new Date().toISOString()
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      console.log('User data updated in Google Sheets');
      return true;
    } catch (error) {
      console.error('Error updating user data in Google Sheets:', error);
      return false;
    }
  }

  // Helper method to convert onboarding data to user profile
  convertToUserProfile(data: OnboardingData): UserProfile {
    return {
      id: `user-${data.phone}`,
      name: 'User', // Will be updated later in settings
      email: data.email,
      phone: data.phone,
      address: data.fullAddress,
      emergencyContact: '',
      medicalInfo: '',
      lastUpdated: new Date().toISOString()
    };
  }
}

export const googleSheetsService = new GoogleSheetsService();
