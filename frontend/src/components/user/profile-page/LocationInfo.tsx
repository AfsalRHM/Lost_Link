import SearchLocation from "./SearchLocation";

const LocationInfo = () => (
  <div className="bg-white shadow-lg rounded-xl p-6">
    <h3 className="font-bold text-gray-700 text-lg mb-4">Location Info</h3>
    <div className="text-sm mb-4">
      <p>
        <span className="font-semibold text-gray-700">Current Location:</span>{" "}
        Kondotty, Malappuram, Kerala
      </p>
      <p>
        <span className="font-semibold text-gray-700">Users Count:</span>{" "}
        <span className="text-yellow-500">Moderate (39)</span>
      </p>
    </div>
    <SearchLocation />
  </div>
);

export default LocationInfo;
