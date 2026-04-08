import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AlertCircle, Package, Search, ShoppingCart } from "lucide-react";

type EmptyVariant = "cart" | "orders" | "search" | "products" | "generic";

const VARIANTS: Record<
  EmptyVariant,
  {
    icon: React.ComponentType<{ className?: string }>;
    title: string;
    description: string;
  }
> = {
  cart: {
    icon: ShoppingCart,
    title: "Your cart is empty",
    description: "Add items from our store to get started",
  },
  orders: {
    icon: Package,
    title: "No orders yet",
    description: "Your past orders will appear here",
  },
  search: {
    icon: Search,
    title: "No results found",
    description: "Try a different keyword or browse categories",
  },
  products: {
    icon: Package,
    title: "No products available",
    description: "Check back soon for more items",
  },
  generic: {
    icon: AlertCircle,
    title: "Nothing here yet",
    description: "This section is empty for now",
  },
};

interface EmptyStateProps {
  variant?: EmptyVariant;
  title?: string;
  description?: string;
  ctaLabel?: string;
  onCta?: () => void;
  className?: string;
}

export default function EmptyState({
  variant = "generic",
  title,
  description,
  ctaLabel,
  onCta,
  className,
}: EmptyStateProps) {
  const config = VARIANTS[variant];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center py-16 px-4 gap-4",
        className,
      )}
      data-ocid="empty-state"
    >
      <div className="w-20 h-20 rounded-full bg-muted/60 flex items-center justify-center">
        <Icon className="w-9 h-9 text-muted-foreground" />
      </div>
      <div>
        <h3 className="text-lg font-bold text-foreground">
          {title ?? config.title}
        </h3>
        <p className="text-sm text-muted-foreground mt-1 max-w-xs">
          {description ?? config.description}
        </p>
      </div>
      {ctaLabel && onCta && (
        <Button
          variant="default"
          className="rounded-full px-6 font-semibold"
          onClick={onCta}
          data-ocid="empty-state-cta"
        >
          {ctaLabel}
        </Button>
      )}
    </div>
  );
}
