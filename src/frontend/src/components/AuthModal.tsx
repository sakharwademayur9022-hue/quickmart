import { Button } from "@/components/ui/button";
import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import { Shield, ShoppingBag, X, Zap } from "lucide-react";

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
  message?: string;
}

const PERKS = [
  { icon: Zap, text: "10-minute delivery to your door" },
  { icon: ShoppingBag, text: "Track orders in real-time" },
  { icon: Shield, text: "Secure & private with Internet Identity" },
];

export default function AuthModal({ open, onClose, message }: AuthModalProps) {
  const { login } = useInternetIdentity();

  if (!open) return null;

  const handleLogin = () => {
    login();
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      data-ocid="auth-modal"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-foreground/50 backdrop-blur-sm"
        role="button"
        tabIndex={0}
        onClick={onClose}
        onKeyDown={(e) => e.key === "Escape" && onClose()}
        aria-label="Close modal"
      />

      {/* Sheet */}
      <dialog
        aria-labelledby="auth-modal-title"
        open
        className="relative bg-card rounded-t-2xl sm:rounded-2xl w-full sm:max-w-sm mx-0 sm:mx-4 p-6 shadow-xl"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 hover:bg-muted rounded-full transition-colors"
          aria-label="Close"
          data-ocid="auth-modal-close"
        >
          <X className="w-4 h-4 text-muted-foreground" />
        </button>

        {/* Drag handle — mobile */}
        <div className="w-10 h-1 bg-border rounded-full mx-auto mb-5 sm:hidden" />

        <div className="flex flex-col items-center text-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
            <ShoppingBag className="w-8 h-8 text-primary" />
          </div>

          <div>
            <h2
              id="auth-modal-title"
              className="text-xl font-bold text-foreground"
            >
              Login to continue
            </h2>
            <p className="text-sm text-muted-foreground mt-1.5 max-w-xs">
              {message ?? "Sign in to add items to your cart and place orders"}
            </p>
          </div>

          <div className="w-full flex flex-col gap-2 text-left bg-muted/40 rounded-xl p-3">
            {PERKS.map(({ icon: Icon, text }) => (
              <div
                key={text}
                className="flex items-center gap-2.5 text-sm text-foreground"
              >
                <Icon className="w-4 h-4 text-primary shrink-0" />
                {text}
              </div>
            ))}
          </div>

          <Button
            className="w-full rounded-xl py-3 font-semibold text-base h-auto"
            onClick={handleLogin}
            data-ocid="auth-modal-login-btn"
          >
            Login with Internet Identity
          </Button>

          <button
            type="button"
            onClick={onClose}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            data-ocid="auth-modal-cancel"
          >
            Maybe later
          </button>
        </div>
      </dialog>
    </div>
  );
}
