import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useNavigate } from "@tanstack/react-router";
import { CheckCircle2, ChevronRight, MapPin, ShoppingBag } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import Layout from "../components/Layout";
import { useAuth } from "../hooks/useAuth";
import { useBackendActor } from "../hooks/useBackendActor";
import { useCart } from "../hooks/useCart";
import { useProducts } from "../hooks/useProducts";
import type { Address, CartItem, Product } from "../types";

const DELIVERY_FEE = 50;

type Step = "address" | "review";

const EMPTY_ADDRESS: Address = {
  tag: "",
  line1: "",
  line2: "",
  city: "",
  pincode: "",
};

function AddressChip({
  address,
  selected,
  onClick,
}: {
  address: Address;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "text-left px-3 py-2 rounded-xl border text-sm transition-all",
        selected
          ? "border-primary bg-primary/10 text-primary font-semibold"
          : "border-border bg-background hover:bg-muted/50 text-foreground",
      )}
      data-ocid="saved-address-chip"
    >
      <span className="font-semibold block">{address.tag}</span>
      <span className="text-muted-foreground text-xs">
        {address.line1}, {address.city}
      </span>
    </button>
  );
}

function AddressForm({
  address,
  onChange,
}: {
  address: Address;
  onChange: (a: Address) => void;
}) {
  const set =
    (field: keyof Address) => (e: React.ChangeEvent<HTMLInputElement>) =>
      onChange({ ...address, [field]: e.target.value });

  return (
    <div className="grid grid-cols-1 gap-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="addr-tag">Label</Label>
          <Input
            id="addr-tag"
            placeholder="Home / Work / Other"
            value={address.tag}
            onChange={set("tag")}
            data-ocid="addr-tag"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="addr-phone">Phone</Label>
          <Input
            id="addr-phone"
            placeholder="+91 98765 43210"
            type="tel"
            data-ocid="addr-phone"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="addr-line1">Address Line 1</Label>
        <Input
          id="addr-line1"
          placeholder="Flat / House no., Building, Street"
          value={address.line1}
          onChange={set("line1")}
          data-ocid="addr-line1"
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="addr-line2">Address Line 2 (optional)</Label>
        <Input
          id="addr-line2"
          placeholder="Area, Landmark"
          value={address.line2}
          onChange={set("line2")}
          data-ocid="addr-line2"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="addr-city">City</Label>
          <Input
            id="addr-city"
            placeholder="Mumbai"
            value={address.city}
            onChange={set("city")}
            data-ocid="addr-city"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="addr-pincode">Pincode</Label>
          <Input
            id="addr-pincode"
            placeholder="400001"
            maxLength={6}
            value={address.pincode}
            onChange={set("pincode")}
            data-ocid="addr-pincode"
          />
        </div>
      </div>
    </div>
  );
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-semibold text-foreground">{value}</span>
    </div>
  );
}

export default function Checkout() {
  const navigate = useNavigate();
  const { isAuthenticated, login, profile } = useAuth();
  const { actor } = useBackendActor();
  const { cartItems, isLoading: cartLoading, clearCart } = useCart();
  const { data: products = [] } = useProducts();

  const [step, setStep] = useState<Step>("address");
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [newAddress, setNewAddress] = useState<Address>({ ...EMPTY_ADDRESS });
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  if (!isAuthenticated) {
    return (
      <Layout>
        <div className="max-w-lg mx-auto px-4 py-24 flex flex-col items-center text-center">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
            <MapPin className="w-10 h-10 text-primary" />
          </div>
          <h2 className="font-display font-bold text-2xl text-foreground mb-2">
            Sign in to checkout
          </h2>
          <p className="text-muted-foreground text-sm mb-8">
            Please log in to place your order.
          </p>
          <Button
            className="rounded-full px-8 font-semibold"
            onClick={login}
            data-ocid="checkout-login-btn"
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
  const deliveryFee = subtotal >= 299 ? 0 : DELIVERY_FEE;
  const total = subtotal + deliveryFee;

  const savedAddresses: Address[] = profile?.savedAddresses ?? [];

  const effectiveAddress =
    selectedAddress ??
    (newAddress.line1 && newAddress.city && newAddress.pincode
      ? newAddress
      : null);

  const isAddressValid =
    effectiveAddress !== null &&
    effectiveAddress.tag.trim() !== "" &&
    effectiveAddress.line1.trim() !== "" &&
    effectiveAddress.city.trim() !== "" &&
    effectiveAddress.pincode.trim().length === 6;

  const handlePlaceOrder = async () => {
    if (!actor || !effectiveAddress) return;
    setIsPlacingOrder(true);
    try {
      // @ts-expect-error — actor methods populated after bindgen
      const order = await actor.placeOrder(effectiveAddress);
      clearCart();
      const orderId = (order as { id: bigint })?.id ?? 0n;
      navigate({ to: `/orders/${orderId}`, search: { success: "1" } });
      toast.success("Order placed! Estimated delivery in 30 minutes 🚀", {
        duration: 5000,
      });
    } catch {
      toast.error("Failed to place order. Please try again.");
    } finally {
      setIsPlacingOrder(false);
    }
  };

  const stepIndicator = (
    <div className="flex items-center gap-2 mb-6">
      {(["address", "review"] as Step[]).map((s, idx) => (
        <div key={s} className="flex items-center gap-2">
          <div
            className={cn(
              "w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors",
              step === s || (idx === 0 && step === "review")
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground",
            )}
          >
            {idx === 0 && step === "review" ? (
              <CheckCircle2 className="w-4 h-4" />
            ) : (
              idx + 1
            )}
          </div>
          <span
            className={cn(
              "text-sm font-medium",
              step === s ? "text-foreground" : "text-muted-foreground",
            )}
          >
            {s === "address" ? "Delivery Address" : "Review & Pay"}
          </span>
          {idx === 0 && (
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          )}
        </div>
      ))}
    </div>
  );

  return (
    <Layout>
      <div className="max-w-2xl mx-auto px-4 py-6">
        <h1 className="font-display font-black text-2xl text-foreground mb-4">
          Checkout
        </h1>

        {stepIndicator}

        {/* ── STEP 1: Address ── */}
        {step === "address" && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-5"
          >
            {savedAddresses.length > 0 && (
              <div className="bg-card rounded-2xl border border-border p-5 space-y-3">
                <h2 className="font-semibold text-sm text-foreground">
                  Saved Addresses
                </h2>
                <div className="flex flex-wrap gap-2">
                  {savedAddresses.map((addr) => (
                    <AddressChip
                      key={`${addr.tag}-${addr.pincode}`}
                      address={addr}
                      selected={selectedAddress === addr}
                      onClick={() => {
                        setSelectedAddress(addr);
                        setNewAddress({ ...EMPTY_ADDRESS });
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            <div className="bg-card rounded-2xl border border-border p-5 space-y-4">
              <h2 className="font-semibold text-sm text-foreground">
                {savedAddresses.length > 0
                  ? "Or enter a new address"
                  : "Delivery Address"}
              </h2>
              <AddressForm
                address={newAddress}
                onChange={(a) => {
                  setNewAddress(a);
                  setSelectedAddress(null);
                }}
              />
            </div>

            <Button
              className="w-full rounded-full font-bold text-[15px] h-12"
              disabled={!isAddressValid}
              onClick={() => setStep("review")}
              data-ocid="address-continue-btn"
            >
              Continue to Review →
            </Button>
          </motion.div>
        )}

        {/* ── STEP 2: Review ── */}
        {step === "review" && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            {/* Delivery address preview */}
            <div className="bg-card rounded-2xl border border-border p-5 space-y-2">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-sm text-foreground flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary" />
                  Delivering to
                </h2>
                <button
                  type="button"
                  onClick={() => setStep("address")}
                  className="text-xs text-primary font-semibold hover:underline"
                  data-ocid="change-address-btn"
                >
                  Change
                </button>
              </div>
              {effectiveAddress && (
                <div className="text-sm text-muted-foreground pl-6">
                  <p className="font-semibold text-foreground">
                    {effectiveAddress.tag}
                  </p>
                  <p>
                    {effectiveAddress.line1}
                    {effectiveAddress.line2
                      ? `, ${effectiveAddress.line2}`
                      : ""}
                  </p>
                  <p>
                    {effectiveAddress.city} – {effectiveAddress.pincode}
                  </p>
                </div>
              )}
            </div>

            {/* Cart items summary */}
            <div className="bg-card rounded-2xl border border-border p-5 space-y-3">
              <h2 className="font-semibold text-sm text-foreground">
                Your Items
              </h2>
              {cartLoading ? (
                <div className="space-y-2">
                  {[1, 2].map((i) => (
                    <div key={i} className="flex gap-3">
                      <Skeleton className="w-10 h-10 rounded-lg" />
                      <div className="flex-1 space-y-1">
                        <Skeleton className="h-3 w-2/3" />
                        <Skeleton className="h-3 w-1/4" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {typedItems.map((item) => {
                    const p = productMap.get(item.productId.toString());
                    const lineTotal = p
                      ? Number(p.price) * Number(item.quantity)
                      : 0;
                    return (
                      <div
                        key={item.productId.toString()}
                        className="flex items-center gap-3"
                        data-ocid="review-cart-item"
                      >
                        <div className="w-10 h-10 rounded-lg bg-muted/60 border border-border flex items-center justify-center shrink-0">
                          <ShoppingBag className="w-5 h-5 text-muted-foreground/40" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">
                            {p?.name ?? `Product #${item.productId}`}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            ×{Number(item.quantity)}
                          </p>
                        </div>
                        <p className="text-sm font-bold text-foreground shrink-0">
                          ₹{lineTotal}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Pricing breakdown */}
            <div
              className="bg-card rounded-2xl border border-border p-5 space-y-3"
              data-ocid="checkout-summary"
            >
              <h2 className="font-semibold text-sm text-foreground">
                Price Breakdown
              </h2>
              <div className="space-y-2">
                <ReviewRow label="Subtotal" value={`₹${subtotal}`} />
                <ReviewRow
                  label="Delivery fee"
                  value={deliveryFee === 0 ? "FREE" : `₹${DELIVERY_FEE}`}
                />
                {deliveryFee === 0 && (
                  <p className="text-xs text-primary font-medium">
                    🎉 Free delivery applied!
                  </p>
                )}
              </div>
              <div className="border-t border-border pt-3 flex justify-between font-bold text-base">
                <span>Total Payable</span>
                <span className="text-accent">₹{total}</span>
              </div>
            </div>

            {/* Place order CTA */}
            <Button
              className="w-full rounded-full font-bold text-[15px] h-12"
              onClick={handlePlaceOrder}
              disabled={isPlacingOrder || typedItems.length === 0}
              data-ocid="place-order-btn"
            >
              {isPlacingOrder ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-primary-foreground/50 border-t-primary-foreground rounded-full animate-spin" />
                  Placing Order…
                </span>
              ) : (
                "Place Order 🚀"
              )}
            </Button>

            <p className="text-xs text-center text-muted-foreground pb-4">
              Estimated delivery in 30 minutes · Cash on delivery available
            </p>
          </motion.div>
        )}
      </div>
    </Layout>
  );
}
