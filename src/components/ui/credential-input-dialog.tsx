import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Shield, Key, Eye, EyeOff, Trash2 } from "lucide-react";
import { useCredentialManagement, CredentialData, StoredCredentials } from "@/hooks/use-credential-management";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface CredentialInputDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  subscriptionId: string;
  serviceName: string;
  onCredentialsSaved?: () => void;
}

export const CredentialInputDialog = ({
  open,
  onOpenChange,
  subscriptionId,
  serviceName,
  onCredentialsSaved
}: CredentialInputDialogProps) => {
  const [formData, setFormData] = useState<CredentialData>({
    username: "",
    password: "",
    notes: "",
    keyHint: "",
  });
  const [masterPassword, setMasterPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showMasterPassword, setShowMasterPassword] = useState(false);
  const [existingCredentials, setExistingCredentials] = useState<StoredCredentials | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const { loading, saveCredentials, getCredentials, decryptCredentials, deleteCredentials } = useCredentialManagement();

  useEffect(() => {
    if (open) {
      loadExistingCredentials();
    } else {
      resetForm();
    }
  }, [open]);

  const loadExistingCredentials = async () => {
    const stored = await getCredentials(subscriptionId);
    if (stored) {
      setExistingCredentials(stored);
      setFormData(prev => ({
        ...prev,
        keyHint: stored.encryption_key_hint || "",
      }));
    }
  };

  const resetForm = () => {
    setFormData({
      username: "",
      password: "",
      notes: "",
      keyHint: "",
    });
    setMasterPassword("");
    setShowPassword(false);
    setShowMasterPassword(false);
    setExistingCredentials(null);
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (!formData.username || !formData.password || !masterPassword) {
      return;
    }

    const result = await saveCredentials(subscriptionId, formData, masterPassword);
    if (result.success) {
      onOpenChange(false);
      onCredentialsSaved?.();
    }
  };

  const handleDecrypt = async () => {
    if (!existingCredentials || !masterPassword) return;

    const decrypted = await decryptCredentials(existingCredentials, masterPassword);
    if (decrypted) {
      setFormData(decrypted);
      setIsEditing(true);
    }
  };

  const handleDelete = async () => {
    if (!existingCredentials) return;

    const result = await deleteCredentials(subscriptionId);
    if (result.success) {
      onOpenChange(false);
      onCredentialsSaved?.();
    }
  };

  const hasCredentials = !!existingCredentials;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Key className="w-5 h-5 text-subcircle-cyan" />
            {hasCredentials && !isEditing ? "View" : hasCredentials ? "Edit" : "Add"} Credentials
          </DialogTitle>
          <DialogDescription>
            {hasCredentials && !isEditing 
              ? `Enter your master password to view ${serviceName} credentials`
              : `${hasCredentials ? "Update" : "Store"} encrypted login credentials for ${serviceName}`
            }
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Security Notice */}
          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription>
              Your credentials are encrypted with your master password and stored securely.
              {!hasCredentials && " Choose a strong master password you'll remember."}
            </AlertDescription>
          </Alert>

          {/* Master Password */}
          <div className="space-y-2">
            <Label htmlFor="master-password">Master Password</Label>
            <div className="relative">
              <Input
                id="master-password"
                type={showMasterPassword ? "text" : "password"}
                value={masterPassword}
                onChange={(e) => setMasterPassword(e.target.value)}
                placeholder="Enter your master password"
                className="pr-10"
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

          {/* Key Hint */}
          {!hasCredentials && (
            <div className="space-y-2">
              <Label htmlFor="key-hint">Password Hint (Optional)</Label>
              <Input
                id="key-hint"
                value={formData.keyHint}
                onChange={(e) => setFormData(prev => ({ ...prev, keyHint: e.target.value }))}
                placeholder="Reminder to help you remember your master password"
              />
            </div>
          )}

          {/* Show hint if exists and not editing */}
          {hasCredentials && !isEditing && existingCredentials?.encryption_key_hint && (
            <div className="bg-muted/50 p-3 rounded-md">
              <p className="text-sm text-muted-foreground">
                <strong>Password Hint:</strong> {existingCredentials.encryption_key_hint}
              </p>
            </div>
          )}

          {/* Credential Fields (only shown when editing or adding new) */}
          {(!hasCredentials || isEditing) && (
            <>
              <div className="space-y-2">
                <Label htmlFor="username">Username/Email</Label>
                <Input
                  id="username"
                  value={formData.username}
                  onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                  placeholder="Enter username or email"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    placeholder="Enter password"
                    className="pr-10"
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
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Additional notes or instructions"
                  rows={3}
                />
              </div>
            </>
          )}

          {/* Action Buttons */}
          <div className="flex justify-between gap-2">
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={() => onOpenChange(false)}
                disabled={loading}
              >
                Cancel
              </Button>
              
              {hasCredentials && !isEditing && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleDelete}
                  disabled={loading}
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Delete
                </Button>
              )}
            </div>

            <div className="flex gap-2">
              {hasCredentials && !isEditing ? (
                <Button 
                  onClick={handleDecrypt}
                  disabled={loading || !masterPassword}
                  className="bg-subcircle-cyan text-subcircle-cyan-foreground hover:bg-subcircle-cyan/90"
                >
                  {loading ? "Decrypting..." : "View Credentials"}
                </Button>
              ) : (
                <Button 
                  onClick={handleSave}
                  disabled={loading || !formData.username || !formData.password || !masterPassword}
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  {loading ? "Saving..." : hasCredentials ? "Update" : "Save"} Credentials
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};