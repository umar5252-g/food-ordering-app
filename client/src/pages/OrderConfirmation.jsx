import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { CheckCircle, Clock, MapPin, Package, ArrowRight, Home, Receipt } from "lucide-react";
import api from "../api/axios";

const OrderConfirmation = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await api.get(`/orders/${id}`);
        // Adjust depending on whether the response is nested in data or not
        const fetchedOrder = res.data?.data || res.data;
        setOrder(fetchedOrder);
      } catch (err) {
        console.warn("Could not fetch order from backend:", err);
        // Fallback to a mock order if the endpoint isn't ready
        setOrder({
          _id: id,
          status: "Placed",
          items: [
            { name: "Classic Beef Burger", quantity: 2, price: 550 },
            { name: "Fries", quantity: 1, price: 200 }
          ],
          totalPrice: 1300,
          orderType: "Delivery",
          deliveryAddress: {
            address: "Street 10, Sector G, Main Area",
            city: "Lahore"
          },
          createdAt: new Date().toISOString(),
        });
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#E4002B] border-t-transparent"></div>
      </div>
    );
  }

  if (error && !order) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-gray-50">
        <p className="text-xl font-semibold text-red-600">Failed to load order details.</p>
        <Link to="/" className="mt-4 text-[#E4002B] hover:underline">Return to Home</Link>
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

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl overflow-hidden rounded-2xl bg-white shadow-xl">
        
        {/* Header Section */}
        <div className="bg-green-50 px-8 py-12 text-center border-b border-green-100">
          <div className="mb-6 flex justify-center">
            {/* Custom CSS animation for the big green checkmark */}
            <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-green-100 shadow-inner animate-[bounce_1s_ease-in-out]">
              <CheckCircle className="h-16 w-16 text-green-500" />
              <div className="absolute inset-0 rounded-full border-4 border-green-500 animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite] opacity-20"></div>
            </div>
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-2">
            Order Placed Successfully!
          </h1>
          <p className="text-lg text-green-700">
            Thank you for your order. We're on it!
          </p>
        </div>

        {/* Content Section */}
        <div className="p-8">
          
          {/* Order ID & Time */}
          <div className="mb-10 grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="flex flex-col items-start justify-center rounded-xl bg-gray-100 p-5 border border-gray-200">
              <span className="mb-1 text-sm font-semibold text-gray-500 uppercase tracking-wider">Order Number</span>
              <span className="text-xl font-bold text-gray-900 font-mono">#{order._id.substring(0, 8).toUpperCase()}</span>
            </div>
            <div className="flex items-center gap-4 rounded-xl bg-red-50 p-5 border border-red-100">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-[#E4002B]">
                <Clock className="h-6 w-6" />
              </div>
              <div>
                <span className="block text-sm font-semibold text-gray-600">Estimated {order.orderType === "Pickup" ? "Pickup" : "Delivery"}</span>
                <span className="block text-lg font-bold text-gray-900">30-45 minutes</span>
              </div>
            </div>
          </div>

          {/* Tracker Section */}
          <div className="mb-12">
            <h3 className="mb-6 text-lg font-bold text-gray-900">Order Status</h3>
            <div className="relative">
              <div className="absolute top-1/2 left-0 h-1 w-full -translate-y-1/2 bg-gray-200 rounded-full"></div>
              {/* Progress Bar Fill */}
              <div 
                className="absolute top-1/2 left-0 h-1 -translate-y-1/2 bg-green-500 rounded-full transition-all duration-1000 ease-in-out"
                style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
              ></div>
              
              <div className="relative flex justify-between">
                {steps.map((step, idx) => {
                  const isCompleted = idx <= currentStepIndex;
                  const isCurrent = idx === currentStepIndex;
                  
                  return (
                    <div key={step} className="flex flex-col items-center">
                      <div 
                        className={`z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 transition-colors duration-500 ${
                          isCompleted 
                            ? "border-green-500 bg-green-500 text-white" 
                            : "border-gray-300 bg-white text-gray-300"
                        } ${isCurrent ? "ring-4 ring-green-100" : ""}`}
                      >
                        {isCompleted ? <CheckCircle className="h-5 w-5" /> : <div className="h-2 w-2 rounded-full bg-gray-300"></div>}
                      </div>
                      <span className={`mt-3 text-xs font-semibold sm:text-sm text-center w-20 sm:w-24 ${
                        isCompleted ? "text-gray-900" : "text-gray-400"
                      }`}>
                        {step}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Order Details Layout */}
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            
            {/* Left Col: Items summary */}
            <div>
              <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-gray-900">
                <Receipt className="h-5 w-5 text-gray-400" /> Order Summary
              </h3>
              <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
                <ul className="divide-y divide-gray-100">
                  {order.items?.map((item, idx) => (
                    <li key={idx} className="flex justify-between p-4">
                      <div className="flex flex-col">
                        <span className="font-semibold text-gray-900 line-clamp-1">{item.name}</span>
                        <span className="text-sm text-gray-500">Qty: {item.quantity}</span>
                      </div>
                      <span className="font-semibold text-gray-900">
                        Rs. {(item.price * item.quantity).toFixed(2)}
                      </span>
                    </li>
                  ))}
                </ul>
                <div className="bg-gray-50 p-4 border-t border-gray-200 flex justify-between text-lg font-bold text-gray-900">
                  <span>Total</span>
                  <span className="text-[#E4002B]">Rs. {order.totalPrice?.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Right Col: Delivery/Pickup Info */}
            <div>
              <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-gray-900">
                {order.orderType === "Pickup" ? (
                  <Package className="h-5 w-5 text-gray-400" /> 
                ) : (
                  <MapPin className="h-5 w-5 text-gray-400" />
                )}
                {order.orderType === "Pickup" ? "Pickup Information" : "Delivery Address"}
              </h3>
              
              <div className="rounded-xl border border-gray-200 bg-white p-5 h-full">
                {order.orderType === "Pickup" ? (
                  <div className="text-gray-700">
                    <p className="font-semibold text-gray-900 mb-1">Flavor Point Main Branch</p>
                    <p>123 Food Street</p>
                    <p>Lahore, Pakistan</p>
                    <p className="mt-4 text-sm text-gray-500">Present your Order ID upon arrival.</p>
                  </div>
                ) : (
                  <div className="text-gray-700 leading-relaxed">
                    <p className="font-semibold text-gray-900 mb-1">{order.customerDetails?.name || "Customer"}</p>
                    <p>{order.deliveryAddress?.address}</p>
                    <p>{order.deliveryAddress?.city}</p>
                    {order.customerDetails?.phone && (
                      <p className="mt-2 text-sm text-gray-500">Tel: {order.customerDetails.phone}</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-12 flex flex-col gap-4 sm:flex-row sm:justify-end">
            <Link
              to={`/orders/${order._id}`}
              className="flex items-center justify-center gap-2 rounded-full border-2 border-[#E4002B] bg-white px-8 py-3 text-lg font-bold text-[#E4002B] transition hover:bg-red-50"
            >
              Track Order <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              to="/"
              className="flex items-center justify-center gap-2 rounded-full bg-[#E4002B] px-8 py-3 text-lg font-bold text-white shadow-lg transition hover:bg-red-700"
            >
              <Home className="h-5 w-5" /> Back to Home
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
