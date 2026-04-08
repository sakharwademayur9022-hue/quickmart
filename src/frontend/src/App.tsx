import {
  RouterProvider,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { Suspense, lazy } from "react";
import LoadingSpinner from "./components/LoadingSpinner";
import { Route as RootRoute } from "./routes/__root";

// ── Lazy page imports ──────────────────────────────────────────────────────
const HomePage = lazy(() => import("./pages/Home"));
const ProductPage = lazy(() => import("./pages/Product"));
const CartPage = lazy(() => import("./pages/Cart"));
const CheckoutPage = lazy(() => import("./pages/Checkout"));
const OrdersPage = lazy(() => import("./pages/Orders"));
const OrderDetailPage = lazy(() => import("./pages/OrderDetail"));
const ProfilePage = lazy(() => import("./pages/Profile"));
const AdminPage = lazy(() => import("./pages/Admin"));
const AdminProductsPage = lazy(() => import("./pages/AdminProducts"));
const AdminOrdersPage = lazy(() => import("./pages/AdminOrders"));

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <LoadingSpinner size="lg" text="Loading…" />
    </div>
  );
}

function Wrap({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<PageLoader />}>{children}</Suspense>;
}

// ── Route definitions ──────────────────────────────────────────────────────

const indexRoute = createRoute({
  getParentRoute: () => RootRoute,
  path: "/",
  component: () => (
    <Wrap>
      <HomePage />
    </Wrap>
  ),
});

const productRoute = createRoute({
  getParentRoute: () => RootRoute,
  path: "/product/$id",
  component: () => (
    <Wrap>
      <ProductPage />
    </Wrap>
  ),
});

const cartRoute = createRoute({
  getParentRoute: () => RootRoute,
  path: "/cart",
  component: () => (
    <Wrap>
      <CartPage />
    </Wrap>
  ),
});

const checkoutRoute = createRoute({
  getParentRoute: () => RootRoute,
  path: "/checkout",
  component: () => (
    <Wrap>
      <CheckoutPage />
    </Wrap>
  ),
});

const ordersRoute = createRoute({
  getParentRoute: () => RootRoute,
  path: "/orders",
  component: () => (
    <Wrap>
      <OrdersPage />
    </Wrap>
  ),
});

const orderDetailRoute = createRoute({
  getParentRoute: () => RootRoute,
  path: "/orders/$id",
  component: () => (
    <Wrap>
      <OrderDetailPage />
    </Wrap>
  ),
});

const profileRoute = createRoute({
  getParentRoute: () => RootRoute,
  path: "/profile",
  component: () => (
    <Wrap>
      <ProfilePage />
    </Wrap>
  ),
});

const adminRoute = createRoute({
  getParentRoute: () => RootRoute,
  path: "/admin",
  component: () => (
    <Wrap>
      <AdminPage />
    </Wrap>
  ),
});

const adminProductsRoute = createRoute({
  getParentRoute: () => RootRoute,
  path: "/admin/products",
  component: () => (
    <Wrap>
      <AdminProductsPage />
    </Wrap>
  ),
});

const adminOrdersRoute = createRoute({
  getParentRoute: () => RootRoute,
  path: "/admin/orders",
  component: () => (
    <Wrap>
      <AdminOrdersPage />
    </Wrap>
  ),
});

// ── Router ─────────────────────────────────────────────────────────────────

const routeTree = RootRoute.addChildren([
  indexRoute,
  productRoute,
  cartRoute,
  checkoutRoute,
  ordersRoute,
  orderDetailRoute,
  profileRoute,
  adminRoute,
  adminProductsRoute,
  adminOrdersRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
