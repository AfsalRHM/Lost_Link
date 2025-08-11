import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { userService } from "../../../services/userService";

import ReportsLoading from "./loading/ReportListLoading";
import { userDataType } from "../../../interface/IuserModel";
import ReportDetailsModal from "./ReportDetailsModal";
import UserErrorHandling from "../../../middlewares/UserErrorHandling";

type Report = {
  id: string;
  title: string;
  reason: string;
  userId: string;
  requestId: string;
  createdAt: Date;
};

const ReportList = ({ userData }: { userData: userDataType }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [loading, setLoading] = useState<boolean>(true);
  const [reports, setReports] = useState<any>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const [reportData, setReportData] = useState<Report | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await userService.getUserReports({
          userId: userData.id,
        });

        if (response.status === 200) {
          setReports(response.data.data);
        } else {
          console.log(
            response,
            "this is the error response on getRedeemRequests"
          );
          UserErrorHandling(response, dispatch, navigate);
        }
      } catch (error) {
        console.error("Failed to fetch reports:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, [userData]);

  const filteredReports = reports.filter(
    (report: any) => report.status === "active"
  );

  const indexOfLastReport = currentPage * itemsPerPage;
  const indexOfFirstReport = indexOfLastReport - itemsPerPage;
  const totalPages = Math.ceil(filteredReports.length / itemsPerPage);

  const handleReportDetails = (report: Report) => {
    setReportData(report);
    setIsModalOpen(true);
  };

  if (loading) return <ReportsLoading />;

  return (
    <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
      <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-6">
        My Reports
      </h2>
      <ReportDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        report={reportData}
      />
      {filteredReports.length === 0 ? (
        <div className="text-center text-gray-500 py-16">
          <p className="text-lg font-semibold">No Reports</p>
          <p className="text-sm">You have raised 0 reports.</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-200">
                <tr>
                  <th className="px-3 py-3 text-left text-sm font-semibold">
                    Sl No.
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">
                    Report Item
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredReports
                  .slice(indexOfFirstReport, indexOfLastReport)
                  .map((report: any, index: number) => (
                    <tr key={report._id} className="hover:bg-gray-50">
                      <td className="px-6 py-3 text-sm">
                        {indexOfFirstReport + index + 1}
                      </td>
                      <td className="px-6 py-3 text-sm">
                        {report.title.length <= 25
                          ? report.title
                          : report.title.slice(0, 25) + "..."}
                      </td>
                      <td className="px-6 py-3 text-sm">
                        <button
                          className="px-3 py-1.5 border border-gray-300 rounded-md hover:bg-gray-100"
                          onClick={() => handleReportDetails(report)}
                        >
                          👁️ Details
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-center space-x-2 mt-6">
            <button
              className="px-3 py-1.5 bg-gray-300 rounded-md hover:bg-gray-400 disabled:opacity-50"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Prev
            </button>
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                className={`px-3 py-1.5 rounded-md hover:bg-gray-400 ${
                  currentPage === index + 1
                    ? "bg-blue-500 text-white"
                    : "bg-gray-300"
                }`}
                onClick={() => setCurrentPage(index + 1)}
              >
                {index + 1}
              </button>
            ))}
            <button
              className="px-3 py-1.5 bg-gray-300 rounded-md hover:bg-gray-400 disabled:opacity-50"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ReportList;
