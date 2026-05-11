import { useState, useEffect, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";

const deals = [
  {
    id: 1,
    title: "Family Feast Bundle",
    subtitle: "Feed the whole family!",
    description: "4 Burgers + 2 Large Fries + 4 Drinks + Dipping Sauces",
    price: 2499,
    originalPrice: 3800,
    image: "/deal_family_feast.png",
    cta: "Order Now",
    link: "/menu",
    badge: "BEST VALUE",
  },
  {
    id: 2,
    title: "Burger Combo Deal",
    subtitle: "Grab your favorite!",
    description: "Any Premium Burger + Fries + Drink",
    price: 899,
    originalPrice: 1300,
    image: "/deal_burger_combo.png",
    cta: "Grab This Deal",
    link: "/menu?category=burgers",
    badge: "MOST POPULAR",
  },
  {
    id: 3,
    title: "Pizza Mania",
    subtitle: "Cheesy goodness awaits!",
    description: "2 Large Pizzas + Garlic Bread + 2 Drinks",
    price: 1999,
    originalPrice: 3200,
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=1400&h=700&fit=crop",
    cta: "Order Pizzas",
    link: "/menu?category=pizza",
    badge: "37% OFF",
  },
  {
    id: 4,
    title: "Chicken Bucket",
    subtitle: "Crispy. Juicy. Perfect.",
    description: "12 Pcs Crispy Chicken + 2 Large Fries + Coleslaw + 4 Drinks",
    price: 2799,
    originalPrice: 4200,
    image: "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=1400&h=700&fit=crop",
    cta: "Get The Bucket",
    link: "/menu?category=chicken",
    badge: "SAVE PKR 1,401",
  },
];

const HeroCarousel = () => {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState("right");
  const [isAnimating, setIsAnimating] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef(null);

  const totalSlides = deals.length;

  const goTo = useCallback(
    (index, dir = "right") => {
      if (isAnimating) return;
      setDirection(dir);
      setIsAnimating(true);
      setCurrent(index);
      // Allow animation to complete before permitting next transition
      setTimeout(() => setIsAnimating(false), 600);
    },
    [isAnimating]
  );

  const next = useCallback(() => {
    goTo((current + 1) % totalSlides, "right");
  }, [current, totalSlides, goTo]);

  const prev = useCallback(() => {
    goTo((current - 1 + totalSlides) % totalSlides, "left");
  }, [current, totalSlides, goTo]);

  // Auto-advance
  useEffect(() => {
    if (isPaused) return;
    timerRef.current = setInterval(next, 3500);
    return () => clearInterval(timerRef.current);
  }, [next, isPaused]);

  return (
    <section
      id="hero-carousel"
      className="relative w-full overflow-hidden bg-[#1a1a1a]"
      style={{ height: "clamp(400px, 55vh, 600px)" }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Slides */}
      {deals.map((deal, index) => {
        let translateClass = "";
        if (index === current) {
          translateClass = "translate-x-0 opacity-100 z-10";
        } else if (direction === "right") {
          translateClass = "translate-x-full opacity-0 z-0";
        } else {
          translateClass = "-translate-x-full opacity-0 z-0";
        }

        return (
          <div
            key={deal.id}
            className={`absolute inset-0 transition-all duration-[600ms] ease-in-out ${translateClass}`}
          >
            {/* Background image */}
            <img
              src={deal.image}
              alt={deal.title}
              className="absolute inset-0 h-full w-full object-cover"
              loading={index === 0 ? "eager" : "lazy"}
            />

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />

            {/* Content */}
            <div className="relative z-10 flex h-full items-center px-6 sm:px-10 lg:px-20">
              <div className="max-w-xl">
                {/* Badge */}
                {deal.badge && (
                  <span className="mb-4 inline-block rounded-md bg-[#E4002B] px-3 py-1 text-xs font-extrabold uppercase tracking-widest text-white shadow-lg">
                    {deal.badge}
                  </span>
                )}

                {/* Subtitle */}
                <p className="mb-1 text-sm font-semibold uppercase tracking-wider text-gray-300 sm:text-base">
                  {deal.subtitle}
                </p>

                {/* Title */}
                <h2 className="mb-3 text-3xl font-black leading-tight text-white sm:text-4xl lg:text-5xl">
                  {deal.title}
                </h2>

                {/* Description */}
                <p className="mb-5 text-sm text-gray-200 sm:text-base lg:text-lg">
                  {deal.description}
                </p>

                {/* Price */}
                <div className="mb-6 flex items-end gap-3">
                  <span className="text-3xl font-black text-white sm:text-4xl">
                    PKR {deal.price.toLocaleString()}
                  </span>
                  {deal.originalPrice && (
                    <span className="text-lg text-gray-400 line-through">
                      PKR {deal.originalPrice.toLocaleString()}
                    </span>
                  )}
                </div>

                {/* CTA */}
                <Link
                  to={deal.link}
                  className="inline-flex items-center gap-2 rounded-full bg-[#E4002B] px-8 py-4 text-base font-bold text-white shadow-xl transition-all duration-200 hover:bg-red-700 hover:scale-105 hover:shadow-2xl sm:text-lg"
                >
                  {deal.cta}
                  <ChevronRight className="h-5 w-5" />
                </Link>
              </div>
            </div>
          </div>
        );
      })}

      {/* Arrow buttons */}
      <button
        id="carousel-prev"
        onClick={prev}
        aria-label="Previous slide"
        className="absolute left-3 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white backdrop-blur-sm transition hover:bg-black/70 sm:left-5 sm:p-3"
      >
        <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
      </button>
      <button
        id="carousel-next"
        onClick={next}
        aria-label="Next slide"
        className="absolute right-3 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white backdrop-blur-sm transition hover:bg-black/70 sm:right-5 sm:p-3"
      >
        <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
      </button>

      {/* Dot indicators */}
      <div className="absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2">
        {deals.map((_, index) => (
          <button
            key={index}
            onClick={() =>
              goTo(index, index > current ? "right" : "left")
            }
            aria-label={`Go to slide ${index + 1}`}
            className={`h-2.5 rounded-full transition-all duration-300 ${
              index === current
                ? "w-8 bg-[#E4002B]"
                : "w-2.5 bg-white/40 hover:bg-white/70"
            }`}
          />
        ))}
      </div>

      {/* Progress bar */}
      {!isPaused && (
        <div className="absolute bottom-0 left-0 z-20 h-1 w-full bg-white/10">
          <div
            className="h-full bg-[#E4002B] transition-none"
            style={{
              animation: "progressBar 3.5s linear infinite",
            }}
          />
        </div>
      )}

      {/* Inline keyframe for progress bar */}
      <style>{`
        @keyframes progressBar {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
    </section>
  );
};

export default HeroCarousel;
