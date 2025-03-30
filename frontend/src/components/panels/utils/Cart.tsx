import { FC, useEffect } from "react";
import mainService from "../../../services/service";
import { useState } from "react";

const Cart: FC = () => {
  const [userProducts, setUserProducts] = useState([{}]);
  const [summary, setSummary] = useState([]);

  useEffect(() => {
    mainService.getUserHistory().then((data) => {
      setUserProducts(data);
    });
  }, []);

  useEffect(() => {
    if (userProducts.length === 0) return;
    console.log(userProducts);

    const summarizeTransactions = (userProducts: any) => {
      return userProducts.reduce((acc: any, product: any) => {
        const { name, transaction_type, quantity, total_cost } = product;
        const qty = parseFloat(quantity);
        const cost = parseFloat(total_cost);

        if (!acc[name]) {
          acc[name] = { buys: 0, sells: 0, total_cost: 0 };
        }

        if (transaction_type === "BUY") {
          acc[name].buys += qty;
          acc[name].total_cost += cost;
        } else if (transaction_type === "SELL") {
          acc[name].sells += qty;
        }

        return acc;
      }, {});
    };

    const calculateNetQuantities = (summary: any) => {
      return Object.keys(summary).map((name) => ({
        name,
        net: summary[name].buys - summary[name].sells,
        avgPrice:
          summary[name].buys !== 0
            ? parseFloat(
                (summary[name].total_cost / summary[name].buys).toFixed(2)
              )
            : 0,
      }));
    };

    const summaryData = summarizeTransactions(userProducts);
    const netData: any = calculateNetQuantities(summaryData);
    setSummary(netData);
  }, [userProducts]);

  return (
    <div
      className="flex flex-col space-y-6 h-full flex-1 bg-[#234164] text-white p-2 rounded-lg shadow-lg overflow-y-auto cursor-pointer"
      style={{
        scrollbarWidth: "thin",
        scrollbarColor: "#4b5563 #2c2f35",
      }}
    >
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold flex justify-center pb-2">Cart</h2>
      </div>

      {/* Products List */}
      <div className="space-y-4">
        {summary.map((product: any, index: number) => (
          <div
            key={index}
            className="bg-[#4DA9D9] rounded-xl shadow-md p-4 space-y-3 transform hover:scale-[1.02] transition-transform duration-200"
          >
            {/* Product Header */}
            <div className="flex justify-between items-center">
              <p className="text-lg font-medium">{product.name}</p>
              <p className="text-lg font-medium">{product.avgPrice} PLN</p>
            </div>

            <div className="flex justify-between text-sm text-gray-300">
              Quantity: {product.net}
            </div>

            <div className="flex justify-between items-center text-sm">

            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Cart;