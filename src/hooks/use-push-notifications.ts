import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface PushSubscription {
  endpoint: string;
  keys: {
    auth: string;
    p256dh: string;
  };
}

export const usePushNotifications = () => {
  const [isSupported, setIsSupported] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);
  const [subscription, setSubscription] = useState<PushSubscription | null>(null);
  const [vapidPublicKey, setVapidPublicKey] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    checkSupport();
    registerServiceWorker();
    fetchVapidPublicKey();
  }, []);

  const checkSupport = () => {
    const supported = 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window;
    setIsSupported(supported);
    return supported;
  };

  const fetchVapidPublicKey = async () => {
    try {
      // TODO: Replace with actual backend API call
      // For now, set a mock VAPID key to allow testing
      const mockVapidKey = 'BCrMJj9_y5I0xqUWU3hN-OXX8cGQfU5bWDxpqKpbOOq-NJFT5IWZHKvKBXq5KxvKYXB_kKxgPQYBaQy1I0xqUWU';
      setVapidPublicKey(mockVapidKey);
      console.log('Mock VAPID public key set');
    } catch (error) {
      console.error('Error setting mock VAPID public key:', error);
    }
  };

  const registerServiceWorker = async () => {
    if (!checkSupport()) return;

    try {
      const reg = await navigator.serviceWorker.register('/sw.js');
      setRegistration(reg);
      
      // Check if already subscribed
      const existingSubscription = await reg.pushManager.getSubscription();
      if (existingSubscription) {
        setIsSubscribed(true);
        const subscriptionData: PushSubscription = {
          endpoint: existingSubscription.endpoint,
          keys: {
            auth: btoa(String.fromCharCode(...new Uint8Array(existingSubscription.getKey('auth')!))),
            p256dh: btoa(String.fromCharCode(...new Uint8Array(existingSubscription.getKey('p256dh')!)))
          }
        };
        setSubscription(subscriptionData);
      }
    } catch (error) {
      console.error('Service worker registration failed:', error);
      toast({
        title: "Service Worker Error",
        description: "Failed to register service worker for push notifications.",
        variant: "destructive"
      });
    }
  };

  const requestPermission = async (): Promise<NotificationPermission> => {
    if (!isSupported) {
      throw new Error('Push notifications are not supported');
    }

    // Check current permission status first
    const currentPermission = Notification.permission;
    console.log('Current notification permission:', currentPermission);

    if (currentPermission === 'granted') {
      return 'granted';
    }

    if (currentPermission === 'denied') {
      throw new Error('Notifications are blocked. Please enable them in your browser settings.');
    }

    // Request permission
    const permission = await Notification.requestPermission();
    console.log('Permission request result:', permission);
    return permission;
  };

  const subscribeToPushNotifications = async (): Promise<PushSubscription | null> => {
    if (isLoading) return null;
    
    setIsLoading(true);
    
    try {
      // Check if service worker is ready
      if (!registration) {
        throw new Error('Service worker not registered. Please refresh the page and try again.');
      }

      if (!vapidPublicKey) {
        throw new Error('VAPID public key not available. Please try again later.');
      }

      console.log('Requesting notification permission...');
      const permission = await requestPermission();
      
      if (permission !== 'granted') {
        const message = permission === 'denied' 
          ? "Notifications are blocked. Please enable them in your browser settings and refresh the page."
          : "Push notifications require permission to work. Please allow notifications when prompted.";
        
        toast({
          title: "Permission Required",
          description: message,
          variant: "destructive"
        });
        return null;
      }

      console.log('Subscribing to push manager...');
      
      // Convert VAPID key for browser compatibility
      const urlBase64ToUint8Array = (base64String: string) => {
        const padding = '='.repeat((4 - base64String.length % 4) % 4);
        const base64 = (base64String + padding)
          .replace(/-/g, '+')
          .replace(/_/g, '/');

        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);

        for (let i = 0; i < rawData.length; ++i) {
          outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
      };

      const pushSubscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidPublicKey)
      });

      const subscriptionData: PushSubscription = {
        endpoint: pushSubscription.endpoint,
        keys: {
          auth: btoa(String.fromCharCode(...new Uint8Array(pushSubscription.getKey('auth')!))),
          p256dh: btoa(String.fromCharCode(...new Uint8Array(pushSubscription.getKey('p256dh')!)))
        }
      };

      // TODO: Store subscription in backend
      // For now, just log the subscription data
      console.log('Mock subscription storage:', subscriptionData);

      setIsSubscribed(true);
      setSubscription(subscriptionData);

      toast({
        title: "Push Notifications Enabled! 🔔",
        description: "You'll now receive push notifications for important updates.",
      });

      return subscriptionData;
    } catch (error: any) {
      console.error('Failed to subscribe to push notifications:', error);
      toast({
        title: "Subscription Failed",
        description: error.message || "Failed to enable push notifications. Please try again.",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const unsubscribeFromPushNotifications = async (): Promise<boolean> => {
    if (isLoading) return false;
    
    setIsLoading(true);
    
    try {
      if (!registration) {
        throw new Error('Service worker not registered');
      }

      const pushSubscription = await registration.pushManager.getSubscription();
      if (pushSubscription) {
        // TODO: Remove from backend
        // For now, just log the unsubscription
        if (subscription?.endpoint) {
          console.log('Mock subscription removal:', subscription.endpoint);
        }

        // Unsubscribe from browser
        await pushSubscription.unsubscribe();
      }

      setIsSubscribed(false);
      setSubscription(null);

      toast({
        title: "Push Notifications Disabled",
        description: "You will no longer receive push notifications.",
      });

      return true;
    } catch (error: any) {
      console.error('Failed to unsubscribe from push notifications:', error);
      toast({
        title: "Unsubscription Failed",
        description: error.message || "Failed to disable push notifications. Please try again.",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const sendTestPushNotification = async () => {
    if (!isSubscribed || !subscription) {
      toast({
        title: "Not Subscribed",
        description: "Please enable push notifications first.",
        variant: "destructive"
      });
      return;
    }

    if (isLoading) return;
    setIsLoading(true);

    try {
      // TODO: Implement actual test notification sending
      // For now, just show a mock success message
      
      toast({
        title: "Test Notification Sent! 🚀",
        description: "Mock test notification sent. Check your notifications!",
      });
    } catch (error: any) {
      console.error('Failed to send test notification:', error);
      toast({
        title: "Test Failed",
        description: "Failed to send test notification (mock).",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isSupported,
    isSubscribed,
    isLoading,
    subscription,
    registration,
    vapidPublicKey,
    requestPermission,
    subscribeToPushNotifications,
    unsubscribeFromPushNotifications,
    sendTestPushNotification
  };
};