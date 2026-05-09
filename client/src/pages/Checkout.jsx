import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import {
  MapPin,
  CreditCard,
  Banknote,
  Smartphone,
  Loader2,
  ArrowLeft,
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../api/axios";
import ImageWithFallback from "../components/ImageWithFallback";

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, total, clearCart } = useCart();
  const { isAuthenticated, loading: authLoading, user } = useAuth();

  useEffect(() => {
    // Wait until auth loading is finished to redirect
    if (!authLoading && !isAuthenticated) {
      toast.error("Please login to proceed to checkout");
      navigate("/login");
    } else if (cart.length === 0) {
      navigate("/cart");
    }
  }, [isAuthenticated, authLoading, navigate, cart.length]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    fullName: user?.name || "",
    phone: "",
    orderType: "Delivery",
    address: "",
    city: "",
    paymentMethod: "Cash on Delivery",
    cardNumber: "",
    expiry: "",
    cvv: "",
  });

  useEffect(() => {
    if (user?.name && !formData.fullName) {
      setFormData((prev) => ({ ...prev, fullName: user.name }));
    }
  }, [user?.name, formData.fullName]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const deliveryFee = formData.orderType === "Delivery" ? 150 : 0;
  const discount = 0; // Assume 0 unless fetched from somewhere else
  const finalTotal = total + deliveryFee - discount;

  const validate = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Full Name is required";

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\+?\d{10,15}$/.test(formData.phone.replace(/[\s-]/g, ""))) {
      newErrors.phone = "Phone must be 10 to 15 digits";
    }

    if (formData.orderType === "Delivery") {
      if (!formData.address.trim()) newErrors.address = "Address is required";
      if (!formData.city.trim()) newErrors.city = "City is required";
    }

    if (formData.paymentMethod === "Card") {
      if (!formData.cardNumber.trim())
        newErrors.cardNumber = "Card number is required";
      if (!formData.expiry.trim()) newErrors.expiry = "Expiry date is required";
      if (!formData.cvv.trim()) newErrors.cvv = "CVV is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return toast.error("Please fix the errors in the form.");
    }

    setIsSubmitting(true);

    try {
      const orderPayload = {
        items: cart.map((item) => ({
          product: item._id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
        })),
        orderType: formData.orderType,
        deliveryAddress:
          formData.orderType === "Delivery"
            ? { address: formData.address, city: formData.city }
            : null,
        paymentMethod: formData.paymentMethod,
        totalPrice: finalTotal,
        customerDetails: {
          name: formData.fullName,
          phone: formData.phone,
        },
      };

      const res = await api.post("/orders", orderPayload);
      const orderId = res.data?.data?._id || res.data?._id || "success";

      toast.success("Order placed successfully!");
      clearCart();
      navigate(`/order-confirmation/${orderId}`);
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Failed to place order. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading || (!isAuthenticated && cart.length > 0)) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-[#E4002B]" />
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center gap-2 text-sm font-medium text-gray-600 transition hover:text-[#E4002B]"
      >
        <ArrowLeft className="h-4 w-4" /> Go Back
      </button>

      <h1 className="mb-8 text-3xl font-extrabold text-gray-900 sm:text-4xl">
        Checkout
      </h1>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 gap-8 lg:grid-cols-3 lg:gap-12"
      >
        {/* LEFT SIDE: Delivery Details & Payment Form */}
        <div className="lg:col-span-2 space-y-8">
          {/* Order Details Section */}
          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-6 flex items-center gap-2 text-xl font-bold text-gray-900">
              <MapPin className="h-6 w-6 text-[#E4002B]" /> Delivery Details
            </h2>

            <div className="mb-6 grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() =>
                  setFormData((prev) => ({ ...prev, orderType: "Delivery" }))
                }
                className={`rounded-xl border p-4 text-center font-bold transition ${
                  formData.orderType === "Delivery"
                    ? "border-[#E4002B] bg-red-50 text-[#E4002B]"
                    : "border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
                Delivery
              </button>
              <button
                type="button"
                onClick={() =>
                  setFormData((prev) => ({ ...prev, orderType: "Pickup" }))
                }
                className={`rounded-xl border p-4 text-center font-bold transition ${
                  formData.orderType === "Pickup"
                    ? "border-[#E4002B] bg-red-50 text-[#E4002B]"
                    : "border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
                Pickup
              </button>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className={`w-full rounded-xl border ${errors.fullName ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "border-gray-300 focus:border-[#E4002B] focus:ring-[#E4002B]"} px-4 py-3 focus:outline-none focus:ring-1`}
                  placeholder="John Doe"
                />
                {errors.fullName && (
                  <p className="mt-1 text-sm text-red-500">{errors.fullName}</p>
                )}
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`w-full rounded-xl border ${errors.phone ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "border-gray-300 focus:border-[#E4002B] focus:ring-[#E4002B]"} px-4 py-3 focus:outline-none focus:ring-1`}
                  placeholder="03001234567"
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
                )}
              </div>

              {formData.orderType === "Delivery" && (
                <>
                  <div className="sm:col-span-2">
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Full Address
                    </label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      rows="2"
                      className={`w-full rounded-xl border ${errors.address ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "border-gray-300 focus:border-[#E4002B] focus:ring-[#E4002B]"} px-4 py-3 focus:outline-none focus:ring-1`}
                      placeholder="Street 123, House 45, Area"
                    ></textarea>
                    {errors.address && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.address}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      City
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className={`w-full rounded-xl border ${errors.city ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "border-gray-300 focus:border-[#E4002B] focus:ring-[#E4002B]"} px-4 py-3 focus:outline-none focus:ring-1`}
                      placeholder="Lahore"
                    />
                    {errors.city && (
                      <p className="mt-1 text-sm text-red-500">{errors.city}</p>
                    )}
                  </div>
                </>
              )}
            </div>
          </section>

          {/* Payment Method Section */}
          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-6 flex items-center gap-2 text-xl font-bold text-gray-900">
              <CreditCard className="h-6 w-6 text-[#E4002B]" /> Payment Method
            </h2>

            <div className="space-y-4">
              <label
                className={`flex cursor-pointer items-center justify-between rounded-xl border p-4 transition ${
                  formData.paymentMethod === "Cash on Delivery"
                    ? "border-[#E4002B] bg-red-50"
                    : "border-gray-200 hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Banknote
                    className={`h-6 w-6 ${formData.paymentMethod === "Cash on Delivery" ? "text-[#E4002B]" : "text-gray-500"}`}
                  />
                  <span className="font-semibold text-gray-900">
                    Cash on Delivery
                  </span>
                </div>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="Cash on Delivery"
                  checked={formData.paymentMethod === "Cash on Delivery"}
                  onChange={handleChange}
                  className="h-5 w-5 accent-[#E4002B]"
                />
              </label>

              <label
                className={`flex cursor-pointer items-center justify-between rounded-xl border p-4 transition ${
                  formData.paymentMethod === "JazzCash"
                    ? "border-[#E4002B] bg-red-50"
                    : "border-gray-200 hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Smartphone
                    className={`h-6 w-6 ${formData.paymentMethod === "JazzCash" ? "text-[#E4002B]" : "text-gray-500"}`}
                  />
                  <span className="font-semibold text-gray-900">JazzCash</span>
                </div>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="JazzCash"
                  checked={formData.paymentMethod === "JazzCash"}
                  onChange={handleChange}
                  className="h-5 w-5 accent-[#E4002B]"
                />
              </label>

              <label
                className={`flex cursor-pointer items-center justify-between rounded-xl border p-4 transition ${
                  formData.paymentMethod === "Card"
                    ? "border-[#E4002B] bg-red-50"
                    : "border-gray-200 hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <CreditCard
                    className={`h-6 w-6 ${formData.paymentMethod === "Card" ? "text-[#E4002B]" : "text-gray-500"}`}
                  />
                  <span className="font-semibold text-gray-900">
                    Credit / Debit Card
                  </span>
                </div>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="Card"
                  checked={formData.paymentMethod === "Card"}
                  onChange={handleChange}
                  className="h-5 w-5 accent-[#E4002B]"
                />
              </label>

              {/* Card Details Conditional Fields */}
              {formData.paymentMethod === "Card" && (
                <div className="mt-4 grid grid-cols-2 gap-4 rounded-xl bg-gray-50 p-4 border border-gray-200 animate-in fade-in slide-in-from-top-2">
                  <div className="col-span-2">
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Card Number
                    </label>
                    <input
                      type="text"
                      name="cardNumber"
                      value={formData.cardNumber}
                      onChange={handleChange}
                      placeholder="0000 0000 0000 0000"
                      className={`w-full rounded-xl border ${errors.cardNumber ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "border-gray-300 focus:border-[#E4002B] focus:ring-[#E4002B]"} px-4 py-3 focus:outline-none focus:ring-1`}
                    />
                    {errors.cardNumber && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.cardNumber}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Expiry (MM/YY)
                    </label>
                    <input
                      type="text"
                      name="expiry"
                      value={formData.expiry}
                      onChange={handleChange}
                      placeholder="MM/YY"
                      className={`w-full rounded-xl border ${errors.expiry ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "border-gray-300 focus:border-[#E4002B] focus:ring-[#E4002B]"} px-4 py-3 focus:outline-none focus:ring-1`}
                    />
                    {errors.expiry && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.expiry}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      CVV
                    </label>
                    <input
                      type="text"
                      name="cvv"
                      value={formData.cvv}
                      onChange={handleChange}
                      placeholder="123"
                      className={`w-full rounded-xl border ${errors.cvv ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "border-gray-300 focus:border-[#E4002B] focus:ring-[#E4002B]"} px-4 py-3 focus:outline-none focus:ring-1`}
                    />
                    {errors.cvv && (
                      <p className="mt-1 text-sm text-red-500">{errors.cvv}</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* RIGHT SIDE: Order Summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 rounded-2xl border border-gray-200 bg-gray-50 p-6 shadow-sm">
            <h2 className="mb-6 text-xl font-bold text-gray-900">
              Order Summary
            </h2>

            {/* Cart Items Summary */}
            <div className="mb-6 max-h-64 overflow-y-auto space-y-4 pr-2 border-b border-gray-200 pb-6">
              {cart.map((item) => (
                <div key={item._id} className="flex gap-4">
                  <div className="h-16 w-16 shrink-0 rounded-lg bg-white p-1 border border-gray-200">
                    <ImageWithFallback
                      src={item.image}
                      alt={item.name}
                      className="h-full w-full rounded object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-bold text-gray-900 line-clamp-1">
                      {item.name}
                    </h4>
                    <p className="text-xs text-gray-500">
                      Qty: {item.quantity}
                    </p>
                    <p className="mt-1 text-sm font-semibold text-[#E4002B]">
                      Rs. {(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-gray-900">
                  Rs. {total.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span className="font-semibold text-gray-900">
                  Rs. {deliveryFee.toFixed(2)}
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

            <div className="my-6 flex justify-between border-t border-gray-200 pt-4 text-xl font-bold text-gray-900">
              <span>Total</span>
              <span>Rs. {Math.max(0, finalTotal).toFixed(2)}</span>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-[#E4002B] py-4 text-lg font-bold text-white shadow-lg transition hover:bg-red-700 hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" /> Processing...
                </>
              ) : (
                "Place Order"
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Checkout;
