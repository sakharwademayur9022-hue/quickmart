import List "mo:core/List";
import Time "mo:core/Time";
import CatalogTypes "../types/catalog";
import Common "../types/common";

module {
  public type State = {
    products : List.List<CatalogTypes.Product>;
    var nextProductId : Common.ProductId;
  };

  public func newState() : State {
    {
      products = List.empty<CatalogTypes.Product>();
      var nextProductId = 1;
    };
  };

  public func createProduct(
    state : State,
    req : CatalogTypes.CreateProductRequest,
  ) : CatalogTypes.Product {
    let id = state.nextProductId;
    state.nextProductId += 1;
    let product : CatalogTypes.Product = {
      id;
      name = req.name;
      description = req.description;
      price = req.price;
      category = req.category;
      imageId = req.imageId;
      inStock = req.inStock;
      createdAt = Time.now();
    };
    state.products.add(product);
    product;
  };

  public func updateProduct(
    state : State,
    id : Common.ProductId,
    req : CatalogTypes.CreateProductRequest,
  ) : ?CatalogTypes.Product {
    var updated : ?CatalogTypes.Product = null;
    state.products.mapInPlace(
      func(p) {
        if (p.id == id) {
          let newP : CatalogTypes.Product = {
            p with
            name = req.name;
            description = req.description;
            price = req.price;
            category = req.category;
            imageId = req.imageId;
            inStock = req.inStock;
          };
          updated := ?newP;
          newP;
        } else {
          p;
        };
      }
    );
    updated;
  };

  public func deleteProduct(state : State, id : Common.ProductId) : Bool {
    let sizeBefore = state.products.size();
    let filtered = state.products.filter(func(p) { p.id != id });
    let sizeAfter = filtered.size();
    if (sizeAfter < sizeBefore) {
      state.products.clear();
      state.products.append(filtered);
      true;
    } else {
      false;
    };
  };

  public func getProduct(state : State, id : Common.ProductId) : ?CatalogTypes.Product {
    state.products.find(func(p) { p.id == id });
  };

  public func getAllProducts(state : State) : [CatalogTypes.Product] {
    state.products.toArray();
  };

  public func getProductsByCategory(
    state : State,
    category : CatalogTypes.Category,
  ) : [CatalogTypes.Product] {
    state.products.filter(func(p) { p.category == category }).toArray();
  };

  public func searchProducts(state : State, name : Text) : [CatalogTypes.Product] {
    let lower = name.toLower();
    state.products.filter(func(p) { p.name.toLower().contains(#text lower) }).toArray();
  };
};
