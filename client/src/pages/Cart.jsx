import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { Minus, Plus, Trash2, ArrowLeft, ShoppingBag } from "lucide-react";
import api from "../api/axios";
import ImageWithFallback from "../components/ImageWithFallback";

const Cart = () => {
  const { cart, total, updateQuantity, removeFromCart } = useCart();
  const navigate = useNavigate();

  // Coupon state
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [applyingCoupon, setApplyingCoupon] = useState(false);
  const [couponMessage, setCouponMessage] = useState({ type: "", text: "" });

  const DELIVERY_FEE = 150;
  const finalTotal = total + DELIVERY_FEE - discount;

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponCode.trim()) return;

    setApplyingCoupon(true);
    setCouponMessage({ type: "", text: "" });

    try {
      // The backend might not have this endpoint yet, but we'll try
      const res = await api.post("/coupons/apply", { code: couponCode });

      // Assuming response gives discount amount or percentage
      // e.g. { success: true, data: { discountValue: 50, type: 'fixed' } }
      const discountValue =
        res.data?.data?.discountValue || res.data?.discountValue || 50;

      setDiscount(discountValue);
      setCouponMessage({
        type: "success",
        text: "Coupon applied successfully!",
      });
    } catch (err) {
      setDiscount(0);
      setCouponMessage({
        type: "error",
        text:
          err.response?.data?.message ||
          "Invalid coupon code or endpoint not found.",
      });
    } finally {
      setApplyingCoupon(false);
    }
  };

  const handleCheckout = () => {
    if (cart.length === 0) return;
    navigate("/checkout");
  };

  if (cart.length === 0) {
    return (
      <div className="container mx-auto flex min-h-[60vh] flex-col items-center justify-center px-4 py-16 text-center">
        <div className="mb-6 flex h-32 w-32 items-center justify-center rounded-full bg-gray-100">
          <ShoppingBag className="h-16 w-16 text-gray-400" />
        </div>
        <h2 className="mb-4 text-3xl font-bold text-gray-900">
          Your cart is empty
        </h2>
        <p className="mb-8 text-gray-500">
          Looks like you haven't added anything to your cart yet.
        </p>
        <Link
          to="/menu"
          className="inline-flex items-center gap-2 rounded-full bg-[#E4002B] px-8 py-4 font-bold text-white shadow-lg transition hover:bg-red-700 hover:shadow-xl"
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

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* LEFT SIDE: Cart Items List */}
        <div className="lg:col-span-2">
          <div className="mb-6 flex items-center justify-between border-b border-gray-200 pb-4">
            <span className="text-lg font-semibold text-gray-700">
              {cart.length} {cart.length === 1 ? "Item" : "Items"}
            </span>
            <Link
              to="/menu"
              className="text-[#E4002B] font-medium hover:underline flex items-center gap-1"
            >
              <ArrowLeft className="h-4 w-4" /> Continue Shopping
            </Link>
          </div>

          <div className="space-y-6">
            {cart.map((item) => (
              <div
                key={item._id}
                className="flex flex-col sm:flex-row items-center gap-6 rounded-2xl bg-white p-4 shadow-sm border border-gray-100"
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
                <div className="flex-1 text-center sm:text-left">
                  <h3 className="text-lg font-bold text-gray-900 line-clamp-1">
                    {item.name}
                  </h3>
                  <p className="mt-1 text-[#E4002B] font-semibold">
                    Rs. {item.price?.toFixed(2)}
                  </p>
                </div>

                {/* Controls */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center rounded-full border border-gray-300 bg-gray-50">
                    <button
                      onClick={() =>
                        updateQuantity(item._id, item.quantity - 1)
                      }
                      className="p-2 text-gray-600 transition hover:text-[#E4002B]"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-10 text-center font-semibold">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        updateQuantity(item._id, item.quantity + 1)
                      }
                      className="p-2 text-gray-600 transition hover:text-[#E4002B]"
                      aria-label="Increase quantity"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="w-24 text-right font-bold text-gray-900">
                    Rs. {(item.price * item.quantity).toFixed(2)}
                  </div>

                  <button
                    onClick={() => removeFromCart(item._id)}
                    className="ml-2 rounded-full p-2 text-gray-400 transition hover:bg-red-50 hover:text-red-500"
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
          <div className="sticky top-24 rounded-2xl bg-gray-50 p-6 border border-gray-200">
            <h2 className="mb-6 text-2xl font-bold text-gray-900">
              Order Summary
            </h2>

            <div className="mb-4 space-y-3 border-b border-gray-200 pb-4 text-gray-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-gray-900">
                  Rs. {total.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span className="font-semibold text-gray-900">
                  Rs. {DELIVERY_FEE.toFixed(2)}
                </span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span className="font-semibold">
                    - Rs. {discount.toFixed(2)}
                  </span>
                </div>
              )}
            </div>

            <div className="mb-6 flex justify-between text-xl font-bold text-gray-900">
              <span>Total</span>
              <span>Rs. {Math.max(0, finalTotal).toFixed(2)}</span>
            </div>

            {/* Coupon Form */}
            <div className="mb-6">
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter coupon code"
                  className="flex-1 rounded-xl border border-gray-300 px-4 py-2 focus:border-[#E4002B] focus:outline-none focus:ring-1 focus:ring-[#E4002B]"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                />
                <button
                  type="submit"
                  disabled={applyingCoupon || !couponCode.trim()}
                  className="rounded-xl bg-gray-900 px-4 py-2 font-semibold text-white transition hover:bg-gray-800 disabled:opacity-50"
                >
                  {applyingCoupon ? "..." : "Apply"}
                </button>
              </form>
              {couponMessage.text && (
                <p
                  className={`mt-2 text-sm ${
                    couponMessage.type === "success"
                      ? "text-green-600"
                      : "text-red-500"
                  }`}
                >
                  {couponMessage.text}
                </p>
              )}
            </div>

            <button
              onClick={handleCheckout}
              disabled={cart.length === 0}
              className="w-full rounded-full bg-[#E4002B] py-4 text-lg font-bold text-white shadow-lg transition hover:bg-red-700 hover:shadow-xl disabled:cursor-not-allowed disabled:bg-gray-400 disabled:shadow-none"
            >
              Proceed to Checkout
            </button>
            {cart.length === 0 && (
              <p className="mt-2 text-center text-sm text-red-500">
                Please add items to your cart to proceed.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
