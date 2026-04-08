import Common "common";

module {
  public type CartItem = {
    productId : Common.ProductId;
    var quantity : Nat;
  };

  public type CartItemView = {
    productId : Common.ProductId;
    quantity : Nat;
  };
};
