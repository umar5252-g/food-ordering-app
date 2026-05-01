import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

const Menu = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const { addToCart, getCartItemCount } = useCart();
  const { user, logout } = useAuth();

  const categories = [
    "all",
    "burgers",
    "pizza",
    "pasta",
    "salads",
    "drinks",
    "desserts",
  ];

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await api.get("/products");
      setProducts(response.data.data);
    } catch (error) {
      setError("Failed to load products");
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts =
    selectedCategory === "all"
      ? products
      : products.filter((product) => product.category === selectedCategory);

  const handleAddToCart = (product) => {
    addToCart(product);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-white text-xl">Loading menu...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 text-xl mb-4">{error}</div>
          <button
            onClick={fetchProducts}
            className="bg-brand-600 hover:bg-brand-700 text-white px-6 py-2 rounded-lg"
          >
            Try Again
          </button>
        </div>
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
                to="/cart"
                className="relative bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
              >
                Cart ({getCartItemCount()})
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

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">Our Menu</h1>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 capitalize ${
                  selectedCategory === category
                    ? "bg-brand-600 text-white"
                    : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product._id}
              className="bg-gray-900 rounded-lg overflow-hidden border border-gray-800 hover:border-gray-700 transition-colors duration-200"
            >
              {product.image && (
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-4">
                <h3 className="text-lg font-semibold text-white mb-2">
                  {product.name}
                </h3>
                <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                  {product.description}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-brand-400 font-bold text-lg">
                    ${product.price}
                  </span>
                  <button
                    onClick={() => handleAddToCart(product)}
                    disabled={!product.isAvailable}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                      product.isAvailable
                        ? "bg-brand-600 hover:bg-brand-700 text-white"
                        : "bg-gray-700 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    {product.isAvailable ? "Add to Cart" : "Unavailable"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">
              No products found in this category.
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Menu;
