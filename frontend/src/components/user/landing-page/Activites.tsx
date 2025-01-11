const Activities = () => {
  return (
    <div className="w-full bg-activity p-8">
      {/* Heading */}
      <div className="flex items-center justify-center font-bold text-3xl md:text-5xl underline text-activityHeading mb-8">
        What You Can Do
      </div>

      {/* Activities Container */}
      <div className="flex flex-col md:flex-row md:justify-between gap-8 md:gap-0 px-5 md:px-10">
        {/* Activity 1 */}
        <div className="w-full md:w-1/4 text-center group cursor-pointer transition-transform transform hover:scale-105">
          <div className="flex flex-col items-center gap-2 mb-4 relative">
            <img
              src="/Activity-First-Logo.png"
              className="w-16 h-16 md:w-12 md:h-12 rounded-full transition-transform transform group-hover:scale-110"
              alt="Put a Request"
            />
            <div className="font-semibold text-lg group-hover:text-blue-500">
              Put a Request
            </div>
            <div className="absolute bottom-16 md:bottom-14 bg-black text-white text-sm rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
              Submit your request
            </div>
          </div>
          <div className="font-medium text-sm md:text-base">
            Submit a request by providing details about your lost item,
            including where and when you lost it.
          </div>
        </div>

        {/* Activity 2 */}
        <div className="w-full md:w-1/4 text-center group cursor-pointer transition-transform transform hover:scale-105">
          <div className="flex flex-col items-center gap-2 mb-4 relative">
            <img
              src="/Activity-Second-Logo.png"
              className="w-16 h-16 md:w-12 md:h-12 rounded-full transition-transform transform group-hover:scale-110"
              alt="Find the Thing"
            />
            <div className="font-semibold text-lg group-hover:text-blue-500">
              Find the Thing
            </div>
            <div className="absolute bottom-16 md:bottom-14 bg-black text-white text-sm rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
              Browse found items
            </div>
          </div>
          <div className="font-medium text-sm md:text-base">
            Browse found items or get notified when there's a match.
          </div>
        </div>

        {/* Activity 3 */}
        <div className="w-full md:w-1/4 text-center group cursor-pointer transition-transform transform hover:scale-105">
          <div className="flex flex-col items-center gap-2 mb-4 relative">
            <img
              src="/Activity-Third-Logo.png"
              className="w-16 h-16 md:w-12 md:h-12 rounded-full transition-transform transform group-hover:scale-110"
              alt="Get a Reward"
            />
            <div className="font-semibold text-lg group-hover:text-blue-500">
              Get a Reward
            </div>
            <div className="absolute bottom-16 md:bottom-14 bg-black text-white text-sm rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
              Claim your reward
            </div>
          </div>
          <div className="font-medium text-sm md:text-base">
            Retrieve your item, or if you found someone else's, claim your
            reward.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Activities;
