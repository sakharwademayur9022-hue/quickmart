import Common "common";
import UsersTypes "users";

module {
  public type OrderStatus = {
    #Confirmed;
    #InTransit;
    #Delivered;
  };

  public type OrderItem = {
    productId : Common.ProductId;
    name : Text;
    price : Nat;
    quantity : Nat;
  };

  public type Order = {
    id : Common.OrderId;
    userId : Common.UserId;
    items : [OrderItem];
    deliveryAddress : UsersTypes.Address;
    var status : OrderStatus;
    totalAmount : Nat;
    deliveryFee : Nat;
    estimatedDelivery : Common.Timestamp;
    createdAt : Common.Timestamp;
  };

  public type OrderView = {
    id : Common.OrderId;
    userId : Common.UserId;
    items : [OrderItem];
    deliveryAddress : UsersTypes.Address;
    status : OrderStatus;
    totalAmount : Nat;
    deliveryFee : Nat;
    estimatedDelivery : Common.Timestamp;
    createdAt : Common.Timestamp;
  };

  public type PlaceOrderRequest = {
    deliveryAddress : UsersTypes.Address;
  };
};
