import type { backendInterface, Product, UserProfile, OrderView, CartItemView } from "../backend";
import { Category, OrderStatus } from "../backend";

const now = BigInt(Date.now()) * BigInt(1_000_000);

const sampleProducts: Product[] = [
  {
    id: BigInt(1),
    name: "Fresh Whole Milk",
    description: "Farm-fresh full-fat whole milk, 1L",
    category: Category.Dairy,
    price: BigInt(6500),
    inStock: true,
    imageId: "",
    createdAt: now,
  },
  {
    id: BigInt(2),
    name: "Organic Bananas",
    description: "Ripe organic bananas, 6 pack",
    category: Category.Fruits,
    price: BigInt(4900),
    inStock: true,
    imageId: "",
    createdAt: now,
  },
  {
    id: BigInt(3),
    name: "Whole Wheat Bread",
    description: "Freshly baked whole wheat loaf",
    category: Category.Bakery,
    price: BigInt(5500),
    inStock: true,
    imageId: "",
    createdAt: now,
  },
  {
    id: BigInt(4),
    name: "Tomatoes",
    description: "Fresh ripe red tomatoes, 500g",
    category: Category.Vegetables,
    price: BigInt(3200),
    inStock: true,
    imageId: "",
    createdAt: now,
  },
  {
    id: BigInt(5),
    name: "Orange Juice",
    description: "Cold-pressed 100% natural orange juice, 500ml",
    category: Category.Beverages,
    price: BigInt(8900),
    inStock: true,
    imageId: "",
    createdAt: now,
  },
  {
    id: BigInt(6),
    name: "Potato Chips",
    description: "Crispy salted potato chips, 150g",
    category: Category.Snacks,
    price: BigInt(4500),
    inStock: false,
    imageId: "",
    createdAt: now,
  },
];

const sampleCart: CartItemView[] = [
  { productId: BigInt(1), quantity: BigInt(2) },
];

const sampleProfile: UserProfile = {
  id: { toText: () => "user-1", compareTo: () => 0 } as any,
  name: "Ravi Kumar",
  email: "ravi@example.com",
  phone: "+91 98765 43210",
  createdAt: now,
  isAdmin: false,
  savedAddresses: [
    {
      tag: "Home",
      line1: "42 MG Road",
      line2: "Apt 5B",
      city: "Bengaluru",
      pincode: "560001",
    },
  ],
};

export const mockBackend: backendInterface = {
  addToCart: async () => undefined,
  clearCart: async () => undefined,
  createProduct: async (req) => ({
    id: BigInt(99),
    ...req,
    createdAt: now,
  }),
  deleteProduct: async () => true,
  getAllOrders: async () => [],
  getAllProducts: async () => sampleProducts,
  getCart: async () => sampleCart,
  getMyOrders: async () => [],
  getOrder: async () => null,
  getProduct: async (id) => sampleProducts.find((p) => p.id === id) ?? null,
  getProductsByCategory: async (cat) =>
    sampleProducts.filter((p) => p.category === cat),
  getProfile: async () => sampleProfile,
  isAdmin: async () => false,
  placeOrder: async (req): Promise<OrderView> => ({
    id: BigInt(1),
    status: OrderStatus.Confirmed,
    deliveryAddress: req.deliveryAddress,
    deliveryFee: BigInt(1500),
    userId: sampleProfile.id,
    createdAt: now,
    estimatedDelivery: now + BigInt(20 * 60 * 1_000_000_000),
    totalAmount: BigInt(15000),
    items: [],
  }),
  removeFromCart: async () => undefined,
  searchProducts: async (name) =>
    sampleProducts.filter((p) =>
      p.name.toLowerCase().includes(name.toLowerCase())
    ),
  seedProducts: async () => undefined,
  setAdminStatus: async () => undefined,
  updateOrderStatus: async () => null,
  updateProduct: async () => null,
  updateProfile: async (req) => ({
    ...sampleProfile,
    ...req,
  }),
};
