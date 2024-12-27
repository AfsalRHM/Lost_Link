export interface ValidationErrorData {
  display: boolean;
  content: string;
}

export const validateStep3Details = (step3Details: {
  password: string;
  reEnterPassword: string;
}) => {
  const errors: {
    password?: ValidationErrorData;
    reEnterPassword?: ValidationErrorData;
  } = {};

  if (step3Details.password.trim().length === 0) {
    errors.password = {
      display: true,
      content: "Password is required.",
    };
  } else if (step3Details.password.includes(" ")) {
    errors.password = {
      display: true,
      content: "Password can't include spaces.",
    };
  } else if (
    !/^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(step3Details.password)
  ) {
    errors.password = {
      display: true,
      content:
        "Password must have at least 8 characters, one uppercase letter, one number, and one special character.",
    };
  }

  if (step3Details.password !== step3Details.reEnterPassword) {
    errors.reEnterPassword = {
      display: true,
      content: "Password didn't match.",
    };
  }

  return errors;
};
