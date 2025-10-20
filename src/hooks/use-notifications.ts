import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface Notification {
  id: string;
  type: 'partner_request' | 'partner_accepted' | 'partner_rejected' | 'partner_connected' | 'credential_shared' | 'credential_accessed' | 'subscription_renewal' | 'subscription_cost_change' | 'system' | 'security';
  title: string;
  message: string;
  data?: any;
  read: boolean;
  created_at: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  category?: 'partner' | 'subscription' | 'security' | 'system';
  action_url?: string;
}

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const [filter, setFilter] = useState<string>('all');
  const { toast } = useToast();

  const fetchNotifications = async () => {
    try {
      // TODO: Replace with backend API call
      // For now, use empty array to get app working
      setNotifications([]);
      setUnreadCount(0);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      toast({
        title: "Error",
        description: "Failed to load notifications",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      // TODO: Replace with backend API call
      // For now, just update local state
      setNotifications(prev => 
        prev.map(n => n.id === id ? { ...n, read: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      // TODO: Replace with backend API call
      // For now, just update local state
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      toast({
        title: "Error",
        description: "Failed to mark notifications as read",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchNotifications();
    // TODO: Add real-time subscriptions when backend is ready
  }, [toast]);

  const filteredNotifications = filter === 'all' 
    ? notifications 
    : notifications.filter(n => n.category === filter);

  const deleteNotification = async (id: string) => {
    try {
      // TODO: Replace with backend API call
      // For now, just update local state
      setNotifications(prev => prev.filter(n => n.id !== id));
      if (notifications.find(n => n.id === id && !n.read)) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const clearAllNotifications = async () => {
    try {
      // TODO: Replace with backend API call
      // For now, just update local state
      setNotifications([]);
      setUnreadCount(0);
    } catch (error) {
      console.error('Error clearing notifications:', error);
    }
  };

  return {
    notifications: filteredNotifications,
    allNotifications: notifications,
    loading,
    unreadCount,
    filter,
    setFilter,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
    fetchNotifications
  };
};