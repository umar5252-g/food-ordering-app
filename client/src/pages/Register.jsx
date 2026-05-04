import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      return toast.error("Please fill in all fields.");
    }

    if (formData.password !== formData.confirmPassword) {
      return toast.error("Passwords do not match.");
    }

    setLoading(true);

    const result = await register(formData.name, formData.email, formData.password);

    if (result.success) {
      toast.success("Account created successfully!");
      // The context's register method auto-logs the user in, so we just redirect to home
      navigate("/", { replace: true });
    } else {
      toast.error(result.message || "Failed to register.");
    }

    setLoading(false);
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-12 bg-gray-50">
      <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-xl">
        
        {/* Card Header */}
        <div className="px-8 pt-10 text-center border-b border-gray-100 pb-6">
          <Link to="/" className="inline-flex items-center justify-center gap-2 mb-4">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#E4002B] font-bold text-white text-xl shadow-md">
              B
            </span>
            <span className="text-2xl font-extrabold text-gray-900 tracking-tight">BrandName</span>
          </Link>
          <h2 className="text-2xl font-bold text-gray-900">Create an Account</h2>
          <p className="mt-2 text-sm text-gray-500">
            Sign up to get started
          </p>
        </div>

        {/* Card Body */}
        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="mb-1 block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                className="block w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-[#E4002B] focus:outline-none focus:ring-1 focus:ring-[#E4002B]"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label htmlFor="email" className="mb-1 block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="block w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-[#E4002B] focus:outline-none focus:ring-1 focus:ring-[#E4002B]"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-1 block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                className="block w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-[#E4002B] focus:outline-none focus:ring-1 focus:ring-[#E4002B]"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="mb-1 block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="block w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-[#E4002B] focus:outline-none focus:ring-1 focus:ring-[#E4002B]"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-6 flex w-full items-center justify-center rounded-xl bg-[#E4002B] py-3.5 text-base font-bold text-white shadow-md transition hover:bg-red-700 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Registering...
                </>
              ) : (
                "Register"
              )}
            </button>
          </form>
        </div>

        {/* Footer Link */}
        <div className="bg-gray-50 py-5 text-center border-t border-gray-100">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="font-semibold text-[#E4002B] hover:underline">
              Login
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
};

export default Register;
