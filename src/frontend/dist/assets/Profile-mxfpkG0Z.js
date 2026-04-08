import { b as useNavigate, f as useQueryClient, r as reactExports, j as jsxRuntimeExports, d as ue } from "./index-DJsfyEPD.js";
import { c as createLucideIcon, u as useAuth, d as useBackendActor, f as useMutation, L as Layout, U as User, B as Button, M as MapPin, H as House } from "./Layout-2vXxPoTN.js";
import { I as Input } from "./input-BsmGlAt7.js";
import { L as Label } from "./label-DCxt_8Gf.js";
import { S as Separator } from "./separator-QuaEKnd5.js";
import { S as Skeleton } from "./skeleton-DaenLL9q.js";
import { T as Trash2 } from "./trash-2-Cwggx07q.js";
import "./index-Du6goGIy.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$3 = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "M8 12h8", key: "1wcyev" }],
  ["path", { d: "M12 8v8", key: "napkw2" }]
];
const CirclePlus = createLucideIcon("circle-plus", __iconNode$3);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["path", { d: "m16 17 5-5-5-5", key: "1bji2h" }],
  ["path", { d: "M21 12H9", key: "dn1m92" }],
  ["path", { d: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4", key: "1uf3rs" }]
];
const LogOut = createLucideIcon("log-out", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7", key: "132q7q" }],
  ["rect", { x: "2", y: "4", width: "20", height: "16", rx: "2", key: "izxlao" }]
];
const Mail = createLucideIcon("mail", __iconNode$1);
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
      d: "M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384",
      key: "9njp5v"
    }
  ]
];
const Phone = createLucideIcon("phone", __iconNode);
const EMPTY_ADDRESS = {
  tag: "",
  line1: "",
  line2: "",
  city: "",
  pincode: ""
};
function ProfileSkeleton() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-2xl border border-border p-5 space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-14 w-14 rounded-full" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-5 w-40" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-56" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-2xl border border-border p-5 space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-5 w-32" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-10 w-full rounded-xl" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-10 w-full rounded-xl" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-10 w-full rounded-xl" })
    ] })
  ] });
}
function Profile() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const {
    isAuthenticated,
    isLoading: authLoading,
    profile,
    logout,
    principal
  } = useAuth();
  const { actor } = useBackendActor();
  const [name, setName] = reactExports.useState("");
  const [email, setEmail] = reactExports.useState("");
  const [phone, setPhone] = reactExports.useState("");
  const [addresses, setAddresses] = reactExports.useState([]);
  const [showAddAddress, setShowAddAddress] = reactExports.useState(false);
  const [newAddr, setNewAddr] = reactExports.useState(EMPTY_ADDRESS);
  reactExports.useEffect(() => {
    if (profile) {
      setName(profile.name ?? "");
      setEmail(profile.email ?? "");
      setPhone(profile.phone ?? "");
      setAddresses(profile.savedAddresses ?? []);
    }
  }, [profile]);
  reactExports.useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate({ to: "/" });
    }
  }, [isAuthenticated, authLoading, navigate]);
  const updateMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.updateProfile({
        name,
        email,
        phone,
        savedAddresses: addresses
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      ue.success("Profile updated successfully", { icon: "✅" });
    },
    onError: () => {
      ue.error("Failed to update profile. Please try again.");
    }
  });
  const handleSave = (e) => {
    e.preventDefault();
    updateMutation.mutate();
  };
  const handleAddAddress = () => {
    if (!newAddr.tag.trim() || !newAddr.line1.trim() || !newAddr.city.trim() || !newAddr.pincode.trim()) {
      ue.error("Please fill all required address fields");
      return;
    }
    setAddresses((prev) => [...prev, newAddr]);
    setNewAddr(EMPTY_ADDRESS);
    setShowAddAddress(false);
  };
  const handleRemoveAddress = (idx) => {
    setAddresses((prev) => prev.filter((_, i) => i !== idx));
  };
  if (authLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-2xl mx-auto px-4 py-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ProfileSkeleton, {}) }) });
  }
  const shortPrincipal = principal ? `${principal.slice(0, 6)}…${principal.slice(-4)}` : "";
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-2xl mx-auto px-4 py-6 space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-card rounded-2xl border border-border p-5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-14 h-14 rounded-full bg-primary/15 flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "w-7 h-7 text-primary" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-lg font-black text-foreground font-display truncate", children: (profile == null ? void 0 : profile.name) || "Your Account" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-0.5 truncate", children: [
          "Principal: ",
          shortPrincipal
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "form",
      {
        onSubmit: handleSave,
        className: "bg-card rounded-2xl border border-border p-5 space-y-4",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-bold text-foreground", children: "Personal Information" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Label,
              {
                htmlFor: "name",
                className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide",
                children: "Full Name"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "name",
                  value: name,
                  onChange: (e) => setName(e.target.value),
                  placeholder: "Your full name",
                  className: "pl-9 rounded-xl",
                  "data-ocid": "profile-name-input"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Label,
              {
                htmlFor: "email",
                className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide",
                children: "Email"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "email",
                  type: "email",
                  value: email,
                  onChange: (e) => setEmail(e.target.value),
                  placeholder: "your@email.com",
                  className: "pl-9 rounded-xl",
                  "data-ocid": "profile-email-input"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Label,
              {
                htmlFor: "phone",
                className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide",
                children: "Phone"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "phone",
                  type: "tel",
                  value: phone,
                  onChange: (e) => setPhone(e.target.value),
                  placeholder: "+91 98765 43210",
                  className: "pl-9 rounded-xl",
                  "data-ocid": "profile-phone-input"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "submit",
              className: "w-full rounded-full font-bold",
              disabled: updateMutation.isPending,
              "data-ocid": "save-profile-btn",
              children: updateMutation.isPending ? "Saving…" : "Save Changes"
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-2xl border border-border overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 py-3.5 border-b border-border bg-muted/30 flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-bold text-foreground", children: "Saved Addresses" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            onClick: () => setShowAddAddress((v) => !v),
            className: "flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary/80 transition-colors",
            "data-ocid": "add-address-btn",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CirclePlus, { className: "w-3.5 h-3.5" }),
              "Add New"
            ]
          }
        )
      ] }),
      showAddAddress && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 py-4 border-b border-border bg-muted/20 space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: "Tag *" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                value: newAddr.tag,
                onChange: (e) => setNewAddr((a) => ({ ...a, tag: e.target.value })),
                placeholder: "Home, Work…",
                className: "rounded-xl text-sm",
                "data-ocid": "addr-tag-input"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: "Pincode *" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                value: newAddr.pincode,
                onChange: (e) => setNewAddr((a) => ({ ...a, pincode: e.target.value })),
                placeholder: "400001",
                className: "rounded-xl text-sm",
                "data-ocid": "addr-pincode-input"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: "Address Line 1 *" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              value: newAddr.line1,
              onChange: (e) => setNewAddr((a) => ({ ...a, line1: e.target.value })),
              placeholder: "Flat no., Building name",
              className: "rounded-xl text-sm",
              "data-ocid": "addr-line1-input"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: "Address Line 2" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              value: newAddr.line2,
              onChange: (e) => setNewAddr((a) => ({ ...a, line2: e.target.value })),
              placeholder: "Street, Locality",
              className: "rounded-xl text-sm"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: "City *" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              value: newAddr.city,
              onChange: (e) => setNewAddr((a) => ({ ...a, city: e.target.value })),
              placeholder: "Mumbai",
              className: "rounded-xl text-sm",
              "data-ocid": "addr-city-input"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "button",
              variant: "outline",
              size: "sm",
              className: "rounded-full",
              onClick: () => {
                setShowAddAddress(false);
                setNewAddr(EMPTY_ADDRESS);
              },
              children: "Cancel"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "button",
              size: "sm",
              className: "rounded-full font-semibold",
              onClick: handleAddAddress,
              "data-ocid": "confirm-add-address-btn",
              children: "Add Address"
            }
          )
        ] })
      ] }),
      addresses.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center py-10 gap-3 text-center px-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 rounded-full bg-muted/60 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "w-6 h-6 text-muted-foreground" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "No saved addresses yet" })
      ] }) : addresses.map((addr, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "flex items-start gap-3 px-5 py-4 border-b border-border last:border-0",
          "data-ocid": "address-row",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 mt-0.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(House, { className: "w-4 h-4 text-primary" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-bold text-accent-foreground uppercase tracking-wide mb-0.5", children: addr.tag }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-foreground", children: addr.line1 }),
              addr.line2 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: addr.line2 }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
                addr.city,
                " – ",
                addr.pincode
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => handleRemoveAddress(idx),
                className: "p-1.5 rounded-lg hover:bg-destructive/10 transition-colors text-muted-foreground hover:text-destructive",
                "aria-label": "Remove address",
                "data-ocid": "remove-address-btn",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-4 h-4" })
              }
            )
          ]
        },
        `${addr.tag}-${addr.pincode}-${idx}`
      ))
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Button,
      {
        variant: "outline",
        className: "w-full rounded-full font-semibold text-destructive border-destructive/30 hover:bg-destructive/10 gap-2",
        onClick: logout,
        "data-ocid": "logout-btn",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(LogOut, { className: "w-4 h-4" }),
          "Logout"
        ]
      }
    )
  ] }) });
}
export {
  Profile as default
};
