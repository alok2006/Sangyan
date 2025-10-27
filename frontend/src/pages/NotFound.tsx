import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-50 px-4">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-indigo-600 mb-4">404</h1>
        <h2 className="text-4xl font-semibold text-gray-800 mb-4">
          Page Not Found
        </h2>
        <p className="text-xl text-gray-600 mb-8 max-w-md mx-auto">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link
            to="/"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200"
          >
            Go to Homepage
          </Link>
          <button
            onClick={() => window.history.back()}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-8 rounded-lg transition-colors duration-200"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
