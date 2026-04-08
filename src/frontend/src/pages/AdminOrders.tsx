import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { ChevronDown, ChevronRight, MapPin, Package } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { OrderStatus } from "../backend.d";
import type { OrderView } from "../backend.d";
import EmptyState from "../components/EmptyState";
import Layout from "../components/Layout";
import LoadingSpinner from "../components/LoadingSpinner";
import { useAuth } from "../hooks/useAuth";
import { useBackendActor } from "../hooks/useBackendActor";

// ── Hooks ──────────────────────────────────────────────────────────────────

function useAllOrders() {
  const { actor, isFetching } = useBackendActor();
  return useQuery({
    queryKey: ["admin", "orders"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllOrders();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 30_000,
  });
}

function useUpdateOrderStatus() {
  const { actor } = useBackendActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      orderId,
      status,
    }: {
      orderId: bigint;
      status: OrderStatus;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.updateOrderStatus(orderId, status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "orders"] });
      toast.success("Order status updated");
    },
    onError: () => toast.error("Failed to update order status"),
  });
}

// ── Helpers ────────────────────────────────────────────────────────────────

const STATUS_LABELS: Record<OrderStatus, string> = {
  [OrderStatus.Confirmed]: "Confirmed",
  [OrderStatus.InTransit]: "In Transit",
  [OrderStatus.Delivered]: "Delivered",
};

const STATUS_COLORS: Record<OrderStatus, string> = {
  [OrderStatus.Confirmed]:
    "bg-accent/20 text-accent-foreground border-accent/30",
  [OrderStatus.InTransit]: "bg-primary/15 text-primary border-primary/20",
  [OrderStatus.Delivered]: "bg-muted text-muted-foreground border-border",
};

const NEXT_STATUS: Partial<Record<OrderStatus, OrderStatus>> = {
  [OrderStatus.Confirmed]: OrderStatus.InTransit,
  [OrderStatus.InTransit]: OrderStatus.Delivered,
};

function formatDate(ns: bigint): string {
  return new Date(Number(ns) / 1_000_000).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatAmount(paise: bigint): string {
  return `₹${(Number(paise) / 100).toFixed(0)}`;
}

function truncatePrincipal(p: { toString(): string }): string {
  const str = p.toString();
  if (str.length <= 12) return str;
  return `${str.slice(0, 6)}…${str.slice(-4)}`;
}

// ── Sub-components ─────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: OrderStatus }) {
  return (
    <Badge
      variant="outline"
      className={`text-xs font-semibold ${STATUS_COLORS[status]}`}
    >
      {STATUS_LABELS[status]}
    </Badge>
  );
}

interface OrderCardProps {
  order: OrderView;
  expanded: boolean;
  onToggle: () => void;
  onAdvance: () => void;
  advancing: boolean;
}

function OrderCard({
  order,
  expanded,
  onToggle,
  onAdvance,
  advancing,
}: OrderCardProps) {
  const nextStatus = NEXT_STATUS[order.status];

  return (
    <div className="border-b border-border last:border-0" data-ocid="order-row">
      {/* Summary row — clickable */}
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted/30 transition-colors text-left"
        data-ocid="order-row-toggle"
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono text-xs text-muted-foreground">
              #{order.id.toString()}
            </span>
            <StatusBadge status={order.status} />
          </div>
          <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground flex-wrap">
            <span className="font-medium text-foreground truncate max-w-[120px]">
              {truncatePrincipal(order.userId)}
            </span>
            <span>{formatDate(order.createdAt)}</span>
            <span>
              {order.items.length} item{order.items.length !== 1 ? "s" : ""}
            </span>
            <span className="font-bold text-foreground">
              {formatAmount(order.totalAmount)}
            </span>
          </div>
        </div>
        {expanded ? (
          <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
        ) : (
          <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
        )}
      </button>

      {/* Expanded detail */}
      {expanded && (
        <div className="px-4 pb-4 bg-muted/20 border-t border-border/60">
          {/* Items */}
          <div className="pt-3 space-y-1.5">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
              Items
            </p>
            {order.items.map((item) => (
              <div
                key={item.productId.toString()}
                className="flex items-center justify-between text-sm"
              >
                <span className="text-foreground truncate flex-1 min-w-0 pr-2">
                  {item.name}
                  <span className="text-muted-foreground ml-1">
                    × {item.quantity.toString()}
                  </span>
                </span>
                <span className="font-semibold shrink-0">
                  {formatAmount(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          {/* Address */}
          <div className="mt-3 pt-3 border-t border-border/60">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">
              Delivery Address
            </p>
            <div className="flex items-start gap-2 text-sm text-foreground">
              <MapPin className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0" />
              <span>
                {order.deliveryAddress.line1}
                {order.deliveryAddress.line2
                  ? `, ${order.deliveryAddress.line2}`
                  : ""}
                , {order.deliveryAddress.city} — {order.deliveryAddress.pincode}
                {order.deliveryAddress.tag && (
                  <Badge variant="secondary" className="ml-2 text-xs">
                    {order.deliveryAddress.tag}
                  </Badge>
                )}
              </span>
            </div>
          </div>

          {/* Advance status button */}
          {nextStatus && (
            <div className="mt-4 flex justify-end">
              <Button
                size="sm"
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation();
                  onAdvance();
                }}
                disabled={advancing}
                className="rounded-full text-xs font-semibold gap-1.5"
                data-ocid="advance-status-btn"
              >
                {advancing
                  ? "Updating…"
                  : `Mark as ${STATUS_LABELS[nextStatus]}`}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────

type TabValue = "all" | OrderStatus;

export default function AdminOrders() {
  const { isAdmin, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { data: orders = [], isLoading: ordersLoading } = useAllOrders();
  const updateStatus = useUpdateOrderStatus();
  const [expanded, setExpanded] = useState<string | null>(null);
  const [tab, setTab] = useState<TabValue>("all");

  useEffect(() => {
    if (!authLoading && !isAdmin) navigate({ to: "/" });
  }, [isAdmin, authLoading, navigate]);

  if (authLoading || !isAdmin) return null;

  const filtered =
    tab === "all" ? orders : orders.filter((o) => o.status === tab);

  const counts: Record<TabValue, number> = {
    all: orders.length,
    [OrderStatus.Confirmed]: orders.filter(
      (o) => o.status === OrderStatus.Confirmed,
    ).length,
    [OrderStatus.InTransit]: orders.filter(
      (o) => o.status === OrderStatus.InTransit,
    ).length,
    [OrderStatus.Delivered]: orders.filter(
      (o) => o.status === OrderStatus.Delivered,
    ).length,
  };

  const tabs: { value: TabValue; label: string }[] = [
    { value: "all", label: "All" },
    { value: OrderStatus.Confirmed, label: "Confirmed" },
    { value: OrderStatus.InTransit, label: "In Transit" },
    { value: OrderStatus.Delivered, label: "Delivered" },
  ];

  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Page header */}
        <div className="mb-6">
          <h1 className="text-2xl font-black text-foreground tracking-tight">
            Orders
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {orders.length} total orders
          </p>
        </div>

        {/* Tab filter */}
        <Tabs
          value={tab}
          onValueChange={(v) => setTab(v as TabValue)}
          className="mb-4"
        >
          <TabsList
            className="grid w-full grid-cols-4 h-9"
            data-ocid="order-status-tabs"
          >
            {tabs.map(({ value, label }) => (
              <TabsTrigger
                key={value}
                value={value}
                className="text-xs font-semibold"
                data-ocid={`tab-${value}`}
              >
                {label}
                {counts[value] > 0 && (
                  <span className="ml-1 text-[10px] bg-muted rounded-full px-1.5 py-0.5 font-bold">
                    {counts[value]}
                  </span>
                )}
              </TabsTrigger>
            ))}
          </TabsList>

          {tabs.map(({ value: tabVal }) => (
            <TabsContent key={tabVal} value={tabVal} className="mt-4">
              <Card className="border-border overflow-hidden">
                <CardContent className="p-0">
                  {ordersLoading ? (
                    <div className="flex items-center justify-center py-12">
                      <LoadingSpinner size="md" text="Loading orders…" />
                    </div>
                  ) : filtered.length === 0 ? (
                    <EmptyState
                      variant="orders"
                      title="No orders found"
                      description={
                        tab === "all"
                          ? "No orders have been placed yet."
                          : `No ${STATUS_LABELS[tab as OrderStatus]} orders.`
                      }
                    />
                  ) : (
                    filtered.map((order) => {
                      const id = order.id.toString();
                      const nextStatus = NEXT_STATUS[order.status];
                      return (
                        <OrderCard
                          key={id}
                          order={order}
                          expanded={expanded === id}
                          onToggle={() =>
                            setExpanded((prev) => (prev === id ? null : id))
                          }
                          onAdvance={() => {
                            if (nextStatus) {
                              updateStatus.mutate({
                                orderId: order.id,
                                status: nextStatus,
                              });
                            }
                          }}
                          advancing={
                            updateStatus.isPending &&
                            updateStatus.variables?.orderId === order.id
                          }
                        />
                      );
                    })
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>

        {/* Status legend */}
        <div className="flex items-center gap-3 flex-wrap mt-4">
          {Object.values(OrderStatus).map((s) => (
            <div
              key={s}
              className="flex items-center gap-1.5 text-xs text-muted-foreground"
            >
              <Package className="w-3 h-3" />
              <StatusBadge status={s} />
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
