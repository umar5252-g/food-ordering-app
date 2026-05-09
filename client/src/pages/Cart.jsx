import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { Minus, Plus, Trash2, ArrowLeft, ShoppingBag, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import api from "../api/axios";
import ImageWithFallback from "../components/ImageWithFallback";

const Cart = () => {
  const { cart, total, updateQuantity, removeFromCart, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const DELIVERY_FEE = 150;
  const finalTotal = total > 0 ? total + DELIVERY_FEE : 0;

  const handleQuantityChange = (id, currentQty, change) => {
    const newQty = currentQty + change;
    if (newQty >= 1) {
      updateQuantity(id, newQty);
    }
  };

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      toast.error("Please login to place your order");
      navigate("/login", { state: { from: "/cart" } });
      return;
    }

    if (cart.length === 0) return;

    setIsSubmitting(true);
    try {
      // Map cart items to match the backend schema exactly
      const orderItems = cart.map((item) => ({
        product: item._id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
      }));

      // Send the requested payload structure, including fallback fields to pass Mongoose validation
      const payload = {
        items: orderItems,
        totalAmount: finalTotal,
        totalPrice: finalTotal, 
        orderType: "Delivery",
        paymentMethod: "Cash on Delivery",
        customerDetails: {
          name: user.name,
          phone: user.phone || "N/A",
        },
      };

      // api uses the centralized instance which automatically attaches the Bearer token!
      const response = await api.post("/orders", payload);

      clearCart();
      toast.success("Order placed successfully!");
      // Redirect to the order confirmation page
      navigate(`/order-confirmation/${response.data.data._id || 'success'}`);
    } catch (err) {
      const message = err.response?.data?.message || "Failed to place order";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="container mx-auto flex min-h-[60vh] flex-col items-center justify-center px-4 py-16 text-center">
        <div className="mb-6 flex h-32 w-32 items-center justify-center rounded-full bg-gray-100 shadow-inner">
          <ShoppingBag className="h-16 w-16 text-gray-400" />
        </div>
        <h2 className="mb-4 text-3xl font-extrabold text-gray-900">
          Your cart is empty
        </h2>
        <p className="mb-8 text-lg text-gray-500 max-w-md mx-auto">
          Looks like you haven't added anything to your cart yet. Let's fix that!
        </p>
        <Link
          to="/menu"
          className="inline-flex items-center gap-2 rounded-full bg-[#E4002B] px-8 py-4 text-lg font-bold text-white shadow-lg transition hover:bg-red-700 hover:shadow-xl hover:-translate-y-1"
        >
          <ArrowLeft className="h-5 w-5" />
          Browse Menu
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      <h1 className="mb-8 text-3xl font-extrabold text-gray-900 sm:text-4xl">
        Shopping Cart
      </h1>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 flex-col-reverse lg:flex-row">
        {/* LEFT SIDE: Cart Items List */}
        <div className="lg:col-span-2">
          <div className="mb-6 flex items-center justify-between border-b border-gray-200 pb-4">
            <span className="text-lg font-semibold text-gray-700">
              {cart.length} {cart.length === 1 ? "Item" : "Items"}
            </span>
            <Link
              to="/menu"
              className="text-[#E4002B] font-bold hover:text-red-700 transition flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" /> Continue Shopping
            </Link>
          </div>

          <div className="space-y-6">
            {cart.map((item) => (
              <div
                key={item._id}
                className="flex flex-col sm:flex-row items-center gap-6 rounded-2xl bg-white p-4 shadow-sm border border-gray-100 transition hover:shadow-md"
              >
                {/* Image */}
                <div className="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-gray-100">
                  <ImageWithFallback
                    src={item.image}
                    alt={item.name}
                    className="h-full w-full object-cover"
                  />
                </div>

                {/* Info */}
                <div className="flex-1 text-center sm:text-left w-full">
                  <h3 className="text-lg font-bold text-gray-900 line-clamp-1">
                    {item.name}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500 line-clamp-1">
                    {item.description || "Delicious food item prepared fresh for you"}
                  </p>
                  <p className="mt-2 text-[#E4002B] font-bold">
                    Rs. {item.price?.toFixed(2)}
                  </p>
                </div>

                {/* Controls */}
                <div className="flex flex-wrap sm:flex-nowrap items-center justify-center sm:justify-end gap-4 w-full sm:w-auto mt-4 sm:mt-0">
                  <div className="flex items-center rounded-full border border-gray-300 bg-white shadow-sm">
                    <button
                      onClick={() => handleQuantityChange(item._id, item.quantity, -1)}
                      disabled={item.quantity <= 1}
                      className="p-2 text-gray-600 transition hover:text-[#E4002B] hover:bg-gray-50 rounded-l-full disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-10 text-center font-bold text-gray-900">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => handleQuantityChange(item._id, item.quantity, 1)}
                      className="p-2 text-gray-600 transition hover:text-[#E4002B] hover:bg-gray-50 rounded-r-full"
                      aria-label="Increase quantity"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="w-24 text-center sm:text-right font-black text-gray-900 hidden sm:block">
                    Rs. {(item.price * item.quantity).toFixed(2)}
                  </div>

                  <button
                    onClick={() => removeFromCart(item._id)}
                    className="rounded-full p-3 text-gray-400 transition hover:bg-red-50 hover:text-[#E4002B] focus:outline-none focus:ring-2 focus:ring-red-500"
                    title="Remove item"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT SIDE: Order Summary Box */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 rounded-3xl bg-gray-50 p-8 border border-gray-200 shadow-sm">
            <h2 className="mb-6 text-2xl font-black text-gray-900">
              Order Summary
            </h2>

            <div className="mb-6 space-y-4 border-b border-gray-200 pb-6 text-gray-600">
              <div className="flex justify-between items-center text-lg">
                <span>Subtotal</span>
                <span className="font-bold text-gray-900">
                  Rs. {total.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center text-lg">
                <span>Delivery Fee</span>
                <span className="font-bold text-gray-900">
                  Rs. {DELIVERY_FEE.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="mb-8 flex justify-between items-center text-2xl font-black text-gray-900">
              <span>Total</span>
              <span className="text-[#E4002B]">Rs. {finalTotal.toFixed(2)}</span>
            </div>

            <button
              onClick={handleCheckout}
              disabled={cart.length === 0 || isSubmitting}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-[#E4002B] py-5 text-xl font-bold text-white shadow-xl transition duration-300 hover:bg-red-700 hover:shadow-2xl hover:-translate-y-1 disabled:cursor-not-allowed disabled:bg-gray-400 disabled:shadow-none disabled:-translate-y-0"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-6 w-6 animate-spin" /> Processing...
                </>
              ) : (
                "Proceed to Checkout"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
