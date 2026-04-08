import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link, useNavigate } from "@tanstack/react-router";
import { Minus, Plus, ShoppingBag, ShoppingCart, Trash2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Layout from "../components/Layout";
import { useAuth } from "../hooks/useAuth";
import { useCart } from "../hooks/useCart";
import { useProducts } from "../hooks/useProducts";
import type { CartItem, Product } from "../types";

const DELIVERY_FEE = 50;

function CartItemRow({
  item,
  product,
  onAdd,
  onSubtract,
  onDelete,
}: {
  item: CartItem;
  product?: Product;
  onAdd: () => void;
  onSubtract: () => void;
  onDelete: () => void;
}) {
  const qty = Number(item.quantity);
  const price = product ? Number(product.price) : 0;
  const lineTotal = price * qty;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -40, transition: { duration: 0.2 } }}
      className="flex gap-3 items-start py-4 border-b border-border last:border-0"
      data-ocid="cart-item-row"
    >
      {/* Product image */}
      <div className="w-16 h-16 rounded-xl bg-muted/60 border border-border flex items-center justify-center shrink-0">
        <ShoppingBag className="w-7 h-7 text-muted-foreground/40" />
      </div>

      <div className="flex-1 min-w-0">
        <p className="font-semibold text-foreground text-sm leading-snug line-clamp-2">
          {product?.name ?? `Product #${item.productId}`}
        </p>
        <p className="text-xs text-muted-foreground mt-0.5 capitalize">
          {product?.category ?? "—"}
        </p>
        <p className="text-accent font-bold text-sm mt-1">₹{price} each</p>
      </div>

      <div className="flex flex-col items-end gap-2 shrink-0">
        {/* Quantity controls */}
        <div
          className="flex items-center gap-0 border border-border rounded-full overflow-hidden"
          aria-label="Quantity controls"
        >
          <button
            type="button"
            onClick={onSubtract}
            className="w-7 h-7 flex items-center justify-center hover:bg-muted transition-colors text-foreground"
            aria-label="Decrease quantity"
            data-ocid="cart-qty-minus"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <span className="w-7 text-center text-sm font-bold leading-none">
            {qty}
          </span>
          <button
            type="button"
            onClick={onAdd}
            className="w-7 h-7 flex items-center justify-center hover:bg-primary/10 transition-colors text-primary"
            aria-label="Increase quantity"
            data-ocid="cart-qty-plus"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        <p className="text-sm font-bold text-foreground">₹{lineTotal}</p>

        <button
          type="button"
          onClick={onDelete}
          className="text-muted-foreground hover:text-destructive transition-colors p-1 rounded"
          aria-label="Remove item from cart"
          data-ocid="cart-item-delete"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}

function EmptyCart() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-20 px-6 text-center"
      data-ocid="empty-cart"
    >
      <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-6">
        <ShoppingCart className="w-12 h-12 text-primary/60" />
      </div>
      <h2 className="font-display font-bold text-2xl text-foreground mb-2">
        Your cart is empty
      </h2>
      <p className="text-muted-foreground text-sm mb-8 max-w-xs">
        Explore fresh groceries, snacks, and essentials delivered to your door
        in just 30 minutes.
      </p>
      <Link to="/">
        <Button
          className="rounded-full px-8 font-semibold"
          data-ocid="start-shopping-btn"
        >
          Start Shopping
        </Button>
      </Link>
    </motion.div>
  );
}

function CartSkeleton() {
  return (
    <div className="space-y-0">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex gap-3 py-4 border-b border-border">
          <Skeleton className="w-16 h-16 rounded-xl shrink-0" />
          <div className="flex-1 space-y-2 pt-1">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/3" />
            <Skeleton className="h-4 w-1/5" />
          </div>
          <div className="flex flex-col items-end gap-2 pt-1">
            <Skeleton className="h-7 w-20 rounded-full" />
            <Skeleton className="h-4 w-10" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Cart() {
  const navigate = useNavigate();
  const { isAuthenticated, login } = useAuth();
  const { cartItems, isLoading, addToCart, removeFromCart, getItemQuantity } =
    useCart();
  const { data: products = [] } = useProducts();

  if (!isAuthenticated) {
    return (
      <Layout>
        <div className="max-w-lg mx-auto px-4 py-24 flex flex-col items-center text-center">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
            <ShoppingCart className="w-10 h-10 text-primary" />
          </div>
          <h2 className="font-display font-bold text-2xl text-foreground mb-2">
            Sign in to view your cart
          </h2>
          <p className="text-muted-foreground text-sm mb-8 max-w-xs">
            Your cart is saved to your account. Log in to see your items and
            checkout.
          </p>
          <Button
            className="rounded-full px-8 font-semibold"
            onClick={login}
            data-ocid="cart-login-btn"
          >
            Login with Internet Identity
          </Button>
        </div>
      </Layout>
    );
  }

  const typedItems = cartItems as CartItem[];
  const productMap = new Map<string, Product>(
    (products as Product[]).map((p) => [p.id.toString(), p]),
  );

  const subtotal = typedItems.reduce((sum, item) => {
    const p = productMap.get(item.productId.toString());
    return sum + (p ? Number(p.price) * Number(item.quantity) : 0);
  }, 0);
  const total = subtotal > 0 ? subtotal + DELIVERY_FEE : 0;
  const totalQty = typedItems.reduce((s, i) => s + Number(i.quantity), 0);

  return (
    <Layout>
      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-display font-black text-2xl text-foreground">
            My Cart
          </h1>
          {typedItems.length > 0 && (
            <span className="text-sm text-muted-foreground bg-muted/50 px-3 py-1 rounded-full">
              {totalQty} {totalQty === 1 ? "item" : "items"}
            </span>
          )}
        </div>

        {isLoading ? (
          <div className="bg-card rounded-2xl border border-border px-4">
            <CartSkeleton />
          </div>
        ) : typedItems.length === 0 ? (
          <EmptyCart />
        ) : (
          <div className="grid gap-4 lg:grid-cols-5 items-start">
            {/* Items list */}
            <div className="lg:col-span-3 bg-card rounded-2xl border border-border px-4">
              <AnimatePresence initial={false}>
                {typedItems.map((item) => {
                  const product = productMap.get(item.productId.toString());
                  const currentQty = getItemQuantity(item.productId);
                  return (
                    <CartItemRow
                      key={item.productId.toString()}
                      item={item}
                      product={product}
                      onAdd={() =>
                        product
                          ? addToCart(
                              item.productId,
                              product.name,
                              BigInt(currentQty + 1),
                            )
                          : undefined
                      }
                      onSubtract={() => {
                        if (currentQty <= 1) {
                          removeFromCart(item.productId);
                        } else if (product) {
                          addToCart(
                            item.productId,
                            product.name,
                            BigInt(currentQty - 1),
                          );
                        }
                      }}
                      onDelete={() => removeFromCart(item.productId)}
                    />
                  );
                })}
              </AnimatePresence>
            </div>

            {/* Order summary */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="lg:col-span-2 bg-card rounded-2xl border border-border p-5 space-y-4"
              data-ocid="cart-summary"
            >
              <h2 className="font-display font-bold text-base text-foreground">
                Order Summary
              </h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-semibold text-foreground">
                    ₹{subtotal}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Delivery fee</span>
                  <span className="font-semibold text-foreground">
                    ₹{DELIVERY_FEE}
                  </span>
                </div>
                {subtotal >= 299 && (
                  <div className="flex justify-between text-primary text-xs font-medium">
                    <span>Free delivery discount</span>
                    <span>-₹{DELIVERY_FEE}</span>
                  </div>
                )}
                <div className="border-t border-border pt-3 flex justify-between font-bold text-base">
                  <span>Total</span>
                  <span className="text-accent">
                    ₹{subtotal >= 299 ? subtotal : total}
                  </span>
                </div>
              </div>

              <Button
                className="w-full rounded-full font-bold text-[15px] h-12"
                onClick={() => navigate({ to: "/checkout" })}
                data-ocid="proceed-checkout-btn"
              >
                Proceed to Checkout →
              </Button>

              <p className="text-xs text-center text-muted-foreground">
                🎉 Free delivery on orders above ₹299
              </p>
            </motion.div>
          </div>
        )}
      </div>
    </Layout>
  );
}
