import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-white to-purple-50 px-4 py-12">
      <div className="max-w-lg text-center">
        <h1 className="text-9xl font-bold text-violet-600">404</h1>
        <div className="w-full h-2 bg-violet-200 rounded-full my-6"></div>

        <h2 className="text-3xl font-semibold text-gray-800 mb-4">
          Page Not Found
        </h2>
        <p className="text-gray-600 mb-8">
          Oops! The page you're looking for seems to have vanished into thin
          air. It might have been moved or doesn't exist.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            to="/"
            className="px-6 py-3 bg-violet-600 text-white font-medium rounded-lg hover:bg-violet-700 transition-colors duration-300 shadow-md"
          >
            Return Home
          </Link>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="w-16 h-16 absolute top-1/4 left-1/4 rounded-full bg-violet-200 opacity-50"></div>
      <div className="w-24 h-24 absolute bottom-1/4 right-1/3 rounded-full bg-violet-300 opacity-40"></div>
      <div className="w-12 h-12 absolute top-1/3 right-1/4 rounded-full bg-violet-100 opacity-60"></div>
    </div>
  );
};

export default NotFound;
