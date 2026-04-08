import { d as useBackendActor, e as useQuery, f as useMutation } from "./Layout-2vXxPoTN.js";
import { f as useQueryClient, d as ue } from "./index-DJsfyEPD.js";
import { C as Category } from "./backend.d-C2Aaw6C6.js";
function toCategoryEnum(c) {
  return Category[c];
}
function useProducts() {
  const { actor, isFetching: actorLoading } = useBackendActor();
  return useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllProducts();
    },
    enabled: !!actor && !actorLoading,
    staleTime: 3e4
  });
}
function useProductsByCategory(category) {
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
    staleTime: 3e4
  });
}
function useProduct(id) {
  const { actor, isFetching: actorLoading } = useBackendActor();
  return useQuery({
    queryKey: ["product", id == null ? void 0 : id.toString()],
    queryFn: async () => {
      if (!actor || id === null) return null;
      return actor.getProduct(id);
    },
    enabled: !!actor && !actorLoading && id !== null
  });
}
function useSearchProducts(query) {
  const { actor, isFetching: actorLoading } = useBackendActor();
  return useQuery({
    queryKey: ["products", "search", query],
    queryFn: async () => {
      if (!actor || !query.trim()) return [];
      return actor.searchProducts(query);
    },
    enabled: !!actor && !actorLoading && query.trim().length > 0,
    staleTime: 1e4
  });
}
function useCreateProduct() {
  const { actor } = useBackendActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (product) => {
      if (!actor) throw new Error("Actor not available");
      return actor.createProduct({
        name: product.name,
        description: product.description,
        price: product.price,
        category: toCategoryEnum(product.category),
        imageId: product.imageId,
        inStock: product.inStock
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      ue.success("Product created successfully");
    },
    onError: () => {
      ue.error("Failed to create product");
    }
  });
}
function useUpdateProduct() {
  const { actor } = useBackendActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (product) => {
      if (!actor) throw new Error("Actor not available");
      return actor.updateProduct(product.id, {
        name: product.name,
        description: product.description,
        price: product.price,
        category: toCategoryEnum(product.category),
        imageId: product.imageId,
        inStock: product.inStock
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      ue.success("Product updated successfully");
    },
    onError: () => {
      ue.error("Failed to update product");
    }
  });
}
function useDeleteProduct() {
  const { actor } = useBackendActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      if (!actor) throw new Error("Actor not available");
      return actor.deleteProduct(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      ue.success("Product deleted");
    },
    onError: () => {
      ue.error("Failed to delete product");
    }
  });
}
export {
  useSearchProducts as a,
  useProduct as b,
  useProducts as c,
  useCreateProduct as d,
  useUpdateProduct as e,
  useDeleteProduct as f,
  useProductsByCategory as u
};
