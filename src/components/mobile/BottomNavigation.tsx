import { Grid3X3, Vault, Link, BarChart3, Settings, Plus, LogOut } from "lucide-react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

const navItems = [
  { icon: Grid3X3, label: "Catalog", path: "/" },
  { icon: Vault, label: "Vault", path: "/vault" },
  { icon: Plus, label: "Add", path: "/subscriptions/add" },
  { icon: BarChart3, label: "Compare", path: "/compare" },
  { icon: Settings, label: "Settings", path: "/settings" },
];

export const BottomNavigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isDemoMode, exitDemoMode } = useAuth();

  const handleExitDemo = () => {
    exitDemoMode();
    navigate('/onboarding');
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border shadow-card z-50">
      <div className="flex justify-around items-center py-2 px-4 max-w-md mx-auto">
        {navItems.map(({ icon: Icon, label, path }) => {
          const isActive = location.pathname === path;
          
          return (
            <NavLink
              key={path}
              to={path}
              className={cn(
                "flex flex-col items-center gap-1 py-2 px-3 rounded-lg relative",
                "min-w-0 flex-1 transition-all duration-200 ease-smooth",
                "transform active:scale-95 hover:scale-105",
                isActive 
                  ? "text-primary bg-primary/10 shadow-service scale-105" 
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
            >
              <div className="relative">
                <Icon className="w-5 h-5 shrink-0" />
              </div>
              <span className="text-xs font-medium truncate">{label}</span>
            </NavLink>
          );
        })}
        
        {/* Exit Demo button - only shows in demo mode */}
        {isDemoMode && (
          <button
            onClick={handleExitDemo}
            className={cn(
              "flex flex-col items-center gap-1 py-2 px-3 rounded-lg relative",
              "min-w-0 flex-1 transition-all duration-200 ease-smooth",
              "transform active:scale-95 hover:scale-105",
              "text-orange-600 hover:text-orange-700 hover:bg-orange-50 dark:text-orange-400 dark:hover:text-orange-300 dark:hover:bg-orange-950/50"
            )}
          >
            <div className="relative">
              <LogOut className="w-5 h-5 shrink-0" />
            </div>
            <span className="text-xs font-medium truncate">Exit Demo</span>
          </button>
        )}
      </div>
    </nav>
  );
};