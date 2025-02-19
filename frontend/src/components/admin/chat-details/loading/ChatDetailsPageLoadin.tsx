const ChatListSkeleton = () => {
  return (
    <div className="flex min-h-screen bg-blue-900 text-white animate-pulse">
      {/* Sidebar Skeleton */}
      <div className="fixed top-0 left-0 w-64 h-full bg-blue-800 shadow-md z-10 hidden lg:block">
        <div className="p-4 space-y-6">
          <div className="h-8 bg-blue-700 rounded-lg"></div>
          <div className="h-8 bg-blue-700 rounded-lg"></div>
          <div className="h-8 bg-blue-700 rounded-lg"></div>
          <div className="h-8 bg-blue-700 rounded-lg"></div>
        </div>
      </div>

      <div className="flex-1 ml-0 lg:ml-64">
        {/* Header Skeleton */}
        <header className="sticky top-0 z-20 bg-blue-800 shadow-sm">
          <div className="flex items-center justify-between p-4">
            <div className="lg:hidden">
              <div className="w-8 h-8 bg-blue-700 rounded-lg"></div>
            </div>

            <div className="flex-1 mx-4 relative flex items-center space-x-2">
              <div className="w-full sm:w-1/3 h-10 bg-blue-700 rounded-lg"></div>
              <div className="w-12 h-10 bg-blue-600 rounded-lg"></div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-blue-700 rounded-lg"></div>
              <div className="w-8 h-8 bg-blue-500 rounded-full"></div>
            </div>
          </div>
        </header>

        {/* Chat Content Skeleton */}
        <main className="p-6 space-y-4">
          <div className="h-20 bg-blue-800 rounded-lg"></div>
          <div className="h-20 bg-blue-800 rounded-lg"></div>
          <div className="h-20 bg-blue-800 rounded-lg"></div>
          <div className="h-20 bg-blue-800 rounded-lg"></div>
        </main>
      </div>
    </div>
  );
};

export default ChatListSkeleton;
