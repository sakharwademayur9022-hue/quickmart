import { r as reactExports, j as jsxRuntimeExports, b as useNavigate, L as Link } from "./index-DJsfyEPD.js";
import { u as useAuth, a as useCart, L as Layout, S as ShoppingCart, B as Button } from "./Layout-2vXxPoTN.js";
import { S as Skeleton } from "./skeleton-DaenLL9q.js";
import { c as useProducts } from "./useProducts-B7CZcMOm.js";
import { M as MotionConfigContext, i as isHTMLElement, u as useConstant, P as PresenceContext, a as usePresence, b as useIsomorphicLayoutEffect, L as LayoutGroupContext, m as motion } from "./proxy-DpbzPQmG.js";
import { S as ShoppingBag } from "./shopping-bag-8qMxQwFm.js";
import { M as Minus } from "./minus-CFBydUQb.js";
import { P as Plus } from "./plus-Da899kh8.js";
import { T as Trash2 } from "./trash-2-Cwggx07q.js";
import "./backend.d-C2Aaw6C6.js";
function setRef(ref, value) {
  if (typeof ref === "function") {
    return ref(value);
  } else if (ref !== null && ref !== void 0) {
    ref.current = value;
  }
}
function composeRefs(...refs) {
  return (node) => {
    let hasCleanup = false;
    const cleanups = refs.map((ref) => {
      const cleanup = setRef(ref, node);
      if (!hasCleanup && typeof cleanup === "function") {
        hasCleanup = true;
      }
      return cleanup;
    });
    if (hasCleanup) {
      return () => {
        for (let i = 0; i < cleanups.length; i++) {
          const cleanup = cleanups[i];
          if (typeof cleanup === "function") {
            cleanup();
          } else {
            setRef(refs[i], null);
          }
        }
      };
    }
  };
}
function useComposedRefs(...refs) {
  return reactExports.useCallback(composeRefs(...refs), refs);
}
class PopChildMeasure extends reactExports.Component {
  getSnapshotBeforeUpdate(prevProps) {
    const element = this.props.childRef.current;
    if (isHTMLElement(element) && prevProps.isPresent && !this.props.isPresent && this.props.pop !== false) {
      const parent = element.offsetParent;
      const parentWidth = isHTMLElement(parent) ? parent.offsetWidth || 0 : 0;
      const parentHeight = isHTMLElement(parent) ? parent.offsetHeight || 0 : 0;
      const computedStyle = getComputedStyle(element);
      const size = this.props.sizeRef.current;
      size.height = parseFloat(computedStyle.height);
      size.width = parseFloat(computedStyle.width);
      size.top = element.offsetTop;
      size.left = element.offsetLeft;
      size.right = parentWidth - size.width - size.left;
      size.bottom = parentHeight - size.height - size.top;
    }
    return null;
  }
  /**
   * Required with getSnapshotBeforeUpdate to stop React complaining.
   */
  componentDidUpdate() {
  }
  render() {
    return this.props.children;
  }
}
function PopChild({ children, isPresent, anchorX, anchorY, root, pop }) {
  var _a;
  const id = reactExports.useId();
  const ref = reactExports.useRef(null);
  const size = reactExports.useRef({
    width: 0,
    height: 0,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  });
  const { nonce } = reactExports.useContext(MotionConfigContext);
  const childRef = ((_a = children.props) == null ? void 0 : _a.ref) ?? (children == null ? void 0 : children.ref);
  const composedRef = useComposedRefs(ref, childRef);
  reactExports.useInsertionEffect(() => {
    const { width, height, top, left, right, bottom } = size.current;
    if (isPresent || pop === false || !ref.current || !width || !height)
      return;
    const x = anchorX === "left" ? `left: ${left}` : `right: ${right}`;
    const y = anchorY === "bottom" ? `bottom: ${bottom}` : `top: ${top}`;
    ref.current.dataset.motionPopId = id;
    const style = document.createElement("style");
    if (nonce)
      style.nonce = nonce;
    const parent = root ?? document.head;
    parent.appendChild(style);
    if (style.sheet) {
      style.sheet.insertRule(`
          [data-motion-pop-id="${id}"] {
            position: absolute !important;
            width: ${width}px !important;
            height: ${height}px !important;
            ${x}px !important;
            ${y}px !important;
          }
        `);
    }
    return () => {
      var _a2;
      (_a2 = ref.current) == null ? void 0 : _a2.removeAttribute("data-motion-pop-id");
      if (parent.contains(style)) {
        parent.removeChild(style);
      }
    };
  }, [isPresent]);
  return jsxRuntimeExports.jsx(PopChildMeasure, { isPresent, childRef: ref, sizeRef: size, pop, children: pop === false ? children : reactExports.cloneElement(children, { ref: composedRef }) });
}
const PresenceChild = ({ children, initial, isPresent, onExitComplete, custom, presenceAffectsLayout, mode, anchorX, anchorY, root }) => {
  const presenceChildren = useConstant(newChildrenMap);
  const id = reactExports.useId();
  let isReusedContext = true;
  let context = reactExports.useMemo(() => {
    isReusedContext = false;
    return {
      id,
      initial,
      isPresent,
      custom,
      onExitComplete: (childId) => {
        presenceChildren.set(childId, true);
        for (const isComplete of presenceChildren.values()) {
          if (!isComplete)
            return;
        }
        onExitComplete && onExitComplete();
      },
      register: (childId) => {
        presenceChildren.set(childId, false);
        return () => presenceChildren.delete(childId);
      }
    };
  }, [isPresent, presenceChildren, onExitComplete]);
  if (presenceAffectsLayout && isReusedContext) {
    context = { ...context };
  }
  reactExports.useMemo(() => {
    presenceChildren.forEach((_, key) => presenceChildren.set(key, false));
  }, [isPresent]);
  reactExports.useEffect(() => {
    !isPresent && !presenceChildren.size && onExitComplete && onExitComplete();
  }, [isPresent]);
  children = jsxRuntimeExports.jsx(PopChild, { pop: mode === "popLayout", isPresent, anchorX, anchorY, root, children });
  return jsxRuntimeExports.jsx(PresenceContext.Provider, { value: context, children });
};
function newChildrenMap() {
  return /* @__PURE__ */ new Map();
}
const getChildKey = (child) => child.key || "";
function onlyElements(children) {
  const filtered = [];
  reactExports.Children.forEach(children, (child) => {
    if (reactExports.isValidElement(child))
      filtered.push(child);
  });
  return filtered;
}
const AnimatePresence = ({ children, custom, initial = true, onExitComplete, presenceAffectsLayout = true, mode = "sync", propagate = false, anchorX = "left", anchorY = "top", root }) => {
  const [isParentPresent, safeToRemove] = usePresence(propagate);
  const presentChildren = reactExports.useMemo(() => onlyElements(children), [children]);
  const presentKeys = propagate && !isParentPresent ? [] : presentChildren.map(getChildKey);
  const isInitialRender = reactExports.useRef(true);
  const pendingPresentChildren = reactExports.useRef(presentChildren);
  const exitComplete = useConstant(() => /* @__PURE__ */ new Map());
  const exitingComponents = reactExports.useRef(/* @__PURE__ */ new Set());
  const [diffedChildren, setDiffedChildren] = reactExports.useState(presentChildren);
  const [renderedChildren, setRenderedChildren] = reactExports.useState(presentChildren);
  useIsomorphicLayoutEffect(() => {
    isInitialRender.current = false;
    pendingPresentChildren.current = presentChildren;
    for (let i = 0; i < renderedChildren.length; i++) {
      const key = getChildKey(renderedChildren[i]);
      if (!presentKeys.includes(key)) {
        if (exitComplete.get(key) !== true) {
          exitComplete.set(key, false);
        }
      } else {
        exitComplete.delete(key);
        exitingComponents.current.delete(key);
      }
    }
  }, [renderedChildren, presentKeys.length, presentKeys.join("-")]);
  const exitingChildren = [];
  if (presentChildren !== diffedChildren) {
    let nextChildren = [...presentChildren];
    for (let i = 0; i < renderedChildren.length; i++) {
      const child = renderedChildren[i];
      const key = getChildKey(child);
      if (!presentKeys.includes(key)) {
        nextChildren.splice(i, 0, child);
        exitingChildren.push(child);
      }
    }
    if (mode === "wait" && exitingChildren.length) {
      nextChildren = exitingChildren;
    }
    setRenderedChildren(onlyElements(nextChildren));
    setDiffedChildren(presentChildren);
    return null;
  }
  const { forceRender } = reactExports.useContext(LayoutGroupContext);
  return jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: renderedChildren.map((child) => {
    const key = getChildKey(child);
    const isPresent = propagate && !isParentPresent ? false : presentChildren === renderedChildren || presentKeys.includes(key);
    const onExit = () => {
      if (exitingComponents.current.has(key)) {
        return;
      }
      if (exitComplete.has(key)) {
        exitingComponents.current.add(key);
        exitComplete.set(key, true);
      } else {
        return;
      }
      let isEveryExitComplete = true;
      exitComplete.forEach((isExitComplete) => {
        if (!isExitComplete)
          isEveryExitComplete = false;
      });
      if (isEveryExitComplete) {
        forceRender == null ? void 0 : forceRender();
        setRenderedChildren(pendingPresentChildren.current);
        propagate && (safeToRemove == null ? void 0 : safeToRemove());
        onExitComplete && onExitComplete();
      }
    };
    return jsxRuntimeExports.jsx(PresenceChild, { isPresent, initial: !isInitialRender.current || initial ? void 0 : false, custom, presenceAffectsLayout, mode, root, onExitComplete: isPresent ? void 0 : onExit, anchorX, anchorY, children: child }, key);
  }) });
};
const DELIVERY_FEE = 50;
function CartItemRow({
  item,
  product,
  onAdd,
  onSubtract,
  onDelete
}) {
  const qty = Number(item.quantity);
  const price = product ? Number(product.price) : 0;
  const lineTotal = price * qty;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      layout: true,
      initial: { opacity: 0, y: 10 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, x: -40, transition: { duration: 0.2 } },
      className: "flex gap-3 items-start py-4 border-b border-border last:border-0",
      "data-ocid": "cart-item-row",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 rounded-xl bg-muted/60 border border-border flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingBag, { className: "w-7 h-7 text-muted-foreground/40" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-foreground text-sm leading-snug line-clamp-2", children: (product == null ? void 0 : product.name) ?? `Product #${item.productId}` }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5 capitalize", children: (product == null ? void 0 : product.category) ?? "—" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-accent font-bold text-sm mt-1", children: [
            "₹",
            price,
            " each"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-end gap-2 shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex items-center gap-0 border border-border rounded-full overflow-hidden",
              "aria-label": "Quantity controls",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: onSubtract,
                    className: "w-7 h-7 flex items-center justify-center hover:bg-muted transition-colors text-foreground",
                    "aria-label": "Decrease quantity",
                    "data-ocid": "cart-qty-minus",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Minus, { className: "w-3.5 h-3.5" })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-7 text-center text-sm font-bold leading-none", children: qty }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: onAdd,
                    className: "w-7 h-7 flex items-center justify-center hover:bg-primary/10 transition-colors text-primary",
                    "aria-label": "Increase quantity",
                    "data-ocid": "cart-qty-plus",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-3.5 h-3.5" })
                  }
                )
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-bold text-foreground", children: [
            "₹",
            lineTotal
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: onDelete,
              className: "text-muted-foreground hover:text-destructive transition-colors p-1 rounded",
              "aria-label": "Remove item from cart",
              "data-ocid": "cart-item-delete",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-4 h-4" })
            }
          )
        ] })
      ]
    }
  );
}
function EmptyCart() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      initial: { opacity: 0, scale: 0.95 },
      animate: { opacity: 1, scale: 1 },
      className: "flex flex-col items-center justify-center py-20 px-6 text-center",
      "data-ocid": "empty-cart",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingCart, { className: "w-12 h-12 text-primary/60" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-bold text-2xl text-foreground mb-2", children: "Your cart is empty" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm mb-8 max-w-xs", children: "Explore fresh groceries, snacks, and essentials delivered to your door in just 30 minutes." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            className: "rounded-full px-8 font-semibold",
            "data-ocid": "start-shopping-btn",
            children: "Start Shopping"
          }
        ) })
      ]
    }
  );
}
function CartSkeleton() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-0", children: [1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 py-4 border-b border-border", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "w-16 h-16 rounded-xl shrink-0" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 space-y-2 pt-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-3/4" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-1/3" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-1/5" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-end gap-2 pt-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-7 w-20 rounded-full" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-10" })
    ] })
  ] }, i)) });
}
function Cart() {
  const navigate = useNavigate();
  const { isAuthenticated, login } = useAuth();
  const { cartItems, isLoading, addToCart, removeFromCart, getItemQuantity } = useCart();
  const { data: products = [] } = useProducts();
  if (!isAuthenticated) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-lg mx-auto px-4 py-24 flex flex-col items-center text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingCart, { className: "w-10 h-10 text-primary" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-bold text-2xl text-foreground mb-2", children: "Sign in to view your cart" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm mb-8 max-w-xs", children: "Your cart is saved to your account. Log in to see your items and checkout." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          className: "rounded-full px-8 font-semibold",
          onClick: login,
          "data-ocid": "cart-login-btn",
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
  const total = subtotal > 0 ? subtotal + DELIVERY_FEE : 0;
  const totalQty = typedItems.reduce((s, i) => s + Number(i.quantity), 0);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-2xl mx-auto px-4 py-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display font-black text-2xl text-foreground", children: "My Cart" }),
      typedItems.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm text-muted-foreground bg-muted/50 px-3 py-1 rounded-full", children: [
        totalQty,
        " ",
        totalQty === 1 ? "item" : "items"
      ] })
    ] }),
    isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-card rounded-2xl border border-border px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CartSkeleton, {}) }) : typedItems.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyCart, {}) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 lg:grid-cols-5 items-start", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "lg:col-span-3 bg-card rounded-2xl border border-border px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { initial: false, children: typedItems.map((item) => {
        const product = productMap.get(item.productId.toString());
        const currentQty = getItemQuantity(item.productId);
        return /* @__PURE__ */ jsxRuntimeExports.jsx(
          CartItemRow,
          {
            item,
            product,
            onAdd: () => product ? addToCart(
              item.productId,
              product.name,
              BigInt(currentQty + 1)
            ) : void 0,
            onSubtract: () => {
              if (currentQty <= 1) {
                removeFromCart(item.productId);
              } else if (product) {
                addToCart(
                  item.productId,
                  product.name,
                  BigInt(currentQty - 1)
                );
              }
            },
            onDelete: () => removeFromCart(item.productId)
          },
          item.productId.toString()
        );
      }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { opacity: 0, y: 12 },
          animate: { opacity: 1, y: 0 },
          className: "lg:col-span-2 bg-card rounded-2xl border border-border p-5 space-y-4",
          "data-ocid": "cart-summary",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-bold text-base text-foreground", children: "Order Summary" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 text-sm", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Subtotal" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-semibold text-foreground", children: [
                  "₹",
                  subtotal
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Delivery fee" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-semibold text-foreground", children: [
                  "₹",
                  DELIVERY_FEE
                ] })
              ] }),
              subtotal >= 299 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-primary text-xs font-medium", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Free delivery discount" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                  "-₹",
                  DELIVERY_FEE
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t border-border pt-3 flex justify-between font-bold text-base", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Total" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-accent", children: [
                  "₹",
                  subtotal >= 299 ? subtotal : total
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                className: "w-full rounded-full font-bold text-[15px] h-12",
                onClick: () => navigate({ to: "/checkout" }),
                "data-ocid": "proceed-checkout-btn",
                children: "Proceed to Checkout →"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-center text-muted-foreground", children: "🎉 Free delivery on orders above ₹299" })
          ]
        }
      )
    ] })
  ] }) });
}
export {
  Cart as default
};
