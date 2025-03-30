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
  products: { product: { name: string }; quantity: number }[];
}

const HistoryModal: FC<HistoryModalProps> = ({ onClose }) => {
  const [historyOrders, setHistoryOrders] = useState<OrderHistoryItem[]>([]);

  useEffect(() => {
    mainService
      .getUserHistory()
      .then((data) => {
        console.log(data);
        const limitedOrders = data.slice(0, 5);
        setHistoryOrders(limitedOrders);
      })
      .catch((err) => {
        console.error("Error fetching order history:", err);
      });
  }, []);

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
      onClick={onClose}
    >
      <div className="bg-[#234164] ring-1 ring-gray-500/50 rounded-xl shadow-xl w-[600px] max-w-[95%] p-6 relative">
        <h1 className="text-center text-white font-semibold text-lg mb-4">History</h1>
        <div className="flex flex-col gap-4">
          {historyOrders.map((order) => (
            <div key={order.id} className="bg-[#4DA9D9] p-4 rounded-lg">
              <p className="text-white text-sm">Date: {new Date(order.created_at).toLocaleString()}</p>
              <p className="text-white text-sm">Total: ${order.total_price}</p>
              <p className="text-white text-sm">Status: {order.status}</p>
              <ul className="text-white text-sm mt-2">
                {order.products.map((item, i) => (
                  <li key={i}>
                    {item.product.name} - {item.quantity} pcs
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HistoryModal;