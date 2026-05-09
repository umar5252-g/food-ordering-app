import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Minus, Plus, ShoppingCart, ArrowLeft, Star } from "lucide-react";
import api from "../api/axios";
import toast from "react-hot-toast";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import ImageWithFallback from "../components/ImageWithFallback";

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { isAuthenticated, user } = useAuth();

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);

  // Review form state
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "" });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewError, setReviewError] = useState(null);

  useEffect(() => {
    const fetchProductAndReviews = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch product
        const productRes = await api.get(`/products/${id}`);
        setProduct(productRes.data.data);

        // Fetch reviews (might fail if endpoint doesn't exist yet, so we catch silently)
        try {
          const reviewsRes = await api.get(`/reviews?productId=${id}`);
          setReviews(reviewsRes.data.data || []);
        } catch (revErr) {
          console.warn("Reviews endpoint might not be ready:", revErr);
          setReviews([]);
        }
      } catch (err) {
        const message = err.response?.data?.message || "Failed to load product";
        setError(message);
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };

    fetchProductAndReviews();
  }, [id]);

  const handleQuantityChange = (delta) => {
    setQuantity((prev) => Math.max(1, prev + delta));
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewForm.comment.trim()) return;

    try {
      setSubmittingReview(true);
      setReviewError(null);
      const res = await api.post("/reviews", {
        productId: id,
        rating: reviewForm.rating,
        comment: reviewForm.comment,
      });
      // Add the new review to the list
      setReviews((prev) => [res.data.data, ...prev]);
      setReviewForm({ rating: 5, comment: "" });
    } catch (err) {
      setReviewError(err.response?.data?.message || "Failed to submit review");
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#E4002B] border-t-transparent"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="mb-4 text-2xl font-bold text-red-600">Error</h2>
        <p className="mb-8 text-gray-600">{error || "Product not found"}</p>
        <Link
          to="/menu"
          className="inline-flex items-center gap-2 rounded-full bg-[#E4002B] px-6 py-3 font-semibold text-white transition hover:bg-red-700"
        >
          <ArrowLeft className="h-5 w-5" />
          Back to Menu
        </Link>
      </div>
    );
  }

  // Calculate average rating
  const avgRating =
    reviews.length > 0
      ? (
          reviews.reduce((sum, rev) => sum + rev.rating, 0) / reviews.length
        ).toFixed(1)
      : 0;

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <Link
        to="/menu"
        className="mb-8 inline-flex items-center gap-2 text-gray-600 transition hover:text-[#E4002B]"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Menu
      </Link>

      {/* Top Layout: Image & Details */}
      <div className="mb-16 grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-12">
        {/* Left Side: Image */}
        <div className="overflow-hidden rounded-2xl bg-white p-4 shadow-sm">
          <ImageWithFallback
            src={product.image}
            alt={product.name}
            className="h-auto w-full object-cover rounded-xl"
          />
        </div>

        {/* Right Side: Details */}
        <div className="flex flex-col justify-center">
          <div className="mb-2">
            <span className="inline-block rounded-full bg-gray-200 px-3 py-1 text-sm font-semibold text-gray-700 uppercase tracking-wide">
              {product.category}
            </span>
          </div>
          <h1 className="mb-4 text-4xl font-extrabold text-gray-900 sm:text-5xl">
            {product.name}
          </h1>
          <p className="mb-6 text-3xl font-bold text-[#E4002B]">
            ${product.price?.toFixed(2)}
          </p>
          <p className="mb-8 text-lg leading-relaxed text-gray-600">
            {product.description}
          </p>

          <div className="mb-8 flex items-center gap-4">
            <span className="font-semibold text-gray-700">Quantity:</span>
            <div className="flex items-center rounded-full border border-gray-300 bg-white">
              <button
                onClick={() => handleQuantityChange(-1)}
                className="p-3 text-gray-600 transition hover:text-[#E4002B]"
                disabled={quantity <= 1}
              >
                <Minus className="h-5 w-5" />
              </button>
              <span className="w-12 text-center font-semibold text-lg">
                {quantity}
              </span>
              <button
                onClick={() => handleQuantityChange(1)}
                className="p-3 text-gray-600 transition hover:text-[#E4002B]"
              >
                <Plus className="h-5 w-5" />
              </button>
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-[#E4002B] py-4 text-lg font-bold text-white shadow-lg transition hover:bg-red-700 hover:shadow-xl active:scale-[0.98]"
          >
            <ShoppingCart className="h-6 w-6" />
            Add to Cart
          </button>
        </div>
      </div>

      {/* Below: Reviews Section */}
      <div className="border-t border-gray-200 pt-12">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Reviews</h2>
            <div className="mt-2 flex items-center gap-2">
              <Star className="h-6 w-6 fill-[#E4002B] text-[#E4002B]" />
              <span className="text-xl font-bold text-gray-900">
                {avgRating}
              </span>
              <span className="text-gray-500">
                ({reviews.length} {reviews.length === 1 ? "review" : "reviews"})
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
          {/* List of reviews */}
          <div className="lg:col-span-2 space-y-6">
            {reviews.length === 0 ? (
              <p className="text-gray-500 italic">
                No reviews yet. Be the first to review!
              </p>
            ) : (
              reviews.map((review, idx) => (
                <div
                  key={review._id || idx}
                  className="rounded-xl bg-white p-6 shadow-sm"
                >
                  <div className="mb-4 flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-gray-900">
                        {review.user?.name || review.username || "Anonymous"}
                      </h4>
                      <span className="text-sm text-gray-500">
                        {review.createdAt
                          ? new Date(review.createdAt).toLocaleDateString()
                          : "Just now"}
                      </span>
                    </div>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < review.rating
                              ? "fill-yellow-400 text-yellow-400"
                              : "fill-gray-200 text-gray-200"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-700">{review.comment}</p>
                </div>
              ))
            )}
          </div>

          {/* Review form (if logged in) */}
          <div className="lg:col-span-1">
            {isAuthenticated ? (
              <div className="rounded-2xl bg-gray-100 p-6">
                <h3 className="mb-4 text-xl font-bold text-gray-900">
                  Write a Review
                </h3>
                {reviewError && (
                  <div className="mb-4 rounded-lg bg-red-100 p-3 text-sm text-red-700">
                    {reviewError}
                  </div>
                )}
                <form onSubmit={handleReviewSubmit}>
                  <div className="mb-4">
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Rating
                    </label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          type="button"
                          key={star}
                          onClick={() =>
                            setReviewForm((prev) => ({ ...prev, rating: star }))
                          }
                          className="focus:outline-none"
                        >
                          <Star
                            className={`h-8 w-8 transition ${
                              star <= reviewForm.rating
                                ? "fill-yellow-400 text-yellow-400"
                                : "fill-gray-300 text-gray-300"
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="comment"
                      className="mb-2 block text-sm font-medium text-gray-700"
                    >
                      Your Review
                    </label>
                    <textarea
                      id="comment"
                      rows="4"
                      className="w-full rounded-xl border border-gray-300 p-3 focus:border-[#E4002B] focus:ring-[#E4002B]"
                      placeholder="What did you think of this item?"
                      value={reviewForm.comment}
                      onChange={(e) =>
                        setReviewForm((prev) => ({
                          ...prev,
                          comment: e.target.value,
                        }))
                      }
                      required
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="w-full rounded-full bg-gray-900 py-3 font-semibold text-white transition hover:bg-gray-800 disabled:opacity-50"
                  >
                    {submittingReview ? "Submitting..." : "Submit Review"}
                  </button>
                </form>
              </div>
            ) : (
              <div className="rounded-2xl bg-gray-100 p-6 text-center">
                <h3 className="mb-2 text-lg font-bold text-gray-900">
                  Sign in to review
                </h3>
                <p className="mb-4 text-sm text-gray-600">
                  Share your thoughts with other customers.
                </p>
                <Link
                  to="/login"
                  className="inline-block w-full rounded-full bg-gray-900 py-3 font-semibold text-white transition hover:bg-gray-800"
                >
                  Log In
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
