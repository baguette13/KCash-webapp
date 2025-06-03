import React, { createContext, useContext, useState, ReactNode } from 'react';
import { CartProduct, CartState } from '../interfaces/interfaces';

interface CartContextType {
  cart: CartState;
  addToCart: (product: CartProduct) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  sendOrder: () => Promise<any>;
}

const initialCart: CartState = {
  products: [],
  total: 0
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cart, setCart] = useState<CartState>(initialCart);

  const calculateTotal = (products: CartProduct[]): number => {
    return products.reduce((sum, product) => {
      return sum + (parseFloat(product.price) * product.quantity);
    }, 0);
  };

  const addToCart = (product: CartProduct) => {
    setCart(prevCart => {
      const existingProduct = prevCart.products.find(p => p.id === product.id);
      
      let updatedProducts;
      if (existingProduct) {
        updatedProducts = prevCart.products.map(p => 
          p.id === product.id 
            ? { ...p, quantity: p.quantity + 1 } 
            : p
        );
      } else {
        updatedProducts = [...prevCart.products, { ...product, quantity: 1 }];
      }
      
      const total = calculateTotal(updatedProducts);
      
      return {
        products: updatedProducts,
        total
      };
    });
  };

  const removeFromCart = (productId: number) => {
    setCart(prevCart => {
      const updatedProducts = prevCart.products.filter(p => p.id !== productId);
      const total = calculateTotal(updatedProducts);
      
      return {
        products: updatedProducts,
        total
      };
    });
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCart(prevCart => {
      const updatedProducts = prevCart.products.map(p => 
        p.id === productId ? { ...p, quantity } : p
      );
      const total = calculateTotal(updatedProducts);
      
      return {
        products: updatedProducts,
        total
      };
    });
  };

  const clearCart = () => {
    setCart(initialCart);
  };

  const sendOrder = async (): Promise<any> => {
    try {
      const token = sessionStorage.getItem("access_token");
      if (!token || cart.products.length === 0) {
        return Promise.reject("No token or empty cart");
      }
      
      const userDataResponse = await fetch("http://localhost:8000/api/profile/details/", {
        headers: {
          "Authorization": `Bearer ${token}`,
        }
      });
      
      if (!userDataResponse.ok) {
        throw new Error("Failed to get user data");
      }
      
      const userData = await userDataResponse.json();
      
      const orderData = {
        user: userData.id,
        total_price: cart.total.toFixed(2),
        products: cart.products.map(product => ({
          product: { id: product.id },
          quantity: product.quantity
        }))
      };
      
      console.log("Sending order data:", JSON.stringify(orderData, null, 2));
      
      const response = await fetch("http://localhost:8000/api/orders/", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(orderData)
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Server response:", errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      clearCart();
      return result;
    } catch (error) {
      console.error("Error sending order:", error);
      throw error;
    }
  };

  return (
    <CartContext.Provider value={{ 
      cart, 
      addToCart, 
      removeFromCart, 
      updateQuantity, 
      clearCart,
      sendOrder
    }}>
      {children}
    </CartContext.Provider>
  );
};