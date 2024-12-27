import SigninInput from "./SigninInput";
import ContinueButton from "./ContinueButton";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { resetStep } from "../../../redux/slice/registerStepSlice";
import { useState } from "react";

import { validateStep3Details } from "../../../validations/registerStep3";
import ValidationError from "../shared/ValidationError";
import {
  assignUserPassword,
  makeEmptyUserDetails,
} from "../../../redux/slice/registerDetails";
import insertUser from "../../../api/auth-api/saveUserAPI";
import { RootState } from "../../../redux/store";

type inputPropsType = {
  display: boolean;
  content: string;
};

const RegisterStep3 = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { userFullName, userName, userLocation, userEmail } =
  useSelector((state: RootState) => state.registerDetails);

  const [userPasswordValidationErrorData, setuserPasswordValidationErrorData] =
    useState<inputPropsType>({ display: false, content: "" });
  const [
    userReEnterPasswordValidationErrorData,
    setuserReEnterPasswordValidationErrorData,
  ] = useState<inputPropsType>({ display: false, content: "" });

  const [userPasswordInput, setUserPasswordInput] = useState<string>("");
  const [userReEnterPasswordInput, setReEnterUserPasswordInput] =
    useState<string>("");

  function handleBack(): void {
    dispatch(resetStep());
  }

  async function handleValidation(): Promise<void> {
    try {
      const errors = validateStep3Details({
        password: userPasswordInput,
        reEnterPassword: userReEnterPasswordInput,
      });

      if (errors.password) {
        setuserPasswordValidationErrorData(errors.password);
      } else {
        setuserPasswordValidationErrorData({ display: false, content: "" });
      }

      if (errors.reEnterPassword) {
        setuserReEnterPasswordValidationErrorData(errors.reEnterPassword);
      } else {
        setuserReEnterPasswordValidationErrorData({
          display: false,
          content: "",
        });
      }

      if (!errors.reEnterPassword && !errors.password) {
        dispatch(assignUserPassword(userPasswordInput));
        const result = await insertUser({
          userFullName,
          userName,
          userLocation,
          userEmail,
          userPassword: userPasswordInput,
        });

        if (result.status == true) {
          dispatch(resetStep());
          dispatch(makeEmptyUserDetails());
          navigate("/signin");
        }
      }
    } catch (error) {
      console.log(error, "error in RegisterStep3");
    }
  }

  return (
    <div>
      <div>
        <ValidationError
          display={userPasswordValidationErrorData.display}
          name="userFullNameValidation"
          content={userPasswordValidationErrorData.content}
        />
        <SigninInput
          name="Enter a Password"
          stateFunc={setUserPasswordInput}
          item="userPassword1"
        />
        <ValidationError
          display={userReEnterPasswordValidationErrorData.display}
          name="userFullNameValidation"
          content={userReEnterPasswordValidationErrorData.content}
        />
        <SigninInput
          name="Re-enter Password"
          stateFunc={setReEnterUserPasswordInput}
          item="userPassword2"
        />

        <div onClick={handleValidation}>
          <ContinueButton
            text="Register Now"
            details={{ userPassword: userPasswordInput }}
            item="registerButton"
          />
        </div>
      </div>
      <div className="text-center text-gray-400 md:pb-0 pb-5 mt-3 md:mt-8">
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

export default RegisterStep3;
