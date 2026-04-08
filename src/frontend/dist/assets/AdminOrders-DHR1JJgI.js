import { r as reactExports, j as jsxRuntimeExports, c as cn, b as useNavigate, h as LoadingSpinner, f as useQueryClient, d as ue } from "./index-DJsfyEPD.js";
import { B as Badge } from "./badge-BflPiVcb.js";
import { g as useComposedRefs, u as useAuth, L as Layout, d as useBackendActor, e as useQuery, f as useMutation, M as MapPin, B as Button } from "./Layout-2vXxPoTN.js";
import { C as Card, a as CardContent } from "./card-B9m9fl0E.js";
import { e as useId, P as Primitive, c as composeEventHandlers, h as createContextScope, l as createCollection, k as useDirection, b as useControllableState, u as useCallbackRef, g as Presence, C as ChevronDown } from "./index-CBVHiE6N.js";
import { O as OrderStatus } from "./backend.d-C2Aaw6C6.js";
import { E as EmptyState } from "./EmptyState-CsgZWgSy.js";
import { P as Package } from "./package-C5X_8B0-.js";
import { C as ChevronRight } from "./chevron-right-C8hkA3ky.js";
var ENTRY_FOCUS = "rovingFocusGroup.onEntryFocus";
var EVENT_OPTIONS = { bubbles: false, cancelable: true };
var GROUP_NAME = "RovingFocusGroup";
var [Collection, useCollection, createCollectionScope] = createCollection(GROUP_NAME);
var [createRovingFocusGroupContext, createRovingFocusGroupScope] = createContextScope(
  GROUP_NAME,
  [createCollectionScope]
);
var [RovingFocusProvider, useRovingFocusContext] = createRovingFocusGroupContext(GROUP_NAME);
var RovingFocusGroup = reactExports.forwardRef(
  (props, forwardedRef) => {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Collection.Provider, { scope: props.__scopeRovingFocusGroup, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Collection.Slot, { scope: props.__scopeRovingFocusGroup, children: /* @__PURE__ */ jsxRuntimeExports.jsx(RovingFocusGroupImpl, { ...props, ref: forwardedRef }) }) });
  }
);
RovingFocusGroup.displayName = GROUP_NAME;
var RovingFocusGroupImpl = reactExports.forwardRef((props, forwardedRef) => {
  const {
    __scopeRovingFocusGroup,
    orientation,
    loop = false,
    dir,
    currentTabStopId: currentTabStopIdProp,
    defaultCurrentTabStopId,
    onCurrentTabStopIdChange,
    onEntryFocus,
    preventScrollOnEntryFocus = false,
    ...groupProps
  } = props;
  const ref = reactExports.useRef(null);
  const composedRefs = useComposedRefs(forwardedRef, ref);
  const direction = useDirection(dir);
  const [currentTabStopId, setCurrentTabStopId] = useControllableState({
    prop: currentTabStopIdProp,
    defaultProp: defaultCurrentTabStopId ?? null,
    onChange: onCurrentTabStopIdChange,
    caller: GROUP_NAME
  });
  const [isTabbingBackOut, setIsTabbingBackOut] = reactExports.useState(false);
  const handleEntryFocus = useCallbackRef(onEntryFocus);
  const getItems = useCollection(__scopeRovingFocusGroup);
  const isClickFocusRef = reactExports.useRef(false);
  const [focusableItemsCount, setFocusableItemsCount] = reactExports.useState(0);
  reactExports.useEffect(() => {
    const node = ref.current;
    if (node) {
      node.addEventListener(ENTRY_FOCUS, handleEntryFocus);
      return () => node.removeEventListener(ENTRY_FOCUS, handleEntryFocus);
    }
  }, [handleEntryFocus]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    RovingFocusProvider,
    {
      scope: __scopeRovingFocusGroup,
      orientation,
      dir: direction,
      loop,
      currentTabStopId,
      onItemFocus: reactExports.useCallback(
        (tabStopId) => setCurrentTabStopId(tabStopId),
        [setCurrentTabStopId]
      ),
      onItemShiftTab: reactExports.useCallback(() => setIsTabbingBackOut(true), []),
      onFocusableItemAdd: reactExports.useCallback(
        () => setFocusableItemsCount((prevCount) => prevCount + 1),
        []
      ),
      onFocusableItemRemove: reactExports.useCallback(
        () => setFocusableItemsCount((prevCount) => prevCount - 1),
        []
      ),
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        Primitive.div,
        {
          tabIndex: isTabbingBackOut || focusableItemsCount === 0 ? -1 : 0,
          "data-orientation": orientation,
          ...groupProps,
          ref: composedRefs,
          style: { outline: "none", ...props.style },
          onMouseDown: composeEventHandlers(props.onMouseDown, () => {
            isClickFocusRef.current = true;
          }),
          onFocus: composeEventHandlers(props.onFocus, (event) => {
            const isKeyboardFocus = !isClickFocusRef.current;
            if (event.target === event.currentTarget && isKeyboardFocus && !isTabbingBackOut) {
              const entryFocusEvent = new CustomEvent(ENTRY_FOCUS, EVENT_OPTIONS);
              event.currentTarget.dispatchEvent(entryFocusEvent);
              if (!entryFocusEvent.defaultPrevented) {
                const items = getItems().filter((item) => item.focusable);
                const activeItem = items.find((item) => item.active);
                const currentItem = items.find((item) => item.id === currentTabStopId);
                const candidateItems = [activeItem, currentItem, ...items].filter(
                  Boolean
                );
                const candidateNodes = candidateItems.map((item) => item.ref.current);
                focusFirst(candidateNodes, preventScrollOnEntryFocus);
              }
            }
            isClickFocusRef.current = false;
          }),
          onBlur: composeEventHandlers(props.onBlur, () => setIsTabbingBackOut(false))
        }
      )
    }
  );
});
var ITEM_NAME = "RovingFocusGroupItem";
var RovingFocusGroupItem = reactExports.forwardRef(
  (props, forwardedRef) => {
    const {
      __scopeRovingFocusGroup,
      focusable = true,
      active = false,
      tabStopId,
      children,
      ...itemProps
    } = props;
    const autoId = useId();
    const id = tabStopId || autoId;
    const context = useRovingFocusContext(ITEM_NAME, __scopeRovingFocusGroup);
    const isCurrentTabStop = context.currentTabStopId === id;
    const getItems = useCollection(__scopeRovingFocusGroup);
    const { onFocusableItemAdd, onFocusableItemRemove, currentTabStopId } = context;
    reactExports.useEffect(() => {
      if (focusable) {
        onFocusableItemAdd();
        return () => onFocusableItemRemove();
      }
    }, [focusable, onFocusableItemAdd, onFocusableItemRemove]);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Collection.ItemSlot,
      {
        scope: __scopeRovingFocusGroup,
        id,
        focusable,
        active,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Primitive.span,
          {
            tabIndex: isCurrentTabStop ? 0 : -1,
            "data-orientation": context.orientation,
            ...itemProps,
            ref: forwardedRef,
            onMouseDown: composeEventHandlers(props.onMouseDown, (event) => {
              if (!focusable) event.preventDefault();
              else context.onItemFocus(id);
            }),
            onFocus: composeEventHandlers(props.onFocus, () => context.onItemFocus(id)),
            onKeyDown: composeEventHandlers(props.onKeyDown, (event) => {
              if (event.key === "Tab" && event.shiftKey) {
                context.onItemShiftTab();
                return;
              }
              if (event.target !== event.currentTarget) return;
              const focusIntent = getFocusIntent(event, context.orientation, context.dir);
              if (focusIntent !== void 0) {
                if (event.metaKey || event.ctrlKey || event.altKey || event.shiftKey) return;
                event.preventDefault();
                const items = getItems().filter((item) => item.focusable);
                let candidateNodes = items.map((item) => item.ref.current);
                if (focusIntent === "last") candidateNodes.reverse();
                else if (focusIntent === "prev" || focusIntent === "next") {
                  if (focusIntent === "prev") candidateNodes.reverse();
                  const currentIndex = candidateNodes.indexOf(event.currentTarget);
                  candidateNodes = context.loop ? wrapArray(candidateNodes, currentIndex + 1) : candidateNodes.slice(currentIndex + 1);
                }
                setTimeout(() => focusFirst(candidateNodes));
              }
            }),
            children: typeof children === "function" ? children({ isCurrentTabStop, hasTabStop: currentTabStopId != null }) : children
          }
        )
      }
    );
  }
);
RovingFocusGroupItem.displayName = ITEM_NAME;
var MAP_KEY_TO_FOCUS_INTENT = {
  ArrowLeft: "prev",
  ArrowUp: "prev",
  ArrowRight: "next",
  ArrowDown: "next",
  PageUp: "first",
  Home: "first",
  PageDown: "last",
  End: "last"
};
function getDirectionAwareKey(key, dir) {
  if (dir !== "rtl") return key;
  return key === "ArrowLeft" ? "ArrowRight" : key === "ArrowRight" ? "ArrowLeft" : key;
}
function getFocusIntent(event, orientation, dir) {
  const key = getDirectionAwareKey(event.key, dir);
  if (orientation === "vertical" && ["ArrowLeft", "ArrowRight"].includes(key)) return void 0;
  if (orientation === "horizontal" && ["ArrowUp", "ArrowDown"].includes(key)) return void 0;
  return MAP_KEY_TO_FOCUS_INTENT[key];
}
function focusFirst(candidates, preventScroll = false) {
  const PREVIOUSLY_FOCUSED_ELEMENT = document.activeElement;
  for (const candidate of candidates) {
    if (candidate === PREVIOUSLY_FOCUSED_ELEMENT) return;
    candidate.focus({ preventScroll });
    if (document.activeElement !== PREVIOUSLY_FOCUSED_ELEMENT) return;
  }
}
function wrapArray(array, startIndex) {
  return array.map((_, index) => array[(startIndex + index) % array.length]);
}
var Root = RovingFocusGroup;
var Item = RovingFocusGroupItem;
var TABS_NAME = "Tabs";
var [createTabsContext] = createContextScope(TABS_NAME, [
  createRovingFocusGroupScope
]);
var useRovingFocusGroupScope = createRovingFocusGroupScope();
var [TabsProvider, useTabsContext] = createTabsContext(TABS_NAME);
var Tabs$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const {
      __scopeTabs,
      value: valueProp,
      onValueChange,
      defaultValue,
      orientation = "horizontal",
      dir,
      activationMode = "automatic",
      ...tabsProps
    } = props;
    const direction = useDirection(dir);
    const [value, setValue] = useControllableState({
      prop: valueProp,
      onChange: onValueChange,
      defaultProp: defaultValue ?? "",
      caller: TABS_NAME
    });
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      TabsProvider,
      {
        scope: __scopeTabs,
        baseId: useId(),
        value,
        onValueChange: setValue,
        orientation,
        dir: direction,
        activationMode,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Primitive.div,
          {
            dir: direction,
            "data-orientation": orientation,
            ...tabsProps,
            ref: forwardedRef
          }
        )
      }
    );
  }
);
Tabs$1.displayName = TABS_NAME;
var TAB_LIST_NAME = "TabsList";
var TabsList$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeTabs, loop = true, ...listProps } = props;
    const context = useTabsContext(TAB_LIST_NAME, __scopeTabs);
    const rovingFocusGroupScope = useRovingFocusGroupScope(__scopeTabs);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Root,
      {
        asChild: true,
        ...rovingFocusGroupScope,
        orientation: context.orientation,
        dir: context.dir,
        loop,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Primitive.div,
          {
            role: "tablist",
            "aria-orientation": context.orientation,
            ...listProps,
            ref: forwardedRef
          }
        )
      }
    );
  }
);
TabsList$1.displayName = TAB_LIST_NAME;
var TRIGGER_NAME = "TabsTrigger";
var TabsTrigger$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeTabs, value, disabled = false, ...triggerProps } = props;
    const context = useTabsContext(TRIGGER_NAME, __scopeTabs);
    const rovingFocusGroupScope = useRovingFocusGroupScope(__scopeTabs);
    const triggerId = makeTriggerId(context.baseId, value);
    const contentId = makeContentId(context.baseId, value);
    const isSelected = value === context.value;
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Item,
      {
        asChild: true,
        ...rovingFocusGroupScope,
        focusable: !disabled,
        active: isSelected,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Primitive.button,
          {
            type: "button",
            role: "tab",
            "aria-selected": isSelected,
            "aria-controls": contentId,
            "data-state": isSelected ? "active" : "inactive",
            "data-disabled": disabled ? "" : void 0,
            disabled,
            id: triggerId,
            ...triggerProps,
            ref: forwardedRef,
            onMouseDown: composeEventHandlers(props.onMouseDown, (event) => {
              if (!disabled && event.button === 0 && event.ctrlKey === false) {
                context.onValueChange(value);
              } else {
                event.preventDefault();
              }
            }),
            onKeyDown: composeEventHandlers(props.onKeyDown, (event) => {
              if ([" ", "Enter"].includes(event.key)) context.onValueChange(value);
            }),
            onFocus: composeEventHandlers(props.onFocus, () => {
              const isAutomaticActivation = context.activationMode !== "manual";
              if (!isSelected && !disabled && isAutomaticActivation) {
                context.onValueChange(value);
              }
            })
          }
        )
      }
    );
  }
);
TabsTrigger$1.displayName = TRIGGER_NAME;
var CONTENT_NAME = "TabsContent";
var TabsContent$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeTabs, value, forceMount, children, ...contentProps } = props;
    const context = useTabsContext(CONTENT_NAME, __scopeTabs);
    const triggerId = makeTriggerId(context.baseId, value);
    const contentId = makeContentId(context.baseId, value);
    const isSelected = value === context.value;
    const isMountAnimationPreventedRef = reactExports.useRef(isSelected);
    reactExports.useEffect(() => {
      const rAF = requestAnimationFrame(() => isMountAnimationPreventedRef.current = false);
      return () => cancelAnimationFrame(rAF);
    }, []);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Presence, { present: forceMount || isSelected, children: ({ present }) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      Primitive.div,
      {
        "data-state": isSelected ? "active" : "inactive",
        "data-orientation": context.orientation,
        role: "tabpanel",
        "aria-labelledby": triggerId,
        hidden: !present,
        id: contentId,
        tabIndex: 0,
        ...contentProps,
        ref: forwardedRef,
        style: {
          ...props.style,
          animationDuration: isMountAnimationPreventedRef.current ? "0s" : void 0
        },
        children: present && children
      }
    ) });
  }
);
TabsContent$1.displayName = CONTENT_NAME;
function makeTriggerId(baseId, value) {
  return `${baseId}-trigger-${value}`;
}
function makeContentId(baseId, value) {
  return `${baseId}-content-${value}`;
}
var Root2 = Tabs$1;
var List = TabsList$1;
var Trigger = TabsTrigger$1;
var Content = TabsContent$1;
function Tabs({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Root2,
    {
      "data-slot": "tabs",
      className: cn("flex flex-col gap-2", className),
      ...props
    }
  );
}
function TabsList({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    List,
    {
      "data-slot": "tabs-list",
      className: cn(
        "bg-muted text-muted-foreground inline-flex h-9 w-fit items-center justify-center rounded-lg p-[3px]",
        className
      ),
      ...props
    }
  );
}
function TabsTrigger({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Trigger,
    {
      "data-slot": "tabs-trigger",
      className: cn(
        "data-[state=active]:bg-background dark:data-[state=active]:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring dark:data-[state=active]:border-input dark:data-[state=active]:bg-input/30 text-foreground dark:text-muted-foreground inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow-sm [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      ),
      ...props
    }
  );
}
function TabsContent({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Content,
    {
      "data-slot": "tabs-content",
      className: cn("flex-1 outline-none", className),
      ...props
    }
  );
}
function useAllOrders() {
  const { actor, isFetching } = useBackendActor();
  return useQuery({
    queryKey: ["admin", "orders"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllOrders();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 3e4
  });
}
function useUpdateOrderStatus() {
  const { actor } = useBackendActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      orderId,
      status
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.updateOrderStatus(orderId, status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "orders"] });
      ue.success("Order status updated");
    },
    onError: () => ue.error("Failed to update order status")
  });
}
const STATUS_LABELS = {
  [OrderStatus.Confirmed]: "Confirmed",
  [OrderStatus.InTransit]: "In Transit",
  [OrderStatus.Delivered]: "Delivered"
};
const STATUS_COLORS = {
  [OrderStatus.Confirmed]: "bg-accent/20 text-accent-foreground border-accent/30",
  [OrderStatus.InTransit]: "bg-primary/15 text-primary border-primary/20",
  [OrderStatus.Delivered]: "bg-muted text-muted-foreground border-border"
};
const NEXT_STATUS = {
  [OrderStatus.Confirmed]: OrderStatus.InTransit,
  [OrderStatus.InTransit]: OrderStatus.Delivered
};
function formatDate(ns) {
  return new Date(Number(ns) / 1e6).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });
}
function formatAmount(paise) {
  return `₹${(Number(paise) / 100).toFixed(0)}`;
}
function truncatePrincipal(p) {
  const str = p.toString();
  if (str.length <= 12) return str;
  return `${str.slice(0, 6)}…${str.slice(-4)}`;
}
function StatusBadge({ status }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Badge,
    {
      variant: "outline",
      className: `text-xs font-semibold ${STATUS_COLORS[status]}`,
      children: STATUS_LABELS[status]
    }
  );
}
function OrderCard({
  order,
  expanded,
  onToggle,
  onAdvance,
  advancing
}) {
  const nextStatus = NEXT_STATUS[order.status];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-b border-border last:border-0", "data-ocid": "order-row", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        type: "button",
        onClick: onToggle,
        className: "w-full flex items-center gap-3 px-4 py-3 hover:bg-muted/30 transition-colors text-left",
        "data-ocid": "order-row-toggle",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-xs text-muted-foreground", children: [
                "#",
                order.id.toString()
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: order.status })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mt-1 text-xs text-muted-foreground flex-wrap", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-foreground truncate max-w-[120px]", children: truncatePrincipal(order.userId) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: formatDate(order.createdAt) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                order.items.length,
                " item",
                order.items.length !== 1 ? "s" : ""
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-foreground", children: formatAmount(order.totalAmount) })
            ] })
          ] }),
          expanded ? /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "w-4 h-4 text-muted-foreground shrink-0" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "w-4 h-4 text-muted-foreground shrink-0" })
        ]
      }
    ),
    expanded && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 pb-4 bg-muted/20 border-t border-border/60", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pt-3 space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2", children: "Items" }),
        order.items.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex items-center justify-between text-sm",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-foreground truncate flex-1 min-w-0 pr-2", children: [
                item.name,
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground ml-1", children: [
                  "× ",
                  item.quantity.toString()
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold shrink-0", children: formatAmount(item.price * item.quantity) })
            ]
          },
          item.productId.toString()
        ))
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 pt-3 border-t border-border/60", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5", children: "Delivery Address" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2 text-sm text-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "w-3.5 h-3.5 text-primary mt-0.5 shrink-0" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            order.deliveryAddress.line1,
            order.deliveryAddress.line2 ? `, ${order.deliveryAddress.line2}` : "",
            ", ",
            order.deliveryAddress.city,
            " — ",
            order.deliveryAddress.pincode,
            order.deliveryAddress.tag && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", className: "ml-2 text-xs", children: order.deliveryAddress.tag })
          ] })
        ] })
      ] }),
      nextStatus && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 flex justify-end", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          size: "sm",
          variant: "outline",
          onClick: (e) => {
            e.stopPropagation();
            onAdvance();
          },
          disabled: advancing,
          className: "rounded-full text-xs font-semibold gap-1.5",
          "data-ocid": "advance-status-btn",
          children: advancing ? "Updating…" : `Mark as ${STATUS_LABELS[nextStatus]}`
        }
      ) })
    ] })
  ] });
}
function AdminOrders() {
  const { isAdmin, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { data: orders = [], isLoading: ordersLoading } = useAllOrders();
  const updateStatus = useUpdateOrderStatus();
  const [expanded, setExpanded] = reactExports.useState(null);
  const [tab, setTab] = reactExports.useState("all");
  reactExports.useEffect(() => {
    if (!authLoading && !isAdmin) navigate({ to: "/" });
  }, [isAdmin, authLoading, navigate]);
  if (authLoading || !isAdmin) return null;
  const filtered = tab === "all" ? orders : orders.filter((o) => o.status === tab);
  const counts = {
    all: orders.length,
    [OrderStatus.Confirmed]: orders.filter(
      (o) => o.status === OrderStatus.Confirmed
    ).length,
    [OrderStatus.InTransit]: orders.filter(
      (o) => o.status === OrderStatus.InTransit
    ).length,
    [OrderStatus.Delivered]: orders.filter(
      (o) => o.status === OrderStatus.Delivered
    ).length
  };
  const tabs = [
    { value: "all", label: "All" },
    { value: OrderStatus.Confirmed, label: "Confirmed" },
    { value: OrderStatus.InTransit, label: "In Transit" },
    { value: OrderStatus.Delivered, label: "Delivered" }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-3xl mx-auto px-4 py-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-black text-foreground tracking-tight", children: "Orders" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground mt-0.5", children: [
        orders.length,
        " total orders"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Tabs,
      {
        value: tab,
        onValueChange: (v) => setTab(v),
        className: "mb-4",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            TabsList,
            {
              className: "grid w-full grid-cols-4 h-9",
              "data-ocid": "order-status-tabs",
              children: tabs.map(({ value, label }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                TabsTrigger,
                {
                  value,
                  className: "text-xs font-semibold",
                  "data-ocid": `tab-${value}`,
                  children: [
                    label,
                    counts[value] > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-1 text-[10px] bg-muted rounded-full px-1.5 py-0.5 font-bold", children: counts[value] })
                  ]
                },
                value
              ))
            }
          ),
          tabs.map(({ value: tabVal }) => /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: tabVal, className: "mt-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border-border overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-0", children: ordersLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center py-12", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingSpinner, { size: "md", text: "Loading orders…" }) }) : filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            EmptyState,
            {
              variant: "orders",
              title: "No orders found",
              description: tab === "all" ? "No orders have been placed yet." : `No ${STATUS_LABELS[tab]} orders.`
            }
          ) : filtered.map((order) => {
            var _a;
            const id = order.id.toString();
            const nextStatus = NEXT_STATUS[order.status];
            return /* @__PURE__ */ jsxRuntimeExports.jsx(
              OrderCard,
              {
                order,
                expanded: expanded === id,
                onToggle: () => setExpanded((prev) => prev === id ? null : id),
                onAdvance: () => {
                  if (nextStatus) {
                    updateStatus.mutate({
                      orderId: order.id,
                      status: nextStatus
                    });
                  }
                },
                advancing: updateStatus.isPending && ((_a = updateStatus.variables) == null ? void 0 : _a.orderId) === order.id
              },
              id
            );
          }) }) }) }, tabVal))
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-3 flex-wrap mt-4", children: Object.values(OrderStatus).map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex items-center gap-1.5 text-xs text-muted-foreground",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "w-3 h-3" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: s })
        ]
      },
      s
    )) })
  ] }) });
}
export {
  AdminOrders as default
};
