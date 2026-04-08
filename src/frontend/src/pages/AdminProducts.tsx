import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "@tanstack/react-router";
import { Package, Pencil, Plus, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import EmptyState from "../components/EmptyState";
import Layout from "../components/Layout";
import { useAuth } from "../hooks/useAuth";
import {
  useCreateProduct,
  useDeleteProduct,
  useProducts,
  useUpdateProduct,
} from "../hooks/useProducts";
import type { Category, Product } from "../types";

const CATEGORIES: Category[] = [
  "Fruits",
  "Vegetables",
  "Dairy",
  "Snacks",
  "Beverages",
  "Bakery",
  "Meat",
  "PersonalCare",
  "Household",
];

const CATEGORY_LABELS: Record<Category, string> = {
  Fruits: "🍎 Fruits",
  Vegetables: "🥦 Vegetables",
  Dairy: "🥛 Dairy",
  Snacks: "🍿 Snacks",
  Beverages: "🧃 Beverages",
  Bakery: "🍞 Bakery",
  Meat: "🥩 Meat",
  PersonalCare: "🧴 Personal Care",
  Household: "🏠 Household",
};

interface FormValues {
  name: string;
  description: string;
  price: string;
  category: Category;
  imageId: string;
  inStock: boolean;
}

const DEFAULT_FORM: FormValues = {
  name: "",
  description: "",
  price: "",
  category: "Fruits",
  imageId: "",
  inStock: true,
};

function ProductFormPanel({
  initial,
  onClose,
  onSubmit,
  submitting,
}: {
  initial?: Product | null;
  onClose: () => void;
  onSubmit: (values: FormValues) => void;
  submitting: boolean;
}) {
  const [form, setForm] = useState<FormValues>(
    initial
      ? {
          name: initial.name,
          description: initial.description,
          price: (Number(initial.price) / 100).toFixed(2),
          category: initial.category,
          imageId: initial.imageId,
          inStock: initial.inStock,
        }
      : DEFAULT_FORM,
  );

  function set<K extends keyof FormValues>(key: K, value: FormValues[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-foreground/20 backdrop-blur-sm p-4">
      <Card className="w-full max-w-lg border-border shadow-xl">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-black text-lg text-foreground">
              {initial ? "Edit Product" : "Add New Product"}
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-full hover:bg-muted transition-colors"
              aria-label="Close"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              onSubmit(form);
            }}
            className="space-y-4"
          >
            <div className="space-y-1">
              <Label htmlFor="prod-name">Name *</Label>
              <Input
                id="prod-name"
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                placeholder="e.g. Organic Bananas"
                required
                data-ocid="product-name-input"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="prod-desc">Description</Label>
              <Textarea
                id="prod-desc"
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
                placeholder="Short product description"
                rows={2}
                data-ocid="product-description-input"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="prod-price">Price (₹) *</Label>
                <Input
                  id="prod-price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.price}
                  onChange={(e) => set("price", e.target.value)}
                  placeholder="49.00"
                  required
                  data-ocid="product-price-input"
                />
              </div>
              <div className="space-y-1">
                <Label>Category *</Label>
                <Select
                  value={form.category}
                  onValueChange={(v) => set("category", v as Category)}
                >
                  <SelectTrigger data-ocid="product-category-select">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {CATEGORY_LABELS[cat]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="prod-image">Image ID</Label>
              <Input
                id="prod-image"
                value={form.imageId}
                onChange={(e) => set("imageId", e.target.value)}
                placeholder="asset-slug or URL"
                data-ocid="product-image-input"
              />
            </div>

            <div className="flex items-center gap-2 pt-1">
              <Checkbox
                id="prod-instock"
                checked={form.inStock}
                onCheckedChange={(v) => set("inStock", !!v)}
                data-ocid="product-instock-checkbox"
              />
              <Label htmlFor="prod-instock" className="cursor-pointer">
                In Stock
              </Label>
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                type="submit"
                disabled={submitting}
                className="flex-1 rounded-full font-semibold"
                data-ocid="product-form-submit"
              >
                {submitting
                  ? "Saving…"
                  : initial
                    ? "Save Changes"
                    : "Create Product"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="rounded-full"
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

function ProductRow({
  product,
  onEdit,
  onDelete,
}: {
  product: Product;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div
      className="flex items-center gap-3 px-4 py-3 border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
      data-ocid="product-row"
    >
      {/* Image placeholder */}
      <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
        <Package className="w-5 h-5 text-muted-foreground" />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm text-foreground truncate">
          {product.name}
        </p>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-xs text-muted-foreground">
            {CATEGORY_LABELS[product.category]}
          </span>
          <span className="text-xs font-bold text-foreground">
            ₹{(Number(product.price) / 100).toFixed(0)}
          </span>
        </div>
      </div>

      {/* Stock badge */}
      <Badge
        variant={product.inStock ? "default" : "secondary"}
        className={`text-xs shrink-0 ${product.inStock ? "bg-primary/15 text-primary border-primary/20" : ""}`}
      >
        {product.inStock ? "In Stock" : "Out"}
      </Badge>

      {/* Actions */}
      <div className="flex items-center gap-1 shrink-0">
        <button
          type="button"
          onClick={onEdit}
          className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Edit product"
          data-ocid="product-edit-btn"
        >
          <Pencil className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={onDelete}
          className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
          aria-label="Delete product"
          data-ocid="product-delete-btn"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

export default function AdminProducts() {
  const { isAdmin, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { data: products, isLoading: productsLoading } = useProducts();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();

  const [panelOpen, setPanelOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Product | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);

  useEffect(() => {
    if (!authLoading && !isAdmin) navigate({ to: "/" });
  }, [isAdmin, authLoading, navigate]);

  if (authLoading || !isAdmin) return null;

  function openAdd() {
    setEditTarget(null);
    setPanelOpen(true);
  }

  function openEdit(product: Product) {
    setEditTarget(product);
    setPanelOpen(true);
  }

  async function handleSubmit(values: FormValues) {
    const pricePaise = BigInt(
      Math.round(Number.parseFloat(values.price) * 100),
    );
    if (editTarget) {
      await updateProduct.mutateAsync({
        id: editTarget.id,
        name: values.name,
        description: values.description,
        price: pricePaise,
        category: values.category,
        imageId: values.imageId,
        inStock: values.inStock,
      });
    } else {
      await createProduct.mutateAsync({
        name: values.name,
        description: values.description,
        price: pricePaise,
        category: values.category,
        imageId: values.imageId,
        inStock: values.inStock,
      });
    }
    setPanelOpen(false);
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    await deleteProduct.mutateAsync(deleteTarget.id);
    setDeleteTarget(null);
  }

  const submitting = createProduct.isPending || updateProduct.isPending;

  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-black text-foreground tracking-tight">
              Products
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {products?.length ?? 0} items in catalogue
            </p>
          </div>
          <Button
            onClick={openAdd}
            className="rounded-full font-semibold gap-2"
            data-ocid="add-product-btn"
          >
            <Plus className="w-4 h-4" />
            Add Product
          </Button>
        </div>

        {/* Products list */}
        <Card className="border-border overflow-hidden">
          <CardContent className="p-0">
            {productsLoading ? (
              <div className="space-y-0">
                {Array.from({ length: 5 }, (_, i) => `sk-${i}`).map((k) => (
                  <div
                    key={k}
                    className="flex items-center gap-3 px-4 py-3 border-b border-border last:border-0"
                  >
                    <Skeleton className="w-10 h-10 rounded-lg" />
                    <div className="flex-1 space-y-1.5">
                      <Skeleton className="h-4 w-48" />
                      <Skeleton className="h-3 w-32" />
                    </div>
                    <Skeleton className="h-5 w-16 rounded-full" />
                  </div>
                ))}
              </div>
            ) : !products?.length ? (
              <EmptyState
                variant="products"
                description="No products yet. Click 'Add Product' to get started."
                ctaLabel="Add First Product"
                onCta={openAdd}
              />
            ) : (
              products.map((product) => (
                <ProductRow
                  key={product.id.toString()}
                  product={product}
                  onEdit={() => openEdit(product)}
                  onDelete={() => setDeleteTarget(product)}
                />
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {/* Product form panel */}
      {panelOpen && (
        <ProductFormPanel
          initial={editTarget}
          onClose={() => setPanelOpen(false)}
          onSubmit={handleSubmit}
          submitting={submitting}
        />
      )}

      {/* Delete confirmation */}
      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete product?</AlertDialogTitle>
            <AlertDialogDescription>
              <strong>{deleteTarget?.name}</strong> will be permanently removed
              from the catalogue. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              data-ocid="confirm-delete-btn"
            >
              {deleteProduct.isPending ? "Deleting…" : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Layout>
  );
}
