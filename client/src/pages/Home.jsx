import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import api from "../api/axios";
import ProductCard from "../components/ProductCard";
import HeroCarousel from "../components/HeroCarousel";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchProducts = async () => {
    try {
      const response = await api.get("/products?featured=true");
      setProducts(response.data.data);
    } catch (err) {
      const message = err.response?.data?.message || "Failed to load popular items";
      setError(message);
      toast.error(message);
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const categories = [
    { name: "Burgers", emoji: "🍔", id: "burgers" },
    { name: "Pizza", emoji: "🍕", id: "pizza" },
    { name: "Chicken", emoji: "🍗", id: "chicken" },
    { name: "Sides", emoji: "🍟", id: "sides" },
    { name: "Drinks", emoji: "🥤", id: "drinks" },
    { name: "Desserts", emoji: "🍰", id: "desserts" },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Carousel */}
      <HeroCarousel />

      {/* Categories Section */}
      <section className="bg-gray-50 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-black text-gray-900 md:text-4xl">
              Browse by Category
            </h2>
          </div>

          <div className="grid grid-cols-3 gap-4 md:grid-cols-6 lg:gap-6">
            {categories.map((category) => (
              <Link
                key={category.id}
                to={`/menu?category=${category.id}`}
                className="flex flex-col items-center justify-center gap-3 rounded-3xl bg-white p-6 shadow-sm border border-gray-100 transition hover:shadow-xl hover:border-red-100 hover:-translate-y-1"
              >
                <span className="text-4xl md:text-5xl">{category.emoji}</span>
                <span className="font-semibold text-gray-900 text-sm md:text-base">
                  {category.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Items Section */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-black text-gray-900 md:text-4xl">
              Popular Items
            </h2>
          </div>

          {loading ? (
            <div className="flex h-64 items-center justify-center">
              <Loader2 className="h-12 w-12 animate-spin text-[#E4002B]" />
            </div>
          ) : error ? (
            <div className="rounded-2xl bg-red-50 p-6 text-center text-red-700">
              {error}
            </div>
          ) : products.length === 0 ? (
            <div className="rounded-2xl bg-gray-50 p-12 text-center">
              <p className="text-lg font-semibold text-gray-900">
                No popular items available right now.
              </p>
              <p className="mt-2 text-gray-500">
                Check back soon for our featured dishes.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
