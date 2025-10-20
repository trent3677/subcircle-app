import { useState, useEffect } from "react";
import { MobileLayout } from "@/components/mobile/MobileLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChartContainer } from "@/components/ui/chart";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { 
  Shield, 
  ShieldCheck, 
  Plus, 
  Edit, 
  TrendingUp, 
  Star, 
  Calendar, 
  DollarSign, 
  Users,
  Settings,
  ExternalLink,
  Lock,
  CheckCircle
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { VaultCardSkeleton } from "@/components/ui/loading-skeleton";
import { cn } from "@/lib/utils";
import { getServiceLogo, handleLogoError, hasServiceLogo } from "@/lib/logo-utils";
import { ShareSubscriptionDialog } from "@/components/ui/share-subscription-dialog";
import { PartnerSubscriptionsView } from "@/components/ui/partner-subscriptions-view";

interface VaultSubscription {
  id: string;
  service_id: string;
  is_active: boolean;
  shared_with_partners: boolean;
  share_credentials: boolean;
  streaming_services: {
    name: string;
    logo_url?: string | null;
    monthly_price?: number;
    website_url?: string | null;
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

// Demo data for showcasing vault features
const demoSubscriptions: VaultSubscription[] = [
  {
    id: 'demo-sub-1',
    service_id: 'netflix',
    is_active: true,
    shared_with_partners: true,
    share_credentials: true,
    streaming_services: {
      name: 'Netflix',
      logo_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Netflix_2015_logo.svg/1920px-Netflix_2015_logo.svg.png',
      monthly_price: 15.99,
      website_url: 'https://netflix.com'
    }
  },
  {
    id: 'demo-sub-2',
    service_id: 'spotify',
    is_active: true,
    shared_with_partners: false,
    share_credentials: false,
    streaming_services: {
      name: 'Spotify Premium',
      logo_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Spotify_logo_without_text.svg/2048px-Spotify_logo_without_text.svg.png',
      monthly_price: 9.99,
      website_url: 'https://spotify.com'
    }
  },
  {
    id: 'demo-sub-3',
    service_id: 'disney',
    is_active: true,
    shared_with_partners: true,
    share_credentials: false,
    streaming_services: {
      name: 'Disney+',
      logo_url: null,
      monthly_price: 7.99,
      website_url: 'https://disneyplus.com'
    }
  },
  {
    id: 'demo-sub-4',
    service_id: 'hulu',
    is_active: false,
    shared_with_partners: false,
    share_credentials: false,
    streaming_services: {
      name: 'Hulu',
      logo_url: null,
      monthly_price: 5.99,
      website_url: 'https://hulu.com'
    }
  }
];

const demoPartners: PartnerConnection[] = [
  {
    id: 'demo-partner-1',
    partner_id: 'partner-1',
    status: 'connected',
    profiles: {
      display_name: 'Sarah Johnson'
    }
  },
  {
    id: 'demo-partner-2',
    partner_id: 'partner-2',
    status: 'connected',
    profiles: {
      display_name: 'Alex Smith'
    }
  }
];

// Demo partner shared subscriptions (services user gets access to for free)
const demoPartnerSharedSubscriptions = [
  {
    id: 'partner-netflix',
    name: 'Netflix',
    monthly_price: 15.99,
    partner_name: 'Sarah Johnson'
  },
  {
    id: 'partner-apple-music',
    name: 'Apple Music', 
    monthly_price: 9.99,
    partner_name: 'Sarah Johnson'
  },
  {
    id: 'partner-hbo-max',
    name: 'HBO Max',
    monthly_price: 14.99,
    partner_name: 'Alex Smith'
  },
  {
    id: 'partner-youtube-premium',
    name: 'YouTube Premium',
    monthly_price: 11.99,
    partner_name: 'Alex Smith'
  }
];

export default function Vault() {
  const [subscriptions, setSubscriptions] = useState<VaultSubscription[]>([]);
  const [partners, setPartners] = useState<PartnerConnection[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAnnualView, setIsAnnualView] = useState(false);
  const { user, isDemoMode } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetchVaultData();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchVaultData = async () => {
    if (!user) return;
    
    try {
      if (isDemoMode) {
        // Use demo data to showcase features
        setTimeout(() => {
          setSubscriptions(demoSubscriptions);
          setPartners(demoPartners);
          setLoading(false);
        }, 1000); // Simulate loading time
      } else {
        // TODO: Replace with backend API calls
        // For now, use empty arrays to get app working
        setSubscriptions([]);
        setPartners([]);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching vault data:", error);
      toast({
        title: "Error",
        description: "Failed to load your vault",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  const handleSharingUpdate = () => {
    fetchVaultData();
  };

  const totalMonthlyCost = subscriptions.reduce((total, sub) => {
    return total + (sub.streaming_services?.monthly_price || 0);
  }, 0);

  // Calculate total savings from partner shared subscriptions (in demo mode)
  const totalMonthlySavings = isDemoMode 
    ? demoPartnerSharedSubscriptions.reduce((total, service) => total + service.monthly_price, 0)
    : 0;

  // Prepare chart data
  const chartData = subscriptions.map((sub, index) => ({
    name: sub.streaming_services?.name || 'Unknown',
    monthly: sub.streaming_services?.monthly_price || 0,
    annual: (sub.streaming_services?.monthly_price || 0) * 12,
    color: `hsl(${(index * 137.5) % 360}, 70%, 50%)` // Generate unique colors
  }));

  const chartConfig = {
    monthly: {
      label: "Monthly Cost",
    },
    annual: {
      label: "Annual Cost", 
    },
  };

  if (!user) {
    return (
      <MobileLayout>
        <div className="min-h-screen bg-background">
          <div className="p-6">
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
              <div className="relative">
                <Shield className="w-20 h-20 text-muted-foreground opacity-50" />
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-full blur-xl"></div>
              </div>
              <div className="text-center space-y-3 max-w-sm">
                <h2 className="text-2xl font-bold text-foreground">Secure Vault</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Please sign in to access your secure subscription vault and manage your streaming services
                </p>
              </div>
              <Button 
                onClick={() => navigate("/onboarding")} 
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                data-testid="button-signin"
              >
                Sign In to Continue
              </Button>
            </div>
          </div>
        </div>
      </MobileLayout>
    );
  }

  if (loading) {
    return (
      <MobileLayout>
        <div className="min-h-screen bg-background">
          <div className="p-6 space-y-8">
            {/* Header skeleton */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-3">
                  <div className="h-8 w-40 bg-muted rounded-lg animate-pulse" />
                  <div className="h-4 w-32 bg-muted rounded animate-pulse" />
                </div>
                <div className="h-10 w-24 bg-muted rounded-xl animate-pulse" />
              </div>
              
              {/* Summary card skeleton */}
              <div className="h-32 w-full bg-gradient-to-br from-muted to-muted/80 rounded-2xl animate-pulse" />
            </div>
            
            {/* Subscription cards skeleton */}
            <div className="space-y-4">
              <div className="h-6 w-48 bg-muted rounded animate-pulse" />
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <VaultCardSkeleton key={i} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout>
      <div className="min-h-screen bg-background">
        <div className="p-6 space-y-8">
          {/* Enhanced Header Section */}
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold text-foreground">My Vault</h1>
                <p className="text-base text-muted-foreground">
                  Secure management for all your subscriptions
                </p>
              </div>
              <Button 
                size="default" 
                onClick={() => navigate("/")}
                className="bg-accent hover:bg-accent/90 text-accent-foreground px-6 py-2.5 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                data-testid="button-add-subscription"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Service
              </Button>
            </div>
          
            {/* Enhanced Cost Overview Chart */}
            {subscriptions.length > 0 ? (
              <Card className="relative overflow-hidden border-0 shadow-elegant bg-gradient-to-br from-background via-background to-muted/30">
                <CardContent className="p-6">
                  <div className="space-y-6">
                    {/* Header with Toggle */}
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-foreground">Subscription Overview</h3>
                        <p className="text-sm text-muted-foreground">
                          {isAnnualView ? 'Annual' : 'Monthly'} cost breakdown
                        </p>
                      </div>
                      <div className="flex items-center gap-2 bg-muted/50 rounded-full p-1">
                        <Button
                          variant={!isAnnualView ? "default" : "ghost"}
                          size="sm"
                          onClick={() => setIsAnnualView(false)}
                          className="rounded-full px-4 h-8 text-xs"
                        >
                          Monthly
                        </Button>
                        <Button
                          variant={isAnnualView ? "default" : "ghost"}
                          size="sm"
                          onClick={() => setIsAnnualView(true)}
                          className="rounded-full px-4 h-8 text-xs"
                        >
                          Annual
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
                      {/* Chart */}
                      <div className="relative">
                        <ChartContainer config={chartConfig} className="aspect-square max-w-[250px] mx-auto">
                          <PieChart>
                            <Pie
                              data={chartData}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={100}
                              paddingAngle={2}
                              dataKey={isAnnualView ? "annual" : "monthly"}
                            >
                              {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                          </PieChart>
                        </ChartContainer>
                        
                        {/* Center Logo */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg">
                            <img 
                              src="/lovable-uploads/105cee16-9e7f-45ba-9b51-01a7a6f35377.png" 
                              alt="SubCircle" 
                              className="w-10 h-10 object-contain"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Summary */}
                      <div className="space-y-4">
                        <div className="text-center lg:text-left">
                          <p className="text-sm text-muted-foreground uppercase tracking-wide">
                            Total {isAnnualView ? 'Annual' : 'Monthly'} Cost
                          </p>
                          <p className="text-3xl font-bold text-foreground" data-testid="text-total-cost">
                            ${isAnnualView ? (totalMonthlyCost * 12).toFixed(2) : totalMonthlyCost.toFixed(2)}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {subscriptions.length} active {subscriptions.length === 1 ? 'subscription' : 'subscriptions'}
                          </p>
                        </div>

                        {/* Savings from partner shared services */}
                        {totalMonthlySavings > 0 && (
                          <div className="text-center lg:text-left p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                            <p className="text-sm text-green-700 dark:text-green-300 uppercase tracking-wide font-medium">
                              💰 Total {isAnnualView ? 'Annual' : 'Monthly'} Savings
                            </p>
                            <p className="text-2xl font-bold text-green-700 dark:text-green-300" data-testid="text-total-savings">
                              ${isAnnualView ? (totalMonthlySavings * 12).toFixed(2) : totalMonthlySavings.toFixed(2)}
                            </p>
                            <p className="text-xs text-green-600 dark:text-green-400">
                              From {demoPartnerSharedSubscriptions.length} partner-shared {demoPartnerSharedSubscriptions.length === 1 ? 'service' : 'services'}
                            </p>
                          </div>
                        )}

                        {/* Service Breakdown */}
                        <div className="space-y-2">
                          {chartData.map((service, index) => (
                            <div key={service.name} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors">
                              <div className="flex items-center gap-3">
                                <div 
                                  className="w-3 h-3 rounded-full"
                                  style={{ backgroundColor: service.color }}
                                />
                                <span className="text-sm font-medium text-foreground">{service.name}</span>
                              </div>
                              <span className="text-sm font-semibold text-foreground">
                                ${isAnnualView ? service.annual.toFixed(2) : service.monthly.toFixed(2)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              // Fallback summary for empty state
              <Card className="relative overflow-hidden bg-gradient-primary border-0 shadow-elegant">
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent" />
                <CardContent className="relative p-8">
                  <div className="text-center space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-center gap-3">
                        <div className="p-2 bg-white/20 rounded-lg">
                          <DollarSign className="w-5 h-5 text-white" />
                        </div>
                        <p className="text-white/90 text-sm font-medium uppercase tracking-wide">Monthly Total</p>
                      </div>
                      <p className="text-4xl font-bold text-white">$0.00</p>
                      <p className="text-white/80 text-sm">Add subscriptions to see your spending</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
        </div>

          {/* Enhanced Subscriptions Section */}
          {subscriptions.length > 0 ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-foreground">Your Subscriptions</h2>
                <Badge variant="outline" className="px-3 py-1 text-sm font-medium bg-muted/50 border-muted-foreground/20">
                  <CheckCircle className="w-3 h-3 mr-2 text-green-600" />
                  {subscriptions.length} Active
                </Badge>
              </div>
              
              <div className="space-y-4">
                {subscriptions.map((subscription, index) => (
                  <Card 
                    key={subscription.id} 
                    className={cn(
                      "group overflow-hidden border border-border/50 bg-card hover:bg-card/80",
                      "transition-all duration-300 ease-out hover:shadow-card-hover hover:scale-[1.01]",
                      "animate-slide-up"
                    )}
                    style={{ animationDelay: `${index * 100}ms` }}
                    data-testid={`card-subscription-${subscription.id}`}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start gap-6">
                        {/* Service Logo */}
                        <div className="shrink-0">
                          <div className="w-16 h-16 bg-background border border-border/20 rounded-2xl flex items-center justify-center p-3 shadow-sm group-hover:shadow-md transition-shadow duration-300">
                            {hasServiceLogo(subscription.streaming_services) ? (
                              <img
                                src={getServiceLogo(subscription.streaming_services)}
                                alt={`${subscription.streaming_services?.name || "Service"} logo`}
                                className="w-full h-full object-contain"
                                loading="lazy"
                                referrerPolicy="no-referrer"
                                onError={(e) => handleLogoError(e, subscription.streaming_services)}
                                data-testid={`img-service-logo-${subscription.id}`}
                              />
                            ) : (
                              <div className="w-full h-full bg-gradient-primary rounded-xl flex items-center justify-center text-lg font-bold text-white">
                                {subscription.streaming_services?.name?.charAt(0) || "?"}
                              </div>
                            )}
                          </div>
                        </div>
                        
                        {/* Service Info */}
                        <div className="flex-1 min-w-0 space-y-4">
                          <div className="space-y-2">
                            <div className="flex items-start justify-between gap-3">
                              <h3 className="font-bold text-lg text-foreground leading-tight group-hover:text-primary transition-colors duration-300" data-testid={`text-service-name-${subscription.id}`}>
                                {subscription.streaming_services?.name || "Unknown Service"}
                              </h3>
                              {subscription.streaming_services?.monthly_price && (
                                <div className="text-right shrink-0">
                                  <p className="text-2xl font-bold text-primary" data-testid={`text-service-price-${subscription.id}`}>
                                    ${subscription.streaming_services.monthly_price}
                                  </p>
                                  <p className="text-xs text-muted-foreground">per month</p>
                                </div>
                              )}
                            </div>
                            
                            {/* Status Badges */}
                            <div className="flex items-center gap-2 flex-wrap">
                              <Badge variant="outline" className="px-2 py-1 text-xs bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Active
                              </Badge>
                              <Badge variant="outline" className="px-2 py-1 text-xs bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800">
                                <Lock className="w-3 h-3 mr-1" />
                                Credentials Needed
                              </Badge>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex items-center justify-between pt-2">
                            <div className="flex items-center gap-2">
                              {subscription.streaming_services?.website_url && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="px-3 py-1.5 h-auto text-xs font-medium hover:bg-accent hover:text-accent-foreground"
                                  onClick={() => window.open(subscription.streaming_services?.website_url || '', '_blank')}
                                  data-testid={`button-visit-website-${subscription.id}`}
                                >
                                  <ExternalLink className="w-3 h-3 mr-1" />
                                  Visit Site
                                </Button>
                              )}
                            </div>
                            <ShareSubscriptionDialog
                              subscriptionId={subscription.id}
                              serviceName={subscription.streaming_services?.name || "Unknown Service"}
                              currentSettings={{
                                shared_with_partners: subscription.shared_with_partners,
                                share_credentials: subscription.share_credentials,
                              }}
                              onUpdate={handleSharingUpdate}
                            />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ) : (
            // Enhanced Empty State
            <div className="flex flex-col items-center justify-center py-16 space-y-6">
              <div className="relative">
                <Shield className="w-24 h-24 text-muted-foreground opacity-30" />
                <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10 rounded-full blur-2xl"></div>
              </div>
              <div className="text-center space-y-3 max-w-md">
                <h2 className="text-2xl font-bold text-foreground">Your Vault Awaits</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Start building your secure subscription vault by adding streaming services from our catalog
                </p>
              </div>
              <Button 
                onClick={() => navigate("/")} 
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                data-testid="button-browse-catalog"
              >
                <Star className="w-4 h-4 mr-2" />
                Browse Catalog
              </Button>
            </div>
          )}

          {/* Enhanced Partner Subscriptions */}
          {partners.length > 0 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-accent/10 rounded-lg">
                  <Users className="w-5 h-5 text-accent" />
                </div>
                <h2 className="text-xl font-bold text-foreground">Partner Subscriptions</h2>
              </div>
              <div className="space-y-6">
                {partners.map((partner) => (
                  <PartnerSubscriptionsView
                    key={partner.id}
                    partnerId={partner.partner_id}
                    partnerName={partner.profiles?.display_name || "Unknown Partner"}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Enhanced Security Note */}
          <Card className="border-subcircle-cyan/30 dark:border-subcircle-cyan/20 bg-subcircle-cyan/5 dark:bg-subcircle-cyan/10">
            <CardContent className="p-6">
              <div className="flex gap-4">
                <div className="p-2 bg-subcircle-cyan/10 rounded-lg shrink-0">
                  <ShieldCheck className="w-6 h-6 text-subcircle-cyan" />
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-foreground">Bank-Level Security</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Your subscription data is protected with end-to-end encryption. 
                    SubCircle never stores your passwords or payment information.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MobileLayout>
  );
}