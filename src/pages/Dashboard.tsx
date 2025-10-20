import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Users, Tv, Shield, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { ThemeToggle } from '@/components/ThemeToggle';
import { NotificationBell } from '@/components/ui/notification-bell';
import { getServiceLogo, handleLogoError, hasServiceLogo } from '@/lib/logo-utils';

interface Subscription {
  id: string;
  service_id: string;
  is_active: boolean;
  streaming_services: {
    name: string;
    logo_url: string | null;
    monthly_price: number | null;
    category: string | null;
    website_url: string | null;
  };
}

interface PartnerConnection {
  id: string;
  partner_id: string;
  status: string;
  profiles: {
    display_name: string | null;
  } | null;
}

// Logo handling moved to centralized utility

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [partnerConnections, setPartnerConnections] = useState<PartnerConnection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchSubscriptions();
      fetchPartnerConnections();
    }
  }, [user]);

  const fetchSubscriptions = async () => {
    try {
      // TODO: Replace with backend API call
      // For now, use empty array to get app working
      setSubscriptions([]);
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
      toast({
        title: "Error",
        description: "Failed to load subscriptions",
        variant: "destructive"
      });
    }
  };

  const fetchPartnerConnections = async () => {
    try {
      // TODO: Replace with backend API call
      // For now, use empty array to get app working
      setPartnerConnections([]);
    } catch (error) {
      console.error('Error fetching partner connections:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast({
        title: "Error",
        description: "Failed to sign out",
        variant: "destructive"
      });
    } else {
      navigate('/');
    }
  };

  const totalActiveSubscriptions = subscriptions.filter(sub => sub.is_active).length;
  const totalMonthlySpend = subscriptions
    .filter(sub => sub.is_active)
    .reduce((sum, sub) => sum + (sub.streaming_services.monthly_price || 0), 0);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-subtle">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-gradient-primary rounded-2xl mx-auto flex items-center justify-center shadow-elegant animate-pulse">
            <Tv className="w-8 h-8 text-white" />
          </div>
          <p className="text-muted-foreground">Loading your subscriptions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <ThemeToggle />
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Tv className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-xl font-bold">SubCircle</h1>
          </div>
          <div className="flex items-center space-x-2">
            <NotificationBell />
            <Button variant="ghost" size="sm" onClick={() => navigate('/settings')}>
              <Settings className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={handleSignOut}>
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Welcome Section */}
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold">Welcome back!</h2>
          <p className="text-muted-foreground">Manage your streaming subscriptions</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Active Services</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalActiveSubscriptions}</div>
              <p className="text-xs text-muted-foreground">Subscriptions</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Monthly Spend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalMonthlySpend.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">Per month</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <Button 
            onClick={() => navigate('/subscriptions/add')}
            className="h-20 flex-col space-y-2"
          >
            <Plus className="w-6 h-6" />
            <span>Add Service</span>
          </Button>
          <Button 
            variant="outline"
            onClick={() => navigate('/partners')}
            className="h-20 flex-col space-y-2"
          >
            <Users className="w-6 h-6" />
            <span>Connect Partner</span>
          </Button>
        </div>

        {/* Subscriptions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Tv className="w-5 h-5" />
              <span>Your Subscriptions</span>
            </CardTitle>
            <CardDescription>
              {subscriptions.length === 0 
                ? "No subscriptions added yet" 
                : `${subscriptions.length} subscription${subscriptions.length !== 1 ? 's' : ''}`
              }
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {subscriptions.length === 0 ? (
              <div className="text-center py-8 space-y-4">
                <Tv className="w-12 h-12 text-muted-foreground mx-auto" />
                <div>
                  <p className="text-muted-foreground">No subscriptions yet</p>
                  <Button 
                    variant="link" 
                    onClick={() => navigate('/subscriptions/add')}
                    className="mt-2"
                  >
                    Add your first subscription
                  </Button>
                </div>
              </div>
            ) : (
              subscriptions.map((subscription) => (
                <div key={subscription.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-white dark:bg-white border border-border p-1.5 rounded-lg flex items-center justify-center overflow-hidden shadow-sm">
                      {hasServiceLogo(subscription.streaming_services) ? (
                        <img 
                          src={getServiceLogo(subscription.streaming_services)}
                          alt={`${subscription.streaming_services.name} logo`}
                          className="w-full h-full object-contain"
                          loading="lazy"
                          referrerPolicy="no-referrer"
                          onError={(e) => handleLogoError(e, subscription.streaming_services)}
                        />
                      ) : null}
                      <Tv className={`w-5 h-5 text-muted-foreground ${hasServiceLogo(subscription.streaming_services) ? 'hidden' : ''}`} />
                    </div>
                    <div>
                      <p className="font-medium">{subscription.streaming_services.name}</p>
                      <p className="text-sm text-muted-foreground">
                        ${subscription.streaming_services.monthly_price || 0}/month
                      </p>
                    </div>
                  </div>
                  <Badge variant={subscription.is_active ? "default" : "secondary"}>
                    {subscription.is_active ? "Active" : "Inactive"}
                  </Badge>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Partner Connections */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="w-5 h-5" />
              <span>Partner Connections</span>
            </CardTitle>
            <CardDescription>
              Share subscriptions with family & friends
            </CardDescription>
          </CardHeader>
          <CardContent>
            {partnerConnections.length === 0 ? (
              <div className="text-center py-8 space-y-4">
                <Users className="w-12 h-12 text-muted-foreground mx-auto" />
                <div>
                  <p className="text-muted-foreground">No partner connections</p>
                  <Button 
                    variant="link"
                    onClick={() => navigate('/partners')}
                    className="mt-2"
                  >
                    Connect with a partner
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {partnerConnections.map((connection) => (
                  <div key={connection.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                        <Users className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium">
                          {connection.profiles?.display_name || 'Partner'}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Connection Status
                        </p>
                      </div>
                    </div>
                    <Badge variant={connection.status === 'accepted' ? "default" : "secondary"}>
                      {connection.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Privacy Notice */}
        <Card className="border-trust-blue/20">
          <CardContent className="pt-6">
            <div className="flex items-start space-x-3">
              <Shield className="w-5 h-5 text-trust-blue mt-0.5" />
              <div>
                <p className="text-sm font-medium text-trust-blue">Privacy Protected</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Your subscription credentials are encrypted and stored locally on your device only.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Dashboard;