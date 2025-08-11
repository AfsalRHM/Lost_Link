export interface ValidationErrorData {
  display: boolean;
  content: string;
}

export const validateUserEditDetails = (userEditDetails: {
  fullName: string | undefined;
  userName: string | undefined;
  phone: number | null | undefined;
}) => {
  const errors: {
    fullName?: ValidationErrorData;
    userName?: ValidationErrorData;
    phone?: ValidationErrorData;
  } = {};

  if (
    !userEditDetails.fullName ||
    userEditDetails.fullName.trim().length === 0
  ) {
    errors.fullName = {
      display: true,
      content: "Full Name can't be empty.",
    };
  } else if (userEditDetails.fullName.trim().length < 4) {
    errors.fullName = {
      display: true,
      content: "Full Name must be at least 4 characters long.",
    };
  } else if (userEditDetails.fullName.trim().length > 30) {
    errors.fullName = {
      display: true,
      content: "Full Name must be at most 30 characters long.",
    };
  }

  if (
    !userEditDetails.userName ||
    userEditDetails.userName.trim().length === 0
  ) {
    errors.userName = {
      display: true,
      content: "User Name can't be empty.",
    };
  } else if (userEditDetails.userName.trim().length < 4) {
    errors.userName = {
      display: true,
      content: "User Name must be at least 4 characters long.",
    };
  } else if (userEditDetails.userName.trim().length > 30) {
    errors.userName = {
      display: true,
      content: "User Name must be at most 30 characters long.",
    };
  } else if (!/^[a-zA-Z0-9_]+$/.test(userEditDetails.userName.trim())) {
    errors.userName = {
      display: true,
      content: "User Name can only contain letters, numbers, and underscores.",
    };
  }

  if (
    (userEditDetails.phone && userEditDetails.phone.toString().length !== 10) ||
    (userEditDetails.phone && userEditDetails.phone < 0)
  ) {
    errors.phone = {
      display: true,
      content: "Invalid Phone Number",
    };
  }

  return errors;
};
