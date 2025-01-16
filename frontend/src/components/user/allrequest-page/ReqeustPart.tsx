const ReqeustPart = ({ filteredRequests }: { filteredRequests: any }) => {
  console.log(filteredRequests);
  return (
    <div className="flex-1 p-8">
      <h1 className="text-3xl font-bold underline text-center mb-6 text-violet-600">
        All Requests
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredRequests.map((request: any) => (
          <div
            key={request._id}
            className="bg-white shadow-md rounded-lg border border-gray-200 overflow-hidden"
          >
            <img
              src={request.product_images[0]}
              alt={request.product_name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h2 className="text-lg font-semibold mb-2 text-violet-700">
                {request.product_name}
              </h2>
              <p className="text-sm text-gray-600 mb-1">
                <span className="font-medium">Category:</span>{" "}
                {request.product_category}
              </p>
              <p className="text-sm text-gray-600 mb-3">
                <span className="font-medium">Reward:</span>
                {` ₹${request.reward_amount}`}
              </p>
              <p className="text-sm text-gray-700 mb-4">
                {request.additional_information.length > 60
                  ? `${request.additional_information.slice(0, 60)}...`
                  : request.additional_information}
              </p>
              <button className="w-full bg-violet-600 text-white py-2 rounded-md hover:bg-violet-700">
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReqeustPart;
