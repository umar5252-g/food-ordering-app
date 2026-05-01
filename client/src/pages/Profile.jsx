import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Profile = () => {
  const { user, logout } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">
            Please log in to view your profile
          </h1>
          <Link
            to="/login"
            className="bg-brand-600 hover:bg-brand-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="text-2xl font-bold text-white">
              Flavor <span className="text-brand-600">Point</span>
            </Link>

            <div className="flex items-center space-x-4">
              <Link
                to="/menu"
                className="bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
              >
                Menu
              </Link>
              <Link
                to="/cart"
                className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
              >
                Cart
              </Link>
              <button
                onClick={logout}
                className="text-gray-300 hover:text-white"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-gray-900 rounded-lg p-8 border border-gray-800">
          <div className="text-center mb-8">
            <div className="w-24 h-24 bg-brand-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl font-bold text-white">
                {user.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <h1 className="text-3xl font-bold text-white">{user.name}</h1>
            <p className="text-gray-400">{user.email}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4">
                Account Information
              </h2>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-400">
                    Name
                  </label>
                  <p className="text-white">{user.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-400">
                    Email
                  </label>
                  <p className="text-white">{user.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-400">
                    Member Since
                  </label>
                  <p className="text-white">
                    {new Date(
                      user.createdAt || Date.now(),
                    ).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4">
                Quick Actions
              </h2>
              <div className="space-y-3">
                <Link
                  to="/menu"
                  className="block w-full bg-brand-600 hover:bg-brand-700 text-white text-center py-3 px-4 rounded-lg font-medium transition-colors duration-200"
                >
                  Browse Menu
                </Link>
                <Link
                  to="/cart"
                  className="block w-full bg-gray-700 hover:bg-gray-600 text-white text-center py-3 px-4 rounded-lg font-medium transition-colors duration-200"
                >
                  View Cart
                </Link>
                <button
                  onClick={logout}
                  className="w-full bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-lg font-medium transition-colors duration-200"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
