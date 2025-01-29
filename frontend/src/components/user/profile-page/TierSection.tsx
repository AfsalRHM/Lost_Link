const TierSection = () => (
  <div className="mt-6">
    <div className="flex justify-around text-sm text-gray-500 mb-2">
      <span className="hidden md:block">Previous Tier</span>
      <span>Current Tier</span>
      <span className="hidden md:block">Next Tier</span>
    </div>

    <div className="flex items-center gap-4">
      <div className="hidden md:block flex-1 text-center py-3 bg-gradient-to-r from-gray-300 to-gray-400 rounded-lg text-sm shadow-md">
        Elite Finder
      </div>
      <div className="flex-1 text-center py-3 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-lg text-sm font-bold text-white shadow-lg">
        Lost Guardian
      </div>
      <div className="hidden md:block flex-1 text-center py-3 bg-gradient-to-r from-gray-400 to-gray-300 rounded-lg text-sm shadow-md">
        Link Legend
      </div>
    </div>
  </div>
);

export default TierSection;
