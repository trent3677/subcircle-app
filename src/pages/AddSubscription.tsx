import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Tv, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { ThemeToggle } from '@/components/ThemeToggle';
import { getServiceLogo, handleLogoError, hasServiceLogo } from '@/lib/logo-utils';
import { MobileLayout } from '@/components/mobile/MobileLayout';

interface StreamingService {
  id: string;
  name: string;
  logo_url: string | null;
  monthly_price: number | null;
  category: string | null;
  description: string | null;
  website_url?: string | null;
}

// Logo handling moved to centralized utility
const AddSubscription = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [services, setServices] = useState<StreamingService[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [addingService, setAddingService] = useState<string | null>(null);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      // TODO: Replace with backend API call
      // For now, provide some mock services to get app working
      const mockServices = [
        {
          id: '1',
          name: 'Netflix',
          logo_url: null,
          monthly_price: 15.99,
          category: 'streaming',
          description: 'Stream TV shows and movies'
        },
        {
          id: '2',
          name: 'Spotify',
          logo_url: null,
          monthly_price: 9.99,
          category: 'music',
          description: 'Music streaming service'
        }
      ];
      setServices(mockServices);
    } catch (error) {
      console.error('Error fetching services:', error);
      toast({
        title: "Error",
        description: "Failed to load streaming services",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddSubscription = async (serviceId: string) => {
    if (!user) return;
    
    setAddingService(serviceId);
    try {
      // TODO: Replace with backend API call
      // For now, just show success message
      
      toast({
        title: "Success",
        description: "Subscription added successfully (mock)"
      });
      
      navigate('/');
    } catch (error) {
      console.error('Error adding subscription:', error);
      toast({
        title: "Error",
        description: "Failed to add subscription",
        variant: "destructive"
      });
    } finally {
      setAddingService(null);
    }
  };

  const filteredServices = services.filter(service =>
    service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    service.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <MobileLayout>
        <div className="min-h-screen flex items-center justify-center bg-gradient-subtle">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-gradient-primary rounded-2xl mx-auto flex items-center justify-center shadow-elegant animate-pulse">
              <Tv className="w-8 h-8 text-white" />
            </div>
            <p className="text-muted-foreground">Loading streaming services...</p>
          </div>
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout showHeader={false}>
      <div className="min-h-screen bg-gradient-subtle">
        {/* Header */}
        <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {/* Logo */}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm">
                  <img 
                    src="/lovable-uploads/105cee16-9e7f-45ba-9b51-01a7a6f35377.png" 
                    alt="SubCircle" 
                    className="w-6 h-6 object-contain"
                  />
                </div>
              </div>
              <ThemeToggle />
              <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <h1 className="text-xl font-bold">Add Service</h1>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search streaming services..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Services Grid */}
        <div className="space-y-4">
          {filteredServices.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center">
                <Tv className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  {searchQuery ? 'No services found matching your search' : 'No streaming services available'}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredServices.map((service) => (
              <Card key={service.id} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-white dark:bg-white border border-border p-2 rounded-lg flex items-center justify-center overflow-hidden shadow-sm">
                        {hasServiceLogo(service) ? (
                          <img 
                            src={getServiceLogo(service)}
                            alt={`${service.name} logo`}
                            className="w-full h-full object-contain"
                            loading="lazy"
                            referrerPolicy="no-referrer"
                            onError={(e) => handleLogoError(e, service)}
                          />
                        ) : null}
                        <Tv className={`w-6 h-6 text-muted-foreground ${hasServiceLogo(service) ? 'hidden' : ''}`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold">{service.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {service.monthly_price ? `$${service.monthly_price}/month` : 'Pricing varies'}
                        </p>
                        {service.category && (
                          <p className="text-xs text-muted-foreground capitalize">
                            {service.category}
                          </p>
                        )}
                      </div>
                    </div>
                    <Button
                      onClick={() => handleAddSubscription(service.id)}
                      disabled={addingService === service.id}
                      size="sm"
                    >
                      {addingService === service.id ? 'Adding...' : 'Add'}
                    </Button>
                  </div>
                  {service.description && (
                    <p className="text-sm text-muted-foreground mt-3 ml-16">
                      {service.description}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
        </main>
      </div>
    </MobileLayout>
  );
};

export default AddSubscription;