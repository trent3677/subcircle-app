import React, { useState } from 'react';
import { Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const AuthPage = () => {
  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = () => {
    setLoading(true);
    // Break out of Replit preview iframe and redirect to login endpoint
    const url = '/api/login';
    if (window.top && window.top !== window.self) {
      // We're in an iframe (Replit preview), redirect the top window
      window.top.location.href = url;
    } else {
      // Normal window, redirect normally
      window.location.href = url;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* App branding */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 bg-white dark:bg-white rounded-2xl mx-auto flex items-center justify-center shadow-elegant p-3">
            <img 
              src="/lovable-uploads/105cee16-9e7f-45ba-9b51-01a7a6f35377.png" 
              alt="SubCircle Logo" 
              className="w-full h-full object-contain"
            />
          </div>
          <h1 className="text-3xl font-bold text-foreground">SubCircle</h1>
          <p className="text-muted-foreground">Your secure streaming vault</p>
        </div>

        {/* Privacy notice */}
        <Card className="border-trust-blue/20 bg-trust-blue/5">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <Shield className="w-5 h-5 text-trust-blue mt-0.5" />
              <div className="space-y-1">
                <p className="text-sm font-medium text-trust-blue">Privacy First</p>
                <p className="text-xs text-trust-blue/80">
                  Your streaming credentials are stored locally on your device and never uploaded to the cloud.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Auth form */}
        <Card className="shadow-card">
          <CardHeader className="space-y-1 text-center">
            <CardTitle>Welcome to SubCircle</CardTitle>
            <CardDescription>
              Sign in with your Google account to get started
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              data-testid="button-google-signin"
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full"
              size="lg"
              asChild
            >
              <a href="/api/login" target="_blank" rel="noopener noreferrer">
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
                {loading ? 'Signing in...' : 'Continue with Google'}
              </a>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AuthPage;