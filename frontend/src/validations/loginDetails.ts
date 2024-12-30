export interface ValidationErrorData {
  display: boolean;
  content: string;
}

export const validateLoginDetails = (LoginDetails: {
  userMail: string;
  userPassword: string;
}) => {
  const errors: {
    userMail?: ValidationErrorData;
    userPassword?: ValidationErrorData;
  } = {};

  if (LoginDetails.userMail.trim().length < 4) {
    errors.userMail = {
      display: true,
      content: "Enter a Valid Name",
    };
  }

  if (LoginDetails.userPassword.trim().length < 4) {
    errors.userPassword = {
      display: true,
      content: "Enter a Valid Password",
    };
  }

  return errors;
};
