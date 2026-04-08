import Time "mo:core/Time";
import CatalogLib "catalog";
import CatalogTypes "../types/catalog";

module {
  public func seedProducts(catalogState : CatalogLib.State) {
    // Only seed if no products exist
    if (catalogState.products.size() > 0) {
      return;
    };

    let now = Time.now();
    let sampleProducts : [(Text, Text, Nat, CatalogTypes.Category, Text)] = [
      // (name, description, price in paise, category, imageId)
      ("Amul Fresh Milk 1L", "Fresh pasteurized cow milk", 6500, #Dairy, "milk-amul"),
      ("Amul Butter 500g", "Creamy salted butter", 28000, #Dairy, "butter-amul"),
      ("Paneer 200g", "Fresh homemade-style paneer", 9000, #Dairy, "paneer"),
      ("Banana (12 pcs)", "Fresh ripe yellow bananas", 4500, #Fruits, "banana"),
      ("Apple Royal Gala 1kg", "Fresh imported royal gala apples", 17000, #Fruits, "apple"),
      ("Mango Alphonso 1kg", "Premium alphonso mangoes", 32000, #Fruits, "mango"),
      ("Tomato 1kg", "Farm fresh red tomatoes", 3500, #Vegetables, "tomato"),
      ("Onion 1kg", "Fresh onions", 3000, #Vegetables, "onion"),
      ("Spinach 250g", "Fresh washed spinach leaves", 2500, #Vegetables, "spinach"),
      ("Potato 1kg", "Fresh potatoes", 2800, #Vegetables, "potato"),
      ("Lays Classic Salted 52g", "Classic potato chips", 2000, #Snacks, "lays-classic"),
      ("Kurkure Masala Munch 90g", "Crunchy corn puffs", 2000, #Snacks, "kurkure"),
      ("Britannia Good Day Cookies 200g", "Butter cookies", 3500, #Snacks, "good-day"),
      ("Haldirams Bhujia 200g", "Crispy spicy bhujia", 4000, #Snacks, "bhujia"),
      ("Coca Cola 500ml", "Refreshing cola drink", 4500, #Beverages, "coca-cola"),
      ("Minute Maid Orange 1L", "Natural orange juice", 9000, #Beverages, "minute-maid"),
      ("Red Bull 250ml", "Energy drink", 11000, #Beverages, "red-bull"),
      ("Britannia Bread White 400g", "Soft white sandwich bread", 4500, #Bakery, "white-bread"),
      ("Dove Soap 100g", "Moisturizing beauty bar", 6500, #PersonalCare, "dove-soap"),
      ("Vim Dishwash Liquid 500ml", "Grease-cutting dish liquid", 8000, #Household, "vim-dish"),
      ("Ariel Detergent 1kg", "Laundry detergent powder", 27000, #Household, "ariel"),
      ("Chicken Breast Boneless 500g", "Fresh boneless chicken breast", 18000, #Meat, "chicken-breast"),
    ];

    for ((name, desc, price, cat, imgId) in sampleProducts.values()) {
      let id = catalogState.nextProductId;
      catalogState.nextProductId += 1;
      let product : CatalogTypes.Product = {
        id;
        name;
        description = desc;
        price;
        category = cat;
        imageId = imgId;
        inStock = true;
        createdAt = now;
      };
      catalogState.products.add(product);
    };
  };
};
