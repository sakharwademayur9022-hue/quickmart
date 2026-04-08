import List "mo:core/List";
import Time "mo:core/Time";
import OrdersTypes "../types/orders";
import CartTypes "../types/cart";
import CatalogTypes "../types/catalog";
import Common "../types/common";

module {
  public type State = {
    orders : List.List<OrdersTypes.Order>;
    var nextOrderId : Common.OrderId;
  };

  public func newState() : State {
    {
      orders = List.empty<OrdersTypes.Order>();
      var nextOrderId = 1;
    };
  };

  public func placeOrder(
    state : State,
    userId : Common.UserId,
    cartItems : List.List<CartTypes.CartItem>,
    products : [CatalogTypes.Product],
    req : OrdersTypes.PlaceOrderRequest,
  ) : OrdersTypes.OrderView {
    // Build order items from cart + product catalog
    let orderItems = cartItems.filterMap<CartTypes.CartItem, OrdersTypes.OrderItem>(
      func(item) {
        let found = products.find(func(p : CatalogTypes.Product) : Bool { p.id == item.productId });
        switch (found) {
          case (?product) {
            ?{
              productId = item.productId;
              name = product.name;
              price = product.price;
              quantity = item.quantity;
            };
          };
          case null { null };
        };
      }
    );

    let totalAmount = orderItems.foldLeft(
      0,
      func(acc : Nat, item : OrdersTypes.OrderItem) : Nat { acc + item.price * item.quantity }
    );

    let deliveryFee : Nat = 50;
    // 30 minutes in nanoseconds
    let thirtyMinNs : Int = 30 * 60 * 1_000_000_000;
    let now = Time.now();

    let id = state.nextOrderId;
    state.nextOrderId += 1;

    let order : OrdersTypes.Order = {
      id;
      userId;
      items = orderItems.toArray();
      deliveryAddress = req.deliveryAddress;
      var status = #Confirmed;
      totalAmount;
      deliveryFee;
      estimatedDelivery = now + thirtyMinNs;
      createdAt = now;
    };
    state.orders.add(order);
    toView(order);
  };

  public func getOrder(
    state : State,
    orderId : Common.OrderId,
  ) : ?OrdersTypes.OrderView {
    let found = state.orders.find(func(o : OrdersTypes.Order) : Bool { o.id == orderId });
    switch (found) {
      case (?order) { ?toView(order) };
      case null { null };
    };
  };

  public func getUserOrders(
    state : State,
    userId : Common.UserId,
  ) : [OrdersTypes.OrderView] {
    state.orders.filter(func(o : OrdersTypes.Order) : Bool { o.userId == userId })
      .map<OrdersTypes.Order, OrdersTypes.OrderView>(func(o) { toView(o) })
      .toArray();
  };

  public func getAllOrders(state : State) : [OrdersTypes.OrderView] {
    state.orders.map<OrdersTypes.Order, OrdersTypes.OrderView>(func(o) { toView(o) }).toArray();
  };

  public func updateOrderStatus(
    state : State,
    orderId : Common.OrderId,
    status : OrdersTypes.OrderStatus,
  ) : ?OrdersTypes.OrderView {
    var updated : ?OrdersTypes.OrderView = null;
    state.orders.mapInPlace(
      func(o) {
        if (o.id == orderId) {
          o.status := status;
          updated := ?toView(o);
          o;
        } else {
          o;
        };
      }
    );
    updated;
  };

  public func toView(order : OrdersTypes.Order) : OrdersTypes.OrderView {
    {
      id = order.id;
      userId = order.userId;
      items = order.items;
      deliveryAddress = order.deliveryAddress;
      status = order.status;
      totalAmount = order.totalAmount;
      deliveryFee = order.deliveryFee;
      estimatedDelivery = order.estimatedDelivery;
      createdAt = order.createdAt;
    };
  };
};
