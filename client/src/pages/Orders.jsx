import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Package, Calendar, ChevronRight, ShoppingBag, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/orders/myorders`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        // Sort newest first
        const sortedOrders = (res.data.data || []).sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setOrders(sortedOrders);
      } catch (err) {
        console.error('Error fetching orders:', err);
        toast.error('Failed to load your orders.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigate]);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'preparing': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'out for delivery': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'delivered': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 animate-spin text-orange-500" />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="bg-white p-10 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center">
          <div className="bg-orange-100 p-4 rounded-full mb-6">
            <ShoppingBag className="w-12 h-12 text-orange-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">No orders yet</h2>
          <p className="text-gray-500 mb-8 max-w-md mx-auto">
            Looks like you haven't placed any orders yet. Discover our delicious menu and treat yourself today!
          </p>
          <Link 
            to="/menu" 
            className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-8 rounded-full transition-colors"
          >
            Browse Menu
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 sm:py-16">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Orders</h1>
      
      <div className="space-y-6">
        {orders.map((order) => (
          <div 
            key={order._id}
            onClick={() => navigate(`/orders/${order._id}`)}
            className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 pb-4 border-b border-gray-50 gap-4">
              <div className="flex items-center gap-3">
                <div className="bg-gray-50 p-2 rounded-lg">
                  <Package className="w-6 h-6 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Order ID</p>
                  <p className="text-gray-900 font-bold uppercase tracking-wider">#{order._id.substring(0, 8)}</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm font-medium">{formatDate(order.createdAt)}</span>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(order.status)} capitalize`}>
                  {order.status || 'Pending'}
                </span>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
              <div className="flex-1">
                <ul className="text-sm text-gray-600 space-y-1">
                  {order.items?.map((item, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded flex items-center justify-center bg-gray-100 text-xs font-medium text-gray-700">
                        {item.quantity}x
                      </span>
                      <span>{item.name || item.product?.name || 'Unknown Item'}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-4 sm:pt-0 border-gray-50">
                <div className="text-left sm:text-right">
                  <p className="text-sm text-gray-500 font-medium mb-1">Total Amount</p>
                  <p className="text-lg font-bold text-gray-900">Rs. {order.totalPrice?.toLocaleString() || 0}</p>
                </div>
                
                <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center group-hover:bg-orange-100 transition-colors">
                  <ChevronRight className="w-5 h-5 text-orange-500" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
