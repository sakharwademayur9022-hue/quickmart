import { u as useParams, r as reactExports, j as jsxRuntimeExports, L as Link, c as cn } from "./index-DJsfyEPD.js";
import { B as Badge } from "./badge-BflPiVcb.js";
import { c as createLucideIcon, u as useAuth, a as useCart, L as Layout, B as Button, S as ShoppingCart } from "./Layout-2vXxPoTN.js";
import { S as Skeleton } from "./skeleton-DaenLL9q.js";
import { Z as Zap, A as AuthModal } from "./AuthModal-CLGXaJbf.js";
import { b as useProduct } from "./useProducts-B7CZcMOm.js";
import { C as CircleCheck } from "./circle-check-Bnd3XXQN.js";
import { M as Minus } from "./minus-CFBydUQb.js";
import { P as Plus } from "./plus-Da899kh8.js";
import "./shopping-bag-8qMxQwFm.js";
import "./backend.d-C2Aaw6C6.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "m12 19-7-7 7-7", key: "1l729n" }],
  ["path", { d: "M19 12H5", key: "x3x0zl" }]
];
const ArrowLeft = createLucideIcon("arrow-left", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "m15 9-6 6", key: "1uzhvr" }],
  ["path", { d: "m9 9 6 6", key: "z0biqf" }]
];
const CircleX = createLucideIcon("circle-x", __iconNode);
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
const CATEGORY_LABELS = {
  Fruits: "Fruits",
  Vegetables: "Vegetables",
  Dairy: "Dairy",
  Snacks: "Snacks",
  Beverages: "Beverages",
  Bakery: "Bakery",
  Meat: "Meat",
  PersonalCare: "Personal Care",
  Household: "Household"
};
function ProductDetailSkeleton() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-2xl mx-auto px-4 py-6 flex flex-col gap-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-6 w-24" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "w-full aspect-square max-w-sm mx-auto rounded-2xl" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-24" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-7 w-3/4" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-full" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-5/6" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center pt-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-9 w-24" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-12 w-40" })
      ] })
    ] })
  ] });
}
function Product() {
  const { id } = useParams({ from: "/product/$id" });
  const productId = BigInt(id);
  const [imgError, setImgError] = reactExports.useState(false);
  const [localQty, setLocalQty] = reactExports.useState(1);
  const [authModalOpen, setAuthModalOpen] = reactExports.useState(false);
  const { isAuthenticated } = useAuth();
  const cartHook = useCart();
  const cartQty = cartHook.getItemQuantity(productId);
  const { data: product, isLoading } = useProduct(productId);
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(ProductDetailSkeleton, {}) });
  }
  if (!product) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-2xl mx-auto px-4 py-16 flex flex-col items-center gap-4 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-6xl", children: "😕" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-bold text-foreground", children: "Product not found" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "This item may no longer be available." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Link,
        {
          to: "/",
          className: "mt-2 btn-primary inline-flex items-center gap-2",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "w-4 h-4" }),
            "Back to Store"
          ]
        }
      )
    ] }) });
  }
  const categoryKey = Object.keys(
    product.category
  )[0];
  const emoji = CATEGORY_EMOJI[categoryKey] ?? "🛒";
  const categoryLabel = CATEGORY_LABELS[categoryKey] ?? categoryKey;
  const imgSrc = product.imageId && !imgError ? product.imageId : "/assets/images/product-placeholder.svg";
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
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Layout, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-2xl mx-auto px-4 py-4 flex flex-col gap-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Link,
        {
          to: "/",
          className: "inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors w-fit",
          "data-ocid": "back-button",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "w-4 h-4" }),
            "Back"
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "relative rounded-2xl overflow-hidden bg-muted/30 border border-border aspect-square max-w-sm mx-auto w-full shadow-sm",
          "data-ocid": "product-image",
          children: [
            isPlaceholder ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 flex items-center justify-center bg-muted/20", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-8xl filter drop-shadow", "aria-hidden": "true", children: emoji }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
              "img",
              {
                src: imgSrc,
                alt: product.name,
                className: "w-full h-full object-cover",
                onError: () => setImgError(true)
              }
            ),
            !product.inStock && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-card/75 backdrop-blur-[2px] flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Badge,
              {
                variant: "secondary",
                className: "text-sm font-bold px-3 py-1.5",
                children: "Out of Stock"
              }
            ) })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Badge,
            {
              variant: "secondary",
              className: "text-xs font-medium gap-1",
              "data-ocid": "category-badge",
              children: [
                emoji,
                " ",
                categoryLabel
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1 text-xs text-muted-foreground font-medium", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "w-3 h-3 text-accent" }),
            "10-min delivery"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "h1",
          {
            className: "text-2xl sm:text-3xl font-black text-foreground leading-tight",
            "data-ocid": "product-name",
            children: product.name
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: cn(
              "flex items-center gap-1.5 text-sm font-semibold",
              product.inStock ? "text-primary" : "text-destructive"
            ),
            "data-ocid": "stock-indicator",
            children: product.inStock ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-4 h-4" }),
              "In Stock — Ready to ship"
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "w-4 h-4" }),
              "Currently Out of Stock"
            ] })
          }
        ),
        product.description && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground leading-relaxed", children: product.description }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-px bg-border" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-4 flex-wrap", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mb-0.5", children: "Price" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: "text-3xl font-black text-accent",
                "data-ocid": "product-price",
                children: priceFormatted
              }
            )
          ] }),
          product.inStock && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
            cartQty === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "flex items-center border border-border rounded-xl overflow-hidden bg-card",
                "data-ocid": "qty-selector",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => setLocalQty((q) => Math.max(1, q - 1)),
                      disabled: localQty <= 1,
                      className: "px-3 py-2.5 text-foreground hover:bg-muted transition-colors disabled:opacity-40 disabled:cursor-not-allowed",
                      "aria-label": "Decrease quantity",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(Minus, { className: "w-4 h-4" })
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: "text-base font-bold min-w-[40px] text-center text-foreground",
                      "data-ocid": "qty-value",
                      children: localQty
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => setLocalQty((q) => q + 1),
                      className: "px-3 py-2.5 text-foreground hover:bg-muted transition-colors",
                      "aria-label": "Increase quantity",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4" })
                    }
                  )
                ]
              }
            ),
            cartQty > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "flex items-center gap-1 bg-primary rounded-xl overflow-hidden shadow-md",
                "data-ocid": "incart-qty-control",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      onClick: handleDecrementInCart,
                      className: "px-3 py-2.5 text-primary-foreground hover:bg-primary/80 transition-colors",
                      "aria-label": "Remove one from cart",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(Minus, { className: "w-4 h-4" })
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary-foreground text-base font-black min-w-[36px] text-center", children: cartQty }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      onClick: handleIncrementInCart,
                      className: "px-3 py-2.5 text-primary-foreground hover:bg-primary/80 transition-colors",
                      "aria-label": "Add one more to cart",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4" })
                    }
                  )
                ]
              }
            ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                size: "lg",
                className: "rounded-xl px-6 font-bold gap-2 h-11 shadow-md",
                onClick: handleAddToCart,
                disabled: cartHook.isAdding,
                "data-ocid": "add-to-cart-btn",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingCart, { className: "w-4 h-4" }),
                  "Add to Cart"
                ]
              }
            )
          ] })
        ] }),
        cartQty > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex items-center justify-between bg-primary/10 border border-primary/20 rounded-xl px-4 py-3",
            "data-ocid": "in-cart-strip",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-sm font-semibold text-primary", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-4 h-4" }),
                cartQty,
                " × ",
                product.name,
                " in cart"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Link,
                {
                  to: "/cart",
                  className: "text-xs font-bold text-primary underline underline-offset-2",
                  "data-ocid": "view-cart-link",
                  children: "View Cart →"
                }
              )
            ]
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
  Product as default
};
