var Category = /* @__PURE__ */ ((Category2) => {
  Category2["Meat"] = "Meat";
  Category2["Beverages"] = "Beverages";
  Category2["Dairy"] = "Dairy";
  Category2["Bakery"] = "Bakery";
  Category2["Household"] = "Household";
  Category2["PersonalCare"] = "PersonalCare";
  Category2["Vegetables"] = "Vegetables";
  Category2["Snacks"] = "Snacks";
  Category2["Fruits"] = "Fruits";
  return Category2;
})(Category || {});
var OrderStatus = /* @__PURE__ */ ((OrderStatus2) => {
  OrderStatus2["InTransit"] = "InTransit";
  OrderStatus2["Delivered"] = "Delivered";
  OrderStatus2["Confirmed"] = "Confirmed";
  return OrderStatus2;
})(OrderStatus || {});
export {
  Category as C,
  OrderStatus as O
};
