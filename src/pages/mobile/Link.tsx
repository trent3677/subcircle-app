import { useState, useEffect } from "react";
import { MobileLayout } from "@/components/mobile/MobileLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Copy, Users, UserPlus, CheckCircle, Clock, X, Check } from "lucide-react";
// Removed Supabase import - using backend API instead
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface PartnerConnection {
  id: string;
  user_id: string;
  partner_id: string;
  status: string;
  created_at: string;
  isIncoming?: boolean;
  profiles?: {
    display_name?: string;
    avatar_url?: string;
  } | null;
}

// Demo data for showcasing link features
const demoConnections: PartnerConnection[] = [
  {
    id: 'demo-connection-1',
    user_id: 'demo-user',
    partner_id: 'demo-partner-sarah',
    status: 'active',
    created_at: '2024-01-15T10:00:00Z',
    isIncoming: false,
    profiles: {
      display_name: 'Sarah Johnson',
      avatar_url: null
    }
  },
  {
    id: 'demo-connection-2',
    user_id: 'demo-user',
    partner_id: 'demo-partner-alex',
    status: 'pending',
    created_at: '2024-01-20T14:30:00Z',
    isIncoming: true,
    profiles: {
      display_name: 'Alex Smith',
      avatar_url: null
    }
  }
];

const demoCodes = [
  { code: 'DEMO-SAR', name: 'Sarah Johnson' },
  { code: 'DEMO-ALE', name: 'Alex Smith' },
  { code: 'DEMO-MIK', name: 'Mike Wilson' }
];

export default function Link() {
  const [myLinkCode, setMyLinkCode] = useState("");
  const [partnerCode, setPartnerCode] = useState("");
  const [connections, setConnections] = useState<PartnerConnection[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, isDemoMode } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      generateMyLinkCode();
      fetchConnections();
    } else {
      setLoading(false);
    }
  }, [user]);

  const generateMyLinkCode = () => {
    if (!user) return;
    
    if (isDemoMode) {
      // Use a different code for demo mode to avoid self-connection issues
      setMyLinkCode('DEMO-YOU');
    } else {
      // Generate a simple link code based on user ID (first 8 characters)
      const code = user.id.substring(0, 8).toUpperCase();
      setMyLinkCode(code);
    }
  };

  const fetchConnections = async () => {
    if (!user) return;
    
    try {
      if (isDemoMode) {
        // Use demo data to showcase features
        setTimeout(() => {
          setConnections(demoConnections);
          setLoading(false);
        }, 800); // Simulate loading time
      } else {
        // TODO: Replace with actual backend API call
        // For now, set empty connections to allow the app to build
        setConnections([]);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching connections:", error);
      setLoading(false);
    }
  };

  const copyLinkCode = async () => {
    try {
      await navigator.clipboard.writeText(myLinkCode);
      toast({
        title: "Copied!",
        description: "Your link code has been copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy link code",
        variant: "destructive",
      });
    }
  };

  const sendPartnerRequest = async () => {
    if (!user || !partnerCode.trim()) return;
    
    try {
      setLoading(true);
      
      // Check for self-connection
      const myCode = isDemoMode ? 'DEMO-YOU' : user.id.substring(0, 8).toUpperCase();
      if (partnerCode === myCode) {
        toast({
          title: "Invalid code",
          description: "You cannot connect to yourself",
          variant: "destructive",
        });
        return;
      }
      
      // In demo mode, check if it's a valid demo code
      if (isDemoMode) {
        const validDemoCode = demoCodes.find(demo => demo.code === partnerCode);
        if (!validDemoCode) {
          toast({
            title: "Invalid demo code",
            description: "Try DEMO-SAR, DEMO-ALE, or DEMO-MIK",
            variant: "destructive",
          });
          return;
        }
        
        // Check if already connected
        const alreadyConnected = connections.some(
          conn => conn.profiles?.display_name === validDemoCode.name
        );
        if (alreadyConnected) {
          toast({
            title: "Already connected",
            description: `You are already connected to ${validDemoCode.name}`,
            variant: "destructive",
          });
          return;
        }
        
        toast({
          title: "Demo connection created!",
          description: `Connected to ${validDemoCode.name} (demo mode)`,
        });
      } else {
        // Simulate sending partner request for non-demo mode
        toast({
          title: "Request sent!",
          description: `Connection request sent (simulated)`,
        });
      }
      
      setPartnerCode("");
      await fetchConnections(); // Refresh the list
      
    } catch (error) {
      console.error("Error sending partner request:", error);
      toast({
        title: "Error",
        description: "Failed to send connection request",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4 text-success-green" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'declined':
        return <X className="w-4 h-4 text-destructive" />;
      default:
        return <Clock className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-success-green/10 text-success-green border-success-green/20';
      case 'pending':
        return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20';
      case 'declined':
        return 'bg-destructive/10 text-destructive border-destructive/20';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const handleConnectionAction = async (connectionId: string, action: 'accept' | 'decline') => {
    try {
      // TODO: Implement backend API call
      // For now, just simulate success
      
      toast({
        title: action === 'accept' ? "Connection accepted!" : "Connection declined",
        description: action === 'accept' 
          ? "You can now compare subscriptions with this partner" 
          : "Connection request has been declined",
      });
      
      await fetchConnections(); // Refresh the list
      
    } catch (error) {
      console.error("Error updating connection:", error);
      toast({
        title: "Error",
        description: "Failed to update connection",
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
              <h2 className="text-xl font-semibold">Partner Connections</h2>
              <p className="text-muted-foreground">
                Please sign in to connect with family and friends
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
            <div className="animate-pulse text-muted-foreground">Loading connections...</div>
          </div>
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout>
      <div className="p-mobile-padding space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-foreground">Link Partners</h1>
          <p className="text-muted-foreground text-sm">
            Connect with family and friends to share subscriptions
          </p>
        </div>

        {/* My Link Code */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="w-5 h-5" />
              Your Link Code
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Share this code with family or friends to connect
              </p>
              <div className="flex gap-2">
                <div className="flex-1 p-3 bg-muted rounded-lg text-center">
                  <span className="text-2xl font-bold font-mono tracking-wider">
                    {myLinkCode}
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={copyLinkCode}
                  className="shrink-0"
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Enter Partner Code */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <UserPlus className="w-5 h-5" />
              Connect with Partner
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Enter your partner's link code to connect
              </p>
              <div className="flex gap-2">
                <Input
                  placeholder="Enter partner code"
                  value={partnerCode}
                  onChange={(e) => setPartnerCode(e.target.value.toUpperCase())}
                  className="flex-1 text-center font-mono tracking-wider"
                  maxLength={8}
                />
                <Button
                  onClick={sendPartnerRequest}
                  disabled={!partnerCode.trim()}
                  className="shrink-0 bg-accent text-accent-foreground"
                >
                  Connect
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Active Connections */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-success-green" />
            Your Connections
            {connections.length > 0 && (
              <Badge variant="secondary" className="ml-auto">
                {connections.length}
              </Badge>
            )}
          </h2>

          {connections.length > 0 ? (
            <div className="space-y-3">
              {connections.map((connection) => (
                <Card key={connection.id}>
                  <CardContent className="p-4">
                     <div className="flex items-center justify-between">
                       <div className="flex items-center gap-3">
                         <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center text-white font-semibold">
                           {connection.profiles?.display_name?.charAt(0) || "?"}
                         </div>
                         <div>
                           <h3 className="font-medium">
                             {connection.profiles?.display_name || "Unknown User"}
                           </h3>
                           <p className="text-xs text-muted-foreground">
                             {connection.status === 'pending' && connection.isIncoming 
                               ? "Wants to connect with you"
                               : `Connected ${new Date(connection.created_at).toLocaleDateString()}`
                             }
                           </p>
                         </div>
                       </div>
                       
                       <div className="flex items-center gap-2">
                         {connection.status === 'pending' && connection.isIncoming ? (
                           <div className="flex gap-1">
                             <Button
                               size="sm"
                               variant="outline"
                               onClick={() => handleConnectionAction(connection.id, 'accept')}
                               className="h-8 px-3"
                             >
                               <Check className="w-3 h-3 mr-1" />
                               Accept
                             </Button>
                             <Button
                               size="sm"
                               variant="outline"
                               onClick={() => handleConnectionAction(connection.id, 'decline')}
                               className="h-8 px-3 text-destructive border-destructive/20 hover:bg-destructive/10"
                             >
                               <X className="w-3 h-3 mr-1" />
                               Decline
                             </Button>
                           </div>
                         ) : (
                           <div className="flex items-center gap-2">
                             {getStatusIcon(connection.status)}
                             <Badge
                               variant="outline"
                               className={getStatusColor(connection.status)}
                             >
                               {connection.status.charAt(0).toUpperCase() + connection.status.slice(1)}
                             </Badge>
                           </div>
                         )}
                       </div>
                     </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-6 text-center space-y-3">
                <Users className="w-12 h-12 mx-auto text-muted-foreground" />
                <div className="space-y-1">
                  <h3 className="font-medium">No connections yet</h3>
                  <p className="text-sm text-muted-foreground">
                    Share your link code or enter a partner's code to get started
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Help section */}
        <Card className="border-subcircle-cyan/20 bg-subcircle-cyan/5">
          <CardContent className="p-4">
            <div className="space-y-2">
              <h4 className="font-medium text-sm">
                {isDemoMode ? "Try Demo Codes" : "How it works"}
              </h4>
              {isDemoMode ? (
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Try connecting with <strong>DEMO-SAR</strong> (Sarah Johnson)</li>
                  <li>• Try connecting with <strong>DEMO-ALE</strong> (Alex Smith)</li>
                  <li>• Try connecting with <strong>DEMO-MIK</strong> (Mike Wilson)</li>
                  <li>• These demo codes show different connection statuses</li>
                </ul>
              ) : (
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Share your link code with family or friends</li>
                  <li>• Enter their code to send a connection request</li>
                  <li>• Once connected, compare subscriptions to avoid duplicates</li>
                  <li>• Save money by sharing streaming services</li>
                </ul>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </MobileLayout>
  );
}