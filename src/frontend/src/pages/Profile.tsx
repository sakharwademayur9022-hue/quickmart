import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import {
  Home,
  LogOut,
  Mail,
  MapPin,
  Phone,
  PlusCircle,
  Trash2,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { Address } from "../backend.d";
import Layout from "../components/Layout";
import { useAuth } from "../hooks/useAuth";
import { useBackendActor } from "../hooks/useBackendActor";

// ── Address form state ────────────────────────────────────────────────────────

interface AddressForm {
  tag: string;
  line1: string;
  line2: string;
  city: string;
  pincode: string;
}

const EMPTY_ADDRESS: AddressForm = {
  tag: "",
  line1: "",
  line2: "",
  city: "",
  pincode: "",
};

// ── Skeletons ─────────────────────────────────────────────────────────────────

function ProfileSkeleton() {
  return (
    <div className="space-y-4">
      <div className="bg-card rounded-2xl border border-border p-5 space-y-3">
        <Skeleton className="h-14 w-14 rounded-full" />
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-4 w-56" />
      </div>
      <div className="bg-card rounded-2xl border border-border p-5 space-y-3">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-10 w-full rounded-xl" />
        <Skeleton className="h-10 w-full rounded-xl" />
        <Skeleton className="h-10 w-full rounded-xl" />
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function Profile() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const {
    isAuthenticated,
    isLoading: authLoading,
    profile,
    logout,
    principal,
  } = useAuth();
  const { actor } = useBackendActor();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [newAddr, setNewAddr] = useState<AddressForm>(EMPTY_ADDRESS);

  useEffect(() => {
    if (profile) {
      setName(profile.name ?? "");
      setEmail(profile.email ?? "");
      setPhone(profile.phone ?? "");
      setAddresses(profile.savedAddresses ?? []);
    }
  }, [profile]);

  useEffect(() => {
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
        savedAddresses: addresses,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      toast.success("Profile updated successfully", { icon: "✅" });
    },
    onError: () => {
      toast.error("Failed to update profile. Please try again.");
    },
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate();
  };

  const handleAddAddress = () => {
    if (
      !newAddr.tag.trim() ||
      !newAddr.line1.trim() ||
      !newAddr.city.trim() ||
      !newAddr.pincode.trim()
    ) {
      toast.error("Please fill all required address fields");
      return;
    }
    setAddresses((prev) => [...prev, newAddr]);
    setNewAddr(EMPTY_ADDRESS);
    setShowAddAddress(false);
  };

  const handleRemoveAddress = (idx: number) => {
    setAddresses((prev) => prev.filter((_, i) => i !== idx));
  };

  if (authLoading) {
    return (
      <Layout>
        <div className="max-w-2xl mx-auto px-4 py-6">
          <ProfileSkeleton />
        </div>
      </Layout>
    );
  }

  const shortPrincipal = principal
    ? `${principal.slice(0, 6)}…${principal.slice(-4)}`
    : "";

  return (
    <Layout>
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
        {/* Avatar + identity card */}
        <div className="bg-card rounded-2xl border border-border p-5">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-primary/15 flex items-center justify-center shrink-0">
              <User className="w-7 h-7 text-primary" />
            </div>
            <div className="min-w-0">
              <h1 className="text-lg font-black text-foreground font-display truncate">
                {profile?.name || "Your Account"}
              </h1>
              <p className="text-xs text-muted-foreground mt-0.5 truncate">
                Principal: {shortPrincipal}
              </p>
            </div>
          </div>
        </div>

        {/* Edit profile form */}
        <form
          onSubmit={handleSave}
          className="bg-card rounded-2xl border border-border p-5 space-y-4"
        >
          <h2 className="text-sm font-bold text-foreground">
            Personal Information
          </h2>

          <div className="space-y-1">
            <Label
              htmlFor="name"
              className="text-xs font-semibold text-muted-foreground uppercase tracking-wide"
            >
              Full Name
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your full name"
                className="pl-9 rounded-xl"
                data-ocid="profile-name-input"
              />
            </div>
          </div>

          <div className="space-y-1">
            <Label
              htmlFor="email"
              className="text-xs font-semibold text-muted-foreground uppercase tracking-wide"
            >
              Email
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="pl-9 rounded-xl"
                data-ocid="profile-email-input"
              />
            </div>
          </div>

          <div className="space-y-1">
            <Label
              htmlFor="phone"
              className="text-xs font-semibold text-muted-foreground uppercase tracking-wide"
            >
              Phone
            </Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="pl-9 rounded-xl"
                data-ocid="profile-phone-input"
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full rounded-full font-bold"
            disabled={updateMutation.isPending}
            data-ocid="save-profile-btn"
          >
            {updateMutation.isPending ? "Saving…" : "Save Changes"}
          </Button>
        </form>

        {/* Saved addresses */}
        <div className="bg-card rounded-2xl border border-border overflow-hidden">
          <div className="px-5 py-3.5 border-b border-border bg-muted/30 flex items-center justify-between">
            <h2 className="text-sm font-bold text-foreground">
              Saved Addresses
            </h2>
            <button
              type="button"
              onClick={() => setShowAddAddress((v) => !v)}
              className="flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary/80 transition-colors"
              data-ocid="add-address-btn"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              Add New
            </button>
          </div>

          {/* Add address form */}
          {showAddAddress && (
            <div className="px-5 py-4 border-b border-border bg-muted/20 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Tag *</Label>
                  <Input
                    value={newAddr.tag}
                    onChange={(e) =>
                      setNewAddr((a) => ({ ...a, tag: e.target.value }))
                    }
                    placeholder="Home, Work…"
                    className="rounded-xl text-sm"
                    data-ocid="addr-tag-input"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">
                    Pincode *
                  </Label>
                  <Input
                    value={newAddr.pincode}
                    onChange={(e) =>
                      setNewAddr((a) => ({ ...a, pincode: e.target.value }))
                    }
                    placeholder="400001"
                    className="rounded-xl text-sm"
                    data-ocid="addr-pincode-input"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">
                  Address Line 1 *
                </Label>
                <Input
                  value={newAddr.line1}
                  onChange={(e) =>
                    setNewAddr((a) => ({ ...a, line1: e.target.value }))
                  }
                  placeholder="Flat no., Building name"
                  className="rounded-xl text-sm"
                  data-ocid="addr-line1-input"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">
                  Address Line 2
                </Label>
                <Input
                  value={newAddr.line2}
                  onChange={(e) =>
                    setNewAddr((a) => ({ ...a, line2: e.target.value }))
                  }
                  placeholder="Street, Locality"
                  className="rounded-xl text-sm"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">City *</Label>
                <Input
                  value={newAddr.city}
                  onChange={(e) =>
                    setNewAddr((a) => ({ ...a, city: e.target.value }))
                  }
                  placeholder="Mumbai"
                  className="rounded-xl text-sm"
                  data-ocid="addr-city-input"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="rounded-full"
                  onClick={() => {
                    setShowAddAddress(false);
                    setNewAddr(EMPTY_ADDRESS);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  size="sm"
                  className="rounded-full font-semibold"
                  onClick={handleAddAddress}
                  data-ocid="confirm-add-address-btn"
                >
                  Add Address
                </Button>
              </div>
            </div>
          )}

          {/* Address list */}
          {addresses.length === 0 ? (
            <div className="flex flex-col items-center py-10 gap-3 text-center px-4">
              <div className="w-12 h-12 rounded-full bg-muted/60 flex items-center justify-center">
                <MapPin className="w-6 h-6 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">
                No saved addresses yet
              </p>
            </div>
          ) : (
            addresses.map((addr, idx) => (
              <div
                key={`${addr.tag}-${addr.pincode}-${idx}`}
                className="flex items-start gap-3 px-5 py-4 border-b border-border last:border-0"
                data-ocid="address-row"
              >
                <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                  <Home className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-accent-foreground uppercase tracking-wide mb-0.5">
                    {addr.tag}
                  </p>
                  <p className="text-sm text-foreground">{addr.line1}</p>
                  {addr.line2 && (
                    <p className="text-sm text-muted-foreground">
                      {addr.line2}
                    </p>
                  )}
                  <p className="text-sm text-muted-foreground">
                    {addr.city} – {addr.pincode}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveAddress(idx)}
                  className="p-1.5 rounded-lg hover:bg-destructive/10 transition-colors text-muted-foreground hover:text-destructive"
                  aria-label="Remove address"
                  data-ocid="remove-address-btn"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        <Separator />

        {/* Logout */}
        <Button
          variant="outline"
          className="w-full rounded-full font-semibold text-destructive border-destructive/30 hover:bg-destructive/10 gap-2"
          onClick={logout}
          data-ocid="logout-btn"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </Button>
      </div>
    </Layout>
  );
}
