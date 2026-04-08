import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";
import { MapPin, Search, Sparkles, Zap } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import AuthModal from "../components/AuthModal";
import CategoryChip from "../components/CategoryChip";
import EmptyState from "../components/EmptyState";
import Layout from "../components/Layout";
import ProductCard from "../components/ProductCard";
import { useAuth } from "../hooks/useAuth";
import { useCart } from "../hooks/useCart";
import { useProductsByCategory, useSearchProducts } from "../hooks/useProducts";
import type { Category, Product } from "../types";

// ── Hero banner data ──────────────────────────────────────────────────────
const HERO_BANNERS = [
  {
    id: "delivery",
    bg: "from-primary/90 to-primary",
    emoji: "⚡",
    headline: "Delivered in 10 minutes",
    sub: "Fresh groceries at your door, faster than ever",
    badge: "10 min",
    badgeColor: "bg-accent text-accent-foreground",
  },
  {
    id: "fresh",
    bg: "from-accent/80 to-accent",
    emoji: "🥦",
    headline: "Farm-fresh produce daily",
    sub: "Sourced from local farms — nothing but the freshest",
    badge: "New Arrivals",
    badgeColor: "bg-primary text-primary-foreground",
  },
  {
    id: "offer",
    bg: "from-primary/70 to-accent/80",
    emoji: "🎁",
    headline: "Up to 30% off today",
    sub: "Limited-time deals on snacks, beverages & more",
    badge: "Today Only",
    badgeColor: "bg-card text-foreground",
  },
];

function HeroBanner() {
  const [active, setActive] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setActive((a) => (a + 1) % HERO_BANNERS.length);
    }, 4000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const banner = HERO_BANNERS[active];

  return (
    <div className="relative overflow-hidden rounded-2xl">
      <div
        className={cn(
          "bg-gradient-to-br p-6 sm:p-8 min-h-[160px] sm:min-h-[180px] flex flex-col justify-between transition-all duration-700",
          banner.bg,
        )}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <Badge
              className={cn(
                "text-xs font-bold px-2.5 py-1 mb-3 border-0",
                banner.badgeColor,
              )}
            >
              {banner.badge}
            </Badge>
            <h2 className="text-xl sm:text-2xl font-black text-white leading-tight drop-shadow-sm">
              {banner.headline}
            </h2>
            <p className="text-white/80 text-sm mt-1.5 max-w-xs">
              {banner.sub}
            </p>
          </div>
          <span
            className="text-5xl sm:text-6xl shrink-0 filter drop-shadow"
            aria-hidden="true"
          >
            {banner.emoji}
          </span>
        </div>
        <div className="flex items-center gap-1.5 mt-4">
          {HERO_BANNERS.map((b, i) => (
            <button
              key={b.id}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Slide ${i + 1}`}
              className={cn(
                "rounded-full transition-all duration-300",
                i === active
                  ? "w-5 h-1.5 bg-white"
                  : "w-1.5 h-1.5 bg-white/50 hover:bg-white/75",
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

interface ProductGridProps {
  products: Product[] | undefined;
  isLoading: boolean;
  onAddToCart: (p: Product) => void;
  onIncrement: (p: Product) => void;
  onDecrement: (p: Product) => void;
  getItemQuantity: (id: bigint) => number;
  isAuthenticated: boolean;
  onRequireAuth: () => void;
}

function ProductGrid({
  products,
  isLoading,
  onAddToCart,
  onIncrement,
  onDecrement,
  getItemQuantity,
  isAuthenticated,
  onRequireAuth,
}: ProductGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {["sk-1", "sk-2", "sk-3", "sk-4", "sk-5", "sk-6", "sk-7", "sk-8"].map(
          (key) => (
            <div key={key} className="rounded-xl overflow-hidden bg-card">
              <Skeleton className="aspect-square w-full" />
              <div className="p-3 space-y-2">
                <Skeleton className="h-3 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
                <div className="flex justify-between pt-1">
                  <Skeleton className="h-5 w-16" />
                  <Skeleton className="h-7 w-14" />
                </div>
              </div>
            </div>
          ),
        )}
      </div>
    );
  }

  if (!products || products.length === 0) {
    return null;
  }

  return (
    <div
      className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3"
      data-ocid="product-grid"
    >
      {products.map((product) => (
        <Link
          key={product.id.toString()}
          to="/product/$id"
          params={{ id: product.id.toString() }}
        >
          <ProductCard
            product={product}
            quantity={getItemQuantity(product.id)}
            isAuthenticated={isAuthenticated}
            onAddToCart={onAddToCart}
            onIncrement={onIncrement}
            onDecrement={onDecrement}
            onRequireAuth={onRequireAuth}
          />
        </Link>
      ))}
    </div>
  );
}

export default function Home() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  );
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { isAuthenticated } = useAuth();
  const cartHook = useCart();

  // Debounce search input
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [search]);

  const isSearching = debouncedSearch.trim().length > 0;

  const { data: allProducts, isLoading: allLoading } = useProductsByCategory(
    isSearching ? null : selectedCategory,
  );
  const { data: searchResults, isLoading: searchLoading } =
    useSearchProducts(debouncedSearch);

  const products = isSearching ? searchResults : allProducts;
  const isLoading = isSearching ? searchLoading : allLoading;
  const isEmpty = !isLoading && (!products || products.length === 0);

  const handleRequireAuth = useCallback(() => setAuthModalOpen(true), []);

  const handleAddToCart = useCallback(
    (product: Product) => {
      cartHook.addToCart(product.id, product.name);
    },
    [cartHook],
  );

  const handleIncrement = useCallback(
    (product: Product) => {
      cartHook.addToCart(product.id, product.name, 1n);
    },
    [cartHook],
  );

  const handleDecrement = useCallback(
    (product: Product) => {
      const qty = cartHook.getItemQuantity(product.id);
      if (qty > 1) {
        cartHook.addToCart(product.id, product.name, BigInt(qty - 1));
      } else {
        cartHook.removeFromCart(product.id);
      }
    },
    [cartHook],
  );

  const sectionTitle = useMemo(() => {
    if (isSearching) return `Results for "${debouncedSearch}"`;
    if (selectedCategory) return selectedCategory;
    return "All Products";
  }, [isSearching, debouncedSearch, selectedCategory]);

  return (
    <Layout>
      {/* Delivery banner strip */}
      <div className="bg-primary text-primary-foreground text-xs font-semibold text-center py-2 flex items-center justify-center gap-2">
        <Zap className="w-3.5 h-3.5" aria-hidden="true" />
        <span>Express delivery in as fast as 10 minutes!</span>
        <MapPin className="w-3.5 h-3.5" aria-hidden="true" />
        <span className="opacity-75">Mumbai</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-5">
        {/* Search bar — mobile prominent */}
        <div className="relative" data-ocid="search-bar">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <Input
            type="search"
            placeholder="Search groceries, snacks, beverages…"
            className="pl-10 pr-4 h-11 rounded-full border-input bg-card shadow-sm text-sm focus-visible:ring-primary"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            data-ocid="search-input"
            aria-label="Search products"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground transition-colors px-1"
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
        </div>

        {/* Hero banner — hidden when searching */}
        {!isSearching && (
          <section aria-label="Promotions">
            <HeroBanner />
          </section>
        )}

        {/* Category strip */}
        {!isSearching && (
          <section aria-label="Categories">
            <CategoryChip
              active={selectedCategory}
              onChange={setSelectedCategory}
            />
          </section>
        )}

        {/* Products section */}
        <section aria-label={sectionTitle}>
          <div className="flex items-center justify-between mb-3 gap-2">
            <h2 className="text-base font-bold text-foreground flex items-center gap-2">
              {!isSearching && (
                <Sparkles className="w-4 h-4 text-accent" aria-hidden="true" />
              )}
              {sectionTitle}
              {!isLoading && products && products.length > 0 && (
                <span className="text-xs font-normal text-muted-foreground">
                  ({products.length})
                </span>
              )}
            </h2>
          </div>

          <ProductGrid
            products={products}
            isLoading={isLoading}
            isAuthenticated={isAuthenticated}
            onAddToCart={handleAddToCart}
            onIncrement={handleIncrement}
            onDecrement={handleDecrement}
            getItemQuantity={cartHook.getItemQuantity}
            onRequireAuth={handleRequireAuth}
          />

          {isEmpty && isSearching && (
            <EmptyState
              variant="search"
              title={`No results for "${debouncedSearch}"`}
              description="Try checking the spelling or browse a category below"
              ctaLabel="Browse All"
              onCta={() => {
                setSearch("");
                setSelectedCategory(null);
              }}
            />
          )}

          {isEmpty && !isSearching && (
            <EmptyState
              variant="products"
              title="No products here yet"
              description="Check back soon — we're adding new items daily"
            />
          )}
        </section>
      </div>

      <AuthModal
        open={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        message="Sign in to add items to your cart and checkout"
      />
    </Layout>
  );
}
