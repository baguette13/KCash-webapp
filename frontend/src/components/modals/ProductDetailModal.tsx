import React, { FC } from "react";
import Modal from "./modal";
import { useCart } from "../../context/CartContext";
import { CartProduct } from "../../interfaces/interfaces";

interface ProductDetailModalProps {
  product: any;
  isOpen: boolean;
  onClose: () => void;
}

const ProductDetailModal: FC<ProductDetailModalProps> = ({ product, isOpen, onClose }) => {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    const cartProduct: CartProduct = {
      id: product.id,
      name: product.name,
      category: product.category,
      price: product.price,
      stock: product.stock,
      quantity: 1,
    };
    
    addToCart(cartProduct);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="text-white">
        <h2 className="text-2xl font-bold mb-4">{product.name}</h2>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <p className="text-gray-300 text-sm">Category</p>
            <p className="font-medium">{product.category}</p>
          </div>
          <div>
            <p className="text-gray-300 text-sm">Price</p>
            <p className="font-medium">{product.price} PLN</p>
          </div>
          <div>
            <p className="text-gray-300 text-sm">Available Stock</p>
            <p className="font-medium">{product.stock}</p>
          </div>
        </div>
        
        <div className="mt-8 flex justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 rounded-lg hover:bg-gray-700 transition-colors"
          >
            Close
          </button>
          <button
            onClick={handleAddToCart}
            className="px-4 py-2 bg-[#008ABB] rounded-lg hover:bg-[#006a8e] transition-colors"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ProductDetailModal;