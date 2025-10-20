import { useState } from "react";
import { MobileLayout } from "@/components/mobile/MobileLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { 
  Shield, 
  Download, 
  Trash2, 
  ExternalLink, 
  Mail, 
  User, 
  Moon, 
  Sun,
  Smartphone,
  FileText,
  HelpCircle
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeProvider";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

export default function MobileSettings() {
  const [requireBiometric, setRequireBiometric] = useState(false);
  const [requirePin, setRequirePin] = useState(false);
  const { user, signOut } = useAuth();
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate("/onboarding");
      toast({
        title: "Signed out",
        description: "You have been successfully signed out",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to sign out",
        variant: "destructive",
      });
    }
  };

  const handleExportVault = () => {
    // TODO: Implement vault export
    toast({
      title: "Coming Soon",
      description: "Vault export will be available soon",
    });
  };

  const handleDeleteVault = () => {
    // TODO: Implement vault deletion with confirmation
    toast({
      title: "Coming Soon",
      description: "Vault deletion will be available soon",
    });
  };

  const openLink = (url: string) => {
    window.open(url, '_blank');
  };

  return (
    <MobileLayout>
      <div className="p-mobile-padding space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground text-sm">
            Manage your account and preferences
          </p>
        </div>

        {/* Profile Section */}
        {user ? (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="w-5 h-5" />
                Account
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center text-white font-semibold">
                  {user.email?.charAt(0).toUpperCase() || "?"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{user.email}</p>
                  <p className="text-sm text-muted-foreground">
                    Signed in with Google
                  </p>
                </div>
                <Badge variant="outline" className="text-xs">
                  Premium
                </Badge>
              </div>
              
              <Button
                variant="outline"
                onClick={handleSignOut}
                className="w-full"
              >
                Sign Out
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-6 text-center space-y-3">
              <User className="w-12 h-12 mx-auto text-muted-foreground" />
              <div className="space-y-1">
                <h3 className="font-medium">Not signed in</h3>
                <p className="text-sm text-muted-foreground">
                  Sign in to access all features
                </p>
              </div>
              <Button onClick={() => navigate("/onboarding")} className="bg-primary text-primary-foreground">
                Sign In
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Security Settings */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Security
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="font-medium text-sm">Require PIN for vault</p>
                <p className="text-xs text-muted-foreground">
                  Add an extra layer of security
                </p>
              </div>
              <Switch
                checked={requirePin}
                onCheckedChange={setRequirePin}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="font-medium text-sm">Biometric unlock</p>
                <p className="text-xs text-muted-foreground">
                  Use fingerprint or face unlock
                </p>
              </div>
              <Switch
                checked={requireBiometric}
                onCheckedChange={setRequireBiometric}
              />
            </div>
          </CardContent>
        </Card>

        {/* Appearance */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              {theme === 'dark' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              Appearance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="font-medium text-sm">Dark mode</p>
                <p className="text-xs text-muted-foreground">
                  Toggle between light and dark themes
                </p>
              </div>
              <Switch
                checked={theme === 'dark'}
                onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
              />
            </div>
          </CardContent>
        </Card>

        {/* Vault Management */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Smartphone className="w-5 h-5" />
              Vault Management
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              variant="outline"
              onClick={handleExportVault}
              className="w-full justify-start"
            >
              <Download className="w-4 h-4 mr-2" />
              Export Vault
            </Button>
            
            <Button
              variant="outline"
              onClick={handleDeleteVault}
              className="w-full justify-start text-destructive hover:text-destructive"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Vault
            </Button>
          </CardContent>
        </Card>

        {/* Support & Legal */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <HelpCircle className="w-5 h-5" />
              Support & Legal
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              variant="ghost"
              onClick={() => openLink("mailto:support@subcircle.app")}
              className="w-full justify-start"
            >
              <Mail className="w-4 h-4 mr-2" />
              Support Email
              <ExternalLink className="w-3 h-3 ml-auto" />
            </Button>
            
            <Button
              variant="ghost"
              onClick={() => openLink("#")}
              className="w-full justify-start"
            >
              <FileText className="w-4 h-4 mr-2" />
              Privacy Policy
              <ExternalLink className="w-3 h-3 ml-auto" />
            </Button>
            
            <Button
              variant="ghost"
              onClick={() => openLink("#")}
              className="w-full justify-start"
            >
              <FileText className="w-4 h-4 mr-2" />
              Terms of Service
              <ExternalLink className="w-3 h-3 ml-auto" />
            </Button>
          </CardContent>
        </Card>

        {/* App Info */}
        <Card className="border-subcircle-cyan/20 bg-subcircle-cyan/5">
          <CardContent className="p-4 text-center space-y-2">
            <div className="w-12 h-12 bg-white rounded-full mx-auto flex items-center justify-center p-2 shadow-sm">
              <img 
                src="/lovable-uploads/105cee16-9e7f-45ba-9b51-01a7a6f35377.png" 
                alt="SubCircle Logo" 
                className="w-full h-full object-contain"
              />
            </div>
            <div className="space-y-1">
              <h3 className="font-semibold">SubCircle</h3>
              <p className="text-xs text-muted-foreground">
                Version 1.0.0 • Track. Share. Never double-pay.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </MobileLayout>
  );
}