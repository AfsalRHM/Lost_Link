const UserDetailsPartLoading = () => {
  return (
    <div className="w-full bg-blue-500 min-h-screen animate-pulse">
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        <div className="flex items-center justify-between mb-8">
          <div className="h-10 w-32 bg-white rounded-full shadow-md" />
          <div className="h-8 w-24 bg-violet-100 rounded-full" />
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-10">
          <div className="border-b border-gray-100 pb-6 mb-8">
            <div className="flex items-center gap-6 mb-4">
              <div className="w-24 h-24 rounded-full bg-violet-300" />
              <div>
                <div className="h-8 w-48 bg-violet-300 mb-2 rounded" />
                <div className="h-6 w-32 bg-violet-200 rounded" />
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-10">
            <div className="space-y-8">
              <div>
                <div className="h-6 w-40 bg-violet-300 mb-4 rounded" />
                <div className="space-y-4">
                  {Array(4)
                    .fill(null)
                    .map((_, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className="h-5 w-5 bg-violet-200 rounded" />
                        <div className="h-5 w-56 bg-violet-200 rounded" />
                      </div>
                    ))}
                </div>
              </div>

              <div>
                <div className="h-6 w-40 bg-violet-300 mb-4 rounded" />
                <div className="grid grid-cols-2 gap-4">
                  {Array(4)
                    .fill(null)
                    .map((_, index) => (
                      <div key={index} className="bg-violet-50 p-4 rounded-xl">
                        <div className="h-5 w-32 bg-violet-200 mb-2 rounded" />
                        <div className="h-8 w-20 bg-violet-300 rounded" />
                      </div>
                    ))}
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div>
                <div className="h-6 w-40 bg-violet-300 mb-4 rounded" />
                <div className="bg-violet-50 p-6 rounded-xl">
                  <div className="h-5 w-48 bg-violet-200 mb-2 rounded" />
                  <div className="h-6 w-40 bg-violet-300 rounded" />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center gap-4 mt-8">
            <div className="h-12 w-full md:w-1/3 bg-violet-400 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetailsPartLoading;
