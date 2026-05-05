import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Search, ChevronRight, Loader2 } from "lucide-react";
import api from "../api/axios";
import ProductCard from "../components/ProductCard";

const Menu = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("category") || "all",
  );

  const categories = [
    { id: "all", label: "All" },
    { id: "burgers", label: "Burgers" },
    { id: "chicken", label: "Chicken" },
    { id: "pizza", label: "Pizza" },
    { id: "pasta", label: "Pasta" },
    { id: "salads", label: "Salads" },
    { id: "sides", label: "Sides" },
    { id: "drinks", label: "Drinks" },
    { id: "desserts", label: "Desserts" },
  ];

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (selectedCategory !== "all") {
      setSearchParams({ category: selectedCategory });
    } else {
      setSearchParams({});
    }
  }, [selectedCategory, setSearchParams]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await api.get("/products");
      setProducts(response.data.data);
    } catch (err) {
      setError("Failed to load products");
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      selectedCategory === "all" || product.category === selectedCategory;
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  const LoadingSkeleton = () => (
    <div className="flex h-64 items-center justify-center">
      <Loader2 className="h-12 w-12 animate-spin text-[#E4002B]" />
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Page Header Banner */}
      <section className="bg-gradient-to-r from-[#E4002B] to-red-700 px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-4 flex items-center gap-2 text-red-100">
            <Link to="/" className="hover:text-white transition">
              Home
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span>Menu</span>
          </div>
          <h1 className="text-4xl font-black text-white md:text-5xl">
            Our Menu
          </h1>
          <p className="mt-2 max-w-xl text-lg text-red-100">
            Explore our delicious selection of fresh, quality dishes
          </p>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search dishes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-full border border-gray-300 bg-white py-3 pl-12 pr-4 text-gray-900 placeholder-gray-500 focus:border-[#E4002B] focus:outline-none focus:ring-2 focus:ring-[#E4002B]/10"
            />
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div className="mb-8 flex flex-wrap gap-2 border-b border-gray-200 pb-4">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryChange(category.id)}
              className={`rounded-full px-4 py-2 font-semibold transition ${
                selectedCategory === category.id
                  ? "bg-[#E4002B] text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>

        {/* Error State */}
        {error && (
          <div className="mb-8 rounded-2xl bg-red-50 p-6 text-center">
            <p className="text-red-700">{error}</p>
            <button
              onClick={fetchProducts}
              className="mt-4 inline-flex rounded-full bg-red-600 px-6 py-2 font-semibold text-white hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Loading State */}
        {loading && <LoadingSkeleton />}

        {/* No Results State */}
        {!loading && !error && filteredProducts.length === 0 && (
          <div className="rounded-2xl bg-gray-50 py-12 text-center">
            <p className="text-lg text-gray-600">
              {searchTerm
                ? `No dishes found matching "${searchTerm}"`
                : "No products available in this category"}
            </p>
          </div>
        )}

        {/* Products Grid */}
        {!loading && !error && filteredProducts.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}

        {/* Results Count */}
        {!loading && !error && filteredProducts.length > 0 && (
          <div className="mt-8 text-center text-sm text-gray-600">
            Showing {filteredProducts.length} of {products.length} products
          </div>
        )}
      </main>
    </div>
  );
};

export default Menu;
