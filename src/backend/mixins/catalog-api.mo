import Runtime "mo:core/Runtime";
import CatalogLib "../lib/catalog";
import CatalogTypes "../types/catalog";
import UsersLib "../lib/users";
import Common "../types/common";

mixin (
  catalogState : CatalogLib.State,
  usersState : UsersLib.State,
) {
  public shared ({ caller }) func createProduct(
    req : CatalogTypes.CreateProductRequest
  ) : async CatalogTypes.Product {
    if (not UsersLib.isAdmin(usersState, caller)) {
      Runtime.trap("Unauthorized: admin only");
    };
    CatalogLib.createProduct(catalogState, req);
  };

  public shared ({ caller }) func updateProduct(
    id : Common.ProductId,
    req : CatalogTypes.CreateProductRequest,
  ) : async ?CatalogTypes.Product {
    if (not UsersLib.isAdmin(usersState, caller)) {
      Runtime.trap("Unauthorized: admin only");
    };
    CatalogLib.updateProduct(catalogState, id, req);
  };

  public shared ({ caller }) func deleteProduct(id : Common.ProductId) : async Bool {
    if (not UsersLib.isAdmin(usersState, caller)) {
      Runtime.trap("Unauthorized: admin only");
    };
    CatalogLib.deleteProduct(catalogState, id);
  };

  public query func getProduct(id : Common.ProductId) : async ?CatalogTypes.Product {
    CatalogLib.getProduct(catalogState, id);
  };

  public query func getAllProducts() : async [CatalogTypes.Product] {
    CatalogLib.getAllProducts(catalogState);
  };

  public query func getProductsByCategory(
    category : CatalogTypes.Category
  ) : async [CatalogTypes.Product] {
    CatalogLib.getProductsByCategory(catalogState, category);
  };

  public query func searchProducts(name : Text) : async [CatalogTypes.Product] {
    CatalogLib.searchProducts(catalogState, name);
  };
};
