const UserDetailsLoading = () => {
  return (
    <div className="flex items-center gap-6 mb-6 animate-pulse">
      <div className="h-20 w-20 bg-gray-300 rounded-full shadow-md"></div>

      <div className="grid grid-cols-2 gap-4 flex-grow">
        <div className="text-sm">
          <div className="h-4 bg-gray-300 rounded-md w-24 mb-2"></div>
          <div className="h-4 bg-gray-300 rounded-md w-32"></div>
        </div>
        <div className="text-sm">
          <div className="h-4 bg-gray-300 rounded-md w-24 mb-2"></div>
          <div className="h-4 bg-gray-300 rounded-md w-32"></div>
        </div>
        <div className="text-sm">
          <div className="h-4 bg-gray-300 rounded-md w-24 mb-2"></div>
          <div className="h-4 bg-gray-300 rounded-md w-32"></div>
        </div>
        <div className="text-sm">
          <div className="h-4 bg-gray-300 rounded-md w-24 mb-2"></div>
          <div className="h-4 bg-gray-300 rounded-md w-32"></div>
        </div>
      </div>

      <div className="h-10 w-32 bg-gray-300 rounded-lg shadow-md"></div>
    </div>
  );
};

export default UserDetailsLoading;
