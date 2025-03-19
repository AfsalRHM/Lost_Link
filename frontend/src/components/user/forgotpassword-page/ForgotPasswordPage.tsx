import { useState } from "react";
import UserVerifyStep1 from "./UserVerifyStep1";
import ChangePasswordStep2 from "./ChangePasswordStep2";

const ForgotPasswordPage = () => {
  const [userMail, setUserMail] = useState<string>("");

  const [currentResetPasswordStep, setCurrentResetPasswordStep] =
    useState<number>(1);

  return (
    <div className="flex font-display bg-blue-50 items-center justify-center min-h-screen ">
      <div className="relative flex flex-col m-6 space-y-8 bg-blue-100 shadow-2xl rounded-2xl md:flex-row md:space-y-0">
        <div className="flex flex-col justify-center px-8 py-4 md:p-14">
          <div className="flex justify-center">
            <span className="mb-3 text-4xl font-bold items-center flex md:flex-row flex-col">
              Welcome to <span className="text-blue-600">&nbsp;LostLink</span>
            </span>
          </div>
          <div className="flex justify-center items-center">
            <span className="font-light text-sm text-gray-400 mb-8 flex">
              Complete the steps to Reset Your Password
            </span>
          </div>
          {currentResetPasswordStep == 1 ? (
            <UserVerifyStep1
              funcUserMail={setUserMail} 
              funcCurrentStep={setCurrentResetPasswordStep}
            />
          ) : (
            <ChangePasswordStep2 userMailValue={userMail} 
            funcCurrentStep={setCurrentResetPasswordStep} />
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
