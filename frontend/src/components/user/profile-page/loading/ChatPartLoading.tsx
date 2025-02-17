const ChatPartLoading = () => {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl h-[80vh] flex flex-col animate-pulse">
          {/* Header Skeleton */}
          <div className="flex justify-between items-center p-4 border-b border-violet-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-violet-100 rounded-full" />
              <div>
                <div className="w-32 h-5 bg-violet-100 rounded" />
                <div className="w-16 h-3 bg-violet-100 rounded mt-1" />
              </div>
            </div>
            <div className="w-8 h-8 bg-violet-100 rounded-full" />
          </div>
  
          {/* Messages Area Skeleton */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-violet-50">
            {[...Array(5)].map((_, index) => (
              <div key={index} className={`flex ${index % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
                <div className="p-3 w-40 h-6 bg-violet-100 rounded-2xl" />
              </div>
            ))}
          </div>
  
          {/* Input Area Skeleton */}
          <div className="p-4 bg-white border-t border-violet-100 flex items-center gap-2">
            <div className="flex-1 p-3 h-10 bg-violet-100 rounded-xl" />
            <div className="w-12 h-10 bg-violet-100 rounded-xl" />
          </div>
        </div>
      </div>
    );
  };
  
  export default ChatPartLoading;
  