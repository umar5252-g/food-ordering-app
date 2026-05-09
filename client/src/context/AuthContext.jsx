import { createContext, useContext, useState, useEffect } from "react";
import toast from "react-hot-toast";
import api from "../api/axios";

const AuthContext = createContext();

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

const AuthProvider = ({ children }) => {
  // STEP 1: Initialize user from localStorage (instant, no async)
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem("user");
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (error) {
      console.error("Error parsing user from localStorage:", error);
      return null;
    }
  });

  // STEP 2: Loading state MUST be true until auth check completes
  const [loading, setLoading] = useState(true);

  // STEP 3: On component mount, verify token with backend
  useEffect(() => {
    const verifyTokenAndGetUser = async () => {
      const token = localStorage.getItem("accessToken");

      if (!token) {
        // No token in localStorage - user not logged in
        console.log("No token found in localStorage");
        setLoading(false);
        return;
      }

      try {
        // Call backend to verify token is valid and get user data
        console.log("Verifying token with backend...");
        const response = await api.get("/auth/me");

        // Token is valid - set user from response
        const freshUser = response.data.data;
        console.log("Token verified, user data retrieved:", freshUser);
        setUser(freshUser);
        localStorage.setItem("user", JSON.stringify(freshUser));
      } catch (error) {
        // Token is invalid/expired - clear everything
        console.log("Token verification failed:", error.response?.status);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
        setUser(null);
      } finally {
        // CRITICAL: Always set loading to false when done
        setLoading(false);
      }
    };

    verifyTokenAndGetUser();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.post("/auth/login", { email, password });
      const { user, accessToken, refreshToken } = response.data.data;

      // Store tokens and user in localStorage
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("user", JSON.stringify(user));

      // Update context state
      setUser(user);

      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Login failed",
      };
    }
  };

  const register = async (name, email, password) => {
    try {
      const response = await api.post("/auth/register", {
        name,
        email,
        password,
      });
      const { user, accessToken, refreshToken } = response.data.data;

      // Store tokens and user in localStorage
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("user", JSON.stringify(user));

      // Update context state
      setUser(user);

      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Registration failed",
      };
    }
  };

  const logout = async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (refreshToken) {
        await api.post("/auth/logout", { refreshToken });
      }
      toast.success("Logged out successfully.");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Logout failed. Please try again.");
    } finally {
      // Always clear auth data even if API call fails
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      setUser(null);
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
  };

  // CRITICAL: While loading, show spinner and do NOT render children
  // This prevents the flash of login redirect before auth check completes
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#E4002B] border-t-transparent"></div>
          <p className="text-gray-600">Loading authentication...</p>
        </div>
      </div>
    );
  }

  // When loading is false, render the app
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export { AuthContext, useAuth, AuthProvider };
