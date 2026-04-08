import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Category as BackendCategory } from "../backend.d";
import type { Category } from "../types";
import { useBackendActor } from "./useBackendActor";

// Map our local string Category to backend enum
function toCategoryEnum(c: Category): BackendCategory {
  return BackendCategory[c as keyof typeof BackendCategory];
}

export function useProducts() {
  const { actor, isFetching: actorLoading } = useBackendActor();

  return useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllProducts();
    },
    enabled: !!actor && !actorLoading,
    staleTime: 30_000,
  });
}

export function useProductsByCategory(category: Category | null) {
  const { actor, isFetching: actorLoading } = useBackendActor();

  return useQuery({
    queryKey: ["products", "category", category],
    queryFn: async () => {
      if (!actor) return [];
      if (!category) {
        return actor.getAllProducts();
      }
      return actor.getProductsByCategory(toCategoryEnum(category));
    },
    enabled: !!actor && !actorLoading,
    staleTime: 30_000,
  });
}

export function useProduct(id: bigint | null) {
  const { actor, isFetching: actorLoading } = useBackendActor();

  return useQuery({
    queryKey: ["product", id?.toString()],
    queryFn: async () => {
      if (!actor || id === null) return null;
      return actor.getProduct(id);
    },
    enabled: !!actor && !actorLoading && id !== null,
  });
}

export function useSearchProducts(query: string) {
  const { actor, isFetching: actorLoading } = useBackendActor();

  return useQuery({
    queryKey: ["products", "search", query],
    queryFn: async () => {
      if (!actor || !query.trim()) return [];
      return actor.searchProducts(query);
    },
    enabled: !!actor && !actorLoading && query.trim().length > 0,
    staleTime: 10_000,
  });
}

export function useCreateProduct() {
  const { actor } = useBackendActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (product: {
      name: string;
      description: string;
      price: bigint;
      category: Category;
      imageId: string;
      inStock: boolean;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.createProduct({
        name: product.name,
        description: product.description,
        price: product.price,
        category: toCategoryEnum(product.category),
        imageId: product.imageId,
        inStock: product.inStock,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Product created successfully");
    },
    onError: () => {
      toast.error("Failed to create product");
    },
  });
}

export function useUpdateProduct() {
  const { actor } = useBackendActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (product: {
      id: bigint;
      name: string;
      description: string;
      price: bigint;
      category: Category;
      imageId: string;
      inStock: boolean;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.updateProduct(product.id, {
        name: product.name,
        description: product.description,
        price: product.price,
        category: toCategoryEnum(product.category),
        imageId: product.imageId,
        inStock: product.inStock,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Product updated successfully");
    },
    onError: () => {
      toast.error("Failed to update product");
    },
  });
}

export function useDeleteProduct() {
  const { actor } = useBackendActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Actor not available");
      return actor.deleteProduct(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Product deleted");
    },
    onError: () => {
      toast.error("Failed to delete product");
    },
  });
}

export function useSeedProducts() {
  const { actor } = useBackendActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.seedProducts();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Products seeded successfully");
    },
    onError: () => {
      toast.error("Failed to seed products");
    },
  });
}
