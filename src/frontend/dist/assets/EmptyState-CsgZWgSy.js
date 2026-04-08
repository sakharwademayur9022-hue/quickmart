import { j as jsxRuntimeExports, c as cn } from "./index-DJsfyEPD.js";
import { c as createLucideIcon, b as Search, S as ShoppingCart, B as Button } from "./Layout-2vXxPoTN.js";
import { P as Package } from "./package-C5X_8B0-.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["line", { x1: "12", x2: "12", y1: "8", y2: "12", key: "1pkeuh" }],
  ["line", { x1: "12", x2: "12.01", y1: "16", y2: "16", key: "4dfq90" }]
];
const CircleAlert = createLucideIcon("circle-alert", __iconNode);
const VARIANTS = {
  cart: {
    icon: ShoppingCart,
    title: "Your cart is empty",
    description: "Add items from our store to get started"
  },
  orders: {
    icon: Package,
    title: "No orders yet",
    description: "Your past orders will appear here"
  },
  search: {
    icon: Search,
    title: "No results found",
    description: "Try a different keyword or browse categories"
  },
  products: {
    icon: Package,
    title: "No products available",
    description: "Check back soon for more items"
  },
  generic: {
    icon: CircleAlert,
    title: "Nothing here yet",
    description: "This section is empty for now"
  }
};
function EmptyState({
  variant = "generic",
  title,
  description,
  ctaLabel,
  onCta,
  className
}) {
  const config = VARIANTS[variant];
  const Icon = config.icon;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: cn(
        "flex flex-col items-center justify-center text-center py-16 px-4 gap-4",
        className
      ),
      "data-ocid": "empty-state",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-20 h-20 rounded-full bg-muted/60 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "w-9 h-9 text-muted-foreground" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-bold text-foreground", children: title ?? config.title }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1 max-w-xs", children: description ?? config.description })
        ] }),
        ctaLabel && onCta && /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            variant: "default",
            className: "rounded-full px-6 font-semibold",
            onClick: onCta,
            "data-ocid": "empty-state-cta",
            children: ctaLabel
          }
        )
      ]
    }
  );
}
export {
  EmptyState as E
};
