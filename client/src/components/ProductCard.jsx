import { useState } from "react";
import { ShoppingCart, Star, Check } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import ImageWithFallback from "./ImageWithFallback";

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <Link to={`/product/${product._id}`} className="block group">
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-md transition group-hover:shadow-xl">
        <div className="h-48 w-full overflow-hidden bg-gray-100">
          <ImageWithFallback
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
        </div>

        <div className="p-4 flex flex-col h-[200px]">
          <div className="mb-2 flex items-start justify-between gap-2">
            <h3 className="text-lg font-bold text-gray-900 line-clamp-1 group-hover:text-[#E4002B] transition">
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

          <p className="mb-auto text-sm text-gray-600 line-clamp-2">
            {product.description}
          </p>

          <div className="my-4 flex items-center justify-between">
            <span className="text-xl font-black text-[#E4002B]">
              ${product.price.toFixed(2)}
            </span>
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-semibold text-gray-700">4.5</span>
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={!product.isAvailable || isAdded}
            className={`flex w-full items-center justify-center gap-2 rounded-full px-4 py-3 text-sm font-bold text-white transition ${
              isAdded 
                ? "bg-green-600 hover:bg-green-700" 
                : "bg-[#E4002B] hover:bg-red-700"
            } disabled:opacity-70 disabled:cursor-not-allowed`}
          >
            {isAdded ? (
              <>
                <Check className="h-4 w-4" />
                Added!
              </>
            ) : (
              <>
                <ShoppingCart className="h-4 w-4" />
                Add to Cart
              </>
            )}
          </button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
