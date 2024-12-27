const UserDetails = () => (
  <div className="flex items-center gap-6 mb-6">
    {/* Profile Image */}
    <div className="h-20 w-20 bg-gray-300 rounded-full shadow-md"></div>

    {/* User Information */}
    <div className="grid grid-cols-2 gap-4 flex-grow">
      <div className="text-sm">
        <span className="font-semibold text-gray-700">Full Name:</span>
        <span className="text-gray-600 block">Afsal Rahman</span>
      </div>
      <div className="text-sm">
        <span className="font-semibold text-gray-700">Email:</span>
        <span className="text-gray-600 block">Afsal Rahman</span>
      </div>
      <div className="text-sm">
        <span className="font-semibold text-gray-700">User Name:</span>
        <span className="text-gray-600 block">Dhaamu</span>
      </div>
      <div className="text-sm">
        <span className="font-semibold text-gray-700">Phone Number:</span>
        <span className="text-gray-600 block">Afsal Rahman</span>
      </div>
    </div>

    {/* Edit Button */}
    <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md transition-all">
      Edit Details
    </button>
  </div>
);

export default UserDetails;
