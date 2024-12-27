import { Link, useNavigate } from "react-router-dom";
import LoginButton from "./LoginButton";
import LoginInput from "./LoginInput";

import sidePic from "/LostItem.webp";
import { useState } from "react";
import userLogin from "../../../api/auth-api/userLoginAPI";
import ValidationError from "../shared/ValidationError";
import { assignAccessToken } from "../../../redux/slice/accessTokenSlice";
import { useDispatch } from "react-redux";
import { assignUserDetails } from "../../../redux/slice/userDetailsSlice";

const LoginPage = () => {
  const [userMailInput, setUserMailInput] = useState<string>("");
  const [userPasswordInput, setUserPasswordInput] = useState<string>("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [userLoginValidationError, setUserLoginValidationError] = useState<{
    status: boolean;
    message: string;
  }>({ status: true, message: "" });

  async function handleSubmit(): Promise<void> {
    const result = await userLogin({
      userEmail: userMailInput,
      userPassword: userPasswordInput,
    });
    if (!result.data.status) {
      setUserLoginValidationError({
        status: result.data.status,
        message: result.data.message,
      });
    } else {
      console.log(result.data.data)
      const userData = {
        userId: result.data.data._id,
        userName: result.data.data.user_name
      }
      const accessToken = result.authorizationHeader.split(" ")[1];
      dispatch(assignUserDetails(userData))
      dispatch(assignAccessToken(accessToken));
      navigate("/home");
    }
  }

  return (
    <div className="flex font-display bg-blue-50 items-center justify-center min-h-screen ">
      <div className="relative flex flex-col m-6 space-y-8 bg-blue-100 shadow-2xl rounded-2xl md:flex-row md:space-y-0">
        <div className="flex flex-col justify-center p-8 md:p-14">
          <div className="flex justify-center">
            <span className="mb-3 text-4xl font-bold items-center flex">
              Welcome back
            </span>
          </div>
          <div className="flex justify-center">
            <span className="font-light text-sm text-gray-400 mb-8">
              Welcome back! Please enter your details
            </span>
          </div>

          <ValidationError
            display={!userLoginValidationError.status}
            name="userLoginValidation"
            content={userLoginValidationError.message}
          />
          <LoginInput
            name="Enter your Email"
            stateFunc={setUserMailInput}
            item="emailOrPhone"
          />
          <LoginInput
            name="Enter your Password"
            stateFunc={setUserPasswordInput}
            item="password"
          />

          <div className="flex justify-between w-full py-4">
            <div className="mr-24">
              <input type="checkbox" name="ch" id="ch" className="mr-2" />
              <span className="text-md">Remember for 5 days</span>
            </div>
            <span className="font-bold text-md cursor-pointer hover:text-gray-500">
              Forgot password
            </span>
          </div>

          <div onClick={handleSubmit}>
            <LoginButton item="submitButton" />
          </div>
          <LoginButton item="googleButton" />

          <div className="text-center text-gray-400">
            Dont'have an account?
            <Link to="/signup">
              <span className="font-bold text-black hover:underline cursor-pointer transition ease-in-out duration-300">
                Sign up for free
              </span>
            </Link>
          </div>
        </div>
        <div className="relative">
          <img
            src={sidePic}
            alt="img"
            className="w-[400px] h-full hidden rounded-r-2xl md:block object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;