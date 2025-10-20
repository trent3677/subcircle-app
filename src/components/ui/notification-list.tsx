import { formatDistanceToNow } from 'date-fns';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { useNotifications } from '@/hooks/use-notifications';
import { 
  CheckCheck, 
  Users, 
  UserX, 
  UserCheck, 
  Shield, 
  Key, 
  Calendar, 
  TrendingUp, 
  Bell,
  AlertTriangle 
} from 'lucide-react';

const getNotificationIcon = (type: string, priority?: string) => {
  const baseClass = "h-4 w-4";
  const urgentClass = priority === 'urgent' ? "animate-pulse" : "";
  
  switch (type) {
    case 'partner_accepted':
      return <UserCheck className={`${baseClass} text-emerald-500 ${urgentClass}`} />;
    case 'partner_connected':
      return <Users className={`${baseClass} text-primary ${urgentClass}`} />;
    case 'partner_rejected':
      return <UserX className={`${baseClass} text-destructive ${urgentClass}`} />;
    case 'partner_request':
      return <Users className={`${baseClass} text-subcircle-indigo ${urgentClass}`} />;
    case 'credential_shared':
      return <Key className={`${baseClass} text-subcircle-cyan ${urgentClass}`} />;
    case 'credential_accessed':
      return <Shield className={`${baseClass} text-subcircle-teal ${urgentClass}`} />;
    case 'subscription_renewal':
      return <Calendar className={`${baseClass} text-amber-500 ${urgentClass}`} />;
    case 'subscription_cost_change':
      return <TrendingUp className={`${baseClass} text-orange-500 ${urgentClass}`} />;
    case 'security':
      return <Shield className={`${baseClass} text-subcircle-error ${urgentClass}`} />;
    case 'system':
      return <Bell className={`${baseClass} text-subcircle-indigo ${urgentClass}`} />;
    default:
      return <Bell className={`${baseClass} text-muted-foreground ${urgentClass}`} />;
  }
};

export const NotificationList = () => {
  const { notifications, loading, unreadCount, markAsRead, markAllAsRead } = useNotifications();

  if (loading) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        Loading notifications...
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between p-4 border-b">
        <h3 className="font-semibold">Notifications</h3>
        {unreadCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={markAllAsRead}
            className="text-xs"
          >
            <CheckCheck className="h-3 w-3 mr-1" />
            Mark all read
          </Button>
        )}
      </div>

      <ScrollArea className="h-96">
        {notifications.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground">
            No notifications yet
          </div>
        ) : (
          <div className="divide-y">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 hover:bg-accent/50 cursor-pointer transition-colors ${
                  !notification.read ? 'bg-accent/20' : ''
                }`}
                onClick={() => !notification.read && markAsRead(notification.id)}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">
                    {getNotificationIcon(notification.type, notification.priority)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-sm truncate">
                        {notification.title}
                      </p>
                      {!notification.read && (
                        <Badge variant="secondary" className="h-5 px-1.5 text-xs">
                          New
                        </Badge>
                      )}
                      {notification.priority === 'urgent' && (
                        <Badge className="bg-subcircle-error text-white h-5 px-1.5 text-xs animate-pulse">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          Urgent
                        </Badge>
                      )}
                      {notification.priority === 'high' && (
                        <Badge className="bg-orange-500 text-white h-5 px-1.5 text-xs">
                          High
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {notification.message}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
};