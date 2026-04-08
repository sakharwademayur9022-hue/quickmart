import { b as useNavigate, u as useParams, e as useSearch, r as reactExports, j as jsxRuntimeExports, c as cn } from "./index-DJsfyEPD.js";
import { B as Badge } from "./badge-BflPiVcb.js";
import { c as createLucideIcon, u as useAuth, a as useCart, L as Layout, B as Button, M as MapPin, d as useBackendActor, e as useQuery } from "./Layout-2vXxPoTN.js";
import { S as Separator } from "./separator-QuaEKnd5.js";
import { S as Skeleton } from "./skeleton-DaenLL9q.js";
import { O as OrderStatus } from "./backend.d-C2Aaw6C6.js";
import { P as Package } from "./package-C5X_8B0-.js";
import "./index-Du6goGIy.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$4 = [["path", { d: "m15 18-6-6 6-6", key: "1wnfg3" }]];
const ChevronLeft = createLucideIcon("chevron-left", __iconNode$4);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$3 = [
  ["path", { d: "M21.801 10A10 10 0 1 1 17 3.335", key: "yps3ct" }],
  ["path", { d: "m9 11 3 3L22 4", key: "1pflzl" }]
];
const CircleCheckBig = createLucideIcon("circle-check-big", __iconNode$3);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["polyline", { points: "12 6 12 12 16 14", key: "68esgv" }]
];
const Clock = createLucideIcon("clock", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8", key: "v9h5vc" }],
  ["path", { d: "M21 3v5h-5", key: "1q7to0" }],
  ["path", { d: "M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16", key: "3uifl3" }],
  ["path", { d: "M8 16H3v5", key: "1cv678" }]
];
const RefreshCw = createLucideIcon("refresh-cw", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2", key: "wrbu53" }],
  ["path", { d: "M15 18H9", key: "1lyqi6" }],
  [
    "path",
    {
      d: "M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14",
      key: "lysw3i"
    }
  ],
  ["circle", { cx: "17", cy: "18", r: "2", key: "332jqn" }],
  ["circle", { cx: "7", cy: "18", r: "2", key: "19iecd" }]
];
const Truck = createLucideIcon("truck", __iconNode);
const STEPS = [
  { key: OrderStatus.Confirmed, label: "Confirmed", icon: CircleCheckBig },
  { key: OrderStatus.InTransit, label: "In Transit", icon: Truck },
  { key: OrderStatus.Delivered, label: "Delivered", icon: Package }
];
const STATUS_ORDER = {
  [OrderStatus.Confirmed]: 0,
  [OrderStatus.InTransit]: 1,
  [OrderStatus.Delivered]: 2
};
function StepIndicator({ status }) {
  const currentIdx = STATUS_ORDER[status];
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center", "aria-label": "Order progress", children: STEPS.map((step, i) => {
    const Icon = step.icon;
    const done = i <= currentIdx;
    const active = i === currentIdx;
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex items-center flex-1 last:flex-none",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: cn(
                  "w-9 h-9 rounded-full flex items-center justify-center border-2 transition-smooth",
                  done ? "bg-primary border-primary text-primary-foreground" : "bg-muted border-border text-muted-foreground",
                  active && "ring-4 ring-primary/20"
                ),
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "w-4 h-4" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: cn(
                  "text-[10px] font-semibold whitespace-nowrap",
                  done ? "text-primary" : "text-muted-foreground"
                ),
                children: step.label
              }
            )
          ] }),
          i < STEPS.length - 1 && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: cn(
                "flex-1 h-0.5 mb-4 mx-1 rounded",
                i < currentIdx ? "bg-primary" : "bg-border"
              )
            }
          )
        ]
      },
      step.key
    );
  }) });
}
function formatDate(ns) {
  const ms = Number(ns) / 1e6;
  return new Date(ms).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}
function formatTime(ns) {
  const ms = Number(ns) / 1e6;
  return new Date(ms).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit"
  });
}
function formatAmount(paise) {
  return `₹${(Number(paise) / 100).toFixed(2)}`;
}
function useOrderDetail(id) {
  const { actor, isFetching: actorLoading } = useBackendActor();
  const { isAuthenticated } = useAuth();
  return useQuery({
    queryKey: ["order", id],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getOrder(BigInt(id));
    },
    enabled: isAuthenticated && !!actor && !actorLoading,
    refetchInterval: 5e3
  });
}
function OrderSkeleton() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-48" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-24 w-full rounded-2xl" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-32 w-full rounded-2xl" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-40 w-full rounded-2xl" })
  ] });
}
function OrderDetail() {
  const navigate = useNavigate();
  const { id } = useParams({ from: "/orders/$id" });
  const search = useSearch({ strict: false });
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { addToCart } = useCart();
  const { data: order, isLoading } = useOrderDetail(id);
  reactExports.useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate({ to: "/" });
    }
  }, [isAuthenticated, authLoading, navigate]);
  const handleReorder = () => {
    if (!order) return;
    for (const item of order.items) {
      addToCart(item.productId, item.name, item.quantity);
    }
    navigate({ to: "/cart" });
  };
  const isSuccess = (search == null ? void 0 : search.success) === "1";
  if (isLoading || authLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-2xl mx-auto px-4 py-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(OrderSkeleton, {}) }) });
  }
  if (!order) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-2xl mx-auto px-4 py-6 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "w-12 h-12 text-muted-foreground mx-auto mb-4" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-bold text-foreground", children: "Order not found" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm mt-1 mb-4", children: "This order may have been removed or doesn't exist." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          variant: "outline",
          onClick: () => navigate({ to: "/orders" }),
          className: "rounded-full",
          children: "View all orders"
        }
      )
    ] }) });
  }
  const subtotal = order.totalAmount - order.deliveryFee;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-2xl mx-auto px-4 py-6 space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        type: "button",
        onClick: () => navigate({ to: "/orders" }),
        className: "flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors",
        "data-ocid": "back-to-orders",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "w-4 h-4" }),
          "All Orders"
        ]
      }
    ),
    isSuccess && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 p-4 rounded-2xl bg-primary/10 border border-primary/20", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "w-5 h-5 text-primary shrink-0" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-bold text-primary", children: "Order Placed Successfully!" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-primary/80 mt-0.5", children: "Your groceries are being picked up. Expected delivery soon!" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-2xl border border-border p-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-4 mb-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-lg font-black text-foreground font-display", children: [
            "Order #",
            String(order.id).slice(-6).toUpperCase()
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-0.5", children: [
            "Placed on ",
            formatDate(order.createdAt)
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Badge,
          {
            variant: "outline",
            className: cn(
              "text-xs font-semibold px-3 py-1 rounded-full shrink-0",
              order.status === OrderStatus.Confirmed && "bg-accent/20 text-accent-foreground border-accent/40",
              order.status === OrderStatus.InTransit && "bg-secondary/30 text-secondary-foreground border-secondary/50",
              order.status === OrderStatus.Delivered && "bg-primary/15 text-primary border-primary/30"
            ),
            children: order.status === OrderStatus.InTransit ? "In Transit" : order.status
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StepIndicator, { status: order.status }),
      order.status !== OrderStatus.Delivered && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 flex items-center gap-2 p-3 rounded-xl bg-muted/50 border border-border", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-4 h-4 text-primary shrink-0" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
            "Estimated delivery:",
            " "
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-bold text-foreground", children: formatTime(order.estimatedDelivery) })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-2xl border border-border overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-5 py-3 border-b border-border bg-muted/30", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-sm font-bold text-foreground", children: [
        "Items (",
        order.items.length,
        ")"
      ] }) }),
      order.items.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "flex items-center gap-4 px-5 py-3.5 border-b border-border last:border-0",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-xl bg-muted flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "w-5 h-5 text-muted-foreground" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground truncate", children: item.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-0.5", children: [
                "Qty: ",
                Number(item.quantity)
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-bold text-foreground shrink-0", children: formatAmount(item.price * item.quantity) })
          ]
        },
        String(item.productId)
      ))
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-2xl border border-border p-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "w-4 h-4 text-primary" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-bold text-foreground", children: "Delivery Address" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pl-6 space-y-0.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-accent-foreground uppercase tracking-wide", children: order.deliveryAddress.tag }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-foreground", children: order.deliveryAddress.line1 }),
        order.deliveryAddress.line2 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-foreground", children: order.deliveryAddress.line2 }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
          order.deliveryAddress.city,
          " – ",
          order.deliveryAddress.pincode
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-2xl border border-border p-5 space-y-2.5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-bold text-foreground mb-1", children: "Price Details" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-sm text-muted-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Subtotal" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: formatAmount(subtotal) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-sm text-muted-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Delivery fee" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            className: order.deliveryFee === 0n ? "text-primary font-medium" : "",
            children: order.deliveryFee === 0n ? "FREE" : formatAmount(order.deliveryFee)
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between font-bold text-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Total" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary", children: formatAmount(order.totalAmount) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Button,
      {
        className: "w-full rounded-full font-bold text-sm py-3 gap-2",
        onClick: handleReorder,
        "data-ocid": "reorder-btn",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "w-4 h-4" }),
          "Reorder All Items"
        ]
      }
    )
  ] }) });
}
export {
  OrderDetail as default
};
