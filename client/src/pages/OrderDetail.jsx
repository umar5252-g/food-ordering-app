import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { CheckCircle, Clock, MapPin, Package, ArrowLeft, Receipt, RefreshCcw, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import api from "../api/axios";

const OrderDetail = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchOrder = async (showRefreshIndicator = false) => {
    if (showRefreshIndicator) setIsRefreshing(true);
    try {
      const res = await api.get(`/orders/${id}`);
      const fetchedOrder = res.data?.data || res.data;
      setOrder(fetchedOrder);
      if (showRefreshIndicator) toast.success("Order status updated!");
    } catch (err) {
      console.error("Could not fetch order from backend:", err);
      setError("Failed to load order tracking details.");
      if (showRefreshIndicator) toast.error("Failed to update status.");
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center bg-gray-50">
        <Loader2 className="h-10 w-10 animate-spin text-[#E4002B]" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="flex h-[80vh] flex-col items-center justify-center bg-gray-50 text-center px-4">
        <div className="rounded-2xl bg-white p-8 shadow-sm border border-gray-100 max-w-md w-full">
          <p className="mb-4 text-xl font-bold text-red-600">Order Not Found</p>
          <p className="mb-6 text-gray-500">We couldn't find the tracking information for this order.</p>
          <Link
            to="/orders"
            className="rounded-full bg-[#E4002B] px-8 py-3 font-bold text-white transition hover:bg-red-700"
          >
            Back to My Orders
          </Link>
        </div>
      </div>
    );
  }

  const steps = ["Placed", "Preparing", "Out for Delivery", "Delivered"];
  // For pickup orders
  if (order.orderType === "Pickup") {
    steps[2] = "Ready for Pickup";
    steps[3] = "Picked Up";
  }

  const currentStepIndex = steps.indexOf(order.status) !== -1 ? steps.indexOf(order.status) : 0;
  // Handle cancelled state specially
  const isCancelled = order.status === "Cancelled";

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        
        {/* Navigation & Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <Link
            to="/orders"
            className="flex w-fit items-center gap-2 text-sm font-semibold text-gray-500 hover:text-[#E4002B] transition"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Orders
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black text-gray-900">
              Track Order
            </h1>
            <span className="font-mono text-gray-500 font-medium bg-white px-3 py-1 rounded-lg border border-gray-200">
              #{order._id.substring(0, 8).toUpperCase()}
            </span>
          </div>
        </div>

        {/* Live Tracker Card */}
        <div className="mb-8 overflow-hidden rounded-3xl bg-white shadow-sm border border-gray-100">
          <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50 p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm">
                <Clock className="h-6 w-6 text-[#E4002B]" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Current Status</p>
                <p className={`text-xl font-black ${isCancelled ? 'text-red-600' : 'text-gray-900'}`}>
                  {order.status}
                </p>
              </div>
            </div>
            <button
              onClick={() => fetchOrder(true)}
              disabled={isRefreshing}
              className="flex items-center gap-2 rounded-full border-2 border-gray-200 bg-white px-4 py-2 text-sm font-bold text-gray-700 transition hover:bg-gray-50 hover:border-gray-300 disabled:opacity-50"
            >
              <RefreshCcw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} /> 
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>

          <div className="p-8 sm:p-12">
            {isCancelled ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="rounded-full bg-red-100 p-4 mb-4">
                  <div className="h-4 w-4 rounded-full bg-red-600"></div>
                </div>
                <h3 className="text-xl font-bold text-red-600 mb-2">Order Cancelled</h3>
                <p className="text-gray-500 max-w-sm mx-auto">This order has been cancelled and will not be delivered.</p>
              </div>
            ) : (
              <div className="relative">
                {/* Progress Bar Background */}
                <div className="absolute top-6 left-0 h-1.5 w-full -translate-y-1/2 bg-gray-100 rounded-full"></div>
                
                {/* Progress Bar Fill */}
                <div 
                  className="absolute top-6 left-0 h-1.5 -translate-y-1/2 bg-[#E4002B] rounded-full transition-all duration-1000 ease-in-out shadow-[0_0_10px_rgba(228,0,43,0.5)]"
                  style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
                ></div>
                
                <div className="relative flex justify-between">
                  {steps.map((step, idx) => {
                    const isCompleted = idx <= currentStepIndex;
                    const isCurrent = idx === currentStepIndex;
                    
                    return (
                      <div key={step} className="flex flex-col items-center">
                        <div 
                          className={`z-10 flex h-12 w-12 items-center justify-center rounded-full border-4 transition-all duration-500 ${
                            isCompleted 
                              ? "border-[#E4002B] bg-[#E4002B] text-white shadow-lg" 
                              : "border-gray-100 bg-white text-gray-300"
                          } ${isCurrent ? "ring-4 ring-red-100 scale-110" : ""}`}
                        >
                          {isCompleted ? <CheckCircle className="h-6 w-6" /> : <div className="h-3 w-3 rounded-full bg-gray-200"></div>}
                        </div>
                        <span className={`mt-4 text-xs sm:text-sm font-bold text-center w-24 sm:w-28 transition-colors duration-500 ${
                          isCompleted ? "text-gray-900" : "text-gray-400"
                        }`}>
                          {step}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Order Details Layout */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          
          {/* Left Col: Items summary */}
          <div>
            <h3 className="mb-4 flex items-center gap-2 text-xl font-black text-gray-900">
              <Receipt className="h-6 w-6 text-[#E4002B]" /> Order Summary
            </h3>
            <div className="rounded-3xl border border-gray-100 bg-white overflow-hidden shadow-sm">
              <ul className="divide-y divide-gray-50 px-6 py-2">
                {order.items?.map((item, idx) => (
                  <li key={idx} className="flex justify-between py-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-gray-900">{item.name}</span>
                      <span className="text-sm font-medium text-gray-500">Qty: {item.quantity}</span>
                    </div>
                    <span className="font-bold text-gray-900">
                      Rs. {(item.price * item.quantity).toFixed(2)}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="bg-gray-50 px-6 py-5 border-t border-gray-100">
                <div className="flex justify-between text-sm text-gray-500 font-medium mb-2">
                  <span>Subtotal</span>
                  <span>Rs. {(order.totalPrice - (order.orderType === "Delivery" ? 150 : 0)).toFixed(2)}</span>
                </div>
                {order.orderType === "Delivery" && (
                  <div className="flex justify-between text-sm text-gray-500 font-medium mb-4">
                    <span>Delivery Fee</span>
                    <span>Rs. 150.00</span>
                  </div>
                )}
                <div className="flex justify-between text-xl font-black text-gray-900 border-t border-gray-200 pt-4">
                  <span>Total</span>
                  <span className="text-[#E4002B]">Rs. {order.totalPrice?.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Col: Delivery/Pickup Info */}
          <div>
            <h3 className="mb-4 flex items-center gap-2 text-xl font-black text-gray-900">
              {order.orderType === "Pickup" ? (
                <Package className="h-6 w-6 text-[#E4002B]" /> 
              ) : (
                <MapPin className="h-6 w-6 text-[#E4002B]" />
              )}
              {order.orderType === "Pickup" ? "Pickup Information" : "Delivery Details"}
            </h3>
            
            <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm h-full">
              {order.orderType === "Pickup" ? (
                <div className="text-gray-700">
                  <p className="font-black text-gray-900 mb-2 text-lg">Flavor Point Main Branch</p>
                  <p className="font-medium">123 Flavor Street</p>
                  <p className="font-medium">Culinary City, FL 12345</p>
                  <div className="mt-6 rounded-xl bg-gray-50 p-4 border border-gray-100">
                    <p className="text-sm font-bold text-gray-900">Instructions</p>
                    <p className="text-sm text-gray-600 mt-1">Please present your Order ID #{order._id.substring(0, 8).toUpperCase()} at the counter.</p>
                  </div>
                </div>
              ) : (
                <div className="text-gray-700">
                  <p className="font-black text-gray-900 mb-2 text-lg">{order.customerDetails?.name || "Customer"}</p>
                  <p className="font-medium">{order.deliveryAddress?.address}</p>
                  <p className="font-medium">{order.deliveryAddress?.city}</p>
                  {order.customerDetails?.phone && (
                    <p className="mt-4 font-bold text-gray-900">Tel: <span className="font-medium text-gray-600">{order.customerDetails.phone}</span></p>
                  )}
                  {order.paymentMethod && (
                    <p className="mt-2 font-bold text-gray-900">Payment: <span className="font-medium text-gray-600">{order.paymentMethod}</span></p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default OrderDetail;
