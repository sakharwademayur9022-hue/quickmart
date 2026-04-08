import Runtime "mo:core/Runtime";
import OrdersLib "../lib/orders";
import CartLib "../lib/cart";
import CatalogLib "../lib/catalog";
import UsersLib "../lib/users";
import OrdersTypes "../types/orders";
import Common "../types/common";

mixin (
  ordersState : OrdersLib.State,
  cartState : CartLib.State,
  catalogState : CatalogLib.State,
  usersState : UsersLib.State,
) {
  public shared ({ caller }) func placeOrder(
    req : OrdersTypes.PlaceOrderRequest
  ) : async OrdersTypes.OrderView {
    let cartItems = CartLib.getCartItems(cartState, caller);
    if (cartItems.size() == 0) {
      Runtime.trap("Cart is empty");
    };
    let products = CatalogLib.getAllProducts(catalogState);
    let orderView = OrdersLib.placeOrder(ordersState, caller, cartItems, products, req);
    // Clear cart after successful order
    CartLib.clearCart(cartState, caller);
    orderView;
  };

  public query ({ caller }) func getMyOrders() : async [OrdersTypes.OrderView] {
    OrdersLib.getUserOrders(ordersState, caller);
  };

  public query ({ caller }) func getOrder(orderId : Common.OrderId) : async ?OrdersTypes.OrderView {
    OrdersLib.getOrder(ordersState, orderId);
  };

  public shared ({ caller }) func updateOrderStatus(
    orderId : Common.OrderId,
    status : OrdersTypes.OrderStatus,
  ) : async ?OrdersTypes.OrderView {
    if (not UsersLib.isAdmin(usersState, caller)) {
      Runtime.trap("Unauthorized: admin only");
    };
    OrdersLib.updateOrderStatus(ordersState, orderId, status);
  };

  public query ({ caller }) func getAllOrders() : async [OrdersTypes.OrderView] {
    if (not UsersLib.isAdmin(usersState, caller)) {
      Runtime.trap("Unauthorized: admin only");
    };
    OrdersLib.getAllOrders(ordersState);
  };
};
