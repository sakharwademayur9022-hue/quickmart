import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { ChevronRight, ClipboardList, Package } from "lucide-react";
import { useEffect } from "react";
import type { OrderView } from "../backend.d";
import { OrderStatus } from "../backend.d";
import EmptyState from "../components/EmptyState";
import Layout from "../components/Layout";
import { useAuth } from "../hooks/useAuth";
import { useBackendActor } from "../hooks/useBackendActor";

// ── Status helpers ────────────────────────────────────────────────────────────

const STATUS_META: Record<OrderStatus, { label: string; className: string }> = {
  [OrderStatus.Confirmed]: {
    label: "Confirmed",
    className: "bg-accent/20 text-accent-foreground border-accent/40",
  },
  [OrderStatus.InTransit]: {
    label: "In Transit",
    className: "bg-secondary/30 text-secondary-foreground border-secondary/50",
  },
  [OrderStatus.Delivered]: {
    label: "Delivered",
    className: "bg-primary/15 text-primary border-primary/30",
  },
};

function StatusBadge({ status }: { status: OrderStatus }) {
  const meta = STATUS_META[status];
  return (
    <Badge
      variant="outline"
      className={cn(
        "text-xs font-semibold px-2 py-0.5 rounded-full",
        meta.className,
      )}
    >
      {meta.label}
    </Badge>
  );
}

// ── Hook ──────────────────────────────────────────────────────────────────────

function useMyOrders() {
  const { actor, isFetching: actorLoading } = useBackendActor();
  const { isAuthenticated } = useAuth();

  return useQuery<OrderView[]>({
    queryKey: ["myOrders"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMyOrders();
    },
    enabled: isAuthenticated && !!actor && !actorLoading,
    refetchInterval: 5_000,
  });
}

// ── Loading skeleton ──────────────────────────────────────────────────────────

function OrderRowSkeleton() {
  return (
    <div className="flex items-center gap-4 p-4 border-b border-border last:border-0">
      <Skeleton className="w-10 h-10 rounded-xl shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-20" />
      </div>
      <div className="flex flex-col items-end gap-1">
        <Skeleton className="h-5 w-16 rounded-full" />
        <Skeleton className="h-4 w-12" />
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function Orders() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { data: orders = [], isLoading } = useMyOrders();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate({ to: "/" });
    }
  }, [isAuthenticated, authLoading, navigate]);

  const formatDate = (ns: bigint) => {
    const ms = Number(ns) / 1_000_000;
    return new Date(ms).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatAmount = (paise: bigint) =>
    `₹${(Number(paise) / 100).toFixed(2)}`;

  return (
    <Layout>
      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Page header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
            <ClipboardList className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-black text-foreground font-display">
              My Orders
            </h1>
            <p className="text-xs text-muted-foreground">
              Track all your past purchases
            </p>
          </div>
        </div>

        {/* Order list card */}
        <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
          {isLoading || authLoading ? (
            ["a", "b", "c", "d"].map((k) => <OrderRowSkeleton key={k} />)
          ) : orders.length === 0 ? (
            <EmptyState
              variant="orders"
              title="No orders yet"
              description="Place your first order to see it here"
              ctaLabel="Shop Now"
              onCta={() => navigate({ to: "/" })}
            />
          ) : (
            orders.map((order) => (
              <button
                key={String(order.id)}
                type="button"
                onClick={() =>
                  navigate({
                    to: "/orders/$id",
                    params: { id: String(order.id) },
                  })
                }
                className="w-full flex items-center gap-4 p-4 border-b border-border last:border-0 hover:bg-muted/40 active:bg-muted transition-colors text-left"
                data-ocid="order-row"
              >
                {/* Icon */}
                <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center shrink-0">
                  <Package className="w-5 h-5 text-muted-foreground" />
                </div>

                {/* Order info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-foreground truncate">
                    Order #{String(order.id).slice(-6).toUpperCase()}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {formatDate(order.createdAt)} · {order.items.length} item
                    {order.items.length !== 1 ? "s" : ""}
                  </p>
                </div>

                {/* Right side */}
                <div className="flex flex-col items-end gap-1.5 shrink-0">
                  <StatusBadge status={order.status} />
                  <span className="text-sm font-bold text-foreground">
                    {formatAmount(order.totalAmount)}
                  </span>
                </div>

                <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
              </button>
            ))
          )}
        </div>
      </div>
    </Layout>
  );
}
