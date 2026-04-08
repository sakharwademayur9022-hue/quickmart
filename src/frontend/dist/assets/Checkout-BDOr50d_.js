import { b as useNavigate, r as reactExports, j as jsxRuntimeExports, c as cn, d as ue } from "./index-DJsfyEPD.js";
import { u as useAuth, d as useBackendActor, a as useCart, L as Layout, M as MapPin, B as Button } from "./Layout-2vXxPoTN.js";
import { I as Input } from "./input-BsmGlAt7.js";
import { L as Label } from "./label-DCxt_8Gf.js";
import { S as Skeleton } from "./skeleton-DaenLL9q.js";
import { c as useProducts } from "./useProducts-B7CZcMOm.js";
import { C as CircleCheck } from "./circle-check-Bnd3XXQN.js";
import { C as ChevronRight } from "./chevron-right-C8hkA3ky.js";
import { m as motion } from "./proxy-DpbzPQmG.js";
import { S as ShoppingBag } from "./shopping-bag-8qMxQwFm.js";
import "./index-Du6goGIy.js";
import "./backend.d-C2Aaw6C6.js";
const DELIVERY_FEE = 50;
const EMPTY_ADDRESS = {
  tag: "",
  line1: "",
  line2: "",
  city: "",
  pincode: ""
};
function AddressChip({
  address,
  selected,
  onClick
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "button",
    {
      type: "button",
      onClick,
      className: cn(
        "text-left px-3 py-2 rounded-xl border text-sm transition-all",
        selected ? "border-primary bg-primary/10 text-primary font-semibold" : "border-border bg-background hover:bg-muted/50 text-foreground"
      ),
      "data-ocid": "saved-address-chip",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold block", children: address.tag }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground text-xs", children: [
          address.line1,
          ", ",
          address.city
        ] })
      ]
    }
  );
}
function AddressForm({
  address,
  onChange
}) {
  const set = (field) => (e) => onChange({ ...address, [field]: e.target.value });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 gap-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "addr-tag", children: "Label" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            id: "addr-tag",
            placeholder: "Home / Work / Other",
            value: address.tag,
            onChange: set("tag"),
            "data-ocid": "addr-tag"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "addr-phone", children: "Phone" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            id: "addr-phone",
            placeholder: "+91 98765 43210",
            type: "tel",
            "data-ocid": "addr-phone"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "addr-line1", children: "Address Line 1" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Input,
        {
          id: "addr-line1",
          placeholder: "Flat / House no., Building, Street",
          value: address.line1,
          onChange: set("line1"),
          "data-ocid": "addr-line1"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "addr-line2", children: "Address Line 2 (optional)" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Input,
        {
          id: "addr-line2",
          placeholder: "Area, Landmark",
          value: address.line2,
          onChange: set("line2"),
          "data-ocid": "addr-line2"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "addr-city", children: "City" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            id: "addr-city",
            placeholder: "Mumbai",
            value: address.city,
            onChange: set("city"),
            "data-ocid": "addr-city"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "addr-pincode", children: "Pincode" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            id: "addr-pincode",
            placeholder: "400001",
            maxLength: 6,
            value: address.pincode,
            onChange: set("pincode"),
            "data-ocid": "addr-pincode"
          }
        )
      ] })
    ] })
  ] });
}
function ReviewRow({ label, value }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-sm", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-foreground", children: value })
  ] });
}
function Checkout() {
  const navigate = useNavigate();
  const { isAuthenticated, login, profile } = useAuth();
  const { actor } = useBackendActor();
  const { cartItems, isLoading: cartLoading, clearCart } = useCart();
  const { data: products = [] } = useProducts();
  const [step, setStep] = reactExports.useState("address");
  const [selectedAddress, setSelectedAddress] = reactExports.useState(null);
  const [newAddress, setNewAddress] = reactExports.useState({ ...EMPTY_ADDRESS });
  const [isPlacingOrder, setIsPlacingOrder] = reactExports.useState(false);
  if (!isAuthenticated) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-lg mx-auto px-4 py-24 flex flex-col items-center text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "w-10 h-10 text-primary" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-bold text-2xl text-foreground mb-2", children: "Sign in to checkout" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm mb-8", children: "Please log in to place your order." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          className: "rounded-full px-8 font-semibold",
          onClick: login,
          "data-ocid": "checkout-login-btn",
          children: "Login with Internet Identity"
        }
      )
    ] }) });
  }
  const typedItems = cartItems;
  const productMap = new Map(
    products.map((p) => [p.id.toString(), p])
  );
  const subtotal = typedItems.reduce((sum, item) => {
    const p = productMap.get(item.productId.toString());
    return sum + (p ? Number(p.price) * Number(item.quantity) : 0);
  }, 0);
  const deliveryFee = subtotal >= 299 ? 0 : DELIVERY_FEE;
  const total = subtotal + deliveryFee;
  const savedAddresses = (profile == null ? void 0 : profile.savedAddresses) ?? [];
  const effectiveAddress = selectedAddress ?? (newAddress.line1 && newAddress.city && newAddress.pincode ? newAddress : null);
  const isAddressValid = effectiveAddress !== null && effectiveAddress.tag.trim() !== "" && effectiveAddress.line1.trim() !== "" && effectiveAddress.city.trim() !== "" && effectiveAddress.pincode.trim().length === 6;
  const handlePlaceOrder = async () => {
    if (!actor || !effectiveAddress) return;
    setIsPlacingOrder(true);
    try {
      const order = await actor.placeOrder(effectiveAddress);
      clearCart();
      const orderId = (order == null ? void 0 : order.id) ?? 0n;
      navigate({ to: `/orders/${orderId}`, search: { success: "1" } });
      ue.success("Order placed! Estimated delivery in 30 minutes 🚀", {
        duration: 5e3
      });
    } catch {
      ue.error("Failed to place order. Please try again.");
    } finally {
      setIsPlacingOrder(false);
    }
  };
  const stepIndicator = /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2 mb-6", children: ["address", "review"].map((s, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: cn(
          "w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors",
          step === s || idx === 0 && step === "review" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
        ),
        children: idx === 0 && step === "review" ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-4 h-4" }) : idx + 1
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "span",
      {
        className: cn(
          "text-sm font-medium",
          step === s ? "text-foreground" : "text-muted-foreground"
        ),
        children: s === "address" ? "Delivery Address" : "Review & Pay"
      }
    ),
    idx === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "w-4 h-4 text-muted-foreground" })
  ] }, s)) });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-2xl mx-auto px-4 py-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display font-black text-2xl text-foreground mb-4", children: "Checkout" }),
    stepIndicator,
    step === "address" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0, x: 20 },
        animate: { opacity: 1, x: 0 },
        className: "space-y-5",
        children: [
          savedAddresses.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-2xl border border-border p-5 space-y-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-semibold text-sm text-foreground", children: "Saved Addresses" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2", children: savedAddresses.map((addr) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              AddressChip,
              {
                address: addr,
                selected: selectedAddress === addr,
                onClick: () => {
                  setSelectedAddress(addr);
                  setNewAddress({ ...EMPTY_ADDRESS });
                }
              },
              `${addr.tag}-${addr.pincode}`
            )) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-2xl border border-border p-5 space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-semibold text-sm text-foreground", children: savedAddresses.length > 0 ? "Or enter a new address" : "Delivery Address" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              AddressForm,
              {
                address: newAddress,
                onChange: (a) => {
                  setNewAddress(a);
                  setSelectedAddress(null);
                }
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              className: "w-full rounded-full font-bold text-[15px] h-12",
              disabled: !isAddressValid,
              onClick: () => setStep("review"),
              "data-ocid": "address-continue-btn",
              children: "Continue to Review →"
            }
          )
        ]
      }
    ),
    step === "review" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0, x: 20 },
        animate: { opacity: 1, x: 0 },
        className: "space-y-4",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-2xl border border-border p-5 space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "font-semibold text-sm text-foreground flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "w-4 h-4 text-primary" }),
                "Delivering to"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => setStep("address"),
                  className: "text-xs text-primary font-semibold hover:underline",
                  "data-ocid": "change-address-btn",
                  children: "Change"
                }
              )
            ] }),
            effectiveAddress && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm text-muted-foreground pl-6", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-foreground", children: effectiveAddress.tag }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
                effectiveAddress.line1,
                effectiveAddress.line2 ? `, ${effectiveAddress.line2}` : ""
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
                effectiveAddress.city,
                " – ",
                effectiveAddress.pincode
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-2xl border border-border p-5 space-y-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-semibold text-sm text-foreground", children: "Your Items" }),
            cartLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: [1, 2].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "w-10 h-10 rounded-lg" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 space-y-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-2/3" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-1/4" })
              ] })
            ] }, i)) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: typedItems.map((item) => {
              const p = productMap.get(item.productId.toString());
              const lineTotal = p ? Number(p.price) * Number(item.quantity) : 0;
              return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "flex items-center gap-3",
                  "data-ocid": "review-cart-item",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-lg bg-muted/60 border border-border flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingBag, { className: "w-5 h-5 text-muted-foreground/40" }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground truncate", children: (p == null ? void 0 : p.name) ?? `Product #${item.productId}` }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
                        "×",
                        Number(item.quantity)
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-bold text-foreground shrink-0", children: [
                      "₹",
                      lineTotal
                    ] })
                  ]
                },
                item.productId.toString()
              );
            }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "bg-card rounded-2xl border border-border p-5 space-y-3",
              "data-ocid": "checkout-summary",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-semibold text-sm text-foreground", children: "Price Breakdown" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ReviewRow, { label: "Subtotal", value: `₹${subtotal}` }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    ReviewRow,
                    {
                      label: "Delivery fee",
                      value: deliveryFee === 0 ? "FREE" : `₹${DELIVERY_FEE}`
                    }
                  ),
                  deliveryFee === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-primary font-medium", children: "🎉 Free delivery applied!" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t border-border pt-3 flex justify-between font-bold text-base", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Total Payable" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-accent", children: [
                    "₹",
                    total
                  ] })
                ] })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              className: "w-full rounded-full font-bold text-[15px] h-12",
              onClick: handlePlaceOrder,
              disabled: isPlacingOrder || typedItems.length === 0,
              "data-ocid": "place-order-btn",
              children: isPlacingOrder ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-4 h-4 border-2 border-primary-foreground/50 border-t-primary-foreground rounded-full animate-spin" }),
                "Placing Order…"
              ] }) : "Place Order 🚀"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-center text-muted-foreground pb-4", children: "Estimated delivery in 30 minutes · Cash on delivery available" })
        ]
      }
    )
  ] }) });
}
export {
  Checkout as default
};
