import { Dispatch, SetStateAction, useState } from "react";
import { Link } from "react-router-dom";

import { Search, UserPlus } from "lucide-react";
import { showErrorToast, showSuccessToast } from "../../../utils/toastUtils";

interface BaseEntity {
  id: string;
  name: string;
  email: string;
  status: "active" | "inactive" | string;
  role: string;
}

interface ListPartProps<T extends BaseEntity> {
  items: T[];
  setItems: Dispatch<SetStateAction<T[]>>;
  entity: string;
  updateData: (id: string) => Promise<{ status: string; message: string }>;
  tableHeaders: string[];
}

function ListPart<T extends BaseEntity>({
  items = [],
  setItems,
  entity,
  updateData,
  tableHeaders,
}: ListPartProps<T>) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleStatusChange = async (id: string) => {
    const previousData = [...items];

    setItems(
      items.map((data) =>
        data.id === id
          ? {
              ...data,
              status: data.status === "active" ? "inactive" : "active",
            }
          : data
      )
    );

    try {
      const response = await updateData(id);
      if (response.status) {
        showSuccessToast(`${entity} Status Changed`);
      }
    } catch (error) {
      setItems(previousData);
      showErrorToast(`Failed to update ${entity} status`);
    }
  };

  const filteredData = items.filter(
    (data) =>
      data.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      data.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      data.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="p-6 bg-blue-900 min-h-screen text-white">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold text-white mb-4 sm:mb-0">
          {entity}
        </h1>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder={`Search ${entity}...`}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full bg-blue-300 text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {entity == "Admin" && (
            <Link to="/admin/addadmin">
              <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <UserPlus size={20} className="mr-2" />
                Add Admin
              </button>
            </Link>
          )}
        </div>
      </div>

      <div className="bg-blue-800 rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-blue-700">
              <tr>
                {tableHeaders.map((item: string) => {
                  return (
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                      {item}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody className="bg-blue-400 divide-y divide-gray-200">
              {currentData.map((data) => (
                <tr key={data.id} className="hover:bg-blue-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="ml-4">
                        <div className="text-sm font-medium text-white">
                          {data.name}
                        </div>
                        <div className="text-sm text-black">{data.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex text-sm font-medium px-2 py-1 rounded ${
                        data.status === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {data.status.charAt(0).toUpperCase() +
                        data.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex text-sm font-medium">
                      {data.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-left">
                    <button
                      onClick={() => handleStatusChange(data.id)}
                      className={`inline-flex items-center px-4 py-2 text-white rounded-lg transition-colors ${
                        data.status === "active"
                          ? "bg-red-600 hover:bg-red-700"
                          : "bg-green-600 hover:bg-green-700"
                      }`}
                    >
                      {data.status === "active" ? "Block" : "Unblock"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-4 flex justify-center gap-5 items-center">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50"
        >
          Previous
        </button>
        <span className="text-white">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default ListPart;
