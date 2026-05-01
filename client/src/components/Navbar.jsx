import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, ShoppingCart, ChevronDown, User, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const { getCartItemCount } = useCart();

  const cartCount = getCartItemCount();

  const navLinks = [
    { label: "Home", to: "/" },
    { label: "Menu", to: "/menu" },
    { label: "About", to: "/about" },
    { label: "Contact", to: "/contact" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#E4002B] text-white shadow-lg shadow-red-950/20">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="flex items-center gap-2 text-lg font-bold tracking-tight"
        >
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#E4002B] shadow-sm">
            B
          </span>
          <span>BrandName</span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          <nav className="flex items-center gap-6 text-sm font-medium uppercase tracking-wide">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="transition hover:text-gray-100"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <Link
              to="/cart"
              className="relative inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-2 text-sm text-white transition hover:bg-white/20"
            >
              <ShoppingCart className="h-4 w-4" />
              <span>Cart</span>
              {cartCount > 0 && (
                <span className="absolute -right-2 -top-2 inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-white text-xs font-semibold text-[#E4002B]">
                  {cartCount}
                </span>
              )}
            </Link>

            {!isAuthenticated ? (
              <Link
                to="/login"
                className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/20"
              >
                Login
              </Link>
            ) : (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setProfileOpen((open) => !open)}
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/20"
                >
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#E4002B]">
                    {user?.name?.charAt(0).toUpperCase() || (
                      <User className="h-4 w-4" />
                    )}
                  </span>
                  <span>{user?.name?.split(" ")[0]}</span>
                  <ChevronDown className="h-4 w-4" />
                </button>

                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-48 overflow-hidden rounded-2xl border border-white/10 bg-white text-gray-900 shadow-2xl shadow-black/20">
                    <Link
                      to="/profile"
                      className="block px-4 py-3 text-sm font-medium hover:bg-gray-100"
                      onClick={() => setProfileOpen(false)}
                    >
                      Profile
                    </Link>
                    <button
                      onClick={() => {
                        setProfileOpen(false);
                        logout();
                      }}
                      className="flex w-full items-center gap-2 px-4 py-3 text-sm font-medium text-left text-[#E4002B] hover:bg-gray-100"
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <button
          type="button"
          className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/10 p-2 text-white transition hover:bg-white/20 md:hidden"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {menuOpen && (
        <div className="border-t border-white/10 bg-[#E4002B] px-4 pb-6 md:hidden">
          <nav className="flex flex-col gap-3 pt-4 text-sm font-medium uppercase tracking-wide">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="block rounded-2xl px-4 py-3 transition hover:bg-white/10"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="mt-4 flex flex-col gap-3">
            <Link
              to="/cart"
              className="relative inline-flex items-center gap-2 rounded-2xl bg-white/10 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/20"
              onClick={() => setMenuOpen(false)}
            >
              <ShoppingCart className="h-4 w-4" />
              Cart
              {cartCount > 0 && (
                <span className="absolute right-4 top-3 inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-white text-xs font-semibold text-[#E4002B]">
                  {cartCount}
                </span>
              )}
            </Link>

            {!isAuthenticated ? (
              <Link
                to="/login"
                className="rounded-2xl bg-white px-4 py-3 text-center text-sm font-semibold text-[#E4002B] transition hover:bg-white/90"
                onClick={() => setMenuOpen(false)}
              >
                Login
              </Link>
            ) : (
              <div className="rounded-2xl bg-white/10 p-4 text-sm text-white">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#E4002B]">
                    {user?.name?.charAt(0).toUpperCase() || (
                      <User className="h-4 w-4" />
                    )}
                  </span>
                  <div>
                    <p className="font-semibold">{user?.name}</p>
                    <p className="text-xs text-gray-100">Signed in</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    logout();
                  }}
                  className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-[#E4002B] transition hover:bg-white/90"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
