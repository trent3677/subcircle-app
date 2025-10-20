import { useState, useEffect } from "react";
import { MobileLayout } from "@/components/mobile/MobileLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Search, TrendingUp, Star, Zap, RefreshCw, HelpCircle, Check, Eye, BarChart3, Users, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { ServiceCardSkeleton } from "@/components/ui/loading-skeleton";
import { cn } from "@/lib/utils";
import { usePullRefresh } from "@/hooks/use-pull-refresh";
import { getServiceLogo, handleLogoError, hasServiceLogo } from "@/lib/logo-utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface StreamingService {
  id: string;
  name: string;
  logo_url?: string | null;
  category?: string;
  monthly_price?: number;
  description?: string;
  website_url?: string | null;
}

interface UserSubscription {
  id: string;
  service_id: string;
  is_active: boolean;
}

const customServiceSchema = z.object({
  name: z.string().min(1, "Service name is required"),
  monthlyPrice: z.string().optional(),
  category: z.string().min(1, "Category is required"),
  description: z.string().optional(),
  websiteUrl: z.string().optional(),
});

type CustomServiceFormData = z.infer<typeof customServiceSchema>;

export default function Catalog() {
  const [services, setServices] = useState<StreamingService[]>([]);
  const [userSubscriptions, setUserSubscriptions] = useState<UserSubscription[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [showCustomDialog, setShowCustomDialog] = useState(false);
  const { user, isDemoMode } = useAuth();
  const { toast } = useToast();

  const customForm = useForm<CustomServiceFormData>({
    resolver: zodResolver(customServiceSchema),
    defaultValues: {
      name: "",
      monthlyPrice: "",
      category: "streaming",
      description: "",
      websiteUrl: "",
    },
  });

  // Pull to refresh
  const handleRefresh = async () => {
    await Promise.all([fetchServices(), user && fetchUserSubscriptions()]);
    toast({
      title: "Refreshed",
      description: "Catalog updated successfully",
    });
  };

  const { isRefreshing, pullDistance, pullToRefreshProps } = usePullRefresh({
    onRefresh: handleRefresh,
    threshold: 80,
    disabled: loading,
  });

  // Fetch streaming services
  useEffect(() => {
    fetchServices();
    if (user) {
      fetchUserSubscriptions();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchServices = async () => {
    try {
      // TODO: Replace with backend API call
      // For now, provide mock services to get app working
      const mockServices = [
        {
          id: '1',
          name: 'Netflix',
          logo_url: null,
          category: 'streaming',
          monthly_price: 15.99,
          description: 'Stream TV shows and movies'
        },
        {
          id: '2',
          name: 'Spotify',
          logo_url: null,
          category: 'music',
          monthly_price: 9.99,
          description: 'Music streaming service'
        },
        {
          id: '3',
          name: 'Disney+',
          logo_url: null,
          category: 'streaming',
          monthly_price: 7.99,
          description: 'Disney content streaming'
        },
        {
          id: '4',
          name: 'Hulu',
          logo_url: null,
          category: 'streaming',
          monthly_price: 5.99,
          description: 'Watch current TV and movies'
        },
        {
          id: '5',
          name: 'Amazon Prime Video',
          logo_url: null,
          category: 'streaming',
          monthly_price: 8.99,
          description: 'Prime Video streaming service'
        },
        {
          id: '6',
          name: 'HBO Max',
          logo_url: null,
          category: 'streaming',
          monthly_price: 14.99,
          description: 'Premium content streaming'
        },
        {
          id: '7',
          name: 'Apple Music',
          logo_url: null,
          category: 'music',
          monthly_price: 9.99,
          description: 'Apple music streaming'
        },
        {
          id: '8',
          name: 'YouTube Premium',
          logo_url: null,
          category: 'streaming',
          monthly_price: 11.99,
          description: 'Ad-free YouTube experience'
        },
        {
          id: '9',
          name: 'Crunchyroll',
          logo_url: null,
          category: 'streaming',
          monthly_price: 7.99,
          description: 'Anime and manga streaming'
        },
        {
          id: '10',
          name: 'Shudder',
          logo_url: null,
          category: 'streaming',
          monthly_price: 4.99,
          description: 'Horror and thriller streaming'
        },
        {
          id: '11',
          name: 'Kayo',
          logo_url: null,
          category: 'streaming',
          monthly_price: 25.00,
          description: 'Australian sports streaming'
        }
      ];
      setServices(mockServices);
    } catch (error) {
      console.error("Error fetching services:", error);
      toast({
        title: "Error",
        description: "Failed to load streaming services",
        variant: "destructive",
      });
    }
  };

  const fetchUserSubscriptions = async () => {
    if (!user) return;
    
    try {
      if (isDemoMode) {
        // Use demo subscriptions to match vault data
        const demoSubs = [
          { id: 'demo-sub-1', service_id: '1', is_active: true }, // Netflix
          { id: 'demo-sub-2', service_id: '2', is_active: true }, // Spotify  
          { id: 'demo-sub-3', service_id: '3', is_active: true }, // Disney+
        ];
        setUserSubscriptions(demoSubs);
      } else {
        // TODO: Replace with backend API call
        // For now, use empty array to get app working
        setUserSubscriptions([]);
      }
    } catch (error) {
      console.error("Error fetching user subscriptions:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleSubscription = async (serviceId: string, hasSubscription: boolean) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to manage subscriptions",
        variant: "destructive",
      });
      return;
    }

    try {
      if (hasSubscription) {
        // TODO: Remove subscription via backend API
        setUserSubscriptions(prev => 
          prev.filter(sub => sub.service_id !== serviceId)
        );
        toast({
          title: "Success",
          description: "Subscription removed (mock)",
        });
      } else {
        // TODO: Add subscription via backend API
        const newSub = { id: Date.now().toString(), service_id: serviceId, is_active: true };
        setUserSubscriptions(prev => [...prev, newSub]);
        toast({
          title: "Success",
          description: "Subscription added (mock)",
        });
      }
    } catch (error) {
      console.error("Error toggling subscription:", error);
      toast({
        title: "Error",
        description: "Failed to update subscription",
        variant: "destructive",
      });
    }
  };

  const handleCreateCustomService = async (data: CustomServiceFormData) => {
    if (!user) return;
    
    try {
      // Create new custom service
      const newService: StreamingService = {
        id: `custom-${Date.now()}`,
        name: data.name,
        logo_url: null,
        category: data.category,
        monthly_price: data.monthlyPrice ? parseFloat(data.monthlyPrice) : undefined,
        description: data.description || `Custom ${data.category} service`,
        website_url: data.websiteUrl || null,
      };

      // Add to services list
      setServices(prev => [...prev, newService]);

      // Automatically add to user's subscriptions
      const newSub = {
        id: Math.random().toString(),
        service_id: newService.id,
        is_active: true
      };
      setUserSubscriptions(prev => [...prev, newSub]);

      // Reset form and close dialog
      customForm.reset();
      setShowCustomDialog(false);
      setSearchQuery(""); // Clear search to show the new service

      toast({
        title: "Success",
        description: `${data.name} has been added to your vault`,
      });
    } catch (error) {
      console.error("Error creating custom service:", error);
      toast({
        title: "Error",
        description: "Failed to create custom service",
        variant: "destructive",
      });
    }
  };

  const handleCustomDialogOpen = () => {
    // Pre-fill the service name from search query if available
    if (searchQuery.trim()) {
      customForm.setValue("name", searchQuery.trim());
    }
    setShowCustomDialog(true);
  };

  const filteredServices = services.filter(service =>
    service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    service.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const categories = [...new Set(services.map(s => s.category).filter(Boolean))];

  // Get suggested services (popular ones that user doesn't already have)
  const suggestedServices = services.filter(service => {
    const hasSubscription = userSubscriptions.some(sub => sub.service_id === service.id);
    return !hasSubscription && ['1', '2', '3', '4', '5'].includes(service.id); // Netflix, Spotify, Disney+, Hulu, Prime Video
  }).slice(0, 4);

  if (loading) {
    return (
      <MobileLayout>
        <div className="p-mobile-padding space-y-6">
          {/* Header skeleton */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="h-8 w-48 bg-muted rounded-lg animate-shimmer bg-gradient-to-r from-muted via-muted/50 to-muted bg-[length:200px_100%]" />
              <div className="h-7 w-16 bg-muted rounded-full animate-shimmer bg-gradient-to-r from-muted via-muted/50 to-muted bg-[length:200px_100%]" />
            </div>
            <div className="h-10 w-full bg-muted rounded-lg animate-shimmer bg-gradient-to-r from-muted via-muted/50 to-muted bg-[length:200px_100%]" />
          </div>
          
          {/* Category filters skeleton */}
          <div className="flex gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-8 w-16 bg-muted rounded-md animate-shimmer bg-gradient-to-r from-muted via-muted/50 to-muted bg-[length:200px_100%]" />
            ))}
          </div>
          
          {/* Services grid skeleton */}
          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <ServiceCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout>
      <div className="relative">
        {/* Pull to refresh indicator */}
        {pullDistance > 0 && (
          <div 
            className="absolute top-0 left-0 right-0 flex justify-center items-center bg-primary/10 backdrop-blur-sm z-50 transition-all duration-200"
            style={{ 
              height: `${Math.min(pullDistance, 80)}px`,
              transform: `translateY(-${Math.max(0, 80 - pullDistance)}px)`
            }}
          >
            <RefreshCw 
              className={cn(
                "text-primary transition-all duration-200",
                isRefreshing ? "animate-spin" : "",
                pullDistance >= 80 ? "scale-110" : "scale-90"
              )}
              size={24}
            />
          </div>
        )}
        
        <div className="p-mobile-padding space-y-6" {...pullToRefreshProps}>
        {/* Header */}
        <div className="space-y-4 animate-fade-in">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Discover</h1>
              <p className="text-sm text-muted-foreground">Find your perfect streaming services</p>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-10 h-10 rounded-full hover:bg-primary/10"
                  data-testid="button-help-tutorial"
                >
                  <HelpCircle className="w-5 h-5 text-muted-foreground hover:text-primary" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md mx-auto">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <HelpCircle className="w-5 h-5 text-primary" />
                    How to Use SubCircle
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-4">
                    {/* Step 1 */}
                    <div className="flex gap-3">
                      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm">Discover Services</h4>
                        <p className="text-sm text-muted-foreground">
                          Browse streaming services and toggle switches to add them to your vault
                        </p>
                      </div>
                    </div>
                    
                    {/* Step 2 */}
                    <div className="flex gap-3">
                      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                        <Eye className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm">Manage Your Vault</h4>
                        <p className="text-sm text-muted-foreground">
                          Store and organize your subscriptions with secure credential sharing
                        </p>
                      </div>
                    </div>
                    
                    {/* Step 3 */}
                    <div className="flex gap-3">
                      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                        <Users className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm">Connect with Partners</h4>
                        <p className="text-sm text-muted-foreground">
                          Link with friends or family to share subscriptions and avoid double-paying
                        </p>
                      </div>
                    </div>
                    
                    {/* Step 4 */}
                    <div className="flex gap-3">
                      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                        <BarChart3 className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm">Compare & Save</h4>
                        <p className="text-sm text-muted-foreground">
                          See which services you and your partners share to maximize savings
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <p className="text-xs text-muted-foreground text-center">
                      💡 Use the bottom navigation to explore all features
                    </p>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search services..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 rounded-lg"
            />
          </div>
        </div>

        {/* Suggested Services */}
        {suggestedServices.length > 0 && searchQuery === "" && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold text-foreground">Suggested for You</h3>
              <Badge variant="secondary" className="text-xs px-2 py-0.5 bg-gradient-accent text-white border-0">
                <TrendingUp className="w-3 h-3 mr-1" />
                Popular
              </Badge>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {suggestedServices.map((service) => {
                const hasSubscription = userSubscriptions.some(
                  sub => sub.service_id === service.id
                );
                
                return (
                  <Card
                    key={service.id}
                    className="group relative overflow-hidden border-0 bg-gradient-card hover:shadow-card-hover hover:scale-[1.02] transition-all duration-300 ease-bounce flex-shrink-0 w-40"
                  >
                    <div className="p-3 space-y-2 relative z-10">
                      {/* Service icon */}
                      <div className="flex items-center justify-between">
                        <div className="w-12 h-12 bg-background border border-border/20 rounded-xl flex items-center justify-center p-2 shadow-service group-hover:shadow-service group-hover:scale-110 transition-all duration-300">
                          <img
                            src={getServiceLogo(service)}
                            alt={`${service.name} logo`}
                            className="w-full h-full object-contain"
                            loading="lazy"
                            referrerPolicy="no-referrer"
                            onError={(e) => handleLogoError(e, service)}
                          />
                        </div>
                        <Switch
                          checked={hasSubscription}
                          onCheckedChange={() => {
                            toggleSubscription(service.id, hasSubscription);
                            if (navigator.vibrate) {
                              navigator.vibrate(hasSubscription ? [50] : [50, 50, 50]);
                            }
                          }}
                          className="scale-75"
                        />
                      </div>
                      
                      <div className="space-y-1">
                        <h4 className="font-semibold text-sm leading-tight group-hover:text-primary transition-colors">
                          {service.name}
                        </h4>
                        {service.monthly_price && (
                          <p className="text-primary font-medium text-xs">
                            ${service.monthly_price}/mo
                          </p>
                        )}
                      </div>
                    </div>
                    
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </Card>
                );
              })}
            </div>
          </div>
        )}


        {/* Services grid */}
        <div className="grid grid-cols-2 gap-4">
          {filteredServices.map((service, index) => {
            const hasSubscription = userSubscriptions.some(
              sub => sub.service_id === service.id
            );
            
            return (
              <Card
                key={service.id}
                className={cn(
                  "group relative overflow-hidden border-0 bg-gradient-card",
                  "hover:shadow-card-hover hover:scale-[1.02] transition-all duration-300 ease-bounce",
                  "animate-slide-up",
                  hasSubscription && "ring-2 ring-primary/20 shadow-service"
                )}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Service card content */}
                <div className="p-4 space-y-3 relative z-10">
                  {/* Service icon and badges */}
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="w-14 h-14 bg-background border border-border/20 rounded-xl flex items-center justify-center p-2.5 shadow-service group-hover:shadow-service group-hover:scale-110 transition-all duration-300">
                        <img
                          src={getServiceLogo(service)}
                          alt={`${service.name} logo`}
                          className="w-full h-full object-contain"
                          loading="lazy"
                          referrerPolicy="no-referrer"
                          onError={(e) => handleLogoError(e, service)}
                        />
                      </div>
                      
                      {/* Popular badge (show on some services as example) */}
                      {index < 3 && (
                        <Badge variant="secondary" className="text-xs px-2 py-0.5 bg-gradient-accent text-white border-0">
                          <TrendingUp className="w-3 h-3 mr-1" />
                          Popular
                        </Badge>
                      )}
                    </div>
                    
                    <div className="space-y-1">
                      <h3 className="font-semibold text-sm leading-tight group-hover:text-primary transition-colors">
                        {service.name}
                      </h3>
                      <div className="flex items-center justify-between">
                        {service.monthly_price && (
                          <p className="text-primary font-medium text-sm">
                            ${service.monthly_price}/mo
                          </p>
                        )}
                        {service.category && (
                          <Badge variant="outline" className="text-xs">
                            {service.category}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Quick action button */}
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      {hasSubscription ? (
                        <>
                          <Zap className="w-3 h-3 text-primary" />
                          In your vault
                        </>
                      ) : (
                        "Add to vault"
                      )}
                    </span>
                    <Switch
                      checked={hasSubscription}
                      onCheckedChange={() => {
                        toggleSubscription(service.id, hasSubscription);
                        // Add haptic feedback for mobile
                        if (navigator.vibrate) {
                          navigator.vibrate(hasSubscription ? [50] : [50, 50, 50]);
                        }
                      }}
                      className="scale-90"
                    />
                  </div>
                </div>

                {/* Gradient overlay for visual depth */}
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Card>
            );
          })}
        </div>

        {/* Empty state with custom service option */}
        {filteredServices.length === 0 && (
          <div className="text-center py-12 space-y-4">
            <p className="text-muted-foreground">No services found</p>
            <p className="text-sm text-muted-foreground">
              {searchQuery ? `Can't find "${searchQuery}"?` : "Try adjusting your search"}
            </p>
            {searchQuery && user && (
              <Button
                onClick={handleCustomDialogOpen}
                className="mt-4"
                data-testid="button-add-custom-service"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Custom Service
              </Button>
            )}
          </div>
        )}
        </div>
      </div>

      {/* Custom Service Dialog */}
      <Dialog open={showCustomDialog} onOpenChange={setShowCustomDialog}>
        <DialogContent className="max-w-md mx-auto">
          <DialogHeader>
            <DialogTitle>Add Custom Service</DialogTitle>
            <DialogDescription>
              Create a custom subscription service that's not in our catalog
            </DialogDescription>
          </DialogHeader>
          <Form {...customForm}>
            <form onSubmit={customForm.handleSubmit(handleCreateCustomService)} className="space-y-4">
              <FormField
                control={customForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Service Name *</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g. My Streaming Service" 
                        {...field} 
                        data-testid="input-custom-service-name"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={customForm.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="select-custom-service-category">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="streaming">Streaming</SelectItem>
                        <SelectItem value="music">Music</SelectItem>
                        <SelectItem value="gaming">Gaming</SelectItem>
                        <SelectItem value="software">Software</SelectItem>
                        <SelectItem value="news">News & Media</SelectItem>
                        <SelectItem value="fitness">Fitness</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={customForm.control}
                name="monthlyPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Monthly Price (optional)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="0.01" 
                        placeholder="0.00" 
                        {...field} 
                        data-testid="input-custom-service-price"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={customForm.control}
                name="websiteUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Website URL (optional)</FormLabel>
                    <FormControl>
                      <Input 
                        type="url" 
                        placeholder="https://example.com" 
                        {...field} 
                        data-testid="input-custom-service-url"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={customForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description (optional)</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Brief description of the service" 
                        {...field} 
                        data-testid="input-custom-service-description"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-2 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowCustomDialog(false)}
                  className="flex-1"
                  data-testid="button-cancel-custom-service"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="flex-1"
                  data-testid="button-create-custom-service"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Service
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </MobileLayout>
  );
}