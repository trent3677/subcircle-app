import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Key, Eye, EyeOff, Copy, Shield, User } from "lucide-react";
import { useCredentialManagement, StoredCredentials } from "@/hooks/use-credential-management";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";

interface PartnerCredentialAccessProps {
  subscriptionId: string;
  serviceName: string;
  partnerName: string;
  hasCredentials: boolean;
}

export const PartnerCredentialAccess = ({
  subscriptionId,
  serviceName,
  partnerName,
  hasCredentials
}: PartnerCredentialAccessProps) => {
  const [open, setOpen] = useState(false);
  const [masterPassword, setMasterPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showMasterPassword, setShowMasterPassword] = useState(false);
  const [decryptedData, setDecryptedData] = useState<any>(null);
  const [credentials, setCredentials] = useState<StoredCredentials | null>(null);

  const { loading, getCredentials, decryptCredentials } = useCredentialManagement();
  const { toast } = useToast();

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      // Reset state when closing
      setMasterPassword("");
      setDecryptedData(null);
      setCredentials(null);
      setShowPassword(false);
      setShowMasterPassword(false);
    } else {
      // Load credentials when opening
      loadCredentials();
    }
  };

  const loadCredentials = async () => {
    const stored = await getCredentials(subscriptionId);
    setCredentials(stored);
  };

  const handleDecrypt = async () => {
    if (!credentials || !masterPassword) return;

    const decrypted = await decryptCredentials(credentials, masterPassword);
    if (decrypted) {
      setDecryptedData(decrypted);
    }
  };

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied",
        description: `${label} copied to clipboard`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      });
    }
  };

  if (!hasCredentials) {
    return (
      <Button variant="outline" size="sm" disabled>
        <Key className="w-4 h-4 mr-1" />
        No Credentials
      </Button>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="text-subcircle-cyan border-subcircle-cyan/30 hover:bg-subcircle-cyan/10 hover:text-subcircle-cyan"
        >
          <Key className="w-4 h-4 mr-1" />
          View Credentials
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="w-5 h-5 text-subcircle-cyan" />
            {serviceName} Credentials
          </DialogTitle>
          <DialogDescription>
            Shared by {partnerName} • Enter their master password to decrypt
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Security Notice */}
          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription>
              These credentials are encrypted by {partnerName}. You need their master password to view them.
            </AlertDescription>
          </Alert>

          {/* Show hint if available */}
          {credentials?.encryption_key_hint && (
            <div className="bg-muted/50 p-3 rounded-md">
              <p className="text-sm text-muted-foreground">
                <strong>Password Hint:</strong> {credentials.encryption_key_hint}
              </p>
            </div>
          )}

          {/* Master Password Input */}
          {!decryptedData && (
            <div className="space-y-2">
              <Label htmlFor="partner-master-password">Master Password</Label>
              <div className="relative">
                <Input
                  id="partner-master-password"
                  type={showMasterPassword ? "text" : "password"}
                  value={masterPassword}
                  onChange={(e) => setMasterPassword(e.target.value)}
                  placeholder="Enter the master password"
                  className="pr-10"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && masterPassword) {
                      handleDecrypt();
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowMasterPassword(!showMasterPassword)}
                >
                  {showMasterPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* Decrypted Credentials */}
          {decryptedData && (
            <div className="space-y-3">
              <Card className="bg-gradient-subtle border-subcircle-cyan/20">
                <CardContent className="pt-4">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-xs font-medium text-muted-foreground">USERNAME/EMAIL</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          value={decryptedData.username}
                          readOnly
                          className="bg-background/50"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(decryptedData.username, "Username")}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs font-medium text-muted-foreground">PASSWORD</Label>
                      <div className="flex items-center gap-2">
                        <div className="relative flex-1">
                          <Input
                            type={showPassword ? "text" : "password"}
                            value={decryptedData.password}
                            readOnly
                            className="bg-background/50 pr-10"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(decryptedData.password, "Password")}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {decryptedData.notes && (
                      <div className="space-y-2">
                        <Label className="text-xs font-medium text-muted-foreground">NOTES</Label>
                        <div className="bg-muted/30 p-3 rounded-md">
                          <p className="text-sm">{decryptedData.notes}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-2">
            <Button 
              variant="outline" 
              onClick={() => setOpen(false)}
            >
              Close
            </Button>
            
            {!decryptedData && (
              <Button 
                onClick={handleDecrypt}
                disabled={loading || !masterPassword}
                className="bg-subcircle-cyan text-subcircle-cyan-foreground hover:bg-subcircle-cyan/90"
              >
                {loading ? "Decrypting..." : "Decrypt"}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};