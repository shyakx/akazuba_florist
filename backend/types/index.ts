export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: 'flowers' | 'bouquets';
  featured: boolean;
  description: string;
  shortDescription?: string;
  originalPrice?: number;
  rating?: number;
  reviews?: number;
  inStock?: boolean;
  discount?: number;
  tags?: string[];
  weight?: string;
  dimensions?: string;
  color?: string;
  type?: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'customer' | 'admin';
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