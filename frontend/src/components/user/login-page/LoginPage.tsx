import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import { userService } from "../../../services/userService";

import LoginButton from "./LoginButton";
import LoginInput from "./LoginInput";
import sidePic from "/LostItem.webp";
import ValidationError from "../shared/ValidationError";
import { assignAccessToken } from "../../../redux/slice/accessTokenSlice";
import { assignUserDetails } from "../../../redux/slice/userDetailsSlice";
import { showSuccessToast } from "../../../utils/toastUtils";
import { validateLoginDetails } from "../../../validations/loginDetails";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { showErrorToast2 } from "../../../utils/iziToastUtils";

type inputPropsType = {
  display: boolean;
  content: string;
};

interface GoogleJwtPayload {
  email: string;
}

const LoginPage = () => {
  const [userMailValidationErrorData, setUserMailValidationErrorData] =
    useState<inputPropsType>({ display: false, content: "" });
  const [userPasswordValidationErrorData, setUserPasswordValidationErrorData] =
    useState<inputPropsType>({ display: false, content: "" });

  const [userMailInput, setUserMailInput] = useState<string>("");
  const [userPasswordInput, setUserPasswordInput] = useState<string>("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [userLoginValidationError, setUserLoginValidationError] =
    useState<inputPropsType>({ display: false, content: "" });

  const loginPageDetails = {
    userMail: userMailInput,
    userPassword: userPasswordInput,
  };

  async function handleSubmit(): Promise<void> {
    const errors = await validateLoginDetails(loginPageDetails);

    if (errors.userMail) {
      setUserMailValidationErrorData(errors.userMail);
    } else {
      setUserMailValidationErrorData({ display: false, content: "" });
    }

    if (errors.userPassword) {
      setUserPasswordValidationErrorData(errors.userPassword);
    } else {
      setUserPasswordValidationErrorData({ display: false, content: "" });
    }

    if (!errors.userMail && !errors.userPassword) {
      const response = await userService.login({
        userEmail: userMailInput,
        userPassword: userPasswordInput,
      });

      if (response.status === 200) {
        const userData = {
          userId: response.data.data._id,
          userName: response.data.data.user_name,
          userProfile: response.data.data.profile_pic,
        };

        // Changed the access token to body
        const accessToken = response.data.accessToken;
        dispatch(assignUserDetails(userData));
        dispatch(assignAccessToken(accessToken));
        showSuccessToast("Login successful!");
        navigate("/home");
      } else {
        setUserLoginValidationError({
          display: !response.data.status,
          content: response.data.message,
        });
      }
    }
  }

  async function handleGoogleLoginSuccess(
    credentialResponse: CredentialResponse
  ) {
    try {
      if (credentialResponse.credential) {
        const userData: GoogleJwtPayload = jwtDecode(
          credentialResponse.credential
        );
        const response = await userService.googleLogin({
          userMail: userData.email,
        });

        console.log(response, "This is the response 098765")

        if (response.status === 200) {
          const userData = {
            userId: response.data._id,
            userName: response.data.user_name,
            userProfile: response.data.profile_pic,
          };
          console.log(userData, "This is the data that we generated 123456709")
          // Changed the access token to body
          const accessToken = response.data.accessToken;
          dispatch(assignUserDetails(userData));
          dispatch(assignAccessToken(accessToken));
          showSuccessToast("Login successful...!");
          navigate("/home");
        } else {
          if (response.data.message == "Your Account has been Blocked") {
            setUserLoginValidationError({
              display: true,
              content:
                "Your Account has been Blocked..! Please contact customer service for further details",
            });
          } else if (response.data.message == "User Not Exists") {
            setUserLoginValidationError({
              display: true,
              content: "User not Exists...! Please Sign in",
            });
          }
        }
      }
    } catch (error) {
      console.log(error);
      handleGoogleLoginFailure();
    }
  }

  function handleGoogleLoginFailure() {
    showErrorToast2("Google Login Failed...!");
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
            display={userLoginValidationError.display}
            name="userLoginValidation"
            content={userLoginValidationError.content}
          />

          <ValidationError
            display={userMailValidationErrorData.display}
            name="userLoginValidation"
            content={userMailValidationErrorData.content}
          />

          <LoginInput
            name="Enter your Email"
            stateFunc={setUserMailInput}
            item="emailOrPhone"
          />

          <ValidationError
            display={userPasswordValidationErrorData.display}
            name="userLoginValidation"
            content={userPasswordValidationErrorData.content}
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
            <Link to="/resetpassword">
              <span className="font-bold text-md cursor-pointer hover:text-gray-500">
                Forgot password
              </span>
            </Link>
          </div>

          <div onClick={handleSubmit}>
            <LoginButton item="submitButton" />
          </div>

          <GoogleLogin
            onSuccess={handleGoogleLoginSuccess}
            onError={handleGoogleLoginFailure}
            useOneTap
            theme="filled_blue"
            size="large"
          />
          <br></br>

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
