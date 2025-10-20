import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Eye, Shield } from "lucide-react";

export default function Onboarding() {
  const { user, signInWithGoogle, signInWithReplit, enterDemoMode } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleReplitSignIn = async () => {
    try {
      signInWithReplit();
    } catch (error) {
      console.error("Replit sign in failed:", error);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      signInWithGoogle();
    } catch (error) {
      console.error("Google sign in failed:", error);
    }
  };

  const handleDemoMode = () => {
    enterDemoMode();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-primary flex flex-col justify-center items-center p-mobile-padding text-center">
      {/* Logo and branding */}
      <div className="mb-8 space-y-4">
        <div className="w-24 h-24 bg-white rounded-full mx-auto flex items-center justify-center shadow-elegant p-3">
          <img 
            src="/lovable-uploads/105cee16-9e7f-45ba-9b51-01a7a6f35377.png" 
            alt="SubCircle Logo" 
            className="w-full h-full object-contain"
          />
        </div>
        
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-white">SubCircle</h1>
          <p className="text-lg text-white/90 font-medium">Track. Share. Never double-pay.</p>
        </div>
      </div>

      {/* Subheadline */}
      <p className="text-white/80 text-base mb-12 max-w-sm leading-relaxed px-4">
        Keep your streaming subscriptions in sync with friends or family.
      </p>

      {/* Authentication Options */}
      <div className="w-full max-w-sm space-y-4">
        {/* Primary: Replit Auth */}
        <Button
          onClick={handleReplitSignIn}
          className="w-full bg-white text-black hover:bg-gray-100 shadow-card py-6 text-base font-semibold rounded-lg border-2 border-white/20"
          size="lg"
          data-testid="button-replit-signin"
        >
          <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" fill="currentColor">
            <path d="M7.27 2.75v7.5h7.5v-7.5h-7.5zM16.73 2.75V12H7.27v7.25h7.5V24h1.96V2.75h-1.96z" fill="#F26207"/>
          </svg>
          Continue with Replit
        </Button>
        
        {/* Secondary: Google Auth */}
        <Button
          onClick={handleGoogleSignIn}
          variant="outline"
          className="w-full border-white/30 text-white hover:bg-white/10 hover:text-white py-6 text-base font-medium rounded-lg"
          size="lg"
          data-testid="button-google-signin"
        >
          <svg className="w-4 h-4 mr-3" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Sign in with Google
        </Button>
        
        {/* Demo Mode */}
        <div className="flex items-center gap-4 text-white/60 text-sm">
          <div className="flex-1 h-px bg-white/20"></div>
          <span>or explore features</span>
          <div className="flex-1 h-px bg-white/20"></div>
        </div>
        
        <Button
          onClick={handleDemoMode}
          variant="outline"
          className="w-full border-white/30 text-white hover:bg-white/10 hover:text-white py-6 text-base font-medium rounded-lg"
          size="lg"
          data-testid="button-demo-mode"
        >
          <Eye className="w-4 h-4 mr-3" />
          Try Demo Mode
        </Button>
      </div>

      {/* Footer */}
      <div className="mt-12 text-white/60 text-sm text-center space-y-2">
        <p>By continuing, you agree to our</p>
        <div className="space-x-4">
          <a href="#" className="underline hover:text-white">Terms of Service</a>
          <a href="#" className="underline hover:text-white">Privacy Policy</a>
        </div>
      </div>
    </div>
  );
}