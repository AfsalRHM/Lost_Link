import { useEffect, useState } from "react";

import { adminService } from "../../../services/adminService";

import { Users, ShoppingCart, TrendingUp, IndianRupee } from "lucide-react";

import { Sidebar } from "../shared/Sidebar";
import NavBar from "../shared/Navbar";

import { StatCard } from "./StatCard";

import { UserChart } from "./UserChart";
import { RequestChart } from "./RequestChart";
import { RedeemRequestChart } from "./RequestRedeemChart";

import { userDataType } from "../../../interface/IuserModel";
import IrequestModel from "../../../interface/IrequestModel";
import UserChartLoading from "./loading/UserChartLoading";
import RequestChartLoading from "./loading/RequestChartLoading";
import RedeemRequestChartLoading from "./loading/RedeemRequestChartLoading";

const DashboardPage = () => {
  const [userLoading, setUserLoading] = useState<boolean>(true);
  const [requestLoading, setRequestLoading] = useState<boolean>(true);
  const [redeemRequestLoading, setRedeemRequestLoading] =
    useState<boolean>(true);

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [users, setUsers] = useState([]);
  const [requests, setRequests] = useState([]);
  const [redeemRequests, setRedeemRequests] = useState([]);

  const [totalProfit, setTotalProfit] = useState<string | number>(0);

  // Store counts by month
  const [currentMonthUsers, setCurrentMonthUsers] = useState(0);
  const [previousMonthUsers, setPreviousMonthUsers] = useState(0);

  const calculateGrowthRate = ({
    previousUsers,
    currentUsers,
  }: {
    previousUsers: number;
    currentUsers: number;
  }): string => {
    if (previousUsers === 0) {
      return currentUsers > 0 ? "100%" : "0%";
    }

    const growthRate = ((currentUsers - previousUsers) / previousUsers) * 100;
    return `${growthRate.toFixed(2)}%`;
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await adminService.getAllUsers();

        if (response.status == 200) {
          setUsers(response.data.data);

          const currentMonth = new Date().getMonth();
          const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;
          const currentYear = new Date().getFullYear();

          const usersThisMonth = response.data.data.filter(
            (user: userDataType) => {
              const createdAt = new Date(user.createdAt!);
              return (
                createdAt.getMonth() === currentMonth &&
                createdAt.getFullYear() === currentYear
              );
            }
          );
          const usersLastMonth = response.data.data.filter(
            (user: userDataType) => {
              const createdAt = new Date(user.createdAt!);
              return (
                createdAt.getMonth() === previousMonth &&
                createdAt.getFullYear() === currentYear
              );
            }
          );
          setCurrentMonthUsers(usersThisMonth.length);
          setPreviousMonthUsers(usersLastMonth.length);
        } else {
          console.log(response, "this is the error response on fetchUsers");
        }
      } catch (error) {
        console.error("Failed to fetch users", error);
      } finally {
        setUserLoading(false);
      }
    };

    // To get Request Details
    const fetchRequests = async () => {
      try {
        const response = await adminService.getAllRequests();

        if (response.status == 200) {
          setRequests(response.data.data);
          const profit = response.data.data.reduce(
            (acc: number, request: IrequestModel) => {
              return (acc += Math.floor((request.rewardAmount / 100) * 5));
            },
            0
          );
          const formattedProfit = profit.toLocaleString("en-IN");
          setTotalProfit(formattedProfit);
        } else {
          console.log(response, "this is the error response on fetchRequests");
        }
      } catch (error) {
        console.error("Failed to fetch requests", error);
      } finally {
        setRequestLoading(false);
      }
    };

    // To get Redeem Request Details
    const fetchRedeemRequests = async () => {
      try {
        const response = await adminService.getAllRedeemRequests();

        if (response.status == 200) {
          setRedeemRequests(response.data.data);
        } else {
          console.log(
            response,
            "this is the error response on fetchRedeemRequests"
          );
        }
      } catch (error) {
        console.error("Failed to fetch redeem requests", error);
      } finally {
        setRedeemRequestLoading(false);
      }
    };

    fetchUsers();
    fetchRequests();
    fetchRedeemRequests();
  }, []);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-950 to-blue-900 text-white">
      <div
        className={`lg:block fixed top-0 left-0 w-64 h-full bg-blue-900/70 backdrop-blur-md shadow-lg z-10 transition-all duration-300 ${
          sidebarOpen ? "block" : "hidden"
        }`}
      >
        <Sidebar isOpen={sidebarOpen} toggle={() => setSidebarOpen(false)} />
      </div>

      <div className="flex-1 ml-0 lg:ml-64 transition-all duration-300">
        <NavBar setSidebarOpen={setSidebarOpen} />
        <main className="p-4 md:p-6 lg:p-8">
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold mb-2">
              Dashboard Overview
            </h1>
            <div className="flex justify-between items-center">
              <p className="text-blue-200 text-sm md:text-base">
                Welcome back! Here's what's happening with your business today.
              </p>
              {/* <button className="px-3 py-1.5 bg-blue-700/50 hover:bg-blue-700/70 text-blue-100 text-sm font-medium rounded-md border border-blue-600/30 flex items-center gap-1.5 transition-colors">
                <FileDown size={20} />
                Report
              </button> */}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
            <StatCard
              title="Total Revenue (All Time)"
              value={`₹${totalProfit}`}
              icon={<IndianRupee size={24} className="text-blue-400" />}
              className="bg-blue-300/50 backdrop-blur-sm hover:shadow-lg transition-all hover:scale-105"
              loading={requestLoading}
            />
            <StatCard
              title="Total Requests (All Time)"
              value={requests.length.toString()}
              icon={<ShoppingCart size={24} className="text-green-400" />}
              className="bg-blue-300/50 backdrop-blur-sm hover:shadow-lg transition-all hover:scale-105"
              loading={requestLoading}
            />
            <StatCard
              title="Total Users (All Time)"
              value={users.length.toString()}
              icon={<Users size={24} className="text-purple-400" />}
              className="bg-blue-300/50 backdrop-blur-sm hover:shadow-lg transition-all hover:scale-105"
              loading={userLoading}
            />
            <StatCard
              title="Growth Rate (This Month)"
              value={calculateGrowthRate({
                currentUsers: currentMonthUsers,
                previousUsers: previousMonthUsers,
              })}
              icon={<TrendingUp size={24} className="text-orange-400" />}
              className="bg-blue-300/50 backdrop-blur-sm hover:shadow-lg transition-all hover:scale-105"
              loading={requestLoading}
            />
          </div>

          <div className="mb-8">
            <div className="bg-blue-800/50 rounded-xl p-4 backdrop-blur-sm shadow-md">
              <h2 className="text-xl font-semibold mb-4 text-blue-100">
                User Trend
              </h2>
              {userLoading ? (
                <UserChartLoading />
              ) : (
                <UserChart userData={users} />
              )}
            </div>
          </div>

          <div className="mb-8">
            <div className="bg-blue-800/50 rounded-xl p-4 backdrop-blur-sm shadow-md">
              <h2 className="text-xl font-semibold mb-4 text-blue-100">
                Request Trend
              </h2>
              {requestLoading ? (
                <RequestChartLoading />
              ) : (
                <RequestChart requestData={requests} />
              )}
            </div>
          </div>

          <div className="mb-8">
            <div className="bg-blue-800/50 rounded-xl p-4 backdrop-blur-sm shadow-md">
              <h2 className="text-xl font-semibold mb-4 text-blue-100">
                Redeem Request Trend
              </h2>
              {redeemRequestLoading ? (
                <RedeemRequestChartLoading />
              ) : (
                <RedeemRequestChart redeemRequestData={redeemRequests} />
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;
