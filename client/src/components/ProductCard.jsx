import { ShoppingCart, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

const placeholderImage =
  "https://via.placeholder.com/600x400?text=Delicious+Food";

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
  };

  return (
    <Link to={`/product/${product._id}`} className="block group">
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-md transition group-hover:shadow-xl">
        <img
          src={product.image || placeholderImage}
          alt={product.name}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = placeholderImage;
          }}
          className="h-48 w-full object-cover transition group-hover:scale-105"
        />

        <div className="p-4">
          <div className="mb-2 flex items-start justify-between gap-2">
            <h3 className="text-sm font-bold text-gray-900 line-clamp-2 group-hover:text-[#E4002B] transition">
              {product.name}
            </h3>
            {product.isAvailable ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-1 text-xs font-semibold text-green-700 whitespace-nowrap">
                <span className="h-2 w-2 rounded-full bg-green-600" />
                Available
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2 py-1 text-xs font-semibold text-red-700 whitespace-nowrap">
                <span className="h-2 w-2 rounded-full bg-red-600" />
                Unavailable
              </span>
            )}
          </div>

          <p className="mb-3 text-xs text-gray-600 line-clamp-2">
            {product.description}
          </p>

          <div className="mb-4 flex items-center justify-between">
            <span className="text-lg font-bold text-[#E4002B]">
              ${product.price.toFixed(2)}
            </span>
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-xs font-semibold text-gray-700">4.5</span>
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={!product.isAvailable}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-[#E4002B] px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ShoppingCart className="h-4 w-4" />
            Add to Cart
          </button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
