import { useSelector } from "react-redux";

import StepperPart from "./StepperPart";
import RegisterStep1 from "./RegisterStep1";
import RegisterStep2 from "./RegisterStep2";
import RegisterStep3 from "./RegisterStep3";

import { RootState } from "../../../redux/store";

const SignUpPage = () => {
  const { step } = useSelector((state: RootState) => state.registerStep);

  return (
    <div className="flex font-display bg-blue-50 items-center justify-center min-h-screen ">
      <div className="relative flex flex-col m-6 space-y-8 bg-blue-100 shadow-2xl rounded-2xl md:flex-row md:space-y-0">
        <div className="relative">
          <StepperPart />
        </div>
        <div className="flex flex-col justify-center px-8 py-4 md:p-14">
          <div className="flex justify-center">
            <span className="mb-3 text-4xl font-bold items-center flex md:flex-row flex-col">
              Welcome to <span className="text-blue-600">&nbsp;LostLink</span>
            </span>
          </div>
          <div className="flex justify-center items-center">
            <span className="font-light text-sm text-gray-400 mb-8 flex">
              Complete the steps to finish Registration
            </span>
          </div>

          {step == 1 ? (
            <RegisterStep1 />
          ) : step == 2 ? (
            <RegisterStep2 />
          ) : (
            <RegisterStep3 />
          )}
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
