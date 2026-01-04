
export enum UserRole {
  ADMIN = 'admin',
  KASIR = 'kasir'
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
}

export interface Product {
  id: number;
  name: string;
  stock: number;
  price: number;
  category: string;
}

export interface TransactionDetail {
  id: string;
  productId: number;
  productName: string;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface Transaction {
  id: string;
  userId: number;
  userName: string;
  items: TransactionDetail[];
  totalPrice: number;
  discount: number;
  finalPrice: number;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}
