import { FC, useEffect } from "react";
import { useState } from "react";
import { useCart } from "../../../context/CartContext";
import { FaPlus, FaMinus, FaTrash } from "react-icons/fa";

const Cart: FC = () => {
  const { cart, updateQuantity, removeFromCart, sendOrder } = useCart();
  const [orderStatus, setOrderStatus] = useState<{ message: string; isError: boolean } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePlaceOrder = async () => {
    if (cart.products.length === 0) {
      setOrderStatus({ message: "Cart is empty!", isError: true });
      return;
    }
    
    setIsSubmitting(true);
    try {
      await sendOrder();
      setOrderStatus({ message: "Order placed successfully!", isError: false });
      setTimeout(() => setOrderStatus(null), 3000);
    } catch (error) {
      setOrderStatus({ message: "Failed to place order", isError: true });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="flex flex-col space-y-6 h-full flex-1 bg-[#234164] text-white p-2 rounded-lg shadow-lg overflow-y-auto cursor-pointer"
      style={{
        scrollbarWidth: "thin",
        scrollbarColor: "#4b5563 #2c2f35",
      }}
    >
      <div>
        <h2 className="text-2xl font-bold flex justify-center pb-2">Cart</h2>
      </div>

      <div className="space-y-4">
        {cart.products.length === 0 ? (
          <div className="text-center text-gray-300 py-4">Your cart is empty</div>
        ) : (
          cart.products.map((product) => (
            <div
              key={product.id}
              className="bg-[#4DA9D9] rounded-xl shadow-md p-4 space-y-3 transform hover:scale-[1.02] transition-transform duration-200"
            >
              <div className="flex justify-between items-center">
                <p className="text-lg font-medium">{product.name}</p>
                <p className="text-lg font-medium">{product.price} PLN</p>
              </div>

              <div className="flex justify-between text-sm text-gray-300">
                Category: {product.category}
              </div>

              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => updateQuantity(product.id, product.quantity - 1)}
                    className="p-1 bg-[#008ABB] rounded-full hover:bg-[#006a8e] transition-colors"
                  >
                    <FaMinus size={10} />
                  </button>
                  <span className="text-white font-medium">{product.quantity}</span>
                  <button 
                    onClick={() => updateQuantity(product.id, product.quantity + 1)}
                    className="p-1 bg-[#008ABB] rounded-full hover:bg-[#006a8e] transition-colors"
                  >
                    <FaPlus size={10} />
                  </button>
                </div>
                <div className="flex items-center">
                  <span className="mr-2">Total: {(parseFloat(product.price) * product.quantity).toFixed(2)} PLN</span>
                  <button 
                    onClick={() => removeFromCart(product.id)}
                    className="p-1 bg-red-500 rounded-full hover:bg-red-600 transition-colors"
                  >
                    <FaTrash size={10} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {cart.products.length > 0 && (
        <div className="mt-4">
          <div className="flex justify-between font-bold text-lg mb-4">
            <span>Total</span>
            <span>{cart.total.toFixed(2)} PLN</span>
          </div>
          <button
            onClick={handlePlaceOrder}
            disabled={isSubmitting}
            className={`w-full py-2 rounded-lg bg-[#008ABB] text-white font-bold hover:bg-[#006a8e] transition-colors ${
              isSubmitting ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isSubmitting ? "Processing..." : "Place Order"}
          </button>
          
          {orderStatus && (
            <div className={`mt-2 p-2 rounded-lg text-center ${
              orderStatus.isError ? "bg-red-500" : "bg-green-500"
            }`}>
              {orderStatus.message}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Cart;