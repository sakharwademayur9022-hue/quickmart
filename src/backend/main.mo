import CatalogLib "lib/catalog";
import UsersLib "lib/users";
import CartLib "lib/cart";
import OrdersLib "lib/orders";

import CatalogApi "mixins/catalog-api";
import UsersApi "mixins/users-api";
import CartApi "mixins/cart-api";
import OrdersApi "mixins/orders-api";
import AdminApi "mixins/admin-api";

actor {
  let catalogState = CatalogLib.newState();
  let usersState = UsersLib.newState();
  let cartState = CartLib.newState();
  let ordersState = OrdersLib.newState();

  include CatalogApi(catalogState, usersState);
  include UsersApi(usersState);
  include CartApi(cartState);
  include OrdersApi(ordersState, cartState, catalogState, usersState);
  include AdminApi(usersState, catalogState);
};
