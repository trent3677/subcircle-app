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
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Share2, Shield, Eye, EyeOff, Users, Key, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useSubscriptionSharing, ShareSettings } from "@/hooks/use-subscription-sharing";
import { CredentialInputDialog } from "@/components/ui/credential-input-dialog";
import { useCredentialManagement } from "@/hooks/use-credential-management";

interface ShareSubscriptionDialogProps {
  subscriptionId: string;
  serviceName: string;
  currentSettings: ShareSettings;
  onUpdate?: () => void;
}

export const ShareSubscriptionDialog = ({
  subscriptionId,
  serviceName,
  currentSettings,
  onUpdate
}: ShareSubscriptionDialogProps) => {
  const [open, setOpen] = useState(false);
  const [credentialDialogOpen, setCredentialDialogOpen] = useState(false);
  const [settings, setSettings] = useState<ShareSettings>(currentSettings);
  const [hasCredentials, setHasCredentials] = useState(false);
  
  const { loading, updateSharingSettings } = useSubscriptionSharing();
  const { getCredentials } = useCredentialManagement();

  const checkCredentials = async () => {
    const credentials = await getCredentials(subscriptionId);
    setHasCredentials(!!credentials);
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (newOpen) {
      checkCredentials();
    }
  };

  const handleSave = async () => {
    const result = await updateSharingSettings(subscriptionId, settings);
    if (result.success) {
      setOpen(false);
      onUpdate?.();
    }
  };

  const handleSettingChange = (key: keyof ShareSettings, value: boolean) => {
    setSettings(prev => {
      const newSettings = { ...prev, [key]: value };
      // If sharing is disabled, also disable credential sharing
      if (key === 'shared_with_partners' && !value) {
        newSettings.share_credentials = false;
      }
      return newSettings;
    });
  };

  return (
    <>
      <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="shrink-0 hover:bg-accent hover:text-accent-foreground transition-colors"
        >
          <Share2 className="w-4 h-4 mr-1" />
          {currentSettings.shared_with_partners ? (
            <Badge variant="secondary" className="ml-1 text-xs">
              <Users className="w-3 h-3 mr-1" />
              Shared
            </Badge>
          ) : (
            "Share"
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-primary" />
            Share {serviceName}
          </DialogTitle>
          <DialogDescription>
            Manage how this subscription is shared with your partners
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Share with Partners Toggle */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-sm font-medium">Share with Partners</Label>
                <p className="text-xs text-muted-foreground">
                  Allow connected partners to see this subscription
                </p>
              </div>
              <Switch
                checked={settings.shared_with_partners}
                onCheckedChange={(checked) => 
                  handleSettingChange('shared_with_partners', checked)
                }
              />
            </div>

            {settings.shared_with_partners && (
              <div className="pl-4 border-l-2 border-primary/20 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-sm font-medium flex items-center gap-2">
                      <Shield className="w-4 h-4 text-subcircle-cyan" />
                      Share Credentials
                      {hasCredentials && (
                        <Badge variant="secondary" className="text-xs">
                          <Key className="w-3 h-3 mr-1" />
                          Saved
                        </Badge>
                      )}
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Share encrypted login credentials for account sharing
                    </p>
                  </div>
                  <Switch
                    checked={settings.share_credentials}
                    onCheckedChange={(checked) => 
                      handleSettingChange('share_credentials', checked)
                    }
                    disabled={!settings.shared_with_partners || !hasCredentials}
                  />
                </div>

                {/* Credential Management */}
                <div className="flex gap-2 pl-6">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCredentialDialogOpen(true)}
                    className="text-xs h-8"
                  >
                    <Key className="w-3 h-3 mr-1" />
                    {hasCredentials ? "Manage" : "Add"} Credentials
                  </Button>
                </div>

                {/* Security Notice */}
                <div className="bg-subcircle-cyan/5 border border-subcircle-cyan/20 rounded-md p-3">
                  <div className="flex gap-2">
                    <Shield className="w-4 h-4 text-subcircle-cyan shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <h4 className="text-xs font-medium">Secure Sharing</h4>
                      <p className="text-xs text-muted-foreground">
                        {settings.share_credentials 
                          ? "Credentials will be encrypted end-to-end and only visible to connected partners"
                          : "Only subscription details will be shared, no credentials"
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2">
            <Button 
              variant="outline" 
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSave}
              disabled={loading}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>

    <CredentialInputDialog
      open={credentialDialogOpen}
      onOpenChange={setCredentialDialogOpen}
      subscriptionId={subscriptionId}
      serviceName={serviceName}
      onCredentialsSaved={() => {
        checkCredentials();
        onUpdate?.();
      }}
    />
    </>
  );
};