import SigninInput from "./SigninInput";
import ContinueButton from "./ContinueButton";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useDispatch } from "react-redux";

import ValidationError from "../shared/ValidationError";

import { validateStep1Details } from "../../../validations/registerStep1";

import { nextStep } from "../../../redux/slice/registerStepSlice";
import {
  assignUserFullName,
  assignUserLocation,
  assignUserName,
} from "../../../redux/slice/registerDetails";
import Geoapify from "../shared/Geoapify";

type inputPropsType = {
  display: boolean;
  content: string;
};

const RegisterStep1 = () => {
  const dispatch = useDispatch();

  const [userFullNameValidationErrorData, setuserFullNameValidationErrorData] =
    useState<inputPropsType>({ display: false, content: "" });

  const [userNameValidationErrorData, setuserNameValidationErrorData] =
    useState<inputPropsType>({ display: false, content: "" });

  const [userLocationValidationErrorData, setuserLocationValidationErrorData] =
    useState<inputPropsType>({ display: false, content: "" });

  const [userFullNameInput, setUserFullNameInput] = useState<string>("");
  const [userNameInput, setUserNameInput] = useState<string>("");
  const [userLocationInput, setUserLocationInput] = useState<string>("");

  const step1Details = {
    userFullName: userFullNameInput,
    userName: userNameInput,
    userLocation: userLocationInput,
  };

  function handleSubmit() {
    const errors = validateStep1Details(step1Details);

    if (errors.userFullName) {
      setuserFullNameValidationErrorData(errors.userFullName);
    } else {
      setuserFullNameValidationErrorData({ display: false, content: "" });
    }

    if (errors.userName) {
      setuserNameValidationErrorData(errors.userName);
    } else {
      setuserNameValidationErrorData({ display: false, content: "" });
    }

    if (errors.userLocation) {
      setuserLocationValidationErrorData(errors.userLocation);
    } else {
      setuserLocationValidationErrorData({ display: false, content: "" });
    }

    if (!errors.userName && !errors.userLocation) {
      dispatch(assignUserFullName(userFullNameInput));
      dispatch(assignUserName(userNameInput));
      dispatch(assignUserLocation(userLocationInput));
      dispatch(nextStep());
    }
  }

  return (
    <div>
      <ValidationError
        display={userFullNameValidationErrorData.display}
        name="userFullNameValidation"
        content={userFullNameValidationErrorData.content}
      />
      <SigninInput
        name="Full Name"
        item="userFullName"
        stateFunc={setUserFullNameInput}
      />

      <ValidationError
        display={userNameValidationErrorData.display}
        name="userNameValidation"
        content={userNameValidationErrorData.content}
      />
      <SigninInput
        name="User Name"
        item="userName"
        stateFunc={setUserNameInput}
      />

      <ValidationError
        display={userLocationValidationErrorData.display}
        name="userLocationValidation"
        content={userLocationValidationErrorData.content}
      />
      {/* <SigninInput
        name="Location"
        item="userLocation"
        stateFunc={setUserLocationInput}
      /> */}
      <Geoapify forThe="onUserRegister" stateFunc={setUserLocationInput} />
      <div onClick={handleSubmit}>
        <ContinueButton
          text="Continue to Next"
          details={step1Details}
          item="continueButton"
        />
      </div>

      <div className="text-center text-gray-400 md:pb-0 pb-5 mt-3 md:mt-8">
        Already have an Acccount?
        <Link to="/signin">
          <span className="font-bold text-black hover:underline cursor-pointer transition ease-in-out duration-300">
            Log In
          </span>
        </Link>
      </div>
    </div>
  );
};

export default RegisterStep1;
