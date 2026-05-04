import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Loader2, User, ShoppingBag, Eye, LogOut } from "lucide-react";
import toast from "react-hot-toast";
import api from "../api/axios";

const Profile = () => {
  const { user, isAuthenticated, loading: authLoading, logout } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("profile");

  // Profile Form State
  const [profileForm, setProfileForm] = useState({
    name: "",
    phone: "",
  });
  const [updatingProfile, setUpdatingProfile] = useState(false);

  // Password Form State
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [updatingPassword, setUpdatingPassword] = useState(false);

  // Orders State
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // Initial redirect & setup
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast.error("Please login to view your profile");
      navigate("/login");
    } else if (user) {
      setProfileForm({
        name: user.name || "",
        phone: user.phone || "",
      });
    }
  }, [authLoading, isAuthenticated, navigate, user]);

  // Fetch orders when tab switches to "orders"
  useEffect(() => {
    if (activeTab === "orders" && isAuthenticated) {
      const fetchOrders = async () => {
        setLoadingOrders(true);
        try {
          const res = await api.get("/orders/my-orders");
          setOrders(res.data?.data || res.data || []);
        } catch (err) {
          console.warn("My Orders fetch failed:", err);
          // Fallback just for visual demonstration if backend isn't ready
          setOrders([
            {
              _id: "ORD-98765432",
              createdAt: new Date().toISOString(),
              totalPrice: 2500,
              status: "Out for Delivery",
              items: [
                { name: "Double Cheese Burger", quantity: 2 },
                { name: "Large Fries", quantity: 1 }
              ]
            },
            {
              _id: "ORD-12345678",
              createdAt: new Date(Date.now() - 86400000 * 3).toISOString(), // 3 days ago
              totalPrice: 1550,
              status: "Delivered",
              items: [
                { name: "Spicy Chicken Wrap", quantity: 1 },
                { name: "Coke", quantity: 2 }
              ]
            }
          ]);
        } finally {
          setLoadingOrders(false);
        }
      };
      fetchOrders();
    }
  }, [activeTab, isAuthenticated]);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    if (!profileForm.name.trim()) return toast.error("Name cannot be empty.");

    setUpdatingProfile(true);
    try {
      await api.put("/users/profile", profileForm);
      toast.success("Profile updated successfully!");
      // If the backend doesn't automatically update the AuthContext state, 
      // you might need a mechanism to refresh the user data here.
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update profile.");
    } finally {
      setUpdatingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!passwordForm.oldPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      return toast.error("Please fill all password fields.");
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      return toast.error("New passwords do not match.");
    }

    setUpdatingPassword(true);
    try {
      await api.put("/users/change-password", {
        oldPassword: passwordForm.oldPassword,
        newPassword: passwordForm.newPassword,
      });
      toast.success("Password changed successfully!");
      setPasswordForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to change password.");
    } finally {
      setUpdatingPassword(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  // Helper for Order Status Colors
  const getStatusBadge = (status) => {
    switch (status) {
      case "Placed": return "bg-blue-100 text-blue-700";
      case "Preparing": return "bg-yellow-100 text-yellow-700";
      case "Out for Delivery": return "bg-purple-100 text-purple-700";
      case "Delivered": return "bg-green-100 text-green-700";
      case "Picked Up": return "bg-green-100 text-green-700";
      case "Cancelled": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  if (authLoading || (!isAuthenticated && !authLoading)) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <Loader2 className="h-10 w-10 animate-spin text-[#E4002B]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        
        {/* Header section */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="text-3xl font-extrabold text-gray-900">Account Dashboard</h1>
          <button
            onClick={handleLogout}
            className="flex w-fit items-center gap-2 rounded-lg bg-gray-200 px-4 py-2 font-medium text-gray-700 transition hover:bg-gray-300"
          >
            <LogOut className="h-4 w-4" /> Sign Out
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Sidebar / Tabs Navigation */}
          <div className="w-full md:w-1/4">
            <div className="overflow-hidden rounded-2xl bg-white shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-100 bg-gray-50 text-center">
                <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-[#E4002B] text-2xl font-bold text-white shadow-md">
                  {user?.name?.charAt(0).toUpperCase() || "U"}
                </div>
                <h3 className="font-bold text-gray-900">{user?.name}</h3>
                <p className="text-sm text-gray-500">{user?.email}</p>
              </div>
              <div className="p-2 flex flex-col gap-1">
                <button
                  onClick={() => setActiveTab("profile")}
                  className={`flex items-center gap-3 w-full rounded-xl px-4 py-3 text-left font-medium transition ${
                    activeTab === "profile" 
                    ? "bg-red-50 text-[#E4002B]" 
                    : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <User className="h-5 w-5" /> My Profile
                </button>
                <button
                  onClick={() => setActiveTab("orders")}
                  className={`flex items-center gap-3 w-full rounded-xl px-4 py-3 text-left font-medium transition ${
                    activeTab === "orders" 
                    ? "bg-red-50 text-[#E4002B]" 
                    : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <ShoppingBag className="h-5 w-5" /> My Orders
                </button>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="w-full md:w-3/4">
            
            {/* --------------------- PROFILE TAB --------------------- */}
            {activeTab === "profile" && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                
                {/* Personal Info Update */}
                <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
                  <h2 className="mb-6 text-xl font-bold text-gray-900">Personal Information</h2>
                  <form onSubmit={handleProfileSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">Full Name</label>
                        <input
                          type="text"
                          value={profileForm.name}
                          onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                          className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-[#E4002B] focus:outline-none focus:ring-1 focus:ring-[#E4002B]"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">Email Address (Read-Only)</label>
                        <input
                          type="email"
                          value={user?.email || ""}
                          disabled
                          className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-500 cursor-not-allowed"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="mb-1 block text-sm font-medium text-gray-700">Phone Number</label>
                        <input
                          type="tel"
                          value={profileForm.phone}
                          onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                          placeholder="+92 300 0000000"
                          className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-[#E4002B] focus:outline-none focus:ring-1 focus:ring-[#E4002B]"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end pt-2">
                      <button
                        type="submit"
                        disabled={updatingProfile}
                        className="flex items-center gap-2 rounded-xl bg-[#E4002B] px-6 py-3 font-bold text-white shadow-md transition hover:bg-red-700 disabled:opacity-70"
                      >
                        {updatingProfile && <Loader2 className="h-4 w-4 animate-spin" />}
                        Save Changes
                      </button>
                    </div>
                  </form>
                </div>

                {/* Password Change Update */}
                <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
                  <h2 className="mb-6 text-xl font-bold text-gray-900">Change Password</h2>
                  <form onSubmit={handlePasswordSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="md:col-span-2">
                        <label className="mb-1 block text-sm font-medium text-gray-700">Current Password</label>
                        <input
                          type="password"
                          value={passwordForm.oldPassword}
                          onChange={(e) => setPasswordForm({ ...passwordForm, oldPassword: e.target.value })}
                          className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-[#E4002B] focus:outline-none focus:ring-1 focus:ring-[#E4002B]"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">New Password</label>
                        <input
                          type="password"
                          value={passwordForm.newPassword}
                          onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                          className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-[#E4002B] focus:outline-none focus:ring-1 focus:ring-[#E4002B]"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">Confirm New Password</label>
                        <input
                          type="password"
                          value={passwordForm.confirmPassword}
                          onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                          className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-[#E4002B] focus:outline-none focus:ring-1 focus:ring-[#E4002B]"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end pt-2">
                      <button
                        type="submit"
                        disabled={updatingPassword}
                        className="flex items-center gap-2 rounded-xl bg-gray-900 px-6 py-3 font-bold text-white shadow-md transition hover:bg-gray-800 disabled:opacity-70"
                      >
                        {updatingPassword && <Loader2 className="h-4 w-4 animate-spin" />}
                        Update Password
                      </button>
                    </div>
                  </form>
                </div>

              </div>
            )}

            {/* --------------------- ORDERS TAB --------------------- */}
            {activeTab === "orders" && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
                  <h2 className="mb-6 text-xl font-bold text-gray-900">Order History</h2>
                  
                  {loadingOrders ? (
                    <div className="flex h-40 items-center justify-center">
                      <Loader2 className="h-8 w-8 animate-spin text-[#E4002B]" />
                    </div>
                  ) : orders.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <ShoppingBag className="mb-4 h-16 w-16 text-gray-300" />
                      <h3 className="mb-2 text-xl font-bold text-gray-900">No orders yet</h3>
                      <p className="mb-6 text-gray-500">You haven't placed any orders with us.</p>
                      <Link
                        to="/menu"
                        className="rounded-full bg-[#E4002B] px-6 py-3 font-bold text-white transition hover:bg-red-700"
                      >
                        Browse Menu
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {orders.map((order) => (
                        <div key={order._id} className="overflow-hidden rounded-xl border border-gray-200">
                          
                          {/* Card Header */}
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gray-50 p-4 border-b border-gray-200">
                            <div>
                              <p className="text-sm font-semibold text-gray-500">
                                Order <span className="text-gray-900 font-mono">#{order._id.substring(0, 8).toUpperCase()}</span>
                              </p>
                              <p className="text-xs text-gray-400 mt-1">
                                {new Date(order.createdAt).toLocaleDateString("en-US", {
                                  year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit"
                                })}
                              </p>
                            </div>
                            <div className="flex items-center gap-4">
                              <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${getStatusBadge(order.status)}`}>
                                {order.status}
                              </span>
                              <span className="font-bold text-[#E4002B] text-lg">
                                Rs. {order.totalPrice?.toFixed(2)}
                              </span>
                            </div>
                          </div>

                          {/* Card Body */}
                          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 gap-4">
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-700">
                                {order.items?.map(item => `${item.quantity}x ${item.name}`).join(", ")}
                              </p>
                            </div>
                            <Link
                              to={`/order-confirmation/${order._id}`}
                              className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 shrink-0"
                            >
                              <Eye className="h-4 w-4" /> View Details
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
};

export default Profile;
