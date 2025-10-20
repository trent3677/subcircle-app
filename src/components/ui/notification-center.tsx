import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { useNotifications } from '@/hooks/use-notifications';
import { 
  CheckCheck, 
  Users, 
  UserX, 
  UserCheck, 
  Shield, 
  CreditCard, 
  AlertTriangle, 
  Bell,
  Trash2,
  Search,
  Filter,
  X,
  Key,
  Calendar,
  TrendingUp,
  Settings
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const getNotificationIcon = (type: string, priority?: string) => {
  const iconClass = `h-4 w-4 ${
    priority === 'urgent' ? 'text-subcircle-error animate-pulse' :
    priority === 'high' ? 'text-subcircle-error' :
    priority === 'medium' ? 'text-subcircle-indigo' : 
    'text-muted-foreground'
  }`;

  switch (type) {
    case 'partner_accepted':
      return <UserCheck className={iconClass.replace('text-muted-foreground', 'text-emerald-500')} />;
    case 'partner_connected':
      return <Users className={iconClass.replace('text-muted-foreground', 'text-primary')} />;
    case 'partner_rejected':
      return <UserX className={iconClass.replace('text-muted-foreground', 'text-destructive')} />;
    case 'partner_request':
      return <Users className={iconClass.replace('text-muted-foreground', 'text-subcircle-indigo')} />;
    case 'credential_shared':
      return <Key className={iconClass.replace('text-muted-foreground', 'text-subcircle-cyan')} />;
    case 'credential_accessed':
      return <Shield className={iconClass.replace('text-muted-foreground', 'text-subcircle-teal')} />;
    case 'subscription_renewal':
      return <Calendar className={iconClass.replace('text-muted-foreground', 'text-amber-500')} />;
    case 'subscription_cost_change':
      return <TrendingUp className={iconClass.replace('text-muted-foreground', 'text-orange-500')} />;
    case 'security':
      return <Shield className={iconClass.replace('text-muted-foreground', 'text-subcircle-error')} />;
    case 'system':
      return <Settings className={iconClass.replace('text-muted-foreground', 'text-subcircle-indigo')} />;
    default:
      return <Bell className={iconClass} />;
  }
};

const getPriorityBadge = (priority?: string) => {
  switch (priority) {
    case 'urgent':
      return <Badge className="bg-subcircle-error text-white animate-pulse">Urgent</Badge>;
    case 'high':
      return <Badge className="bg-subcircle-error text-white">High</Badge>;
    case 'medium':
      return <Badge className="bg-subcircle-indigo text-white">Medium</Badge>;
    case 'low':
    default:
      return null;
  }
};

const getCategoryColor = (category?: string) => {
  switch (category) {
    case 'partner':
      return 'border-l-primary';
    case 'subscription':
      return 'border-l-subcircle-indigo';
    case 'security':
      return 'border-l-subcircle-error';
    case 'system':
      return 'border-l-subcircle-cyan';
    default:
      return 'border-l-muted';
  }
};

export const NotificationCenter = () => {
  const { 
    notifications, 
    allNotifications,
    loading, 
    unreadCount, 
    filter,
    setFilter,
    markAsRead, 
    markAllAsRead,
    deleteNotification,
    clearAllNotifications
  } = useNotifications();
  
  const [searchQuery, setSearchQuery] = useState('');

  const filteredNotifications = notifications.filter(notification =>
    notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    notification.message.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const categoryTabs = [
    { id: 'all', label: 'All', count: allNotifications.length },
    { id: 'partner', label: 'Partners', count: allNotifications.filter(n => n.category === 'partner').length },
    { id: 'subscription', label: 'Subscriptions', count: allNotifications.filter(n => n.category === 'subscription').length },
    { id: 'security', label: 'Security', count: allNotifications.filter(n => n.category === 'security').length },
    { id: 'system', label: 'System', count: allNotifications.filter(n => n.category === 'system').length },
  ];

  if (loading) {
    return (
      <div className="w-full max-w-2xl mx-auto">
        <div className="animate-pulse space-y-4 p-6">
          <div className="h-4 bg-muted rounded w-1/4"></div>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto bg-card rounded-lg border shadow-card animate-fade-in">
      {/* Header */}
      <div className="p-6 border-b bg-gradient-subtle">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Bell className="h-6 w-6 text-primary" />
            <h2 className="text-xl font-semibold">Notification Center</h2>
            {unreadCount > 0 && (
              <Badge className="bg-subcircle-error text-white">
                {unreadCount}
              </Badge>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={markAllAsRead}
                className="text-xs"
              >
                <CheckCheck className="h-3 w-3 mr-1" />
                Mark all read
              </Button>
            )}
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Settings className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={clearAllNotifications}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear all notifications
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search notifications..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4"
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSearchQuery('')}
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>

        {/* Category Tabs */}
        <div className="flex gap-2 mt-4 overflow-x-auto">
          {categoryTabs.map((tab) => (
            <Button
              key={tab.id}
              variant={filter === tab.id ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(tab.id)}
              className="whitespace-nowrap"
            >
              {tab.label}
              {tab.count > 0 && (
                <Badge variant="secondary" className="ml-1 text-xs">
                  {tab.count}
                </Badge>
              )}
            </Button>
          ))}
        </div>
      </div>

      {/* Notification List */}
      <ScrollArea className="h-[500px]">
        {filteredNotifications.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg mb-2">
              {searchQuery ? 'No matching notifications' : 'All caught up!'}
            </p>
            <p className="text-sm">
              {searchQuery ? 'Try adjusting your search terms.' : "You don't have any notifications right now."}
            </p>
          </div>
        ) : (
          <div className="divide-y">
            {filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`group relative p-4 hover:bg-accent/30 transition-all cursor-pointer border-l-4 ${getCategoryColor(notification.category)} ${
                  !notification.read ? 'bg-accent/10' : ''
                }`}
                onClick={() => !notification.read && markAsRead(notification.id)}
              >
                {/* Priority indicator */}
                {notification.priority === 'urgent' && (
                  <div className="absolute top-2 right-2">
                    <div className="w-2 h-2 bg-subcircle-error rounded-full animate-pulse"></div>
                  </div>
                )}

                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    {getNotificationIcon(notification.type, notification.priority)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-medium text-sm">
                          {notification.title}
                        </h4>
                        {!notification.read && (
                          <Badge variant="secondary" className="h-5 px-1.5 text-xs">
                            New
                          </Badge>
                        )}
                        {getPriorityBadge(notification.priority)}
                      </div>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNotification(notification.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                      {notification.message}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                      </p>
                      
                      {notification.action_url && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            // Handle action URL navigation
                            window.location.href = notification.action_url!;
                          }}
                          className="text-xs h-7"
                        >
                          View
                        </Button>
                      )}
                    </div>
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