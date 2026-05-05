import { Link } from "react-router-dom";
import { SearchX, Home, UtensilsCrossed } from "lucide-react";

const NotFound = () => {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center bg-gray-50 px-4 py-16 text-center sm:px-6 lg:px-8">
      <div className="relative mb-8 flex h-40 w-40 items-center justify-center rounded-full bg-red-100 shadow-inner">
        <UtensilsCrossed className="h-20 w-20 text-[#E4002B]" />
        <div className="absolute -bottom-2 -right-2 flex h-16 w-16 items-center justify-center rounded-full border-4 border-gray-50 bg-white shadow-md">
          <SearchX className="h-8 w-8 text-gray-400" />
        </div>
      </div>
      
      <h1 className="mb-2 text-5xl font-black tracking-tight text-gray-900 md:text-6xl">
        404
      </h1>
      <h2 className="mb-6 text-2xl font-bold text-gray-800 sm:text-3xl">
        Oops! We ate that page...
      </h2>
      
      <p className="mb-10 max-w-md text-lg text-gray-500">
        We can't seem to find the page you're looking for. It might have been moved, deleted, or perhaps our chef got a little too hungry.
      </p>
      
      <Link
        to="/"
        className="inline-flex items-center gap-2 rounded-full bg-[#E4002B] px-8 py-4 text-lg font-bold text-white shadow-lg transition hover:bg-red-700 hover:shadow-xl"
      >
        <Home className="h-5 w-5" /> Back to Home Menu
      </Link>
    </div>
  );
};

export default NotFound;
