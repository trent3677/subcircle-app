import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Smartphone, Shield, Users, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { ThemeToggle } from '@/components/ThemeToggle';

const Index = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      // User is authenticated, redirect to dashboard
      navigate('/dashboard');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-subtle">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-white dark:bg-white rounded-2xl mx-auto flex items-center justify-center shadow-elegant animate-pulse p-2">
            <img 
              src="/lovable-uploads/105cee16-9e7f-45ba-9b51-01a7a6f35377.png" 
              alt="SubCircle Logo" 
              className="w-full h-full object-contain"
            />
          </div>
          <p className="text-muted-foreground">Loading SubCircle...</p>
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Theme Toggle */}
      <div className="absolute top-4 left-4 z-10">
        <ThemeToggle />
      </div>
      
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center space-y-8">
          <div className="space-y-4">
            <div className="w-20 h-20 bg-white dark:bg-white rounded-3xl mx-auto flex items-center justify-center shadow-elegant p-3">
              <img 
                src="/lovable-uploads/105cee16-9e7f-45ba-9b51-01a7a6f35377.png" 
                alt="SubCircle Logo" 
                className="w-full h-full object-contain"
              />
            </div>
            <h1 className="text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              SubCircle
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Manage your streaming services securely and share subscriptions with friends and family - 
              all while keeping your credentials private.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={() => navigate('/auth')}
              className="text-lg px-8 py-6"
            >
              Get Started
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => navigate('/auth')}
              className="text-lg px-8 py-6"
            >
              Sign In
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mt-16">
          <Card className="shadow-card border-trust-blue/20">
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-trust-blue/10 rounded-xl mx-auto flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-trust-blue" />
              </div>
              <CardTitle>Privacy First</CardTitle>
              <CardDescription>
                Your streaming passwords never leave your device. Everything is encrypted locally.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="shadow-card border-accent/20">
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-accent/10 rounded-xl mx-auto flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-accent" />
              </div>
              <CardTitle>Share & Compare</CardTitle>
              <CardDescription>
                Connect with partners to see which services you both have and avoid duplicate subscriptions.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="shadow-card border-primary/20">
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-xl mx-auto flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>Smart Management</CardTitle>
              <CardDescription>
                Track all your streaming subscriptions in one place with easy management tools.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
