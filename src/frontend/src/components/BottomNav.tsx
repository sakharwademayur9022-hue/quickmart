import { cn } from "@/lib/utils";
import { Link, useLocation } from "@tanstack/react-router";
import { ClipboardList, Home, ShoppingCart, User } from "lucide-react";
import { useCart } from "../hooks/useCart";

const navItems = [
  { to: "/", label: "Home", icon: Home },
  { to: "/cart", label: "Cart", icon: ShoppingCart },
  { to: "/orders", label: "Orders", icon: ClipboardList },
  { to: "/profile", label: "Account", icon: User },
] as const;

export default function BottomNav() {
  const location = useLocation();
  const { itemCount } = useCart();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 sm:hidden bg-card border-t border-border"
      data-ocid="bottom-nav"
    >
      <div className="flex items-stretch h-16">
        {navItems.map(({ to, label, icon: Icon }) => {
          const isActive =
            location.pathname === to ||
            (to !== "/" && location.pathname.startsWith(to));
          const isCart = to === "/cart";
          return (
            <Link
              key={to}
              to={to}
              className={cn(
                "flex-1 flex flex-col items-center justify-center gap-0.5 relative transition-colors",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground",
              )}
              data-ocid={`bottom-nav-${label.toLowerCase()}`}
            >
              <div className="relative">
                <Icon
                  className={cn(
                    "w-5 h-5",
                    isActive && "scale-110 transition-transform",
                  )}
                />
                {isCart && itemCount > 0 && (
                  <span className="absolute -top-1 -right-1.5 min-w-[16px] h-4 flex items-center justify-center rounded-full bg-primary text-primary-foreground text-[9px] font-bold px-0.5">
                    {itemCount > 99 ? "99+" : itemCount}
                  </span>
                )}
              </div>
              <span
                className={cn(
                  "text-[10px] font-medium",
                  isActive ? "text-primary" : "",
                )}
              >
                {label}
              </span>
              {isActive && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-primary rounded-b-full" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
