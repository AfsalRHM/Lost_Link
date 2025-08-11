import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import { RootState } from "../../../redux/store";
import IrequestModel from "../../../interface/IrequestModel";

const RequestPart = ({
  filteredRequests,
}: {
  filteredRequests: IrequestModel[];
}) => {
  const navigate = useNavigate();

  const { userId } = useSelector((state: RootState) => state.userDetails);

  async function handleRequestDetails(id: string) {
    if (id) {
      navigate(`/requests/request-details?id=${id}`);
    }
  }

  const activeRequests = filteredRequests.filter((request: IrequestModel) => {
    return request.userId !== userId;
  });

  return (
    <div className="flex-1 p-8">
      <h1 className="text-3xl font-bold underline text-center mb-6 text-violet-600">
        All Requests
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {activeRequests.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center text-gray-600 mt-12 animate-fadeIn">
            <h2 className="text-2xl font-semibold mb-2 text-gray-800">
              No Active Requests Found!
            </h2>
            <p className="text-lg text-gray-500 mb-4">
              Looks like there are no active requests available right now.
            </p>
          </div>
        ) : (
          activeRequests.map((request: IrequestModel) =>
            request.userId === userId || request.status !== "active" ? null : (
              <div
                key={request.id}
                className="bg-white shadow-md rounded-lg border border-gray-200 overflow-hidden flex flex-col"
              >
                <img
                  src={request.productImages[0]}
                  alt={request.productName}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4 flex-1 flex flex-col">
                  <h2 className="text-lg font-semibold mb-2 text-violet-700">
                    {request.productName}
                  </h2>
                  {request.missingPlace !== "" ? (
                    <p className="text-sm text-gray-600 mb-1">
                      <span className="font-medium">location:</span>{" "}
                      {request.missingPlace}
                    </p>
                  ) : (
                    <p className="text-sm text-gray-600 mb-1">
                      <span className="font-medium">location:</span>{" "}
                      {request.missingRoute[0]}
                    </p>
                  )}
                  <p className="text-sm text-gray-600 mb-3">
                    <span className="font-medium">Reward:</span>{" "}
                    {` ₹${request.rewardAmount}`}
                  </p>
                  <p className="text-sm text-gray-700 mb-4 flex-1">
                    {request.additionalInfo.length !== 0
                      ? request.additionalInfo.length > 60
                        ? `${request.additionalInfo.slice(0, 60)}...`
                        : request.additionalInfo
                      : "No Description Available..."}
                  </p>
                  <button
                    className="w-full bg-violet-600 text-white py-2 rounded-md hover:bg-violet-700 mt-auto"
                    onClick={() => handleRequestDetails(request.id)}
                  >
                    View Details
                  </button>
                </div>
              </div>
            )
          )
        )}
      </div>
    </div>
  );
};

export default RequestPart;
