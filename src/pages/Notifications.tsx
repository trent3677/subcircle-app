import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { NotificationCenter } from '@/components/ui/notification-center';
import { NotificationSettings } from '@/components/ui/notification-settings';
import { Bell, Settings } from 'lucide-react';

export default function Notifications() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Tabs defaultValue="center" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="center" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notification Center
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Settings
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="center" className="mt-6">
          <NotificationCenter />
        </TabsContent>
        
        <TabsContent value="settings" className="mt-6">
          <NotificationSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
}