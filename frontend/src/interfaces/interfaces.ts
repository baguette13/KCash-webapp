export interface UserDetails {
  email: string;
  first_name: string;
  id: number;
  last_name: string;
  username: string;
  is_staff?: boolean;
}

export interface CartProduct {
  id: number;
  name: string;
  category: string;
  price: string;
  stock: string;
  quantity: number;
}

export interface CartState {
  products: CartProduct[];
  total: number;
}

export interface Order {
  id: number;
  user: number;
  user_details: UserDetails;
  products: OrderItem[];
  total_price: string;
  status: 'Pending' | 'Completed';
  created_at: string;
}

export interface OrderItem {
  product: CartProduct;
  quantity: number;
}
