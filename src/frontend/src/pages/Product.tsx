import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Link, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  CheckCircle2,
  Minus,
  Plus,
  ShoppingCart,
  XCircle,
  Zap,
} from "lucide-react";
import { useState } from "react";
import AuthModal from "../components/AuthModal";
import Layout from "../components/Layout";
import { useAuth } from "../hooks/useAuth";
import { useCart } from "../hooks/useCart";
import { useProduct } from "../hooks/useProducts";
import type { Category } from "../types";

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

const CATEGORY_LABELS: Record<Category, string> = {
  Fruits: "Fruits",
  Vegetables: "Vegetables",
  Dairy: "Dairy",
  Snacks: "Snacks",
  Beverages: "Beverages",
  Bakery: "Bakery",
  Meat: "Meat",
  PersonalCare: "Personal Care",
  Household: "Household",
};

function ProductDetailSkeleton() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-6 flex flex-col gap-6">
      <Skeleton className="h-6 w-24" />
      <Skeleton className="w-full aspect-square max-w-sm mx-auto rounded-2xl" />
      <div className="space-y-3">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-7 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <div className="flex justify-between items-center pt-2">
          <Skeleton className="h-9 w-24" />
          <Skeleton className="h-12 w-40" />
        </div>
      </div>
    </div>
  );
}

export default function Product() {
  const { id } = useParams({ from: "/product/$id" });
  const productId = BigInt(id);

  const [imgError, setImgError] = useState(false);
  const [localQty, setLocalQty] = useState(1);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const { isAuthenticated } = useAuth();
  const cartHook = useCart();
  const cartQty = cartHook.getItemQuantity(productId);

  const { data: product, isLoading } = useProduct(productId);

  if (isLoading) {
    return (
      <Layout>
        <ProductDetailSkeleton />
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <div className="max-w-2xl mx-auto px-4 py-16 flex flex-col items-center gap-4 text-center">
          <span className="text-6xl">😕</span>
          <h2 className="text-xl font-bold text-foreground">
            Product not found
          </h2>
          <p className="text-sm text-muted-foreground">
            This item may no longer be available.
          </p>
          <Link
            to="/"
            className="mt-2 btn-primary inline-flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Store
          </Link>
        </div>
      </Layout>
    );
  }

  const categoryKey = Object.keys(
    product.category as unknown as Record<string, null>,
  )[0] as Category;
  const emoji = CATEGORY_EMOJI[categoryKey] ?? "🛒";
  const categoryLabel = CATEGORY_LABELS[categoryKey] ?? categoryKey;
  const imgSrc =
    product.imageId && !imgError
      ? product.imageId
      : "/assets/images/product-placeholder.svg";
  const isPlaceholder = !product.imageId || imgError || imgSrc.endsWith(".svg");
  const priceFormatted = `₹${Number(product.price)}`;

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      setAuthModalOpen(true);
      return;
    }
    cartHook.addToCart(product.id, product.name, BigInt(localQty));
  };

  const handleIncrementInCart = () => {
    cartHook.addToCart(product.id, product.name, 1n);
  };

  const handleDecrementInCart = () => {
    if (cartQty > 1) {
      cartHook.addToCart(product.id, product.name, BigInt(cartQty - 1));
    } else {
      cartHook.removeFromCart(product.id);
    }
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto px-4 py-4 flex flex-col gap-5">
        {/* Back nav */}
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors w-fit"
          data-ocid="back-button"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Link>

        {/* Product image */}
        <div
          className="relative rounded-2xl overflow-hidden bg-muted/30 border border-border aspect-square max-w-sm mx-auto w-full shadow-sm"
          data-ocid="product-image"
        >
          {isPlaceholder ? (
            <div className="absolute inset-0 flex items-center justify-center bg-muted/20">
              <span className="text-8xl filter drop-shadow" aria-hidden="true">
                {emoji}
              </span>
            </div>
          ) : (
            <img
              src={imgSrc}
              alt={product.name}
              className="w-full h-full object-cover"
              onError={() => setImgError(true)}
            />
          )}

          {/* Out of stock overlay */}
          {!product.inStock && (
            <div className="absolute inset-0 bg-card/75 backdrop-blur-[2px] flex items-center justify-center">
              <Badge
                variant="secondary"
                className="text-sm font-bold px-3 py-1.5"
              >
                Out of Stock
              </Badge>
            </div>
          )}
        </div>

        {/* Product info */}
        <div className="flex flex-col gap-4">
          {/* Category + delivery tags */}
          <div className="flex items-center gap-2 flex-wrap">
            <Badge
              variant="secondary"
              className="text-xs font-medium gap-1"
              data-ocid="category-badge"
            >
              {emoji} {categoryLabel}
            </Badge>
            <span className="flex items-center gap-1 text-xs text-muted-foreground font-medium">
              <Zap className="w-3 h-3 text-accent" />
              10-min delivery
            </span>
          </div>

          {/* Name */}
          <h1
            className="text-2xl sm:text-3xl font-black text-foreground leading-tight"
            data-ocid="product-name"
          >
            {product.name}
          </h1>

          {/* Stock indicator */}
          <div
            className={cn(
              "flex items-center gap-1.5 text-sm font-semibold",
              product.inStock ? "text-primary" : "text-destructive",
            )}
            data-ocid="stock-indicator"
          >
            {product.inStock ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                In Stock — Ready to ship
              </>
            ) : (
              <>
                <XCircle className="w-4 h-4" />
                Currently Out of Stock
              </>
            )}
          </div>

          {/* Description */}
          {product.description && (
            <p className="text-sm text-muted-foreground leading-relaxed">
              {product.description}
            </p>
          )}

          {/* Divider */}
          <div className="h-px bg-border" />

          {/* Price + add to cart row */}
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <p className="text-xs text-muted-foreground mb-0.5">Price</p>
              <span
                className="text-3xl font-black text-accent"
                data-ocid="product-price"
              >
                {priceFormatted}
              </span>
            </div>

            {product.inStock && (
              <div className="flex items-center gap-3">
                {/* Pre-add quantity picker */}
                {cartQty === 0 && (
                  <div
                    className="flex items-center border border-border rounded-xl overflow-hidden bg-card"
                    data-ocid="qty-selector"
                  >
                    <button
                      type="button"
                      onClick={() => setLocalQty((q) => Math.max(1, q - 1))}
                      disabled={localQty <= 1}
                      className="px-3 py-2.5 text-foreground hover:bg-muted transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span
                      className="text-base font-bold min-w-[40px] text-center text-foreground"
                      data-ocid="qty-value"
                    >
                      {localQty}
                    </span>
                    <button
                      type="button"
                      onClick={() => setLocalQty((q) => q + 1)}
                      className="px-3 py-2.5 text-foreground hover:bg-muted transition-colors"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {/* In-cart qty control */}
                {cartQty > 0 ? (
                  <div
                    className="flex items-center gap-1 bg-primary rounded-xl overflow-hidden shadow-md"
                    data-ocid="incart-qty-control"
                  >
                    <button
                      type="button"
                      onClick={handleDecrementInCart}
                      className="px-3 py-2.5 text-primary-foreground hover:bg-primary/80 transition-colors"
                      aria-label="Remove one from cart"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="text-primary-foreground text-base font-black min-w-[36px] text-center">
                      {cartQty}
                    </span>
                    <button
                      type="button"
                      onClick={handleIncrementInCart}
                      className="px-3 py-2.5 text-primary-foreground hover:bg-primary/80 transition-colors"
                      aria-label="Add one more to cart"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <Button
                    size="lg"
                    className="rounded-xl px-6 font-bold gap-2 h-11 shadow-md"
                    onClick={handleAddToCart}
                    disabled={cartHook.isAdding}
                    data-ocid="add-to-cart-btn"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Add to Cart
                  </Button>
                )}
              </div>
            )}
          </div>

          {/* In-cart confirmation strip */}
          {cartQty > 0 && (
            <div
              className="flex items-center justify-between bg-primary/10 border border-primary/20 rounded-xl px-4 py-3"
              data-ocid="in-cart-strip"
            >
              <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                <CheckCircle2 className="w-4 h-4" />
                {cartQty} × {product.name} in cart
              </div>
              <Link
                to="/cart"
                className="text-xs font-bold text-primary underline underline-offset-2"
                data-ocid="view-cart-link"
              >
                View Cart →
              </Link>
            </div>
          )}
        </div>
      </div>

      <AuthModal
        open={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        message="Sign in to add items to your cart and checkout"
      />
    </Layout>
  );
}
