import {
  LoginFormData,
  inputPropsType as ValidationErrorData,
} from "../interface/IloginForm";

const validateAdminLoginDetails = (LoginDetails: LoginFormData) => {
  const errors: {
    email?: ValidationErrorData;
    password?: ValidationErrorData;
  } = {};

  if (!LoginDetails.email.trim()) {
    errors.email = {
      display: true,
      content: "Email is required",
    };
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(LoginDetails.email.trim())) {
    errors.email = {
      display: true,
      content: "Enter a Valid Email",
    };
  }

  if (!LoginDetails.password.trim()) {
    errors.password = {
      display: true,
      content: "Password is required",
    };
  } else if (LoginDetails.password.trim().length < 6) {
    errors.password = {
      display: true,
      content: "Enter a Valid Password",
    };
  }

  return errors;
};

export default validateAdminLoginDetails;
