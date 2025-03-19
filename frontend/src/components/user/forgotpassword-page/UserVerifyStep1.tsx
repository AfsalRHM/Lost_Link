import SigninInput from "../signup-page/SigninInput";
import ContinueButton from "../signup-page/ContinueButton";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

import {
  validateStep2Email,
  validateStep2OTP,
} from "../../../validations/registerStep2";
import ValidationError from "../shared/ValidationError";
import verifyOTP from "../../../api/auth-api/verifyOTPAPI";
import sendResetPasswordMail from "../../../api/auth-api/resetPasswordAPI";

type inputPropsType = {
  display: boolean;
  content: string;
};

const UserVerifyStep1 = (Props: {
  funcUserMail: any;
  funcCurrentStep: any;
}) => {
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
      const response = await sendResetPasswordMail({
        recieverName: "Reset Password",
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
        setuserEmailValidationErrorData({
          display: !response.data.status,
          content: response.data.message,
        });
        console.log(
          response,
          "this is the error response on sendResetPasswordMail"
        );
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
      const response = await verifyOTP({
        userEmail: userEmailInput,
        userEnteredOTP: userOTPInput,
      });
      if (response.status === 200) {
        Props.funcUserMail(userEmailInput);
        Props.funcCurrentStep(2);
      } else {
        setuserOTPValidationErrorData({
          display: true,
          content: "Enter the correct OTP",
        });
        console.log(
          response,
          "this is the error response on verifyOTP"
        );
      }
    }
  }

  return (
    <div>
      <div>
        <div>
          <ValidationError
            display={userEmailValidationErrorData.display}
            name="userEmailValidation"
            content={userEmailValidationErrorData.content}
          />
          <SigninInput
            name="Enter Your Email"
            item="userEmail"
            stateFunc={setUserEmailInput}
          />
        </div>
        <div className="mb-5">
          {otpTracker == false ? (
            <div onClick={handleOtpTracker}>
              <ContinueButton text="Get OTP" item="OTPButton" />
            </div>
          ) : (
            <>
              <ValidationError
                display={userOTPValidationErrorData.display}
                name="userEmailValidation"
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
        </div>
      </div>
      <div className="text-center text-gray-400 md:pb-0 pb-5 mt-5 md:mt-2">
        <Link to="/">
          <span className="font-bold text-black hover:underline cursor-pointer transition ease-in-out duration-300">
            Go Back to Home Page
          </span>
        </Link>
      </div>
    </div>
  );
};

export default UserVerifyStep1;
