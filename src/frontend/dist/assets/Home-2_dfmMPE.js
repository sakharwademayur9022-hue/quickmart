import { j as jsxRuntimeExports, c as cn, r as reactExports, L as Link } from "./index-DJsfyEPD.js";
import { B as Badge } from "./badge-BflPiVcb.js";
import { I as Input } from "./input-BsmGlAt7.js";
import { S as Skeleton } from "./skeleton-DaenLL9q.js";
import { Z as Zap, A as AuthModal } from "./AuthModal-CLGXaJbf.js";
import { E as EmptyState } from "./EmptyState-CsgZWgSy.js";
import { c as createLucideIcon, B as Button, S as ShoppingCart, u as useAuth, a as useCart, L as Layout, M as MapPin, b as Search } from "./Layout-2vXxPoTN.js";
import { M as Minus } from "./minus-CFBydUQb.js";
import { P as Plus } from "./plus-Da899kh8.js";
import { u as useProductsByCategory, a as useSearchProducts } from "./useProducts-B7CZcMOm.js";
import "./shopping-bag-8qMxQwFm.js";
import "./package-C5X_8B0-.js";
import "./backend.d-C2Aaw6C6.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  [
    "path",
    {
      d: "M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z",
      key: "4pj2yx"
    }
  ],
  ["path", { d: "M20 3v4", key: "1olli1" }],
  ["path", { d: "M22 5h-4", key: "1gvqau" }],
  ["path", { d: "M4 17v2", key: "vumght" }],
  ["path", { d: "M5 18H3", key: "zchphs" }]
];
const Sparkles = createLucideIcon("sparkles", __iconNode);
const CATEGORIES = [
  { value: null, label: "All", emoji: "🛒" },
  { value: "Fruits", label: "Fruits", emoji: "🍎" },
  { value: "Vegetables", label: "Vegetables", emoji: "🥦" },
  { value: "Dairy", label: "Dairy", emoji: "🥛" },
  { value: "Snacks", label: "Snacks", emoji: "🍟" },
  { value: "Beverages", label: "Beverages", emoji: "🧃" },
  { value: "Bakery", label: "Bakery", emoji: "🍞" },
  { value: "Meat", label: "Meat", emoji: "🥩" },
  { value: "PersonalCare", label: "Personal Care", emoji: "🧴" },
  { value: "Household", label: "Household", emoji: "🧹" }
];
function CategoryChip({ active, onChange }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: "flex gap-2 overflow-x-auto pb-1 scrollbar-hide -mx-4 px-4",
      role: "tablist",
      "aria-label": "Product categories",
      children: CATEGORIES.map(({ value, label, emoji }) => {
        const isActive = active === value;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            role: "tab",
            "aria-selected": isActive,
            onClick: () => onChange(value),
            className: cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap border transition-all shrink-0",
              isActive ? "bg-primary text-primary-foreground border-primary shadow-sm" : "bg-card text-foreground border-border hover:border-primary/40 hover:bg-primary/5"
            ),
            "data-ocid": `category-chip-${value ?? "all"}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-base leading-none", children: emoji }),
              label
            ]
          },
          label
        );
      })
    }
  );
}
const CATEGORY_EMOJI = {
  Fruits: "🍎",
  Vegetables: "🥦",
  Dairy: "🥛",
  Snacks: "🍟",
  Beverages: "🧃",
  Bakery: "🍞",
  Meat: "🥩",
  PersonalCare: "🧴",
  Household: "🧹"
};
const PRODUCT_IMAGES = {
  default: "/assets/images/product-placeholder.svg"
};
function ProductCard({
  product,
  quantity = 0,
  onAddToCart,
  onIncrement,
  onDecrement,
  onRequireAuth,
  isAuthenticated = false
}) {
  const [imgError, setImgError] = reactExports.useState(false);
  const categoryKey = Object.keys(
    product.category
  )[0];
  const emoji = CATEGORY_EMOJI[categoryKey] ?? "🛒";
  const imgSrc = product.imageId && !imgError ? product.imageId : PRODUCT_IMAGES.default;
  const handleAdd = () => {
    if (!isAuthenticated) {
      onRequireAuth == null ? void 0 : onRequireAuth();
      return;
    }
    onAddToCart == null ? void 0 : onAddToCart(product);
  };
  const priceFormatted = `₹${Number(product.price)}`;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "card-elevated bg-card rounded-xl overflow-hidden flex flex-col group cursor-pointer",
      "data-ocid": `product-card-${product.id}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative aspect-square bg-muted/40 overflow-hidden", children: [
          typeof imgSrc === "string" && imgSrc.endsWith(".svg") ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-5xl", children: emoji }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
            "img",
            {
              src: imgSrc,
              alt: product.name,
              className: "w-full h-full object-cover group-hover:scale-105 transition-transform duration-300",
              onError: () => setImgError(true)
            }
          ),
          !product.inStock && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-card/80 backdrop-blur-sm flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", className: "text-xs font-semibold", children: "Out of Stock" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-2 left-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Badge,
            {
              variant: "secondary",
              className: "text-[10px] px-1.5 py-0.5 font-medium bg-card/90 text-foreground border-border",
              children: [
                emoji,
                " ",
                categoryKey
              ]
            }
          ) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 flex flex-col gap-2 flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground font-medium flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "w-3 h-3 text-accent" }),
              "10-min delivery"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold text-foreground line-clamp-2 mt-0.5 leading-snug", children: product.name })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-base font-black text-accent", children: priceFormatted }),
            product.inStock ? quantity > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "flex items-center gap-1 bg-primary rounded-lg overflow-hidden",
                "data-ocid": `qty-control-${product.id}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => onDecrement == null ? void 0 : onDecrement(product),
                      className: "px-2 py-1.5 text-primary-foreground hover:bg-primary/80 transition-colors",
                      "aria-label": "Decrease quantity",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(Minus, { className: "w-3 h-3" })
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary-foreground text-sm font-bold min-w-[20px] text-center", children: quantity }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => onIncrement == null ? void 0 : onIncrement(product),
                      className: "px-2 py-1.5 text-primary-foreground hover:bg-primary/80 transition-colors",
                      "aria-label": "Increase quantity",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-3 h-3" })
                    }
                  )
                ]
              }
            ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                size: "sm",
                variant: "default",
                className: cn(
                  "rounded-lg px-3 py-1.5 h-auto text-xs font-semibold gap-1.5",
                  "bg-primary text-primary-foreground hover:bg-primary/90"
                ),
                onClick: handleAdd,
                "data-ocid": `add-to-cart-${product.id}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingCart, { className: "w-3 h-3" }),
                  "Add"
                ]
              }
            ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                size: "sm",
                variant: "secondary",
                disabled: true,
                className: "rounded-lg text-xs h-auto py-1.5",
                children: "Notify Me"
              }
            )
          ] })
        ] })
      ]
    }
  );
}
const HERO_BANNERS = [
  {
    id: "delivery",
    bg: "from-primary/90 to-primary",
    emoji: "⚡",
    headline: "Delivered in 10 minutes",
    sub: "Fresh groceries at your door, faster than ever",
    badge: "10 min",
    badgeColor: "bg-accent text-accent-foreground"
  },
  {
    id: "fresh",
    bg: "from-accent/80 to-accent",
    emoji: "🥦",
    headline: "Farm-fresh produce daily",
    sub: "Sourced from local farms — nothing but the freshest",
    badge: "New Arrivals",
    badgeColor: "bg-primary text-primary-foreground"
  },
  {
    id: "offer",
    bg: "from-primary/70 to-accent/80",
    emoji: "🎁",
    headline: "Up to 30% off today",
    sub: "Limited-time deals on snacks, beverages & more",
    badge: "Today Only",
    badgeColor: "bg-card text-foreground"
  }
];
function HeroBanner() {
  const [active, setActive] = reactExports.useState(0);
  const timerRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    timerRef.current = setInterval(() => {
      setActive((a) => (a + 1) % HERO_BANNERS.length);
    }, 4e3);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);
  const banner = HERO_BANNERS[active];
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative overflow-hidden rounded-2xl", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: cn(
        "bg-gradient-to-br p-6 sm:p-8 min-h-[160px] sm:min-h-[180px] flex flex-col justify-between transition-all duration-700",
        banner.bg
      ),
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Badge,
              {
                className: cn(
                  "text-xs font-bold px-2.5 py-1 mb-3 border-0",
                  banner.badgeColor
                ),
                children: banner.badge
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl sm:text-2xl font-black text-white leading-tight drop-shadow-sm", children: banner.headline }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/80 text-sm mt-1.5 max-w-xs", children: banner.sub })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: "text-5xl sm:text-6xl shrink-0 filter drop-shadow",
              "aria-hidden": "true",
              children: banner.emoji
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-1.5 mt-4", children: HERO_BANNERS.map((b, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: () => setActive(i),
            "aria-label": `Slide ${i + 1}`,
            className: cn(
              "rounded-full transition-all duration-300",
              i === active ? "w-5 h-1.5 bg-white" : "w-1.5 h-1.5 bg-white/50 hover:bg-white/75"
            )
          },
          b.id
        )) })
      ]
    }
  ) });
}
function ProductGrid({
  products,
  isLoading,
  onAddToCart,
  onIncrement,
  onDecrement,
  getItemQuantity,
  isAuthenticated,
  onRequireAuth
}) {
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3", children: ["sk-1", "sk-2", "sk-3", "sk-4", "sk-5", "sk-6", "sk-7", "sk-8"].map(
      (key) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl overflow-hidden bg-card", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "aspect-square w-full" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-3/4" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-1/2" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between pt-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-5 w-16" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-7 w-14" })
          ] })
        ] })
      ] }, key)
    ) });
  }
  if (!products || products.length === 0) {
    return null;
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3",
      "data-ocid": "product-grid",
      children: products.map((product) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        Link,
        {
          to: "/product/$id",
          params: { id: product.id.toString() },
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            ProductCard,
            {
              product,
              quantity: getItemQuantity(product.id),
              isAuthenticated,
              onAddToCart,
              onIncrement,
              onDecrement,
              onRequireAuth
            }
          )
        },
        product.id.toString()
      ))
    }
  );
}
function Home() {
  const [search, setSearch] = reactExports.useState("");
  const [debouncedSearch, setDebouncedSearch] = reactExports.useState("");
  const [selectedCategory, setSelectedCategory] = reactExports.useState(
    null
  );
  const [authModalOpen, setAuthModalOpen] = reactExports.useState(false);
  const debounceRef = reactExports.useRef(null);
  const { isAuthenticated } = useAuth();
  const cartHook = useCart();
  reactExports.useEffect(() => {
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
    isSearching ? null : selectedCategory
  );
  const { data: searchResults, isLoading: searchLoading } = useSearchProducts(debouncedSearch);
  const products = isSearching ? searchResults : allProducts;
  const isLoading = isSearching ? searchLoading : allLoading;
  const isEmpty = !isLoading && (!products || products.length === 0);
  const handleRequireAuth = reactExports.useCallback(() => setAuthModalOpen(true), []);
  const handleAddToCart = reactExports.useCallback(
    (product) => {
      cartHook.addToCart(product.id, product.name);
    },
    [cartHook]
  );
  const handleIncrement = reactExports.useCallback(
    (product) => {
      cartHook.addToCart(product.id, product.name, 1n);
    },
    [cartHook]
  );
  const handleDecrement = reactExports.useCallback(
    (product) => {
      const qty = cartHook.getItemQuantity(product.id);
      if (qty > 1) {
        cartHook.addToCart(product.id, product.name, BigInt(qty - 1));
      } else {
        cartHook.removeFromCart(product.id);
      }
    },
    [cartHook]
  );
  const sectionTitle = reactExports.useMemo(() => {
    if (isSearching) return `Results for "${debouncedSearch}"`;
    if (selectedCategory) return selectedCategory;
    return "All Products";
  }, [isSearching, debouncedSearch, selectedCategory]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Layout, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-primary text-primary-foreground text-xs font-semibold text-center py-2 flex items-center justify-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "w-3.5 h-3.5", "aria-hidden": "true" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Express delivery in as fast as 10 minutes!" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "w-3.5 h-3.5", "aria-hidden": "true" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "opacity-75", children: "Mumbai" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto px-4 py-4 flex flex-col gap-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", "data-ocid": "search-bar", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            type: "search",
            placeholder: "Search groceries, snacks, beverages…",
            className: "pl-10 pr-4 h-11 rounded-full border-input bg-card shadow-sm text-sm focus-visible:ring-primary",
            value: search,
            onChange: (e) => setSearch(e.target.value),
            "data-ocid": "search-input",
            "aria-label": "Search products"
          }
        ),
        search && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: () => setSearch(""),
            className: "absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground transition-colors px-1",
            "aria-label": "Clear search",
            children: "✕"
          }
        )
      ] }),
      !isSearching && /* @__PURE__ */ jsxRuntimeExports.jsx("section", { "aria-label": "Promotions", children: /* @__PURE__ */ jsxRuntimeExports.jsx(HeroBanner, {}) }),
      !isSearching && /* @__PURE__ */ jsxRuntimeExports.jsx("section", { "aria-label": "Categories", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        CategoryChip,
        {
          active: selectedCategory,
          onChange: setSelectedCategory
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { "aria-label": sectionTitle, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-between mb-3 gap-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-base font-bold text-foreground flex items-center gap-2", children: [
          !isSearching && /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "w-4 h-4 text-accent", "aria-hidden": "true" }),
          sectionTitle,
          !isLoading && products && products.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-normal text-muted-foreground", children: [
            "(",
            products.length,
            ")"
          ] })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          ProductGrid,
          {
            products,
            isLoading,
            isAuthenticated,
            onAddToCart: handleAddToCart,
            onIncrement: handleIncrement,
            onDecrement: handleDecrement,
            getItemQuantity: cartHook.getItemQuantity,
            onRequireAuth: handleRequireAuth
          }
        ),
        isEmpty && isSearching && /* @__PURE__ */ jsxRuntimeExports.jsx(
          EmptyState,
          {
            variant: "search",
            title: `No results for "${debouncedSearch}"`,
            description: "Try checking the spelling or browse a category below",
            ctaLabel: "Browse All",
            onCta: () => {
              setSearch("");
              setSelectedCategory(null);
            }
          }
        ),
        isEmpty && !isSearching && /* @__PURE__ */ jsxRuntimeExports.jsx(
          EmptyState,
          {
            variant: "products",
            title: "No products here yet",
            description: "Check back soon — we're adding new items daily"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      AuthModal,
      {
        open: authModalOpen,
        onClose: () => setAuthModalOpen(false),
        message: "Sign in to add items to your cart and checkout"
      }
    )
  ] });
}
export {
  Home as default
};
