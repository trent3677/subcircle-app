import { cn } from "@/lib/utils";

interface LoadingSkeletonProps {
  className?: string;
  variant?: "card" | "service" | "vault" | "text" | "circle";
}

export function LoadingSkeleton({ className, variant = "card" }: LoadingSkeletonProps) {
  const variants = {
    card: "h-32 w-full rounded-lg",
    service: "h-44 w-full rounded-xl",
    vault: "h-20 w-full rounded-lg",
    text: "h-4 w-3/4 rounded",
    circle: "h-12 w-12 rounded-full"
  };

  return (
    <div
      className={cn(
        "bg-gradient-to-r from-muted via-muted/50 to-muted animate-shimmer bg-[length:200px_100%]",
        variants[variant],
        className
      )}
    />
  );
}

export function ServiceCardSkeleton() {
  return (
    <div className="p-4 space-y-3 border border-border rounded-xl bg-card">
      <div className="space-y-2">
        <LoadingSkeleton variant="circle" />
        <div className="space-y-1">
          <LoadingSkeleton variant="text" className="h-3 w-20" />
          <LoadingSkeleton variant="text" className="h-3 w-16" />
        </div>
      </div>
      <div className="flex items-center justify-between">
        <LoadingSkeleton variant="text" className="h-3 w-16" />
        <LoadingSkeleton className="h-5 w-9 rounded-full" />
      </div>
    </div>
  );
}

export function VaultCardSkeleton() {
  return (
    <div className="p-4 border border-border rounded-lg bg-card">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1">
          <LoadingSkeleton variant="circle" />
          <div className="flex-1 space-y-2">
            <LoadingSkeleton variant="text" className="h-4 w-24" />
            <LoadingSkeleton variant="text" className="h-3 w-16" />
            <LoadingSkeleton variant="text" className="h-3 w-20" />
          </div>
        </div>
        <LoadingSkeleton className="h-8 w-20 rounded-md" />
      </div>
    </div>
  );
}