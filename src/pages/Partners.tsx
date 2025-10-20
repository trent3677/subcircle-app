import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Users, Plus, UserCheck, UserX } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

interface PartnerConnection {
  id: string;
  partner_id: string;
  status: string;
  created_at: string;
  profiles: {
    display_name: string | null;
  } | null;
}

interface Profile {
  user_id: string;
  display_name: string | null;
}

const Partners = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [connections, setConnections] = useState<PartnerConnection[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchEmail, setSearchEmail] = useState('');
  const [searching, setSearching] = useState(false);
  const [foundProfile, setFoundProfile] = useState<Profile | null>(null);

  useEffect(() => {
    if (user) {
      fetchConnections();
    }
  }, [user]);

  const fetchConnections = async () => {
    try {
      // TODO: Replace with backend API call
      // For now, use empty array to get app working
      setConnections([]);
    } catch (error) {
      console.error('Error fetching connections:', error);
    } finally {
      setLoading(false);
    }
  };

  const searchForUser = async () => {
    if (!searchEmail.trim()) return;
    
    setSearching(true);
    try {
      // TODO: Replace with backend API call
      // For now, just show "not found" to get app working
      toast({
        title: "User not found",
        description: "No user found with that display name (mock)",
        variant: "destructive"
      });
      setFoundProfile(null);
    } catch (error) {
      console.error('Error searching for user:', error);
      toast({
        title: "Error",
        description: "Failed to search for user",
        variant: "destructive"
      });
    } finally {
      setSearching(false);
    }
  };

  const sendConnectionRequest = async () => {
    if (!foundProfile || !user) return;
    
    try {
      // TODO: Replace with backend API call
      // For now, just show success message
      
      toast({
        title: "Success",
        description: "Connection request sent (mock)"
      });
      
      setFoundProfile(null);
      setSearchEmail('');
      fetchConnections();
    } catch (error) {
      console.error('Error sending connection request:', error);
      toast({
        title: "Error",
        description: "Failed to send connection request",
        variant: "destructive"
      });
    }
  };

  const updateConnectionStatus = async (connectionId: string, status: 'accepted' | 'rejected') => {
    try {
      // TODO: Replace with backend API call
      // For now, just show success message
      
      toast({
        title: "Success",
        description: `Connection ${status} (mock)`
      });
      
      fetchConnections();
    } catch (error) {
      console.error('Error updating connection:', error);
      toast({
        title: "Error",
        description: "Failed to update connection",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-subtle">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-white dark:bg-white rounded-2xl mx-auto flex items-center justify-center shadow-elegant animate-pulse p-3">
            <img 
              src="/lovable-uploads/105cee16-9e7f-45ba-9b51-01a7a6f35377.png" 
              alt="SubCircle Logo" 
              className="w-full h-full object-contain"
            />
          </div>
          <p className="text-muted-foreground">Loading partner connections...</p>
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
            <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h1 className="text-xl font-bold">Partners</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Add Partner Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Plus className="w-5 h-5" />
              <span>Connect with Partner</span>
            </CardTitle>
            <CardDescription>
              Search for users by display name to send connection requests
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex space-x-2">
              <Input
                placeholder="Enter display name..."
                value={searchEmail}
                onChange={(e) => setSearchEmail(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && searchForUser()}
              />
              <Button onClick={searchForUser} disabled={searching}>
                {searching ? 'Searching...' : 'Search'}
              </Button>
            </div>
            
            {foundProfile && (
              <Card className="border-primary/20">
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                        <Users className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium">{foundProfile.display_name || 'User'}</p>
                        <p className="text-sm text-muted-foreground">Found user</p>
                      </div>
                    </div>
                    <Button onClick={sendConnectionRequest}>
                      Send Request
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>

        {/* Partner Connections */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="w-5 h-5" />
              <span>Your Connections</span>
            </CardTitle>
            <CardDescription>
              Manage your partner connections for subscription sharing
            </CardDescription>
          </CardHeader>
          <CardContent>
            {connections.length === 0 ? (
              <div className="text-center py-8 space-y-4">
                <Users className="w-12 h-12 text-muted-foreground mx-auto" />
                <div>
                  <p className="text-muted-foreground">No partner connections yet</p>
                  <p className="text-sm text-muted-foreground">Search for users above to get started</p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {connections.map((connection) => (
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
                          {new Date(connection.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={
                        connection.status === 'accepted' ? "default" : 
                        connection.status === 'pending' ? "secondary" : 
                        "destructive"
                      }>
                        {connection.status}
                      </Badge>
                      {connection.status === 'pending' && (
                        <div className="flex space-x-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateConnectionStatus(connection.id, 'accepted')}
                          >
                            <UserCheck className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateConnectionStatus(connection.id, 'rejected')}
                          >
                            <UserX className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Partners;