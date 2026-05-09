import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Loader2, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import api from "../api/axios";

const Profile = () => {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  // Profile data fetch state
  const [profileData, setProfileData] = useState(null);
  const [fetchingProfile, setFetchingProfile] = useState(true);

  // Forms state
  const [profileForm, setProfileForm] = useState({ name: "", phone: "" });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Submit states
  const [updatingProfile, setUpdatingProfile] = useState(false);
  const [updatingPassword, setUpdatingPassword] = useState(false);

  // Password visibility states
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    // 1. Authentication check
    const token = localStorage.getItem("token");
    if (!token && !authLoading) {
      navigate("/login");
      return;
    }

    if (isAuthenticated) {
      fetchProfile();
    }
  }, [isAuthenticated, authLoading, navigate]);

  const fetchProfile = async () => {
    try {
      setFetchingProfile(true);
      const response = await api.get("/users/profile");
      const data = response.data.data;
      setProfileData(data);
      setProfileForm({
        name: data.name || "",
        phone: data.phone || "",
      });
    } catch (err) {
      toast.error("Failed to fetch profile data");
    } finally {
      setFetchingProfile(false);
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    if (!profileForm.name.trim()) return toast.error("Name is required");

    setUpdatingProfile(true);
    try {
      const response = await api.put("/users/profile", profileForm);
      const updatedUser = response.data.data;
      
      // Update local storage so AuthContext picks it up on next load/reload
      localStorage.setItem("user", JSON.stringify(updatedUser));
      
      toast.success("Profile updated successfully!");
      // Simple reload to update context globally
      window.location.reload();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update profile");
    } finally {
      setUpdatingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (
      !passwordForm.currentPassword ||
      !passwordForm.newPassword ||
      !passwordForm.confirmPassword
    ) {
      return toast.error("Please fill all password fields");
    }

    if (passwordForm.newPassword.length < 6) {
      return toast.error("New password must be at least 6 characters");
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      return toast.error("New passwords do not match");
    }

    setUpdatingPassword(true);
    try {
      await api.put("/users/change-password", {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      toast.success("Password changed successfully");
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to change password");
    } finally {
      setUpdatingPassword(false);
    }
  };

  if (authLoading || fetchingProfile) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <Loader2 className="h-10 w-10 animate-spin text-[#E4002B]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
        
        {/* Profile Info Section */}
        <div className="overflow-hidden rounded-3xl bg-white shadow-sm border border-gray-100 p-8">
          <div className="flex items-center gap-6">
            <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-[#E4002B] text-4xl font-black text-white shadow-lg">
              {profileData?.name?.charAt(0).toUpperCase() || user?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-3xl font-black text-gray-900">
                {profileData?.name || user?.name}
              </h1>
              <p className="text-lg text-gray-500">{profileData?.email || user?.email}</p>
              {profileData?.phone && (
                <p className="mt-1 font-semibold text-gray-700">{profileData.phone}</p>
              )}
            </div>
          </div>
        </div>

        {/* Edit Profile Form */}
        <div className="rounded-3xl bg-white shadow-sm border border-gray-100 p-8">
          <h2 className="mb-6 text-2xl font-black text-gray-900 border-b border-gray-100 pb-4">
            Edit Profile
          </h2>
          <form onSubmit={handleProfileSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="mb-2 block text-sm font-bold text-gray-700">
                  Full Name
                </label>
                <input
                  type="text"
                  value={profileForm.name}
                  onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 font-medium text-gray-900 focus:border-[#E4002B] focus:outline-none focus:ring-2 focus:ring-[#E4002B]/20 transition"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-bold text-gray-700">
                  Email Address
                </label>
                <input
                  type="email"
                  value={profileData?.email || ""}
                  readOnly
                  disabled
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 font-medium text-gray-500 cursor-not-allowed"
                />
              </div>
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-bold text-gray-700">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={profileForm.phone}
                  onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                  placeholder="+92 300 0000000"
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 font-medium text-gray-900 focus:border-[#E4002B] focus:outline-none focus:ring-2 focus:ring-[#E4002B]/20 transition"
                />
              </div>
            </div>
            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={updatingProfile}
                className="flex items-center justify-center gap-2 rounded-full bg-[#E4002B] px-8 py-3 font-bold text-white shadow-lg transition hover:bg-red-700 hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0 min-w-[160px]"
              >
                {updatingProfile ? <Loader2 className="h-5 w-5 animate-spin" /> : "Save Changes"}
              </button>
            </div>
          </form>
        </div>

        {/* Change Password Section */}
        <div className="rounded-3xl bg-white shadow-sm border border-gray-100 p-8">
          <h2 className="mb-6 text-2xl font-black text-gray-900 border-b border-gray-100 pb-4">
            Change Password
          </h2>
          <form onSubmit={handlePasswordSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2 relative">
                <label className="mb-2 block text-sm font-bold text-gray-700">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showCurrent ? "text" : "password"}
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 pr-12 font-medium text-gray-900 focus:border-[#E4002B] focus:outline-none focus:ring-2 focus:ring-[#E4002B]/20 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrent(!showCurrent)}
                    className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-600 transition"
                  >
                    {showCurrent ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div className="relative">
                <label className="mb-2 block text-sm font-bold text-gray-700">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showNew ? "text" : "password"}
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 pr-12 font-medium text-gray-900 focus:border-[#E4002B] focus:outline-none focus:ring-2 focus:ring-[#E4002B]/20 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-600 transition"
                  >
                    {showNew ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div className="relative">
                <label className="mb-2 block text-sm font-bold text-gray-700">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirm ? "text" : "password"}
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 pr-12 font-medium text-gray-900 focus:border-[#E4002B] focus:outline-none focus:ring-2 focus:ring-[#E4002B]/20 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-600 transition"
                  >
                    {showConfirm ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={updatingPassword}
                className="flex items-center justify-center gap-2 rounded-full bg-gray-900 px-8 py-3 font-bold text-white shadow-lg transition hover:bg-gray-800 hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0 min-w-[200px]"
              >
                {updatingPassword ? <Loader2 className="h-5 w-5 animate-spin" /> : "Update Password"}
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
};

export default Profile;
