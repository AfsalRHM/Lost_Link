import React, { useState } from "react";
import { Mail, Lock } from "lucide-react";
import LoginInput from "./LoginInput";
import { inputPropsType, LoginFormData } from "../../../interface/IloginForm";
import ValidationError from "../shared/ValidationError";
import validateAdminLoginDetails from "../../../validations/adminLoginValidation";
import adminLogin from "../../../api/admin-api/adminLogin";
import { showErrorToast, showSuccessToast } from "../../../utils/toastUtils";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { assignAdminAccessToken } from "../../../redux/slice/accessTokenSlice";
import { assignAdminDetails } from "../../../redux/slice/adminDetailsSlice";

const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });

  const [adminLoginValidationError, setAdminLoginValidationError] =
    useState<inputPropsType>({ display: false, content: "" });
  const [adminMailLoginValidationError, setAdminMailLoginValidationError] =
    useState<inputPropsType>({ display: false, content: "" });
  const [
    adminPasswordLoginValidationError,
    setAdminPasswordLoginValidationError,
  ] = useState<inputPropsType>({ display: false, content: "" });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const errors = await validateAdminLoginDetails(formData);
    if (errors.email) {
      setAdminMailLoginValidationError(errors.email);
    } else {
      setAdminMailLoginValidationError({ display: false, content: "" });
    }

    if (errors.password) {
      setAdminPasswordLoginValidationError(errors.password);
    } else {
      setAdminPasswordLoginValidationError({ display: false, content: "" });
    }

    if (!errors.password && !errors.email) {
      const result = await adminLogin(formData);
      if (result.data == null) {
        showErrorToast("Admin Login Failed...!");
      } else {
        dispatch(assignAdminAccessToken(result.authorizationHeader.split(' ')[1]));
        dispatch(assignAdminDetails(result.data.data.data))
        showSuccessToast("Admin Login Success...!");
        navigate("/admin/dashboard");
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-800 via-indigo-900 to-blue-800">
      <div className="p-6 sm:p-8 w-full sm:w-1/3 bg-white bg-opacity-90 border-2 border-gray-300 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 md:mx-0 mx-5">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-6">
          Admin Login
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-8 md:space-y-4">
            <ValidationError
              display={adminMailLoginValidationError.display}
              name="userLoginValidation"
              content={adminMailLoginValidationError.content}
            />
            <ValidationError
              display={adminLoginValidationError.display}
              name="userLoginValidation"
              content={adminLoginValidationError.content}
            />
            <LoginInput
              type="email"
              icon={Mail}
              placeholder="admin@example.com"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
            <ValidationError
              display={adminPasswordLoginValidationError.display}
              name="userLoginValidation"
              content={adminPasswordLoginValidationError.content}
            />
            <LoginInput
              type="password"
              icon={Lock}
              placeholder="Enter your password"
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-2.5 sm:py-3 rounded-lg font-medium shadow-lg transform hover:scale-105 hover:from-blue-700 hover:to-blue-800 transition-all duration-300"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
