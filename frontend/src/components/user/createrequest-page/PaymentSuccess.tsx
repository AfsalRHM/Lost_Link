import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const PaymentSuccessPart = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const sessionId = queryParams.get("session_id");

  useEffect(() => {}, [sessionId, navigate]);

  const handleGoBack = () => {
    navigate("/home");
  };

  return (
    <div className="bg-gray-100 min-h-screen flex justify-center items-center py-10">
      <div className="w-full sm:w-11/12 md:w-8/12 lg:w-6/12 bg-white rounded-md p-6 border border-gray-300 shadow-lg">
        <div className="text-center mb-5">
          <p className="font-semibold text-3xl text-green-700">
            Payment Successful!
          </p>
          <p className="text-lg text-gray-700 mt-2">
            Your payment has been successfully processed. Thank you for your
            request!
          </p>
        </div>

        <div className="flex justify-center gap-4 mt-5">
          <button
            onClick={handleGoBack}
            className="w-5/12 bg-violet-700 text-white font-semibold rounded-md h-12 hover:bg-violet-800 focus:outline-none focus:ring focus:ring-violet-500"
          >
            Go to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessPart;
