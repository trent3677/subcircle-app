import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

// Simple encryption/decryption using Web Crypto API
class SimpleEncryption {
  private static async generateKey(password: string, userId: string): Promise<CryptoKey> {
    const enc = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
      "raw",
      enc.encode(password),
      { name: "PBKDF2" },
      false,
      ["deriveBits", "deriveKey"]
    );
    
    // Generate user-specific salt by combining fixed prefix with user ID
    const userSalt = `subcircle-${userId}-2024`;
    
    return crypto.subtle.deriveKey(
      {
        name: "PBKDF2",
        salt: enc.encode(userSalt),
        iterations: 100000,
        hash: "SHA-256",
      },
      keyMaterial,
      { name: "AES-GCM", length: 256 },
      false,
      ["encrypt", "decrypt"]
    );
  }

  static async encrypt(text: string, password: string, userId: string): Promise<string> {
    const key = await this.generateKey(password, userId);
    const enc = new TextEncoder();
    const iv = crypto.getRandomValues(new Uint8Array(12));
    
    const encrypted = await crypto.subtle.encrypt(
      { name: "AES-GCM", iv },
      key,
      enc.encode(text)
    );
    
    const combined = new Uint8Array(iv.length + encrypted.byteLength);
    combined.set(iv);
    combined.set(new Uint8Array(encrypted), iv.length);
    
    return btoa(String.fromCharCode(...combined));
  }

  static async decrypt(encryptedData: string, password: string, userId: string): Promise<string> {
    const key = await this.generateKey(password, userId);
    const combined = new Uint8Array([...atob(encryptedData)].map(c => c.charCodeAt(0)));
    
    const iv = combined.slice(0, 12);
    const data = combined.slice(12);
    
    const decrypted = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv },
      key,
      data
    );
    
    return new TextDecoder().decode(decrypted);
  }
}

export interface CredentialData {
  username: string;
  password: string;
  notes?: string;
  keyHint: string;
}

export interface StoredCredentials {
  id: string;
  subscription_id: string;
  encrypted_username?: string;
  encrypted_password?: string;
  encrypted_notes?: string;
  encryption_key_hint?: string;
  created_at: string;
  updated_at: string;
}

export const useCredentialManagement = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const saveCredentials = async (
    subscriptionId: string,
    credentials: CredentialData,
    masterPassword: string
  ) => {
    setLoading(true);
    try {
      // TODO: Replace with backend API call
      // For now, just show success message
      
      toast({
        title: "Credentials Saved",
        description: "Login credentials saved (mock)",
      });

      return { success: true, data: null };
    } catch (error) {
      console.error("Error saving credentials:", error);
      toast({
        title: "Error",
        description: "Failed to save credentials",
        variant: "destructive",
      });
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  const getCredentials = async (subscriptionId: string): Promise<StoredCredentials | null> => {
    try {
      // TODO: Replace with backend API call
      // For now, return null (no credentials)
      return null;
    } catch (error) {
      console.error("Error fetching credentials:", error);
      return null;
    }
  };

  const decryptCredentials = async (
    storedCredentials: StoredCredentials,
    masterPassword: string
  ): Promise<CredentialData | null> => {
    try {
      // TODO: Replace with backend API call
      // For now, return mock credentials
      
      return {
        username: "mock_user",
        password: "mock_pass",
        notes: "Mock credentials",
        keyHint: storedCredentials.encryption_key_hint || "",
      };
    } catch (error) {
      toast({
        title: "Decryption Failed",
        description: "Invalid master password or corrupted data",
        variant: "destructive",
      });
      return null;
    }
  };

  const deleteCredentials = async (subscriptionId: string) => {
    setLoading(true);
    try {
      // TODO: Replace with backend API call
      // For now, just show success message
      
      toast({
        title: "Credentials Deleted",
        description: "Login credentials deleted (mock)",
      });

      return { success: true };
    } catch (error) {
      console.error("Error deleting credentials:", error);
      toast({
        title: "Error",
        description: "Failed to delete credentials",
        variant: "destructive",
      });
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    saveCredentials,
    getCredentials,
    decryptCredentials,
    deleteCredentials,
  };
};