import { a as useInternetIdentity, j as jsxRuntimeExports } from "./index-DJsfyEPD.js";
import { c as createLucideIcon, X, B as Button } from "./Layout-2vXxPoTN.js";
import { S as ShoppingBag } from "./shopping-bag-8qMxQwFm.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  [
    "path",
    {
      d: "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",
      key: "oel41y"
    }
  ]
];
const Shield = createLucideIcon("shield", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  [
    "path",
    {
      d: "M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z",
      key: "1xq2db"
    }
  ]
];
const Zap = createLucideIcon("zap", __iconNode);
const PERKS = [
  { icon: Zap, text: "10-minute delivery to your door" },
  { icon: ShoppingBag, text: "Track orders in real-time" },
  { icon: Shield, text: "Secure & private with Internet Identity" }
];
function AuthModal({ open, onClose, message }) {
  const { login } = useInternetIdentity();
  if (!open) return null;
  const handleLogin = () => {
    login();
    onClose();
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "fixed inset-0 z-50 flex items-end sm:items-center justify-center",
      "data-ocid": "auth-modal",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "absolute inset-0 bg-foreground/50 backdrop-blur-sm",
            role: "button",
            tabIndex: 0,
            onClick: onClose,
            onKeyDown: (e) => e.key === "Escape" && onClose(),
            "aria-label": "Close modal"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "dialog",
          {
            "aria-labelledby": "auth-modal-title",
            open: true,
            className: "relative bg-card rounded-t-2xl sm:rounded-2xl w-full sm:max-w-sm mx-0 sm:mx-4 p-6 shadow-xl",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: onClose,
                  className: "absolute top-4 right-4 p-1.5 hover:bg-muted rounded-full transition-colors",
                  "aria-label": "Close",
                  "data-ocid": "auth-modal-close",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-4 h-4 text-muted-foreground" })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-1 bg-border rounded-full mx-auto mb-5 sm:hidden" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center text-center gap-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingBag, { className: "w-8 h-8 text-primary" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "h2",
                    {
                      id: "auth-modal-title",
                      className: "text-xl font-bold text-foreground",
                      children: "Login to continue"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1.5 max-w-xs", children: message ?? "Sign in to add items to your cart and place orders" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full flex flex-col gap-2 text-left bg-muted/40 rounded-xl p-3", children: PERKS.map(({ icon: Icon, text }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    className: "flex items-center gap-2.5 text-sm text-foreground",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "w-4 h-4 text-primary shrink-0" }),
                      text
                    ]
                  },
                  text
                )) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    className: "w-full rounded-xl py-3 font-semibold text-base h-auto",
                    onClick: handleLogin,
                    "data-ocid": "auth-modal-login-btn",
                    children: "Login with Internet Identity"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: onClose,
                    className: "text-sm text-muted-foreground hover:text-foreground transition-colors",
                    "data-ocid": "auth-modal-cancel",
                    children: "Maybe later"
                  }
                )
              ] })
            ]
          }
        )
      ]
    }
  );
}
export {
  AuthModal as A,
  Zap as Z
};
