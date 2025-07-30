import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";

import { userService } from "../../../services/userService";

import SigninInput from "./SigninInput";
import ContinueButton from "./ContinueButton";
import PreviousButton from "./PreviousButton";
import { nextStep, resetStep } from "../../../redux/slice/registerStepSlice";
import { emailVerfiedTrue } from "../../../redux/slice/emailVerficationSlice";

import { RootState } from "../../../redux/store";
import {
  validateStep2Email,
  validateStep2OTP,
} from "../../../validations/registerStep2";
import ValidationError from "../shared/ValidationError";
import { assignUserEmail } from "../../../redux/slice/registerDetails";

type inputPropsType = {
  display: boolean;
  content: string;
};

const RegisterStep2 = () => {
  const dispatch = useDispatch();

  const { userFullName } = useSelector(
    (state: RootState) => state.registerDetails
  );

  const [otpTracker, setOtpTracker] = useState<boolean>(false);

  const [userEmailValidationErrorData, setuserEmailValidationErrorData] =
    useState<inputPropsType>({ display: false, content: "" });

  const [userOTPValidationErrorData, setuserOTPValidationErrorData] =
    useState<inputPropsType>({ display: false, content: "" });

  const [userEmailInput, setUserEmailInput] = useState<string>("");
  const [userOTPInput, setUserOTPInput] = useState<string>("");

  const [resendOtpTimer, setResendOtpTimer] = useState<number>(0);

  // Storing the timer

  useEffect(() => {
    const savedExpirationTime = localStorage.getItem("resendOtpExpirationTime");

    if (savedExpirationTime) {
      const remainingTime = Math.floor(
        (new Date(savedExpirationTime).getTime() - new Date().getTime()) / 1000
      );

      if (remainingTime > 0) {
        setResendOtpTimer(remainingTime);
      } else {
        localStorage.removeItem("resendOtpExpirationTime");
      }
    }
  }, []);

  // Countdown Timer Effect
  useEffect(() => {
    if (resendOtpTimer > 0) {
      const timerInterval = setInterval(() => {
        setResendOtpTimer((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(timerInterval);
    }
  }, [resendOtpTimer]);

  // Validate the Email and Sending the OTP to Mail
  async function handleOtpTracker() {
    const errors = validateStep2Email({ email: userEmailInput });

    if (errors.userEmail) {
      setuserEmailValidationErrorData(errors.userEmail);
    } else {
      setuserEmailValidationErrorData({ display: false, content: "" });
    }

    if (!errors.userEmail) {
      const response = await userService.sendMail({
        recieverName: userFullName,
        recieverEmail: userEmailInput,
      });
      if (response.status === 200) {
        const expirationTime = new Date(new Date().getTime() + 47 * 1000);
        localStorage.setItem(
          "resendOtpExpirationTime",
          expirationTime.toISOString()
        );
        setResendOtpTimer(47);
        setOtpTracker(true);
      } else {
        console.log(response, "this is the error response on sendMail");
        setuserEmailValidationErrorData({
          display: !response.data.status,
          content: response.data.message,
        });
      }
    }
  }

  // Verifying the OTP and Proceed to the Register Step 3
  async function handleVerify(): Promise<void> {
    const errors = validateStep2OTP({ otp: userOTPInput });
    if (errors.userOTP) {
      setuserOTPValidationErrorData(errors.userOTP);
    } else {
      setuserOTPValidationErrorData({ display: false, content: "" });
    }
    if (!errors.userOTP) {
      const response = await userService.verifyOTP({
        userEmail: userEmailInput,
        userEnteredOTP: userOTPInput,
      });
      if (response.status === 200) {
        dispatch(emailVerfiedTrue());
        dispatch(assignUserEmail(userEmailInput));
        dispatch(nextStep());
      } else {
        console.log(
          response,
          "this is the error response on getRedeemRequests"
        );
        setuserOTPValidationErrorData({
          display: true,
          content: "Enter the correct OTP",
        });
      }
    }
  }

  // Logic for the Back Button
  function handleBack(): void {
    dispatch(resetStep());
  }

  return (
    <div>
      <div>
        <div>
          <ValidationError
            display={userEmailValidationErrorData.display}
            name="userFullNameValidation"
            content={userEmailValidationErrorData.content}
          />
          <SigninInput
            name="Enter Your Email"
            item="userEmail"
            stateFunc={setUserEmailInput}
          />
        </div>
        <div>
          {otpTracker == false ? (
            <div onClick={handleOtpTracker}>
              <ContinueButton text="Get OTP" item="OTPButton" />
            </div>
          ) : (
            <>
              <ValidationError
                display={userOTPValidationErrorData.display}
                name="userFullNameValidation"
                content={userOTPValidationErrorData.content}
              />
              <div>
                <SigninInput
                  name="Enter the OTP"
                  item="userOTP"
                  stateFunc={setUserOTPInput}
                />
              </div>
              <div className="text-center">
                {resendOtpTimer > 0 ? (
                  <span className="text-gray-500">
                    Resend OTP in {resendOtpTimer}s
                  </span>
                ) : (
                  <span
                    className="text-blue-500 hover:underline cursor-pointer"
                    onClick={handleOtpTracker}
                  >
                    Resend OTP
                  </span>
                )}
              </div>
              <div onClick={handleVerify}>
                <ContinueButton
                  text="Verify OTP & Continue"
                  item="continueButtonForRegister2"
                  details={{ userEmail: userEmailInput }}
                />
              </div>
            </>
          )}
          <PreviousButton text="Go to Previous" item="previousButton" />
        </div>
      </div>
      <div className="text-center text-gray-400 md:pb-0 pb-5 mt-3 md:mt-2">
        <Link to="/">
          <span
            onClick={handleBack}
            className="font-bold text-black hover:underline cursor-pointer transition ease-in-out duration-300"
          >
            Go Back to Home Page
          </span>
        </Link>
      </div>
    </div>
  );
};

export default RegisterStep2;
