import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { userService } from "../../../services/userService";

import { X } from "lucide-react";
import {
  showErrorToast2,
  showSuccessToast2,
} from "../../../utils/iziToastUtils";
import { RootState } from "../../../redux/store";
import UserErrorHandling from "../../../middlewares/UserErrorHandling";

interface reportModalType {
  setIsReportModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  requestId: string | null;
  setReportAlreadySend: React.Dispatch<React.SetStateAction<boolean>>;
}

const ReportModal = ({
  setIsReportModalOpen,
  requestId,
  setReportAlreadySend,
}: reportModalType) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [reportReason, setReportReason] = useState<string>("");

  const { userId } = useSelector((state: RootState) => state.userDetails);

  async function handleSubmitReport() {
    try {
      const response = await userService.reportRequest({
        requestId,
        reportReason,
        userId,
      });

      if (response.status == 200) {
        setIsReportModalOpen(false);
        showSuccessToast2(
          response.data?.data?.message || "Report submitted successfully!"
        );
        setReportAlreadySend(true);
      } else {
        console.log(response, "this is the error response on reportRequest");
        UserErrorHandling(response, dispatch, navigate);
      }
    } catch (error) {
      console.error("Failed to Report Request:", error);
      showErrorToast2("Something went wrong!");
    }
  }

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-96">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-800">Report Request</h2>
            <button onClick={() => setIsReportModalOpen(false)}>
              <X className="text-gray-600 hover:text-gray-800" />
            </button>
          </div>
          <textarea
            className="w-full border rounded-lg p-2 text-gray-800"
            rows={4}
            placeholder="Enter your reason for reporting..."
            value={reportReason}
            onChange={(e) => setReportReason(e.target.value)}
          ></textarea>
          <button
            onClick={handleSubmitReport}
            className="w-full mt-4 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition-all duration-300"
          >
            Submit Report
          </button>
        </div>
      </div>
    </>
  );
};

export default ReportModal;
