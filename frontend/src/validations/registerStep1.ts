export interface ValidationErrorData {
  display: boolean;
  content: string;
}

export const validateStep1Details = (step1Details: {
  userFullName: string;
  userName: string;
  userLocation: string;
}) => {
  const errors: {
    userFullName?: ValidationErrorData;
    userName?: ValidationErrorData;
    userLocation?: ValidationErrorData;
  } = {};

  if (step1Details.userFullName.trim().length < 4) {
    errors.userFullName = {
      display: true,
      content: "Full Name must be at least 4 characters long.",
    };
  } else if (step1Details.userFullName.trim().length > 30) {
    errors.userFullName = {
      display: true,
      content: "Full Name must be at most 30 characters long.",
    };
  } else if (step1Details.userFullName.trim().length === 0) {
    errors.userFullName = {
      display: true,
      content: "Full Name can't be empty.",
    };
  }

  if (step1Details.userName.trim().length < 4) {
    errors.userName = {
      display: true,
      content: "User Name must be at least 4 characters long.",
    };
  } else if (step1Details.userName.trim().length > 30) {
    errors.userName = {
      display: true,
      content: "User Name must be at most 30 characters long.",
    };
  } else if (step1Details.userName.trim().length === 0) {
    errors.userName = {
      display: true,
      content: "User Name can't be empty.",
    };
  }

  if (step1Details.userLocation.trim().length < 2) {
    errors.userLocation = {
      display: true,
      content: "User Location must be at least 2 characters long.",
    };
  } else if (step1Details.userLocation.trim().length > 50) {
    errors.userLocation = {
      display: true,
      content: "User Location must be at most 50 characters long.",
    };
  } else if (step1Details.userLocation.trim().length === 0) {
    errors.userLocation = {
      display: true,
      content: "User Location can't be empty.",
    };
  }

  return errors;
};
