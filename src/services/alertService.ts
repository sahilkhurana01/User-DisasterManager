import { toast } from '@/hooks/use-toast';
import { useStore } from '@/store/useStore';

export interface AlertStatus {
  phone: string;
  alertStatus: 'green' | 'red';
  timestamp: string;
}

class AlertService {
  private readonly API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';
  private checkInterval: NodeJS.Timeout | null = null;
  private lastAlertStatus: 'green' | 'red' = 'green';
  private userPhone: string | null = null;

  // Start monitoring alerts for a specific user
  startMonitoring(phone: string) {
    this.userPhone = phone;
    this.lastAlertStatus = 'green';
    
    // Check immediately
    this.checkAlerts();
    
    // Then check every 30 seconds
    this.checkInterval = setInterval(() => {
      this.checkAlerts();
    }, 30000);
    
    console.log(`Started alert monitoring for user: ${phone}`);
  }

  // Stop monitoring
  stopMonitoring() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
    this.userPhone = null;
    console.log('Stopped alert monitoring');
  }

  // Check alerts from Google Sheets
  private async checkAlerts() {
    if (!this.userPhone) return;

    try {
      const response = await fetch(`${this.API_BASE_URL}/api/users/${encodeURIComponent(this.userPhone)}/alerts`);
      
      if (!response.ok) {
        console.error('Failed to fetch alert status:', response.status);
        return;
      }

      const data: AlertStatus = await response.json();
      
      // Check if alert status changed from green to red
      if (this.lastAlertStatus === 'green' && data.alertStatus === 'red') {
        this.handleRedAlert(data);
      }
      
      // Update last known status
      this.lastAlertStatus = data.alertStatus;
      
    } catch (error) {
      console.error('Error checking alerts:', error);
    }
  }

  // Handle red alert
  private handleRedAlert(alertData: AlertStatus) {
    console.log('🚨 RED ALERT DETECTED!', alertData);
    
    // Show toast notification
    toast({
      title: "🚨 DANGER ALERT",
      description: "Emergency situation detected in your area! Please check notifications for details.",
      variant: "destructive",
      duration: 10000, // Show for 10 seconds
    });

    // Add notification to store
    const { addNotification } = useStore.getState();
    addNotification({
      title: "🚨 Emergency Alert",
      message: "Danger has been detected in your area. Please stay alert and follow emergency procedures.",
      severity: "critical",
      timestamp: alertData.timestamp,
      read: false,
    });

    // Trigger browser notification if permission granted
    this.showBrowserNotification();
  }

  // Show browser notification
  private showBrowserNotification() {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('🚨 Emergency Alert', {
        body: 'Danger detected in your area! Check the app for details.',
        icon: '/favicon.ico',
        tag: 'emergency-alert',
        requireInteraction: true,
      });
    } else if ('Notification' in window && Notification.permission !== 'denied') {
      // Request permission
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          this.showBrowserNotification();
        }
      });
    }
  }

  // Update alert status (for testing)
  async updateAlertStatus(phone: string, status: 'green' | 'red'): Promise<boolean> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/api/users/${encodeURIComponent(phone)}/alerts`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ alertStatus: status }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Alert status updated:', result);
      return true;
    } catch (error) {
      console.error('Error updating alert status:', error);
      return false;
    }
  }

  // Get current alert status
  async getAlertStatus(phone: string): Promise<AlertStatus | null> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/api/users/${encodeURIComponent(phone)}/alerts`);
      
      if (!response.ok) {
        if (response.status === 404) {
          return null; // User not found
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching alert status:', error);
      return null;
    }
  }
}

export const alertService = new AlertService();
