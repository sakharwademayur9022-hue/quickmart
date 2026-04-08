import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Minus, Plus, ShoppingCart, Zap } from "lucide-react";
import { useState } from "react";
import type { Category, Product } from "../types";

const CATEGORY_EMOJI: Record<Category, string> = {
  Fruits: "🍎",
  Vegetables: "🥦",
  Dairy: "🥛",
  Snacks: "🍟",
  Beverages: "🧃",
  Bakery: "🍞",
  Meat: "🥩",
  PersonalCare: "🧴",
  Household: "🧹",
};

const PRODUCT_IMAGES: Record<string, string> = {
  default: "/assets/images/product-placeholder.svg",
};

interface ProductCardProps {
  product: Product;
  quantity?: number;
  onAddToCart?: (product: Product) => void;
  onIncrement?: (product: Product) => void;
  onDecrement?: (product: Product) => void;
  onRequireAuth?: () => void;
  isAuthenticated?: boolean;
}

export default function ProductCard({
  product,
  quantity = 0,
  onAddToCart,
  onIncrement,
  onDecrement,
  onRequireAuth,
  isAuthenticated = false,
}: ProductCardProps) {
  const [imgError, setImgError] = useState(false);
  const categoryKey = Object.keys(
    product.category as unknown as Record<string, null>,
  )[0] as Category;
  const emoji = CATEGORY_EMOJI[categoryKey] ?? "🛒";
  const imgSrc =
    product.imageId && !imgError ? product.imageId : PRODUCT_IMAGES.default;

  const handleAdd = () => {
    if (!isAuthenticated) {
      onRequireAuth?.();
      return;
    }
    onAddToCart?.(product);
  };

  const priceFormatted = `₹${Number(product.price)}`;

  return (
    <div
      className="card-elevated bg-card rounded-xl overflow-hidden flex flex-col group cursor-pointer"
      data-ocid={`product-card-${product.id}`}
    >
      {/* Image */}
      <div className="relative aspect-square bg-muted/40 overflow-hidden">
        {typeof imgSrc === "string" && imgSrc.endsWith(".svg") ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-5xl">{emoji}</span>
          </div>
        ) : (
          <img
            src={imgSrc}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={() => setImgError(true)}
          />
        )}
        {!product.inStock && (
          <div className="absolute inset-0 bg-card/80 backdrop-blur-sm flex items-center justify-center">
            <Badge variant="secondary" className="text-xs font-semibold">
              Out of Stock
            </Badge>
          </div>
        )}
        <div className="absolute top-2 left-2">
          <Badge
            variant="secondary"
            className="text-[10px] px-1.5 py-0.5 font-medium bg-card/90 text-foreground border-border"
          >
            {emoji} {categoryKey}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="p-3 flex flex-col gap-2 flex-1">
        <div className="flex-1">
          <p className="text-xs text-muted-foreground font-medium flex items-center gap-1">
            <Zap className="w-3 h-3 text-accent" />
            10-min delivery
          </p>
          <h3 className="text-sm font-semibold text-foreground line-clamp-2 mt-0.5 leading-snug">
            {product.name}
          </h3>
        </div>

        <div className="flex items-center justify-between gap-2">
          <span className="text-base font-black text-accent">
            {priceFormatted}
          </span>

          {product.inStock ? (
            quantity > 0 ? (
              <div
                className="flex items-center gap-1 bg-primary rounded-lg overflow-hidden"
                data-ocid={`qty-control-${product.id}`}
              >
                <button
                  type="button"
                  onClick={() => onDecrement?.(product)}
                  className="px-2 py-1.5 text-primary-foreground hover:bg-primary/80 transition-colors"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="text-primary-foreground text-sm font-bold min-w-[20px] text-center">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => onIncrement?.(product)}
                  className="px-2 py-1.5 text-primary-foreground hover:bg-primary/80 transition-colors"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <Button
                size="sm"
                variant="default"
                className={cn(
                  "rounded-lg px-3 py-1.5 h-auto text-xs font-semibold gap-1.5",
                  "bg-primary text-primary-foreground hover:bg-primary/90",
                )}
                onClick={handleAdd}
                data-ocid={`add-to-cart-${product.id}`}
              >
                <ShoppingCart className="w-3 h-3" />
                Add
              </Button>
            )
          ) : (
            <Button
              size="sm"
              variant="secondary"
              disabled
              className="rounded-lg text-xs h-auto py-1.5"
            >
              Notify Me
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
