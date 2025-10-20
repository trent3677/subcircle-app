import { ReactNode } from "react";
import { BottomNavigation } from "./BottomNavigation";
import { cn } from "@/lib/utils";

interface MobileLayoutProps {
  children: ReactNode;
  showBottomNav?: boolean;
  showHeader?: boolean;
}

export const MobileLayout = ({ children, showBottomNav = true, showHeader = true }: MobileLayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      {/* App Header with Logo */}
      {showHeader && (
        <header className="fixed top-0 left-0 right-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border z-40">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm">
                <img 
                  src="/lovable-uploads/105cee16-9e7f-45ba-9b51-01a7a6f35377.png" 
                  alt="SubCircle" 
                  className="w-6 h-6 object-contain"
                />
              </div>
              <span className="font-semibold text-foreground">SubCircle</span>
            </div>
          </div>
        </header>
      )}
      
      {/* Main content with spacing for header and bottom nav */}
      <main className={cn("", showHeader && "pt-16", showBottomNav && "pb-20")}>
        {children}
      </main>
      
      {/* Bottom navigation */}
      {showBottomNav && <BottomNavigation />}
    </div>
  );
};

