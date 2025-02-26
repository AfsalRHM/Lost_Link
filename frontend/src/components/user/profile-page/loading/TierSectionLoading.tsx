const TierSectionLoading = () => {
  return (
    <div className="mt-6 text-center animate-pulse">
      <div className="flex justify-around text-xs md:text-sm text-gray-500 mb-2">
        <span className="hidden md:block">Previous Tier</span>
        <span>Current Tier</span>
        <span className="hidden md:block">Next Tier</span>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden md:block flex-1 text-center py-3 rounded-lg text-sm shadow-md bg-gray-300 dark:bg-gray-700"></div>

        <div className="flex-1 text-center py-4 text-lg font-semibold rounded-lg shadow-xl border-2 border-white bg-gray-300 dark:bg-gray-700"></div>

        <div className="hidden md:block flex-1 text-center py-3 rounded-lg text-sm shadow-md bg-gray-300 dark:bg-gray-700"></div>
      </div>
    </div>
  );
};

export default TierSectionLoading;
