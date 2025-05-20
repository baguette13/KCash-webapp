export interface UserDetails {
  email: string;
  first_name: string;
  id: number;
  last_name: string;
  username: string;
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
