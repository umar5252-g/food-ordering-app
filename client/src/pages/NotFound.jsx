import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <h1 className="text-9xl font-black text-gray-200">404</h1>
      <h2 className="mt-4 text-3xl font-bold text-gray-900 sm:text-4xl">
        Page Not Found
      </h2>
      <p className="mt-4 mb-8 max-w-md mx-auto text-lg text-gray-500">
        Oops! The page you are looking for doesn't exist or has been moved.
      </p>
      <Link
        to="/"
        className="rounded-full bg-[#E4002B] px-8 py-4 font-bold text-white shadow-lg transition hover:-translate-y-1 hover:bg-red-700 hover:shadow-xl"
      >
        Back to Home
      </Link>
    </div>
  );
};

export default NotFound;
