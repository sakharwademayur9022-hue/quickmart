import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAuth } from "./useAuth";
import { useBackendActor } from "./useBackendActor";

export function useCart() {
  const { actor, isFetching: actorLoading } = useBackendActor();
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  const { data: cartItems = [], isLoading } = useQuery({
    queryKey: ["cart"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getCart();
    },
    enabled: isAuthenticated && !!actor && !actorLoading,
    staleTime: 10_000,
  });

  const addToCartMutation = useMutation({
    mutationFn: async ({
      productId,
      quantity,
    }: { productId: bigint; quantity: bigint }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.addToCart(productId, quantity);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: () => {
      toast.error("Failed to add item to cart");
    },
  });

  const removeFromCartMutation = useMutation({
    mutationFn: async (productId: bigint) => {
      if (!actor) throw new Error("Actor not available");
      return actor.removeFromCart(productId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: () => {
      toast.error("Failed to remove item from cart");
    },
  });

  const clearCartMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.clearCart();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  const addToCart = (productId: bigint, productName: string, quantity = 1n) => {
    if (!isAuthenticated) return false;
    addToCartMutation.mutate({ productId, quantity });
    toast.success(`${productName} added to cart`, {
      duration: 2000,
      icon: "🛒",
    });
    return true;
  };

  const removeFromCart = (productId: bigint) => {
    removeFromCartMutation.mutate(productId);
  };

  const clearCart = () => {
    clearCartMutation.mutate();
  };

  const itemCount = cartItems.reduce(
    (sum: number, item: { quantity: bigint }) => sum + Number(item.quantity),
    0,
  );

  const getItemQuantity = (productId: bigint): number => {
    const item = (
      cartItems as Array<{ productId: bigint; quantity: bigint }>
    ).find((i) => i.productId === productId);
    return item ? Number(item.quantity) : 0;
  };

  return {
    cartItems,
    itemCount,
    isLoading,
    isAdding: addToCartMutation.isPending,
    addToCart,
    removeFromCart,
    clearCart,
    getItemQuantity,
  };
}
