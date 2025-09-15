export interface Product {
  id: string
  name: string
  type: string
  color: string
  brand: string
  description: string
  price: number
  salePrice?: number | null
  stockQuantity: number
  images: string[]
  videos?: string[]  // New field for videos
  categoryName: string
  categoryId?: string
  size?: string
  concentration?: string
  isActive: boolean
  isFeatured: boolean
  sku?: string
  weight?: number
  tags?: string[]
  categoryIds?: string[]
  shortDescription?: string
  createdAt?: string
  updatedAt?: string
}

export interface CartItem {
  id: string
  productId: string
  product?: Product
  quantity: number
  createdAt?: string
  updatedAt?: string
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: 'CUSTOMER' | 'ADMIN' | 'STAFF';
  isActive: boolean;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: Date;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}

export interface PaymentMethod {
  id: string;
  name: string;
  type: 'momo' | 'bk';
  accountNumber: string;
  accountName: string;
  description: string;
  icon: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  image: string;
  productCount: number;
  slug: string;
}

export interface Testimonial {
  id: string;
  name: string;
  rating: number;
  comment: string;
  product: string;
  date: Date;
  avatar?: string;
} 