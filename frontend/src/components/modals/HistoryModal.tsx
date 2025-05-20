import React, { FC, useEffect, useState } from "react";
import mainService from "../../services/service";

interface HistoryModalProps {
  onClose: () => void;
}

interface OrderHistoryItem {
  id: number;
  created_at: string;
  total_price: string;
  status: string;
  products: { product: { id: number; name: string; price: string; category: string }; quantity: number }[];
}

const HistoryModal: FC<HistoryModalProps> = ({ onClose }) => {
  const [historyOrders, setHistoryOrders] = useState<OrderHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    mainService
      .getUserHistory()
      .then((data) => {
        console.log("Raw order history data:", JSON.stringify(data, null, 2));
        const limitedOrders = data.slice(0, 5);
        setHistoryOrders(limitedOrders);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching order history:", err);
        setError("Failed to load order history");
        setLoading(false);
      });
  }, []);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
      onClick={handleBackdropClick}
    >
      <div className="bg-[#234164] ring-1 ring-gray-500/50 rounded-xl shadow-xl w-[600px] max-w-[95%] p-6 relative" onClick={(e) => e.stopPropagation()}>
        <h1 className="text-center text-white font-semibold text-lg mb-4">Order History</h1>
        
        {loading && (
          <div className="text-center text-white py-4">Loading orders...</div>
        )}
        
        {error && (
          <div className="text-center text-red-500 py-4">{error}</div>
        )}
        
        {!loading && !error && historyOrders.length === 0 && (
          <div className="text-center text-white py-4">You have no order history yet.</div>
        )}
        
        <div className="flex flex-col gap-4 max-h-[70vh] overflow-y-auto">
          {historyOrders.map((order) => (
            <div key={order.id} className="bg-[#4DA9D9] p-4 rounded-lg">
              <p className="text-white text-sm font-bold">Order #{order.id}</p>
              <p className="text-white text-sm">Date: {new Date(order.created_at).toLocaleString()}</p>
              <p className="text-white text-sm">Total: {order.total_price} PLN</p>
              <p className="text-white text-sm">Status: {order.status}</p>
              
              <div className="mt-3 border-t border-white pt-2">
                <p className="text-white text-sm font-semibold">Products:</p>
                {!order.products || order.products.length === 0 ? (
                  <p className="text-white text-sm italic">No products information available</p>
                ) : (
                  <ul className="text-white text-sm mt-1 space-y-1">
                    {order.products.map((item, i) => (
                      <li key={i} className="bg-[#006a8e] p-2 rounded">
                        <div className="flex justify-between">
                          <span>{item.product?.name || "Unknown product"}</span>
                          <span>x{item.quantity}</span>
                        </div>
                        {item.product && (
                          <div className="text-xs text-gray-200 mt-1">
                            Category: {item.product.category} | Price: {item.product.price} PLN
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 flex justify-center">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#008ABB] rounded-lg hover:bg-[#006a8e] text-white transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default HistoryModal;