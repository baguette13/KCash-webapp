import { FC } from "react";
import { FaShoppingCart } from "react-icons/fa";
import { useCart } from "../../context/CartContext";
import { CartProduct } from "../../interfaces/interfaces";

interface ProductProps {
  id: number;  
  category: string; 
  stock: string; 
  name: string; 
  price: string; 
  containerClass: string; 
  onClick: () => void; 
}

const Product: FC<ProductProps> = ({
  id,
  category,
  stock,
  name,
  price,
  containerClass,
  onClick,
}) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation(); 
    
    const cartProduct: CartProduct = {
      id,
      name,
      category,
      price,
      stock,
      quantity: 1,
    };
    
    addToCart(cartProduct);
  };

  return (
    <>
      <div
        className={`flex flex-row justify-between w-full py-3 px-3 cursor-pointer ${containerClass}`}
        onClick={onClick}
      >
        <div className="flex flex-row items-center gap-2">
          <span>
            <FaShoppingCart size={20} className="text-white" /> 
          </span>
          <span className="text-white font-semibold text-sm">{name}</span>
        </div>
        <div className="flex flex-row gap-6 text-xs"> 
          <span className="flex-1 text-white font-semibold text-xs">
            {category} 
          </span>
          <span className="flex-1 text-white font-semibold text-xs">
            {stock} 
          </span>
          <span className="flex-1 text-white font-semibold text-xs">
            {price} PLN 
          </span>
          <button 
            onClick={handleAddToCart} 
            className="ml-2 bg-[#008ABB] hover:bg-[#006a8e] text-white py-1 px-2 rounded-md text-xs transition-colors"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </>
  );
};

export default Product;