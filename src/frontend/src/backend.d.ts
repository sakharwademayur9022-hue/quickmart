import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface PlaceOrderRequest {
    deliveryAddress: Address;
}
export type Timestamp = bigint;
export interface UserProfile {
    id: UserId;
    name: string;
    createdAt: Timestamp;
    savedAddresses: Array<Address>;
    email: string;
    isAdmin: boolean;
    phone: string;
}
export interface Product {
    id: ProductId;
    inStock: boolean;
    name: string;
    createdAt: Timestamp;
    description: string;
    category: Category;
    imageId: string;
    price: bigint;
}
export interface Address {
    tag: string;
    city: string;
    line1: string;
    line2: string;
    pincode: string;
}
export interface OrderItem {
    name: string;
    productId: ProductId;
    quantity: bigint;
    price: bigint;
}
export type UserId = Principal;
export interface UpdateProfileRequest {
    name: string;
    savedAddresses: Array<Address>;
    email: string;
    phone: string;
}
export interface CreateProductRequest {
    inStock: boolean;
    name: string;
    description: string;
    category: Category;
    imageId: string;
    price: bigint;
}
export interface CartItemView {
    productId: ProductId;
    quantity: bigint;
}
export type ProductId = bigint;
export type OrderId = bigint;
export interface OrderView {
    id: OrderId;
    status: OrderStatus;
    deliveryAddress: Address;
    deliveryFee: bigint;
    userId: UserId;
    createdAt: Timestamp;
    estimatedDelivery: Timestamp;
    totalAmount: bigint;
    items: Array<OrderItem>;
}
export enum Category {
    Meat = "Meat",
    Beverages = "Beverages",
    Dairy = "Dairy",
    Bakery = "Bakery",
    Household = "Household",
    PersonalCare = "PersonalCare",
    Vegetables = "Vegetables",
    Snacks = "Snacks",
    Fruits = "Fruits"
}
export enum OrderStatus {
    InTransit = "InTransit",
    Delivered = "Delivered",
    Confirmed = "Confirmed"
}
export interface backendInterface {
    addToCart(productId: ProductId, quantity: bigint): Promise<void>;
    clearCart(): Promise<void>;
    createProduct(req: CreateProductRequest): Promise<Product>;
    deleteProduct(id: ProductId): Promise<boolean>;
    getAllOrders(): Promise<Array<OrderView>>;
    getAllProducts(): Promise<Array<Product>>;
    getCart(): Promise<Array<CartItemView>>;
    getMyOrders(): Promise<Array<OrderView>>;
    getOrder(orderId: OrderId): Promise<OrderView | null>;
    getProduct(id: ProductId): Promise<Product | null>;
    getProductsByCategory(category: Category): Promise<Array<Product>>;
    getProfile(): Promise<UserProfile | null>;
    isAdmin(): Promise<boolean>;
    placeOrder(req: PlaceOrderRequest): Promise<OrderView>;
    removeFromCart(productId: ProductId): Promise<void>;
    searchProducts(name: string): Promise<Array<Product>>;
    seedProducts(): Promise<void>;
    setAdminStatus(target: UserId, adminStatus: boolean): Promise<void>;
    updateOrderStatus(orderId: OrderId, status: OrderStatus): Promise<OrderView | null>;
    updateProduct(id: ProductId, req: CreateProductRequest): Promise<Product | null>;
    updateProfile(req: UpdateProfileRequest): Promise<UserProfile>;
}
