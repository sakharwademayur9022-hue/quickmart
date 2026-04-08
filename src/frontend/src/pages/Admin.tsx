import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowRight,
  Boxes,
  ClipboardList,
  PackageCheck,
  Sprout,
  TrendingUp,
} from "lucide-react";
import { useEffect } from "react";
import { toast } from "sonner";
import { OrderStatus } from "../backend.d";
import Layout from "../components/Layout";
import { useAuth } from "../hooks/useAuth";
import { useBackendActor } from "../hooks/useBackendActor";
import { useProducts } from "../hooks/useProducts";

function useAllOrders() {
  const { actor, isFetching } = useBackendActor();
  return useQuery({
    queryKey: ["admin", "orders"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllOrders();
    },
    enabled: !!actor && !isFetching,
  });
}

function useSeedProducts() {
  const { actor } = useBackendActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.seedProducts();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Products seeded successfully");
    },
    onError: () => toast.error("Failed to seed products"),
  });
}

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  accent?: boolean;
  loading?: boolean;
}

function StatCard({
  label,
  value,
  icon: Icon,
  accent,
  loading,
}: StatCardProps) {
  return (
    <Card className="border-border">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-1">
              {label}
            </p>
            {loading ? (
              <Skeleton className="h-8 w-16 mt-1" />
            ) : (
              <p
                className={`text-3xl font-black ${accent ? "text-primary" : "text-foreground"}`}
              >
                {value}
              </p>
            )}
          </div>
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
              accent
                ? "bg-primary/15 text-primary"
                : "bg-muted text-muted-foreground"
            }`}
          >
            <Icon className="w-5 h-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface NavCardProps {
  to: string;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

function AdminNavCard({
  to,
  label,
  description,
  icon: Icon,
  badge,
}: NavCardProps) {
  return (
    <Link to={to}>
      <Card className="border-border hover:border-primary/40 hover:shadow-md transition-smooth cursor-pointer group">
        <CardContent className="p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-smooth">
            <Icon className="w-6 h-6" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-bold text-foreground">{label}</span>
              {badge && (
                <Badge variant="secondary" className="text-xs">
                  {badge}
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground mt-0.5 truncate">
              {description}
            </p>
          </div>
          <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-smooth shrink-0" />
        </CardContent>
      </Card>
    </Link>
  );
}

export default function Admin() {
  const { isAdmin, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { data: products, isLoading: productsLoading } = useProducts();
  const { data: orders, isLoading: ordersLoading } = useAllOrders();
  const seedMutation = useSeedProducts();

  useEffect(() => {
    if (!authLoading && !isAdmin) {
      navigate({ to: "/" });
    }
  }, [isAdmin, authLoading, navigate]);

  if (authLoading) {
    return (
      <Layout>
        <div className="max-w-3xl mx-auto px-4 py-10 space-y-4">
          {Array.from({ length: 3 }, (_, i) => `sk-${i}`).map((k) => (
            <Skeleton key={k} className="h-20 w-full rounded-xl" />
          ))}
        </div>
      </Layout>
    );
  }

  if (!isAdmin) return null;

  const pendingCount =
    orders?.filter((o) => o.status !== OrderStatus.Delivered).length ?? 0;

  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Page header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-1">
            <Badge
              variant="outline"
              className="text-primary border-primary/30 font-semibold text-xs"
            >
              Admin
            </Badge>
          </div>
          <h1 className="text-2xl font-black text-foreground tracking-tight">
            Dashboard
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Manage your Zapkart store — products, inventory, and orders.
          </p>
        </div>

        {/* Stats row */}
        <section className="mb-8" aria-label="Overview stats">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <StatCard
              label="Total Products"
              value={products?.length ?? 0}
              icon={Boxes}
              accent
              loading={productsLoading}
            />
            <StatCard
              label="Total Orders"
              value={orders?.length ?? 0}
              icon={ClipboardList}
              loading={ordersLoading}
            />
            <StatCard
              label="Pending Orders"
              value={pendingCount}
              icon={TrendingUp}
              loading={ordersLoading}
            />
          </div>
        </section>

        {/* Navigation cards */}
        <section className="mb-8 space-y-3" aria-label="Admin sections">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">
            Manage
          </h2>
          <AdminNavCard
            to="/admin/products"
            label="Products"
            description="Add, edit, or remove products from the catalogue"
            icon={PackageCheck}
            badge={String(products?.length ?? 0)}
          />
          <AdminNavCard
            to="/admin/orders"
            label="Orders"
            description="View all customer orders and update delivery status"
            icon={ClipboardList}
            badge={pendingCount > 0 ? `${pendingCount} pending` : undefined}
          />
        </section>

        {/* Quick actions */}
        <section aria-label="Quick actions">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
            Quick Actions
          </h2>
          <Card className="border-border bg-muted/30">
            <CardContent className="p-5">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-accent/20 text-accent-foreground flex items-center justify-center shrink-0">
                  <Sprout className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-foreground">
                    Seed Sample Products
                  </p>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    Populate the catalogue with demo grocery items across all
                    categories.
                  </p>
                  <Button
                    size="sm"
                    className="mt-3 rounded-full font-semibold"
                    onClick={() => seedMutation.mutate()}
                    disabled={seedMutation.isPending}
                    data-ocid="seed-products-btn"
                  >
                    {seedMutation.isPending ? "Seeding…" : "Seed Products"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </Layout>
  );
}
