import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Link, useLocation } from "@tanstack/react-router";
import {
  ClipboardList,
  Home,
  MapPin,
  Menu,
  Search,
  ShoppingCart,
  User,
  X,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useCart } from "../hooks/useCart";
import BottomNav from "./BottomNav";

interface LayoutProps {
  children: React.ReactNode;
  className?: string;
}

export default function Layout({ children, className }: LayoutProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { itemCount } = useCart();
  const { isAuthenticated, isAdmin, login, logout } = useAuth();
  const location = useLocation();

  const navLinks = [
    { to: "/", label: "Home", icon: Home },
    { to: "/cart", label: "Cart", icon: ShoppingCart },
    { to: "/orders", label: "Orders", icon: ClipboardList },
    { to: "/profile", label: "Account", icon: User },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header
        className="sticky top-0 z-50 bg-card border-b border-border shadow-sm"
        data-ocid="header"
      >
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between gap-3">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground text-base font-black">
                Z
              </span>
            </div>
            <span className="font-display font-black text-lg text-foreground tracking-tight">
              Zapkart
            </span>
          </Link>

          {/* Location pill — desktop */}
          <button
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border bg-muted/40 hover:bg-muted transition-colors text-sm text-foreground max-w-xs"
            type="button"
          >
            <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
            <span className="truncate text-muted-foreground">Deliver to</span>
            <span className="font-semibold truncate">Mumbai, 400001</span>
          </button>

          {/* Search bar — desktop */}
          <Link
            to="/"
            className="hidden md:flex items-center gap-2 flex-1 max-w-md px-4 py-2 rounded-full border border-input bg-muted/40 hover:bg-muted transition-colors text-sm text-muted-foreground"
          >
            <Search className="w-4 h-4 shrink-0" />
            <span>Search for groceries, snacks…</span>
          </Link>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <>
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="hidden sm:block text-xs font-semibold text-primary px-3 py-1.5 rounded-full border border-primary/30 hover:bg-primary/10 transition-colors"
                  >
                    Admin
                  </Link>
                )}
                <Link
                  to="/cart"
                  className="relative p-2 hover:bg-muted rounded-full transition-colors"
                  data-ocid="cart-icon"
                >
                  <ShoppingCart className="w-5 h-5 text-foreground" />
                  {itemCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 min-w-[18px] flex items-center justify-center rounded-full bg-primary text-primary-foreground text-[10px] font-bold leading-none px-1">
                      {itemCount > 99 ? "99+" : itemCount}
                    </span>
                  )}
                </Link>
                <button
                  type="button"
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="p-2 hover:bg-muted rounded-full transition-colors sm:hidden"
                  aria-label="Toggle menu"
                  data-ocid="hamburger-menu"
                >
                  {menuOpen ? (
                    <X className="w-5 h-5" />
                  ) : (
                    <Menu className="w-5 h-5" />
                  )}
                </button>
                <Link
                  to="/profile"
                  className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full border border-border hover:bg-muted transition-colors text-sm font-medium"
                >
                  <User className="w-4 h-4" />
                  <span>Account</span>
                </Link>
              </>
            ) : (
              <Button
                variant="default"
                size="sm"
                className="rounded-full px-4 font-semibold text-sm"
                onClick={login}
                data-ocid="login-btn"
              >
                Login
              </Button>
            )}
          </div>
        </div>

        {/* Mobile slide-down nav */}
        {menuOpen && (
          <div className="sm:hidden bg-card border-t border-border px-4 py-3 flex flex-col gap-1">
            {navLinks.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                onClick={() => setMenuOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  location.pathname === to
                    ? "bg-primary/10 text-primary"
                    : "text-foreground hover:bg-muted",
                )}
              >
                <Icon className="w-4 h-4" />
                {label}
                {to === "/cart" && itemCount > 0 && (
                  <span className="ml-auto text-xs bg-primary text-primary-foreground rounded-full px-1.5 py-0.5">
                    {itemCount}
                  </span>
                )}
              </Link>
            ))}
            {isAdmin && (
              <Link
                to="/admin"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-primary hover:bg-primary/10 transition-colors"
              >
                Admin Panel
              </Link>
            )}
            <div className="pt-2 border-t border-border mt-1">
              <button
                type="button"
                onClick={() => {
                  logout();
                  setMenuOpen(false);
                }}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors w-full"
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Main content */}
      <main className={cn("flex-1 pb-20 sm:pb-6", className)}>{children}</main>

      {/* Bottom nav — mobile only */}
      <BottomNav />
    </div>
  );
}
