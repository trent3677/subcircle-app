import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Bell, 
  Mail, 
  Smartphone, 
  Users, 
  CreditCard, 
  Shield, 
  Settings2,
  Check,
  TestTube,
  AlertTriangle
} from 'lucide-react';
import { usePushNotifications } from '@/hooks/use-push-notifications';

interface NotificationPreferences {
  id?: string;
  user_id: string;
  email_enabled: boolean;
  push_enabled: boolean;
  partner_notifications: boolean;
  subscription_notifications: boolean;
  security_notifications: boolean;
  system_notifications: boolean;
  email_frequency: 'instant' | 'daily' | 'weekly';
  quiet_hours_enabled: boolean;
  quiet_hours_start: string;
  quiet_hours_end: string;
  created_at?: string;
  updated_at?: string;
}

const defaultPreferences: Partial<NotificationPreferences> = {
  email_enabled: true,
  push_enabled: true,
  partner_notifications: true,
  subscription_notifications: true,
  security_notifications: true,
  system_notifications: false,
  email_frequency: 'instant',
  quiet_hours_enabled: false,
  quiet_hours_start: '22:00',
  quiet_hours_end: '08:00'
};

export const NotificationSettings = () => {
  const [preferences, setPreferences] = useState<Partial<NotificationPreferences>>(defaultPreferences);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();
  const { 
    isSupported: pushSupported, 
    isSubscribed: pushSubscribed,
    isLoading: pushLoading,
    vapidPublicKey,
    subscribeToPushNotifications,
    unsubscribeFromPushNotifications,
    sendTestPushNotification 
  } = usePushNotifications();

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      // TODO: Replace with actual backend API call
      // For now, just use default preferences to get app working
      
      setPreferences(defaultPreferences);
    } catch (error) {
      console.error('Error loading preferences:', error);
      setPreferences(defaultPreferences);
    } finally {
      setLoading(false);
    }
  };

  const savePreferences = async () => {
    setSaving(true);
    try {
      // TODO: Replace with actual backend API call
      // For now, just show success message to test UI
      
      toast({
        title: "Settings saved",
        description: "Your notification preferences have been updated (mock).",
      });
    } catch (error) {
      console.error('Error saving preferences:', error);
      toast({
        title: "Error",
        description: "Failed to save notification preferences",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handlePushToggle = async (checked: boolean) => {
    if (checked) {
      if (Notification.permission !== 'granted') {
        const subscription = await subscribeToPushNotifications();
        if (subscription) {
          updatePreference('push_enabled', true);
        }
      } else {
        updatePreference('push_enabled', true);
      }
    } else {
      await unsubscribeFromPushNotifications();
      updatePreference('push_enabled', false);
    }
  };

  const updatePreference = (key: keyof NotificationPreferences, value: any) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  };

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        {[...Array(3)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <div className="h-4 bg-muted rounded w-1/3"></div>
              <div className="h-3 bg-muted rounded w-2/3"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="h-4 bg-muted rounded"></div>
                <div className="h-4 bg-muted rounded"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Notification Settings</h2>
        <p className="text-muted-foreground">
          Customize how and when you receive notifications
        </p>
      </div>

      {/* Delivery Methods */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Delivery Methods
          </CardTitle>
          <CardDescription>
            Choose how you want to receive notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <div>
                <Label className="font-medium">Email Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive notifications via email</p>
              </div>
            </div>
            <Switch
              checked={preferences.email_enabled}
              onCheckedChange={(checked) => updatePreference('email_enabled', checked)}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Smartphone className="h-4 w-4 text-muted-foreground" />
              <div>
                <Label className="font-medium">Push Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Instant notifications in your browser
                </p>
                {!pushSupported && (
                  <Badge variant="secondary" className="mt-1">Not supported</Badge>
                )}
                {pushSupported && !vapidPublicKey && (
                  <Badge variant="destructive" className="mt-1">Configuration needed</Badge>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                checked={preferences.push_enabled && pushSupported && pushSubscribed}
                onCheckedChange={handlePushToggle}
                disabled={!pushSupported || !vapidPublicKey || pushLoading}
              />
              {pushSupported && pushSubscribed && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={sendTestPushNotification}
                  disabled={pushLoading}
                >
                  {pushLoading ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-foreground mr-1" />
                  ) : (
                    <TestTube className="h-4 w-4 mr-1" />
                  )}
                  Test
                </Button>
              )}
            </div>
          </div>
          
          {/* Show instructions when notifications are blocked */}
          {pushSupported && !pushSubscribed && vapidPublicKey && (
            <div className="rounded-lg border border-orange-200 bg-orange-50 p-4 dark:border-orange-800 dark:bg-orange-950">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-600 dark:text-orange-400 mt-0.5 flex-shrink-0" />
                <div className="space-y-2 flex-1">
                  <h4 className="font-medium text-orange-800 dark:text-orange-200">
                    Notifications May Be Blocked
                  </h4>
                  <p className="text-sm text-orange-700 dark:text-orange-300">
                    If push notifications aren't working, try these steps:
                  </p>
                  <ol className="text-sm text-orange-700 dark:text-orange-300 list-decimal list-inside space-y-1 ml-2">
                    <li>Look for the 🔒 or notification icon in your browser's address bar</li>
                    <li>Click on it and change notifications from "Block" to "Allow"</li>
                    <li>Or go to browser Settings → Privacy & Security → Site Settings → Notifications</li>
                    <li>Refresh this page and toggle the switch above again</li>
                  </ol>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Notification Categories */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings2 className="h-5 w-5" />
            Notification Categories
          </CardTitle>
          <CardDescription>
            Control which types of notifications you receive
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Users className="h-4 w-4 text-primary" />
              <div>
                <Label className="font-medium">Partner Activities</Label>
                <p className="text-sm text-muted-foreground">
                  Connection requests, acceptances, credential sharing
                </p>
              </div>
            </div>
            <Switch
              checked={preferences.partner_notifications}
              onCheckedChange={(checked) => updatePreference('partner_notifications', checked)}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CreditCard className="h-4 w-4 text-subcircle-indigo" />
              <div>
                <Label className="font-medium">Subscription Updates</Label>
                <p className="text-sm text-muted-foreground">
                  Renewal reminders, cost changes, recommendations
                </p>
              </div>
            </div>
            <Switch
              checked={preferences.subscription_notifications}
              onCheckedChange={(checked) => updatePreference('subscription_notifications', checked)}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="h-4 w-4 text-subcircle-error" />
              <div>
                <Label className="font-medium">Security Alerts</Label>
                <p className="text-sm text-muted-foreground">
                  Account security, credential access, suspicious activity
                </p>
                <Badge className="bg-subcircle-error text-white mt-1">Always enabled</Badge>
              </div>
            </div>
            <Switch
              checked={true}
              disabled={true}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="h-4 w-4 text-muted-foreground" />
              <div>
                <Label className="font-medium">System Updates</Label>
                <p className="text-sm text-muted-foreground">
                  App updates, maintenance, new features
                </p>
              </div>
            </div>
            <Switch
              checked={preferences.system_notifications}
              onCheckedChange={(checked) => updatePreference('system_notifications', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Email Frequency */}
      {preferences.email_enabled && (
        <Card>
          <CardHeader>
            <CardTitle>Email Frequency</CardTitle>
            <CardDescription>
              How often should we send email notifications?
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                { value: 'instant', label: 'Instant', description: 'As they happen' },
                { value: 'daily', label: 'Daily', description: 'Once per day' },
                { value: 'weekly', label: 'Weekly', description: 'Once per week' }
              ].map((option) => (
                <Button
                  key={option.value}
                  variant={preferences.email_frequency === option.value ? "default" : "outline"}
                  className="h-auto p-4 flex flex-col items-center gap-2"
                  onClick={() => updatePreference('email_frequency', option.value)}
                >
                  {preferences.email_frequency === option.value && (
                    <Check className="h-4 w-4" />
                  )}
                  <div className="text-center">
                    <div className="font-medium">{option.label}</div>
                    <div className="text-xs text-muted-foreground">{option.description}</div>
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Save Button */}
      <div className="flex justify-center">
        <Button 
          onClick={savePreferences} 
          disabled={saving}
          className="min-w-32"
        >
          {saving ? "Saving..." : "Save Preferences"}
        </Button>
      </div>
    </div>
  );
};