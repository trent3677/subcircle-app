import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Shield, Eye, ExternalLink, Key } from "lucide-react";
import { useSubscriptionSharing } from "@/hooks/use-subscription-sharing";
import { VaultCardSkeleton } from "@/components/ui/loading-skeleton";
import { getServiceLogo, handleLogoError, hasServiceLogo } from "@/lib/logo-utils";
import { cn } from "@/lib/utils";
import { PartnerCredentialAccess } from "@/components/ui/partner-credential-access";

interface PartnerSubscription {
  id: string;
  service_id: string;
  shared_with_partners: boolean;
  share_credentials: boolean;
  streaming_services: {
    name: string;
    logo_url?: string | null;
    monthly_price?: number;
    website_url?: string | null;
  };
}

interface PartnerSubscriptionsViewProps {
  partnerId: string;
  partnerName: string;
}

export const PartnerSubscriptionsView = ({ 
  partnerId, 
  partnerName 
}: PartnerSubscriptionsViewProps) => {
  const [subscriptions, setSubscriptions] = useState<PartnerSubscription[]>([]);
  const [loading, setLoading] = useState(true);
  const { getPartnerSubscriptions } = useSubscriptionSharing();

  useEffect(() => {
    fetchPartnerSubscriptions();
  }, [partnerId]);

  const fetchPartnerSubscriptions = async () => {
    setLoading(true);
    const { data, error } = await getPartnerSubscriptions(partnerId);
    if (!error && data) {
      setSubscriptions(data);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-muted-foreground" />
          <h3 className="font-semibold text-foreground">
            {partnerName}'s Shared Subscriptions
          </h3>
        </div>
        {[1, 2].map((i) => (
          <VaultCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (subscriptions.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="p-6 text-center">
          <Users className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
          <h3 className="font-medium text-foreground mb-1">No Shared Subscriptions</h3>
          <p className="text-sm text-muted-foreground">
            {partnerName} hasn't shared any subscriptions with you yet
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-foreground">
            {partnerName}'s Shared Subscriptions
          </h3>
        </div>
        <Badge variant="outline" className="text-xs">
          <Shield className="w-3 h-3 mr-1" />
          {subscriptions.length} shared
        </Badge>
      </div>

      <div className="space-y-3">
        {subscriptions.map((subscription, index) => (
          <Card 
            key={subscription.id} 
            className={cn(
              "group overflow-hidden border bg-gradient-to-r from-subcircle-teal/5 to-subcircle-indigo/5",
              "hover:shadow-card-hover transition-all duration-300 ease-bounce hover:scale-[1.01]",
              "animate-slide-up"
            )}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                {/* Service info */}
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-12 h-12 bg-white dark:bg-white rounded-lg flex items-center justify-center p-2 shadow-service shrink-0 group-hover:shadow-vault group-hover:scale-105 transition-all duration-300">
                    {hasServiceLogo(subscription.streaming_services) ? (
                      <img
                        src={getServiceLogo(subscription.streaming_services)}
                        alt={`${subscription.streaming_services?.name || "Service"} logo`}
                        className="w-full h-full object-contain"
                        loading="lazy"
                        referrerPolicy="no-referrer"
                        onError={(e) => handleLogoError(e, subscription.streaming_services)}
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-primary rounded-lg flex items-center justify-center text-xs font-bold text-white">
                        {subscription.streaming_services?.name?.charAt(0) || "?"}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium text-sm leading-tight group-hover:text-primary transition-colors">
                          {subscription.streaming_services?.name || "Unknown Service"}
                        </h4>
                        {subscription.streaming_services?.monthly_price && (
                          <p className="text-primary font-medium text-xs">
                            ${subscription.streaming_services.monthly_price}/month
                          </p>
                        )}
                      </div>
                      <Badge variant="outline" className="text-xs bg-subcircle-teal/10 text-subcircle-teal border-subcircle-teal/20">
                        <Users className="w-3 h-3 mr-1" />
                        Shared by {partnerName}
                      </Badge>
                    </div>
                    
                    {/* Sharing status and credentials */}
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant="outline" 
                        className={cn(
                          "text-xs",
                          subscription.share_credentials 
                            ? "bg-green-50 text-green-700 border-green-200"
                            : "bg-blue-50 text-blue-700 border-blue-200"
                        )}
                      >
                        <Eye className="w-3 h-3 mr-1" />
                        {subscription.share_credentials ? "Full Access" : "View Only"}
                      </Badge>
                      
                      {subscription.share_credentials && (
                        <Badge variant="secondary" className="text-xs">
                          <Shield className="w-3 h-3 mr-1" />
                          Credentials Available
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  {subscription.share_credentials ? (
                    <PartnerCredentialAccess
                      subscriptionId={subscription.id}
                      serviceName={subscription.streaming_services?.name || "Service"}
                      partnerName={partnerName}
                      hasCredentials={true}
                    />
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      className="shrink-0 hover:bg-primary hover:text-primary-foreground transition-colors"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View Details
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};