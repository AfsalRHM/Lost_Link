import { X } from "lucide-react";
import IreportModel from "../../../interface/IreportModel";

interface reportListModalType {
  setIsReportListModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  reportData: IreportModel[] | undefined;
}

const ReportListModal = ({
  setIsReportListModalOpen,
  reportData,
}: reportListModalType) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-gray-800">All Reports</h2>
          <button onClick={() => setIsReportListModalOpen(false)}>
            <X className="text-gray-600 hover:text-gray-800" />
          </button>
        </div>

        {reportData!.length > 0 ? (
          <ul className="space-y-3">
            {reportData!.map((report: IreportModel, index: number) => (
              <li
                key={index}
                className="p-3 bg-gray-100 rounded-lg shadow-md text-sm"
              >
                <p className="font-semibold">Reason:</p>
                <p className="text-gray-700">{report.reason}</p>
                <p className="text-xs text-gray-500 mt-1">Reported by: {report.user_name}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600 text-sm">No reports found.</p>
        )}
      </div>
    </div>
  );
};

export default ReportListModal;
