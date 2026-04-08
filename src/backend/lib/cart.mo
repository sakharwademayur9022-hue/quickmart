import Map "mo:core/Map";
import List "mo:core/List";
import CartTypes "../types/cart";
import Common "../types/common";

module {
  public type State = {
    carts : Map.Map<Common.UserId, List.List<CartTypes.CartItem>>;
  };

  public func newState() : State {
    { carts = Map.empty<Common.UserId, List.List<CartTypes.CartItem>>() };
  };

  func getUserCart(state : State, userId : Common.UserId) : List.List<CartTypes.CartItem> {
    switch (state.carts.get(userId)) {
      case (?list) { list };
      case null {
        let list = List.empty<CartTypes.CartItem>();
        state.carts.add(userId, list);
        list;
      };
    };
  };

  public func getCart(state : State, userId : Common.UserId) : [CartTypes.CartItemView] {
    let items = getUserCart(state, userId);
    items.map<CartTypes.CartItem, CartTypes.CartItemView>(
      func(item) { { productId = item.productId; quantity = item.quantity } }
    ).toArray();
  };

  public func addOrUpdateItem(
    state : State,
    userId : Common.UserId,
    productId : Common.ProductId,
    quantity : Nat,
  ) {
    let items = getUserCart(state, userId);
    var found = false;
    items.mapInPlace(
      func(item) {
        if (item.productId == productId) {
          found := true;
          { item with var quantity = quantity };
        } else {
          item;
        };
      }
    );
    if (not found) {
      items.add({ productId; var quantity = quantity });
    };
  };

  public func removeItem(
    state : State,
    userId : Common.UserId,
    productId : Common.ProductId,
  ) {
    let items = getUserCart(state, userId);
    let filtered = items.filter(func(item) { item.productId != productId });
    items.clear();
    items.append(filtered);
  };

  public func clearCart(state : State, userId : Common.UserId) {
    let items = getUserCart(state, userId);
    items.clear();
  };

  public func getCartItems(
    state : State,
    userId : Common.UserId,
  ) : List.List<CartTypes.CartItem> {
    getUserCart(state, userId);
  };
};
