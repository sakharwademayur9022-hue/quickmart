import CartLib "../lib/cart";
import CartTypes "../types/cart";
import Common "../types/common";

mixin (cartState : CartLib.State) {
  public query ({ caller }) func getCart() : async [CartTypes.CartItemView] {
    CartLib.getCart(cartState, caller);
  };

  public shared ({ caller }) func addToCart(
    productId : Common.ProductId,
    quantity : Nat,
  ) : async () {
    CartLib.addOrUpdateItem(cartState, caller, productId, quantity);
  };

  public shared ({ caller }) func removeFromCart(productId : Common.ProductId) : async () {
    CartLib.removeItem(cartState, caller, productId);
  };

  public shared ({ caller }) func clearCart() : async () {
    CartLib.clearCart(cartState, caller);
  };
};
