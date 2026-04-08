import { b as useNavigate, r as reactExports, j as jsxRuntimeExports, c as cn } from "./index-DJsfyEPD.js";
import { B as Badge } from "./badge-BflPiVcb.js";
import { S as Skeleton } from "./skeleton-DaenLL9q.js";
import { u as useAuth, L as Layout, C as ClipboardList, d as useBackendActor, e as useQuery } from "./Layout-2vXxPoTN.js";
import { O as OrderStatus } from "./backend.d-C2Aaw6C6.js";
import { E as EmptyState } from "./EmptyState-CsgZWgSy.js";
import { P as Package } from "./package-C5X_8B0-.js";
import { C as ChevronRight } from "./chevron-right-C8hkA3ky.js";
const STATUS_META = {
  [OrderStatus.Confirmed]: {
    label: "Confirmed",
    className: "bg-accent/20 text-accent-foreground border-accent/40"
  },
  [OrderStatus.InTransit]: {
    label: "In Transit",
    className: "bg-secondary/30 text-secondary-foreground border-secondary/50"
  },
  [OrderStatus.Delivered]: {
    label: "Delivered",
    className: "bg-primary/15 text-primary border-primary/30"
  }
};
function StatusBadge({ status }) {
  const meta = STATUS_META[status];
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Badge,
    {
      variant: "outline",
      className: cn(
        "text-xs font-semibold px-2 py-0.5 rounded-full",
        meta.className
      ),
      children: meta.label
    }
  );
}
function useMyOrders() {
  const { actor, isFetching: actorLoading } = useBackendActor();
  const { isAuthenticated } = useAuth();
  return useQuery({
    queryKey: ["myOrders"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMyOrders();
    },
    enabled: isAuthenticated && !!actor && !actorLoading,
    refetchInterval: 5e3
  });
}
function OrderRowSkeleton() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 p-4 border-b border-border last:border-0", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "w-10 h-10 rounded-xl shrink-0" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 space-y-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-32" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-20" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-end gap-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-5 w-16 rounded-full" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-12" })
    ] })
  ] });
}
function Orders() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { data: orders = [], isLoading } = useMyOrders();
  reactExports.useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate({ to: "/" });
    }
  }, [isAuthenticated, authLoading, navigate]);
  const formatDate = (ns) => {
    const ms = Number(ns) / 1e6;
    return new Date(ms).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric"
    });
  };
  const formatAmount = (paise) => `₹${(Number(paise) / 100).toFixed(2)}`;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-2xl mx-auto px-4 py-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ClipboardList, { className: "w-5 h-5 text-primary" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-black text-foreground font-display", children: "My Orders" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Track all your past purchases" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-card rounded-2xl border border-border shadow-sm overflow-hidden", children: isLoading || authLoading ? ["a", "b", "c", "d"].map((k) => /* @__PURE__ */ jsxRuntimeExports.jsx(OrderRowSkeleton, {}, k)) : orders.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      EmptyState,
      {
        variant: "orders",
        title: "No orders yet",
        description: "Place your first order to see it here",
        ctaLabel: "Shop Now",
        onCta: () => navigate({ to: "/" })
      }
    ) : orders.map((order) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        type: "button",
        onClick: () => navigate({
          to: "/orders/$id",
          params: { id: String(order.id) }
        }),
        className: "w-full flex items-center gap-4 p-4 border-b border-border last:border-0 hover:bg-muted/40 active:bg-muted transition-colors text-left",
        "data-ocid": "order-row",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-xl bg-muted flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "w-5 h-5 text-muted-foreground" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-bold text-foreground truncate", children: [
              "Order #",
              String(order.id).slice(-6).toUpperCase()
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-0.5", children: [
              formatDate(order.createdAt),
              " · ",
              order.items.length,
              " item",
              order.items.length !== 1 ? "s" : ""
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-end gap-1.5 shrink-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: order.status }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-bold text-foreground", children: formatAmount(order.totalAmount) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "w-4 h-4 text-muted-foreground shrink-0" })
        ]
      },
      String(order.id)
    )) })
  ] }) });
}
export {
  Orders as default
};
