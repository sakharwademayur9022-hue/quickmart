import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  text?: string;
}

export default function LoadingSpinner({
  size = "md",
  className,
  text,
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "w-4 h-4 border-2",
    md: "w-8 h-8 border-3",
    lg: "w-12 h-12 border-4",
  };

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3",
        className,
      )}
      aria-label="Loading"
      aria-busy="true"
    >
      <div
        className={cn(
          "rounded-full border-primary border-t-transparent animate-spin",
          sizeClasses[size],
        )}
      />
      {text && (
        <p className="text-sm text-muted-foreground font-medium">{text}</p>
      )}
    </div>
  );
}

export function LoadingGrid({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
      {Array.from({ length: count }, (_, i) => `skeleton-${i}`).map((key) => (
        <div
          key={key}
          className="rounded-xl bg-card overflow-hidden animate-pulse"
        >
          <div className="aspect-square bg-muted" />
          <div className="p-3 space-y-2">
            <div className="h-3 bg-muted rounded w-3/4" />
            <div className="h-3 bg-muted rounded w-1/2" />
            <div className="flex justify-between items-center pt-1">
              <div className="h-5 bg-muted rounded w-16" />
              <div className="h-7 bg-muted rounded w-14" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
