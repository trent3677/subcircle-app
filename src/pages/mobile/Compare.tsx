import { useState, useEffect } from "react";
import { MobileLayout } from "@/components/mobile/MobileLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Share2, Users, Smartphone, DollarSign, RefreshCw } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

interface ComparisonData {
  bothHave: ServiceItem[];
  onlyYou: ServiceItem[];
  onlyPartner: ServiceItem[];
  totalSavings: number;
  partnerName?: string;
}

interface ServiceItem {
  id: string;
  name: string;
  logo_url?: string;
  monthly_price?: number;
  category?: string;
}

interface UserSubscriptionWithService {
  id: string;
  service_id: string;
  is_active: boolean;
  streaming_services: {
    id: string;
    name: string;
    logo_url?: string;
    monthly_price?: number;
    category?: string;
  };
}

// Demo data for showcasing comparison features
const demoUserSubscriptions: ServiceItem[] = [
  {
    id: 'netflix',
    name: 'Netflix',
    logo_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Netflix_2015_logo.svg/1920px-Netflix_2015_logo.svg.png',
    monthly_price: 15.99,
    category: 'Streaming Video'
  },
  {
    id: 'spotify',
    name: 'Spotify Premium',
    logo_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Spotify_logo_without_text.svg/2048px-Spotify_logo_without_text.svg.png',
    monthly_price: 9.99,
    category: 'Music'
  },
  {
    id: 'hulu',
    name: 'Hulu',
    logo_url: 'https://variety.com/wp-content/uploads/2019/10/hulu2.png',
    monthly_price: 5.99,
    category: 'Streaming Video'
  },
  {
    id: 'disney',
    name: 'Disney+',
    logo_url: 'https://cnbl-cdn.bamgrid.com/assets/7ecc8bcb60ad77193058d63e321bd21cbac2fc67281dcc5ba08f162c30902633/original',
    monthly_price: 7.99,
    category: 'Streaming Video'
  }
];

const demoPartnerSubscriptions: ServiceItem[] = [
  {
    id: 'netflix',
    name: 'Netflix',
    logo_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Netflix_2015_logo.svg/1920px-Netflix_2015_logo.svg.png',
    monthly_price: 15.99,
    category: 'Streaming Video'
  },
  {
    id: 'apple-music',
    name: 'Apple Music',
    logo_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Apple_Music_icon.svg/2048px-Apple_Music_icon.svg.png',
    monthly_price: 9.99,
    category: 'Music'
  },
  {
    id: 'hbo-max',
    name: 'HBO Max',
    logo_url: 'https://upload.wikimedia.org/wikipedia/commons/1/17/HBO_Max_Logo.svg',
    monthly_price: 14.99,
    category: 'Streaming Video'
  },
  {
    id: 'youtube-premium',
    name: 'YouTube Premium',
    logo_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/YouTube_full-color_icon_%282017%29.svg/2560px-YouTube_full-color_icon_%282017%29.svg.png',
    monthly_price: 11.99,
    category: 'Video & Music'
  }
];

export default function Compare() {
  const [comparison, setComparison] = useState<ComparisonData | null>(null);
  const [userSubscriptions, setUserSubscriptions] = useState<ServiceItem[]>([]);
  const [partnerSubscriptions, setPartnerSubscriptions] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasPartnerConnection, setHasPartnerConnection] = useState(false);
  const { user, isDemoMode } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      loadUserData();
    } else {
      setLoading(false);
    }
  }, [user]);

  const loadUserData = async () => {
    try {
      // Load user's subscriptions
      await fetchUserSubscriptions();
      
      // Check for partner connections
      await checkPartnerConnections();
    } catch (error) {
      console.error("Error loading user data:", error);
      toast({
        title: "Error",
        description: "Failed to load comparison data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchUserSubscriptions = async () => {
    if (!user) return;

    try {
      if (isDemoMode) {
        // Use demo data to showcase features
        setUserSubscriptions(demoUserSubscriptions);
        setPartnerSubscriptions(demoPartnerSubscriptions);
      } else {
        // TODO: Replace with backend API call
        // For now, use empty array to get app working
        setUserSubscriptions([]);
      }
    } catch (error) {
      console.error("Error fetching user subscriptions:", error);
    }
  };

  const checkPartnerConnections = async () => {
    if (!user) return;

    try {
      if (isDemoMode) {
        // In demo mode, simulate having partner connections
        setHasPartnerConnection(true);
        
        // Generate realistic comparison data
        const bothHave = demoUserSubscriptions.filter(userSub => 
          demoPartnerSubscriptions.some(partnerSub => partnerSub.id === userSub.id)
        );
        
        const onlyYou = demoUserSubscriptions.filter(userSub => 
          !demoPartnerSubscriptions.some(partnerSub => partnerSub.id === userSub.id)
        );
        
        const onlyPartner = demoPartnerSubscriptions.filter(partnerSub => 
          !demoUserSubscriptions.some(userSub => userSub.id === partnerSub.id)
        );
        
        const totalSavings = bothHave.reduce((total, service) => 
          total + (service.monthly_price || 0), 0
        );
        
        setTimeout(() => {
          setComparison({
            bothHave,
            onlyYou,
            onlyPartner,
            totalSavings,
            partnerName: 'Sarah Johnson'
          });
        }, 1200); // Simulate analysis time
      } else {
        // TODO: Replace with backend API call
        // For now, just set no partner connections
        setHasPartnerConnection(false);
      }
    } catch (error) {
      console.error("Error checking partner connections:", error);
    }
  };

  const generateRealComparison = async (partnerId: string, partnerName: string) => {
    try {
      // TODO: Replace with backend API call
      // For now, just set empty comparison
      setComparison({
        bothHave: [],
        onlyYou: [],
        onlyPartner: [],
        totalSavings: 0,
        partnerName
      });
    } catch (error) {
      console.error("Error generating real comparison:", error);
    }
  };

  const shareComparison = async () => {
    if (!comparison) return;
    
    const shareText = `💰 SubCircle Comparison Results:
• Both have: ${comparison.bothHave.length} services
• Potential savings: $${comparison.totalSavings.toFixed(2)}/month
• Total duplicate cost: $${comparison.totalSavings.toFixed(2)}/month

Download SubCircle to optimize your subscriptions!`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: "SubCircle Comparison",
          text: shareText,
        });
      } else {
        await navigator.clipboard.writeText(shareText);
        toast({
          title: "Copied!",
          description: "Comparison results copied to clipboard",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to share comparison",
        variant: "destructive",
      });
    }
  };

  if (!user) {
    return (
      <MobileLayout>
        <div className="p-mobile-padding">
          <div className="text-center py-12 space-y-4">
            <Users className="w-16 h-16 mx-auto text-muted-foreground" />
            <div className="space-y-2">
              <h2 className="text-xl font-semibold">Compare Subscriptions</h2>
              <p className="text-muted-foreground">
                Please sign in to compare subscriptions with partners
              </p>
            </div>
            <Button onClick={() => navigate("/onboarding")} className="bg-primary text-primary-foreground">
              Sign In
            </Button>
          </div>
        </div>
      </MobileLayout>
    );
  }

  if (loading) {
    return (
      <MobileLayout>
        <div className="p-mobile-padding">
          <div className="flex items-center justify-center h-64">
            <div className="animate-pulse text-muted-foreground">Loading comparison...</div>
          </div>
        </div>
      </MobileLayout>
    );
  }

  if (!comparison && hasPartnerConnection) {
    return (
      <MobileLayout>
        <div className="p-mobile-padding">
          <div className="text-center py-12 space-y-4">
            <RefreshCw className="w-16 h-16 mx-auto text-muted-foreground animate-spin" />
            <div className="space-y-2">
              <h2 className="text-xl font-semibold">Loading Comparison</h2>
              <p className="text-muted-foreground">
                Analyzing your subscriptions...
              </p>
            </div>
          </div>
        </div>
      </MobileLayout>
    );
  }

  if (!hasPartnerConnection) {
    return (
      <MobileLayout>
        <div className="p-mobile-padding">
          <div className="text-center py-12 space-y-4">
            <Users className="w-16 h-16 mx-auto text-muted-foreground" />
            <div className="space-y-2">
              <h2 className="text-xl font-semibold">No Partner Connected</h2>
              <p className="text-muted-foreground">
                Connect with a partner to start comparing subscriptions and find savings
              </p>
            </div>
            <div className="space-y-3">
              <Button onClick={() => navigate("/link")} className="bg-primary text-primary-foreground">
                Connect Partner
              </Button>
              <div className="pt-4">
                <h3 className="font-medium mb-3 text-foreground">Your Current Subscriptions:</h3>
                {userSubscriptions.length > 0 ? (
                  <div className="space-y-2">
                    {userSubscriptions.map((service) => (
                      <Card key={service.id} className="bg-gradient-card">
                        <CardContent className="p-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-white dark:bg-white rounded-lg flex items-center justify-center p-1 shadow-sm">
                                {service.logo_url ? (
                                  <img 
                                    src={service.logo_url} 
                                    alt={`${service.name} logo`} 
                                    className="w-full h-full object-contain"
                                    onError={(e) => {
                                      const target = e.target as HTMLImageElement;
                                      target.style.display = 'none';
                                      const parent = target.parentElement;
                                      if (parent) {
                                        parent.innerHTML = `<div class="w-full h-full bg-gradient-primary rounded flex items-center justify-center text-xs font-bold text-white">${service.name.charAt(0)}</div>`;
                                      }
                                    }}
                                  />
                                ) : (
                                  <div className="w-full h-full bg-gradient-primary rounded flex items-center justify-center text-xs font-bold text-white">
                                    {service.name.charAt(0)}
                                  </div>
                                )}
                              </div>
                              <span className="font-medium text-sm">{service.name}</span>
                            </div>
                            {service.monthly_price && (
                              <Badge variant="outline" className="text-xs">
                                ${service.monthly_price}/mo
                              </Badge>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm">No active subscriptions</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout>
      <div className="p-mobile-padding space-y-6">
        {/* Header */}
        <div className="space-y-4 animate-fade-in">
          <h1 className="text-2xl font-bold text-foreground">Compare Subscriptions</h1>
          <p className="text-muted-foreground text-sm">
            Comparing with {comparison.partnerName || "your partner"}
          </p>
        </div>

        {/* Savings Summary */}
        <Card className="bg-gradient-primary text-white">
          <CardContent className="p-4 text-center space-y-2">
            <DollarSign className="w-8 h-8 mx-auto mb-2" />
            <div>
              <p className="text-white/80 text-sm">Potential Monthly Savings</p>
              <p className="text-3xl font-bold">${comparison.totalSavings.toFixed(2)}</p>
            </div>
            <p className="text-white/80 text-xs">
              By sharing {comparison.bothHave.length} duplicate services
            </p>
          </CardContent>
        </Card>

        {/* Comparison Columns */}
        <div className="space-y-4">
          {/* Both Have */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">Both Have</h2>
              <Badge variant="destructive" className="bg-subcircle-error">
                {comparison.bothHave.length} duplicates
              </Badge>
            </div>
            
            {comparison.bothHave.length > 0 ? (
              <div className="space-y-2">
                {comparison.bothHave.map((service) => (
                  <Card key={service.id} className="border-subcircle-error/20">
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-white dark:bg-white rounded-lg flex items-center justify-center p-1.5 shadow-service">
                            {service.logo_url ? (
                              <img 
                                src={service.logo_url} 
                                alt={`${service.name} logo`} 
                                className="w-full h-full object-contain"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.style.display = 'none';
                                  const parent = target.parentElement;
                                  if (parent) {
                                    parent.innerHTML = `<div class="w-full h-full bg-gradient-primary rounded-lg flex items-center justify-center text-sm font-bold text-white">${service.name.charAt(0)}</div>`;
                                  }
                                }}
                              />
                            ) : (
                              <div className="w-full h-full bg-gradient-primary rounded-lg flex items-center justify-center text-sm font-bold text-white">
                                {service.name.charAt(0)}
                              </div>
                            )}
                          </div>
                          <div>
                            <span className="font-semibold text-sm">{service.name}</span>
                            {service.category && (
                              <p className="text-xs text-muted-foreground">{service.category}</p>
                            )}
                          </div>
                        </div>
                        {service.monthly_price && (
                          <Badge variant="outline" className="text-xs">
                            ${service.monthly_price}/mo
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-4 text-center text-muted-foreground">
                  <p className="text-sm">No shared subscriptions</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Only You */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">Only You</h2>
              <Badge variant="secondary">
                {comparison.onlyYou.length} unique
              </Badge>
            </div>
            
            {comparison.onlyYou.length > 0 ? (
              <div className="space-y-2">
                {comparison.onlyYou.map((service) => (
                  <Card key={service.id}>
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-white dark:bg-white rounded-lg flex items-center justify-center p-1.5 shadow-service">
                            {service.logo_url ? (
                              <img 
                                src={service.logo_url} 
                                alt={`${service.name} logo`} 
                                className="w-full h-full object-contain"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.style.display = 'none';
                                  const parent = target.parentElement;
                                  if (parent) {
                                    parent.innerHTML = `<div class="w-full h-full bg-gradient-primary rounded-lg flex items-center justify-center text-sm font-bold text-white">${service.name.charAt(0)}</div>`;
                                  }
                                }}
                              />
                            ) : (
                              <div className="w-full h-full bg-gradient-primary rounded-lg flex items-center justify-center text-sm font-bold text-white">
                                {service.name.charAt(0)}
                              </div>
                            )}
                          </div>
                          <div>
                            <span className="font-semibold text-sm">{service.name}</span>
                            {service.category && (
                              <p className="text-xs text-muted-foreground">{service.category}</p>
                            )}
                          </div>
                        </div>
                        {service.monthly_price && (
                          <Badge variant="outline" className="text-xs">
                            ${service.monthly_price}/mo
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-4 text-center text-muted-foreground">
                  <p className="text-sm">No unique subscriptions</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Only Partner */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">Only Partner</h2>
              <Badge variant="secondary">
                {comparison.onlyPartner.length} unique
              </Badge>
            </div>
            
            {comparison.onlyPartner.length > 0 ? (
              <div className="space-y-2">
                {comparison.onlyPartner.map((service) => (
                  <Card key={service.id}>
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-white dark:bg-white rounded-lg flex items-center justify-center p-1.5 shadow-service">
                            {service.logo_url ? (
                              <img 
                                src={service.logo_url} 
                                alt={`${service.name} logo`} 
                                className="w-full h-full object-contain"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.style.display = 'none';
                                  const parent = target.parentElement;
                                  if (parent) {
                                    parent.innerHTML = `<div class="w-full h-full bg-gradient-primary rounded-lg flex items-center justify-center text-sm font-bold text-white">${service.name.charAt(0)}</div>`;
                                  }
                                }}
                              />
                            ) : (
                              <div className="w-full h-full bg-gradient-primary rounded-lg flex items-center justify-center text-sm font-bold text-white">
                                {service.name.charAt(0)}
                              </div>
                            )}
                          </div>
                          <div>
                            <span className="font-semibold text-sm">{service.name}</span>
                            {service.category && (
                              <p className="text-xs text-muted-foreground">{service.category}</p>
                            )}
                          </div>
                        </div>
                        {service.monthly_price && (
                          <Badge variant="outline" className="text-xs">
                            ${service.monthly_price}/mo
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-4 text-center text-muted-foreground">
                  <p className="text-sm">No unique subscriptions</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Share Button */}
        <Button
          onClick={shareComparison}
          className="w-full bg-accent text-accent-foreground py-6 text-base font-semibold"
          size="lg"
        >
          <Share2 className="w-5 h-5 mr-2" />
          Share via SMS
        </Button>

        {/* Tips */}
        <Card className="border-subcircle-cyan/20 bg-subcircle-cyan/5">
          <CardContent className="p-4">
            <div className="space-y-2">
              <h4 className="font-medium text-sm">💡 Money-saving tips</h4>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Cancel duplicate subscriptions you both have</li>
                <li>• Share family plans to split costs</li>
                <li>• Take turns paying for different services</li>
                <li>• Try free trials before committing</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </MobileLayout>
  );
}