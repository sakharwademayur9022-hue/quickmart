export type Category =
  | "Fruits"
  | "Vegetables"
  | "Dairy"
  | "Snacks"
  | "Beverages"
  | "Bakery"
  | "Meat"
  | "PersonalCare"
  | "Household";

export type OrderStatus = "Confirmed" | "InTransit" | "Delivered";

export interface Address {
  tag: string;
  line1: string;
  line2: string;
  city: string;
  pincode: string;
}

export interface Product {
  id: bigint;
  name: string;
  description: string;
  price: bigint;
  category: Category;
  imageId: string;
  inStock: boolean;
  createdAt: bigint;
}

export interface CartItem {
  productId: bigint;
  quantity: bigint;
  product?: Product;
}

export interface OrderItem {
  productId: bigint;
  name: string;
  price: bigint;
  quantity: bigint;
}

export interface Order {
  id: bigint;
  userId: string;
  items: OrderItem[];
  deliveryAddress: Address;
  status: OrderStatus;
  totalAmount: bigint;
  deliveryFee: bigint;
  estimatedDelivery: bigint;
  createdAt: bigint;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  savedAddresses: Address[];
  createdAt: bigint;
  isAdmin: boolean;
}

export interface CartState {
  items: CartItem[];
  totalAmount: number;
  itemCount: number;
}
