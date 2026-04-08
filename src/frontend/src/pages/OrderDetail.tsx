import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams, useSearch } from "@tanstack/react-router";
import {
  CheckCircle,
  ChevronLeft,
  Clock,
  MapPin,
  Package,
  RefreshCw,
  Truck,
} from "lucide-react";
import { useEffect } from "react";
import type { OrderView } from "../backend.d";
import { OrderStatus } from "../backend.d";
import Layout from "../components/Layout";
import { useAuth } from "../hooks/useAuth";
import { useBackendActor } from "../hooks/useBackendActor";
import { useCart } from "../hooks/useCart";

// ── Step indicator ────────────────────────────────────────────────────────────

const STEPS: { key: OrderStatus; label: string; icon: React.ElementType }[] = [
  { key: OrderStatus.Confirmed, label: "Confirmed", icon: CheckCircle },
  { key: OrderStatus.InTransit, label: "In Transit", icon: Truck },
  { key: OrderStatus.Delivered, label: "Delivered", icon: Package },
];

const STATUS_ORDER: Record<OrderStatus, number> = {
  [OrderStatus.Confirmed]: 0,
  [OrderStatus.InTransit]: 1,
  [OrderStatus.Delivered]: 2,
};

function StepIndicator({ status }: { status: OrderStatus }) {
  const currentIdx = STATUS_ORDER[status];
  return (
    <div className="flex items-center" aria-label="Order progress">
      {STEPS.map((step, i) => {
        const Icon = step.icon;
        const done = i <= currentIdx;
        const active = i === currentIdx;
        return (
          <div
            key={step.key}
            className="flex items-center flex-1 last:flex-none"
          >
            <div className="flex flex-col items-center gap-1">
              <div
                className={cn(
                  "w-9 h-9 rounded-full flex items-center justify-center border-2 transition-smooth",
                  done
                    ? "bg-primary border-primary text-primary-foreground"
                    : "bg-muted border-border text-muted-foreground",
                  active && "ring-4 ring-primary/20",
                )}
              >
                <Icon className="w-4 h-4" />
              </div>
              <span
                className={cn(
                  "text-[10px] font-semibold whitespace-nowrap",
                  done ? "text-primary" : "text-muted-foreground",
                )}
              >
                {step.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={cn(
                  "flex-1 h-0.5 mb-4 mx-1 rounded",
                  i < currentIdx ? "bg-primary" : "bg-border",
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatDate(ns: bigint) {
  const ms = Number(ns) / 1_000_000;
  return new Date(ms).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatTime(ns: bigint) {
  const ms = Number(ns) / 1_000_000;
  return new Date(ms).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatAmount(paise: bigint) {
  return `₹${(Number(paise) / 100).toFixed(2)}`;
}

// ── Hook ──────────────────────────────────────────────────────────────────────

function useOrderDetail(id: string) {
  const { actor, isFetching: actorLoading } = useBackendActor();
  const { isAuthenticated } = useAuth();

  return useQuery<OrderView | null>({
    queryKey: ["order", id],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getOrder(BigInt(id));
    },
    enabled: isAuthenticated && !!actor && !actorLoading,
    refetchInterval: 5_000,
  });
}

// ── Skeleton ──────────────────────────────────────────────────────────────────

function OrderSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-24 w-full rounded-2xl" />
      <Skeleton className="h-32 w-full rounded-2xl" />
      <Skeleton className="h-40 w-full rounded-2xl" />
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function OrderDetail() {
  const navigate = useNavigate();
  const { id } = useParams({ from: "/orders/$id" });
  const search = useSearch({ strict: false }) as { success?: string };
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { addToCart } = useCart();
  const { data: order, isLoading } = useOrderDetail(id);

  useEffect(() => {
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

  const isSuccess = search?.success === "1";

  if (isLoading || authLoading) {
    return (
      <Layout>
        <div className="max-w-2xl mx-auto px-4 py-6">
          <OrderSkeleton />
        </div>
      </Layout>
    );
  }

  if (!order) {
    return (
      <Layout>
        <div className="max-w-2xl mx-auto px-4 py-6 text-center">
          <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-lg font-bold text-foreground">Order not found</h2>
          <p className="text-muted-foreground text-sm mt-1 mb-4">
            This order may have been removed or doesn't exist.
          </p>
          <Button
            variant="outline"
            onClick={() => navigate({ to: "/orders" })}
            className="rounded-full"
          >
            View all orders
          </Button>
        </div>
      </Layout>
    );
  }

  const subtotal = order.totalAmount - order.deliveryFee;

  return (
    <Layout>
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
        {/* Back nav */}
        <button
          type="button"
          onClick={() => navigate({ to: "/orders" })}
          className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          data-ocid="back-to-orders"
        >
          <ChevronLeft className="w-4 h-4" />
          All Orders
        </button>

        {/* Success banner */}
        {isSuccess && (
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-primary/10 border border-primary/20">
            <CheckCircle className="w-5 h-5 text-primary shrink-0" />
            <div>
              <p className="text-sm font-bold text-primary">
                Order Placed Successfully!
              </p>
              <p className="text-xs text-primary/80 mt-0.5">
                Your groceries are being picked up. Expected delivery soon!
              </p>
            </div>
          </div>
        )}

        {/* Order header */}
        <div className="bg-card rounded-2xl border border-border p-5">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <h1 className="text-lg font-black text-foreground font-display">
                Order #{String(order.id).slice(-6).toUpperCase()}
              </h1>
              <p className="text-xs text-muted-foreground mt-0.5">
                Placed on {formatDate(order.createdAt)}
              </p>
            </div>
            <Badge
              variant="outline"
              className={cn(
                "text-xs font-semibold px-3 py-1 rounded-full shrink-0",
                order.status === OrderStatus.Confirmed &&
                  "bg-accent/20 text-accent-foreground border-accent/40",
                order.status === OrderStatus.InTransit &&
                  "bg-secondary/30 text-secondary-foreground border-secondary/50",
                order.status === OrderStatus.Delivered &&
                  "bg-primary/15 text-primary border-primary/30",
              )}
            >
              {order.status === OrderStatus.InTransit
                ? "In Transit"
                : order.status}
            </Badge>
          </div>

          {/* Step indicator */}
          <StepIndicator status={order.status} />

          {/* ETA */}
          {order.status !== OrderStatus.Delivered && (
            <div className="mt-4 flex items-center gap-2 p-3 rounded-xl bg-muted/50 border border-border">
              <Clock className="w-4 h-4 text-primary shrink-0" />
              <div>
                <span className="text-xs text-muted-foreground">
                  Estimated delivery:{" "}
                </span>
                <span className="text-sm font-bold text-foreground">
                  {formatTime(order.estimatedDelivery)}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Items */}
        <div className="bg-card rounded-2xl border border-border overflow-hidden">
          <div className="px-5 py-3 border-b border-border bg-muted/30">
            <h2 className="text-sm font-bold text-foreground">
              Items ({order.items.length})
            </h2>
          </div>
          {order.items.map((item) => (
            <div
              key={String(item.productId)}
              className="flex items-center gap-4 px-5 py-3.5 border-b border-border last:border-0"
            >
              <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center shrink-0">
                <Package className="w-5 h-5 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">
                  {item.name}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Qty: {Number(item.quantity)}
                </p>
              </div>
              <span className="text-sm font-bold text-foreground shrink-0">
                {formatAmount(item.price * item.quantity)}
              </span>
            </div>
          ))}
        </div>

        {/* Delivery address */}
        <div className="bg-card rounded-2xl border border-border p-5">
          <div className="flex items-center gap-2 mb-3">
            <MapPin className="w-4 h-4 text-primary" />
            <h2 className="text-sm font-bold text-foreground">
              Delivery Address
            </h2>
          </div>
          <div className="pl-6 space-y-0.5">
            <p className="text-xs font-semibold text-accent-foreground uppercase tracking-wide">
              {order.deliveryAddress.tag}
            </p>
            <p className="text-sm text-foreground">
              {order.deliveryAddress.line1}
            </p>
            {order.deliveryAddress.line2 && (
              <p className="text-sm text-foreground">
                {order.deliveryAddress.line2}
              </p>
            )}
            <p className="text-sm text-muted-foreground">
              {order.deliveryAddress.city} – {order.deliveryAddress.pincode}
            </p>
          </div>
        </div>

        {/* Pricing */}
        <div className="bg-card rounded-2xl border border-border p-5 space-y-2.5">
          <h2 className="text-sm font-bold text-foreground mb-1">
            Price Details
          </h2>
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Subtotal</span>
            <span>{formatAmount(subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Delivery fee</span>
            <span
              className={
                order.deliveryFee === 0n ? "text-primary font-medium" : ""
              }
            >
              {order.deliveryFee === 0n
                ? "FREE"
                : formatAmount(order.deliveryFee)}
            </span>
          </div>
          <Separator />
          <div className="flex justify-between font-bold text-foreground">
            <span>Total</span>
            <span className="text-primary">
              {formatAmount(order.totalAmount)}
            </span>
          </div>
        </div>

        {/* Reorder CTA */}
        <Button
          className="w-full rounded-full font-bold text-sm py-3 gap-2"
          onClick={handleReorder}
          data-ocid="reorder-btn"
        >
          <RefreshCw className="w-4 h-4" />
          Reorder All Items
        </Button>
      </div>
    </Layout>
  );
}
