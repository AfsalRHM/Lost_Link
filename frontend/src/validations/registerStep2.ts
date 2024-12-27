// validation.ts
export interface ValidationErrorData {
  display: boolean;
  content: string;
}

export const validateStep2Email = (step2Email: { email: string }) => {
  const errors: {
    userEmail?: ValidationErrorData;
  } = {};

  if (step2Email.email.trim().length == 0) {
    errors.userEmail = {
      display: true,
      content: "Invalid Email.",
    };
  } else if (step2Email.email.includes(" ")) {
    errors.userEmail = {
      display: true,
      content: "Email can't include space.",
    };
  } else if (
    !/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/.test(step2Email.email)
  ) {
    errors.userEmail = {
      display: true,
      content: "Email can only include lowercase letters.",
    };
  }

  return errors;
};

export const validateStep2OTP = (step2OTP: { otp: string }) => {
  const errors: {
    userOTP?: ValidationErrorData;
  } = {};

  if (step2OTP.otp.trim().length !== 6) {
    errors.userOTP = {
      display: true,
      content: "OTP must be 6 Numbers.",
    };
  } else if (step2OTP.otp.trim().length == 0) {
    errors.userOTP = {
      display: true,
      content: "Invalid OTP. Try again....!",
    };
  }

  return errors;
};
