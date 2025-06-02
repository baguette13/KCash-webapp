import React, { useEffect, useState } from "react";
import { Order } from "../interfaces/interfaces";
import mainService from "../services/service";
import Navbar from "../components/Navbar";
import TokenDebugPanel from "../components/notification/TokenDebugPanel";

const LogisticsPage: React.FC = () => {
  const [pendingOrders, setPendingOrders] = useState<Order[]>([]);
  const [completedOrders, setCompletedOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("pending");
  const [showDebug, setShowDebug] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null); 
    
    try {
      const [pendingResponse, completedResponse] = await Promise.all([
        mainService.getPendingOrders(),
        mainService.getCompletedOrders()
      ]);
      
      console.log("Pending response:", pendingResponse);
      console.log("Completed response:", completedResponse);
      
      const pendingData = pendingResponse && pendingResponse.data ? pendingResponse.data : [];
      
      const completedData = completedResponse 
        ? (completedResponse.data 
            ? completedResponse.data 
            : Array.isArray(completedResponse) 
              ? completedResponse 
              : [])
        : [];
      
      setPendingOrders(Array.isArray(pendingData) ? pendingData : []);
      setCompletedOrders(Array.isArray(completedData) ? completedData : []);
      
    } catch (err: any) {
      setError(
        err.response?.data?.error || 
        "Failed to fetch orders. Please try again later."
      );
      console.error("Error fetching orders:", err);
      setPendingOrders([]);
      setCompletedOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    
    const urlParams = new URLSearchParams(window.location.search);
    setShowDebug(urlParams.get('debug') === 'true');
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        e.preventDefault();
        setShowDebug(prev => !prev);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleCompleteOrder = async (orderId: number) => {
    setError(null); 
    try {
      const response = await mainService.updateOrderStatus(orderId, "Completed");
      
      setError(`Order #${orderId} has been marked as completed`);
      setTimeout(() => setError(null), 3000);
      
      fetchOrders();
      return response;
    } catch (err: any) {
      setError(
        err.response?.data?.error || 
        `Failed to update order #${orderId}. Please try again.`
      );
      console.error("Error updating order status:", err);
    }
  };

  const renderOrderItems = (order: Order | undefined) => {
    if (!order || !order.products || !Array.isArray(order.products) || order.products.length === 0) {
      return <div className="mt-2 pl-4">No products in this order</div>;
    }

    return (
      <div className="mt-2 pl-4">
        <h4 className="text-sm font-semibold">Order Items:</h4>
        <ul className="list-disc pl-5">
          {order.products.map((item, index) => (
            <li key={index} className="text-sm">
              {item?.product?.name ? item.product.name : "Unknown product"} - 
              Quantity: {item?.quantity || 0} - 
              Price: ${(item?.product?.price) ? Number(item.product.price).toFixed(2) : "0.00"}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  const renderOrders = (orders: Order[] | undefined, showCompleteButton: boolean = false) => {
    if (!orders || !Array.isArray(orders) || orders.length === 0) {
      return <p className="text-gray-500 italic">No orders found</p>;
    }

    return orders.map((order, index) => (
      <div key={order?.id || `order-${index}`} className="bg-white shadow-md rounded-lg p-4 mb-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold">Order #{order?.id || 'Unknown'}</h3>
            <p className="text-sm text-gray-600">
              Date: {order?.created_at ? new Date(order.created_at).toLocaleString() : 'Unknown date'}
            </p>
            <p className="text-sm">
              Customer: {order?.user_details ? 
                `${order.user_details.first_name || ''} ${order.user_details.last_name || ''} (${order.user_details.email || 'No email'})` 
                : 'Unknown customer'}
            </p>
            <p className="font-medium">Total: ${order?.total_price ? Number(order.total_price).toFixed(2) : '0.00'}</p>
            <p className={`font-bold ${order?.status === "Pending" ? "text-yellow-600" : "text-green-600"}`}>
              Status: {order?.status || 'Unknown'}
            </p>
            {renderOrderItems(order)}
          </div>
          {showCompleteButton && order?.status === "Pending" && (
            <button
              onClick={() => order?.id && handleCompleteOrder(order.id)}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md"
            >
              Mark as Completed
            </button>
          )}
        </div>
      </div>
    ));
  };

  return (
    <>
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="container mx-auto py-8 px-4 mt-16">
          <h1 className="text-2xl font-bold mb-6">Logistics Dashboard</h1>
          
          {error && (
            <div className={error.includes('has been marked as completed') 
              ? "bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4"
              : "bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4"}>
              {error}
            </div>
          )}
          
          <div className="mb-4">
            <div className="flex border-b">
              <button
                className={`px-4 py-2 ${
                  activeTab === "pending" ? "border-b-2 border-blue-500 text-blue-500" : "text-gray-500"
                }`}
                onClick={() => setActiveTab("pending")}
              >
                Pending Orders
              </button>
              <button
                className={`px-4 py-2 ${
                  activeTab === "completed" ? "border-b-2 border-blue-500 text-blue-500" : "text-gray-500"
                }`}
                onClick={() => setActiveTab("completed")}
              >
                Completed Orders
              </button>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-10">
              <p className="text-gray-500">Loading orders...</p>
            </div>
          ) : (
            <div className="mt-4">
              {activeTab === "pending" ? (
                <>
                  <h2 className="text-xl font-semibold mb-4">Pending Orders</h2>
                  {renderOrders(pendingOrders, true)}
                </>
              ) : (
                <>
                  <h2 className="text-xl font-semibold mb-4">Completed Orders</h2>
                  {renderOrders(completedOrders)}
                </>
              )}
            </div>
          )}
        </div>
      </div>
      <TokenDebugPanel visible={showDebug} />
    </>
  );
};

export default LogisticsPage;