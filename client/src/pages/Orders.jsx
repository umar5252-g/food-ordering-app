import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Package, ChevronRight, Loader2, Calendar } from "lucide-react";
import toast from "react-hot-toast";
import api from "../api/axios";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const fetchOrders = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setLoading(true);
      setError(false);
      // api instance automatically handles baseURL and interceptors for Bearer token!
      const res = await api.get("/orders/myorders");

      // Sort newest first
      const sortedOrders = (res.data.data || []).sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setOrders(sortedOrders);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError(true);
      toast.error("Failed to load your orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [navigate]);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "preparing":
        return "bg-blue-100 text-blue-800";
      case "out for delivery":
        return "bg-orange-100 text-orange-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-gray-50">
        <Loader2 className="h-10 w-10 animate-spin text-[#E4002B]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center bg-gray-50 px-4 text-center">
        <div className="rounded-2xl bg-white p-8 shadow-sm border border-gray-100">
          <p className="mb-4 text-lg font-bold text-red-600">
            Failed to load your orders
          </p>
          <button
            onClick={fetchOrders}
            className="rounded-full bg-[#E4002B] px-6 py-2 font-bold text-white transition hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="mx-auto flex max-w-4xl flex-col items-center justify-center px-4 py-16 text-center mt-12">
        <div className="mb-6 flex h-32 w-32 items-center justify-center rounded-full bg-gray-100">
          <Package className="h-16 w-16 text-gray-400" />
        </div>
        <h2 className="mb-2 text-3xl font-extrabold text-gray-900">
          No orders yet
        </h2>
        <p className="mb-8 text-lg text-gray-500">
          When you place an order it will appear here
        </p>
        <Link
          to="/menu"
          className="inline-flex items-center gap-2 rounded-full bg-[#E4002B] px-8 py-4 font-bold text-white shadow-lg transition hover:bg-red-700 hover:shadow-xl hover:-translate-y-1"
        >
          Start Ordering
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-8 text-3xl font-extrabold text-gray-900 sm:text-4xl">
          Your Orders
        </h1>

        <div className="space-y-6">
          {orders.map((order) => {
            const deliveryFee = 150;
            // Ensure backwards compatibility if old orders don't exactly match structure
            const total = order.totalPrice || 0;
            const subtotal = total > deliveryFee ? total - deliveryFee : total;

            return (
              <div
                key={order._id}
                onClick={() => navigate(`/orders/${order._id}`)}
                className="group cursor-pointer overflow-hidden rounded-2xl bg-white border border-gray-100 shadow-sm transition hover:shadow-md hover:border-red-100"
              >
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-100 bg-gray-50 p-5 gap-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm">
                      <Package className="h-6 w-6 text-[#E4002B]" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-500">
                        Order ID
                      </p>
                      <p className="font-mono font-bold text-gray-900">
                        #{order._id.substring(0, 8)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar className="h-4 w-4" />
                      <span className="text-sm font-semibold">
                        {formatDate(order.createdAt)}
                      </span>
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {order.status || "Pending"}
                    </span>
                  </div>
                </div>

                {/* Body Section */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 gap-6">
                  {/* Items List */}
                  <div className="flex-1 w-full space-y-2">
                    {order.items?.map((item, index) => (
                      <p key={index} className="text-gray-700 font-medium text-sm">
                        {item.name || item.product?.name || "Unknown Item"} <span className="font-bold text-gray-900 ml-1">x {item.quantity}</span>
                      </p>
                    ))}
                  </div>

                  {/* Financials & Action */}
                  <div className="flex w-full sm:w-auto items-center justify-between sm:justify-end gap-6 border-t sm:border-t-0 border-gray-100 pt-4 sm:pt-0">
                    <div className="text-left sm:text-right text-sm">
                      <div className="flex justify-between sm:justify-end gap-4 text-gray-500 font-medium mb-1">
                        <span>Subtotal:</span>
                        <span>Rs. {subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between sm:justify-end gap-4 text-gray-500 font-medium mb-2 pb-2 border-b border-gray-100">
                        <span>Delivery:</span>
                        <span>Rs. {deliveryFee.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between sm:justify-end gap-4">
                        <span className="font-bold text-gray-900">Total:</span>
                        <span className="font-black text-[#E4002B] text-lg">
                          Rs. {total.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-50 text-[#E4002B] transition group-hover:bg-[#E4002B] group-hover:text-white">
                      <ChevronRight className="h-5 w-5" />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Orders;
