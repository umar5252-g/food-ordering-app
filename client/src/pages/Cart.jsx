import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

const Cart = () => {
  const { cart, total, updateQuantity, removeFromCart, clearCart } = useCart();
  const { user, logout } = useAuth();

  const handleQuantityChange = (productId, newQuantity) => {
    updateQuantity(productId, newQuantity);
  };

  const handleRemoveItem = (productId) => {
    removeFromCart(productId);
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-950">
        {/* Header */}
        <header className="bg-gray-900 border-b border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <Link to="/" className="text-2xl font-bold text-white">
                Flavor <span className="text-brand-600">Point</span>
              </Link>

              <div className="flex items-center space-x-4">
                <Link
                  to="/menu"
                  className="bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                >
                  Continue Shopping
                </Link>

                {user && (
                  <div className="flex items-center space-x-4">
                    <span className="text-gray-300">Hi, {user.name}</span>
                    <Link
                      to="/profile"
                      className="text-gray-300 hover:text-white"
                    >
                      Profile
                    </Link>
                    <button
                      onClick={logout}
                      className="text-gray-300 hover:text-white"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="text-6xl mb-4">🛒</div>
            <h1 className="text-3xl font-bold text-white mb-4">
              Your cart is empty
            </h1>
            <p className="text-gray-400 mb-8">
              Add some delicious items from our menu!
            </p>
            <Link
              to="/menu"
              className="bg-brand-600 hover:bg-brand-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200"
            >
              Browse Menu
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="text-2xl font-bold text-white">
              Flavor <span className="text-brand-600">Point</span>
            </Link>

            <div className="flex items-center space-x-4">
              <Link
                to="/menu"
                className="bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
              >
                Continue Shopping
              </Link>

              {user && (
                <div className="flex items-center space-x-4">
                  <span className="text-gray-300">Hi, {user.name}</span>
                  <Link
                    to="/profile"
                    className="text-gray-300 hover:text-white"
                  >
                    Profile
                  </Link>
                  <button
                    onClick={logout}
                    className="text-gray-300 hover:text-white"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-white mb-8">Your Cart</h1>

        <div className="space-y-4">
          {cart.map((item) => (
            <div
              key={item._id}
              className="bg-gray-900 rounded-lg p-6 border border-gray-800"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                  )}
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      {item.name}
                    </h3>
                    <p className="text-gray-400 text-sm">{item.description}</p>
                    <p className="text-brand-400 font-semibold">
                      ${item.price}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() =>
                        handleQuantityChange(item._id, item.quantity - 1)
                      }
                      className="bg-gray-800 hover:bg-gray-700 text-white w-8 h-8 rounded flex items-center justify-center"
                    >
                      -
                    </button>
                    <span className="text-white w-8 text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        handleQuantityChange(item._id, item.quantity + 1)
                      }
                      className="bg-gray-800 hover:bg-gray-700 text-white w-8 h-8 rounded flex items-center justify-center"
                    >
                      +
                    </button>
                  </div>

                  <div className="text-right">
                    <p className="text-white font-semibold">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>

                  <button
                    onClick={() => handleRemoveItem(item._id)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="mt-8 bg-gray-900 rounded-lg p-6 border border-gray-800">
          <div className="flex justify-between items-center mb-4">
            <span className="text-xl font-semibold text-white">Total:</span>
            <span className="text-2xl font-bold text-brand-400">
              ${total.toFixed(2)}
            </span>
          </div>

          <div className="flex space-x-4">
            <button
              onClick={clearCart}
              className="flex-1 bg-gray-800 hover:bg-gray-700 text-white py-3 px-4 rounded-lg font-medium transition-colors duration-200"
            >
              Clear Cart
            </button>
            <button className="flex-1 bg-brand-600 hover:bg-brand-700 text-white py-3 px-4 rounded-lg font-medium transition-colors duration-200">
              Place Order
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Cart;
