import { FC } from "react";
import { FaShoppingCart } from "react-icons/fa";

interface ProductProps {
  category: string; // Kategoria produktu spożywczego
  stock: string; // Ilość w magazynie
  name: string; // Nazwa produktu
  price: string; // Cena produktu
  containerClass: string; // Klasa kontenera dla stylizacji
  onClick: () => void; // Funkcja wywoływana przy kliknięciu
}

const Product: FC<ProductProps> = ({
  category,
  stock,
  name,
  price,
  containerClass,
  onClick,
}) => {
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
            {category} {/* Kategoria produktu */}
          </span>
          <span className="flex-1 text-white font-semibold text-xs">
            {stock} {/* Stan magazynowy */}
          </span>
          <span className="flex-1 text-white font-semibold text-xs">
            {price} PLN {/* Cena produktu */}
          </span>
        </div>
      </div>
    </>
  );
};

export default Product;