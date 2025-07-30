import { useState } from "react";

import { userDataType } from "../../../interface/IuserModel";

const WalletSection = ({
  userData,
}: {
  userData: userDataType | undefined;
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const transactionsPerPage = 5;

  const transactions = userData?.payment_history || [];
  const totalPages = Math.ceil(transactions.length / transactionsPerPage);
  const paginatedTransactions = transactions.slice(
    (currentPage - 1) * transactionsPerPage,
    currentPage * transactionsPerPage
  );

  return (
    <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
      <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">
        Wallet Information
      </h2>

      {/* Wallet Balance */}
      <div className="flex space-x-4 mb-6 border-b-2 pb-2">
        <span className="text-gray-600 font-semibold">Wallet Balance:</span>
        <span className="text-gray-400 font-bold underline-offset-2">
          ₹{userData?.wallet?.toLocaleString()}
        </span>
      </div>

      {/* Transaction History Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                SI No
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Transaction Id
              </th>
              <th className="hidden md:block px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Date
              </th>
              <th className="px-3 md:px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Type
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Amount (₹)
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {paginatedTransactions.length ? (
              paginatedTransactions.map((transaction: any, index: number) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-3 text-sm text-gray-700">
                    {(currentPage - 1) * transactionsPerPage + index + 1}
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-700">
                    {transaction._id.slice(0, 6).toUpperCase()}
                  </td>
                  <td className="hidden md:block px-6 py-3 text-sm text-gray-700">
                    {new Date(transaction.date).toLocaleDateString()}
                  </td>
                  <td className="px-3 md:px-6 py-3 text-sm">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        transaction.type === "credit"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {transaction.type === "credit" ? "Credit" : "Withdraw"}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-700">
                    ₹{transaction.amount.toLocaleString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={4}
                  className="px-6 py-3 text-sm text-center text-gray-500"
                >
                  No transactions available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-end mt-4 space-x-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 text-sm font-medium bg-gray-300 rounded disabled:opacity-50"
          >
            Prev
          </button>
          <span className="text-sm font-medium text-gray-700">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="px-3 py-1 text-sm font-medium bg-gray-300 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default WalletSection;
