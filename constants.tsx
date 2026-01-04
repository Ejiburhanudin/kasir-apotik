
import { Product, User, UserRole } from './types';

export const INITIAL_PRODUCTS: Product[] = [
  { id: 1, name: "Paracetamol 500mg", stock: 100, price: 5000, category: "Obat Bebas" },
  { id: 2, name: "Amoxicillin 500mg", stock: 50, price: 12000, category: "Antibiotik" },
  { id: 3, name: "Cetirizine Syrup", stock: 30, price: 25000, category: "Antihistamin" },
  { id: 4, name: "Vitamin C 1000mg", stock: 200, price: 1500, category: "Suplemen" },
  { id: 5, name: "Antacid Doen", stock: 80, price: 3000, category: "Obat Lambung" },
];

export const MOCK_USERS: User[] = [
  { id: 1, name: "Administrator", email: "admin@apotek.com", role: UserRole.ADMIN },
  { id: 2, name: "Budi Kasir", email: "kasir@apotek.com", role: UserRole.KASIR },
];

export const DISCOUNT_THRESHOLD = 100000;
export const DISCOUNT_PERCENTAGE = 0.10; // 10%
