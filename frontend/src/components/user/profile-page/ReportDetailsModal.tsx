import React from "react";

import { X } from "lucide-react";
import IreportModel from "../../../interface/IreportModel";

interface ReportDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: IreportModel | null;
}

const ReportDetailsModal: React.FC<ReportDetailsModalProps> = ({
  isOpen,
  onClose,
  report,
}) => {
  if (!isOpen || !report) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-96 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 hover:text-gray-900"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-lg font-semibold mb-2">{report.title}</h2>
        <p className="text-sm text-gray-500 mb-4">
          Request raised on {new Date(report.createdAt!).toLocaleDateString()}
        </p>

        <p className="text-gray-700">{report.reason}</p>

        <button
          onClick={onClose}
          className="mt-4 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ReportDetailsModal;
