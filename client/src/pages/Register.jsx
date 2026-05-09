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
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Full Name is required";
    
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return toast.error("Please fix the errors in the form.");
    }

    setLoading(true);

    const result = await register(formData.name, formData.email, formData.password);

    if (result.success) {
      toast.success("Account created successfully!");
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
    if (errors[e.target.name]) {
      setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-12 bg-gray-50">
      <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-xl">
        
        {/* Card Header */}
        <div className="px-8 pt-10 text-center border-b border-gray-100 pb-6">
          <Link to="/" className="inline-flex items-center justify-center gap-2 mb-4">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#E4002B] font-bold text-white text-xl shadow-md">
              F
            </span>
            <span className="text-2xl font-extrabold text-gray-900 tracking-tight">Flavor Point</span>
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
                className={`block w-full rounded-xl border ${errors.name ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-[#E4002B] focus:ring-[#E4002B]'} px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1`}
                placeholder="John Doe"
              />
              {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
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
                className={`block w-full rounded-xl border ${errors.email ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-[#E4002B] focus:ring-[#E4002B]'} px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1`}
                placeholder="you@example.com"
              />
              {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
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
                className={`block w-full rounded-xl border ${errors.password ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-[#E4002B] focus:ring-[#E4002B]'} px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1`}
                placeholder="••••••••"
              />
              {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
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
                className={`block w-full rounded-xl border ${errors.confirmPassword ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-[#E4002B] focus:ring-[#E4002B]'} px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1`}
                placeholder="••••••••"
              />
              {errors.confirmPassword && <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>}
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
