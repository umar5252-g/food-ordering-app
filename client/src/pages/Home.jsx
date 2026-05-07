import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Zap, Clock, DollarSign, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import api from "../api/axios";
import ProductCard from "../components/ProductCard";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchProducts = async () => {
    try {
      const response = await api.get("/products");
      setProducts(response.data.data.slice(0, 6));
    } catch (err) {
      const message = err.response?.data?.message || "Failed to load products";
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
    { name: "Chicken", emoji: "🍗", id: "chicken" },
    { name: "Sides", emoji: "🍟", id: "sides" },
    { name: "Drinks", emoji: "🥤", id: "drinks" },
    { name: "Desserts", emoji: "🍰", id: "desserts" },
  ];

  const whyChooseUs = [
    {
      icon: Zap,
      title: "Fresh Ingredients",
      description: "Only the freshest and finest ingredients",
    },
    {
      icon: Clock,
      title: "Fast Delivery",
      description: "Hot and fresh, delivered to your door",
    },
    {
      icon: DollarSign,
      title: "Best Price",
      description: "Unbeatable prices on quality food",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-screen min-h-96 max-h-screen overflow-hidden bg-gradient-to-r from-black/60 to-black/40">
        <img
          src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=1200&h=600&fit=crop"
          alt="Hero Banner"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />

        <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center">
          <h1 className="mb-4 text-5xl font-black tracking-tight text-white md:text-6xl lg:text-7xl">
            Taste the Difference
          </h1>
          <p className="mb-8 max-w-2xl text-lg text-gray-100 md:text-xl">
            Experience mouth-watering flavors crafted with fresh ingredients and
            delivered hot to your door
          </p>

          <div className="flex flex-col gap-4 sm:flex-row">
            <Link
              to="/menu"
              className="inline-flex items-center justify-center rounded-full bg-[#E4002B] px-8 py-4 text-lg font-bold text-white transition hover:bg-red-700"
            >
              Order Now
            </Link>
            <Link
              to="/menu"
              className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-white bg-transparent px-8 py-4 text-lg font-bold text-white transition hover:bg-white/10"
            >
              View Menu
              <ChevronRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Categories Section */}
      <section className="bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8">
            <h2 className="text-3xl font-black text-gray-900">
              Featured Categories
            </h2>
          </div>

          <div className="flex gap-4 overflow-x-auto pb-4">
            {categories.map((category) => (
              <Link
                key={category.id}
                to={`/menu?category=${category.id}`}
                className="flex min-w-max flex-col items-center gap-3 rounded-2xl bg-white p-6 shadow-md transition hover:shadow-lg hover:translate-y-[-4px]"
              >
                <span className="text-5xl">{category.emoji}</span>
                <span className="font-semibold text-gray-900">
                  {category.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Bestsellers Section */}
      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8">
            <h2 className="text-3xl font-black text-gray-900">
              Our Bestsellers
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
                No featured dishes available
              </p>
              <p className="mt-2 text-gray-500">
                Check back soon for our latest menu items.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Deals Section */}
      <section className="bg-[#E4002B] px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-2xl bg-white/10 p-8 text-center backdrop-blur-sm md:p-12">
            <h3 className="mb-2 text-3xl font-black text-white md:text-4xl">
              Family Deal
            </h3>
            <p className="mb-6 text-lg text-gray-100">
              2 Burgers + 4 Sides + 2 Drinks
            </p>
            <div className="mb-8 flex flex-col items-center gap-2 sm:flex-row sm:justify-center">
              <span className="text-5xl font-black text-white">$49.99</span>
              <span className="text-lg font-semibold text-red-200 line-through">
                $69.99
              </span>
            </div>
            <Link
              to="/menu"
              className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-3 text-lg font-bold text-[#E4002B] transition hover:bg-gray-100"
            >
              Order Now
              <ChevronRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-black text-gray-900">Why Choose Us</h2>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {whyChooseUs.map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={index}
                  className="rounded-2xl bg-white p-8 text-center shadow-md transition hover:shadow-lg"
                >
                  <div className="mb-4 inline-flex rounded-full bg-red-50 p-4">
                    <Icon className="h-6 w-6 text-[#E4002B]" />
                  </div>
                  <h3 className="mb-2 text-lg font-bold text-gray-900">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-[#E4002B] to-red-700 px-4 py-12 text-center sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl">
          <h2 className="mb-4 text-3xl font-black text-white">
            Ready to Order?
          </h2>
          <p className="mb-8 text-lg text-red-100">
            Browse our full menu and satisfy your cravings
          </p>
          <Link
            to="/menu"
            className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-3 text-lg font-bold text-[#E4002B] transition hover:bg-gray-100"
          >
            View Full Menu
            <ChevronRight className="h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
