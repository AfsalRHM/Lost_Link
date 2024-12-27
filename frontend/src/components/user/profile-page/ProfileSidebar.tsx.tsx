const ProfileSidebar = () => (
  <div className="bg-white shadow-lg rounded-xl p-6">
    <h3 className="font-bold text-gray-700 text-lg mb-4">Profile Info</h3>
    <ul className="space-y-3">
      {[
        "Location Info",
        "Tier Information",
        "My Requests",
        "Completed Requests",
        "Payment History",
      ].map((item, index) => (
        <li
          key={index}
          className="p-3 bg-gray-100 hover:bg-blue-50 hover:shadow-md rounded-md text-gray-700 cursor-pointer transition-all"
        >
          {item}
        </li>
      ))}
    </ul>
  </div>
);

export default ProfileSidebar;
