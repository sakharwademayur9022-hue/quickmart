import Common "common";

module {
  public type Category = {
    #Fruits;
    #Vegetables;
    #Dairy;
    #Snacks;
    #Beverages;
    #Bakery;
    #Meat;
    #PersonalCare;
    #Household;
  };

  public type Product = {
    id : Common.ProductId;
    name : Text;
    description : Text;
    price : Nat; // in paise/cents (smallest unit)
    category : Category;
    imageId : Text;
    inStock : Bool;
    createdAt : Common.Timestamp;
  };

  public type CreateProductRequest = {
    name : Text;
    description : Text;
    price : Nat;
    category : Category;
    imageId : Text;
    inStock : Bool;
  };
};
