import { RequestRedeemProps } from "../interface/IrequestProps";

const validateRequestRedeemFormEntries = ({
  requestRedeemDetails,
  requestCreationDate,
}: {
  requestRedeemDetails: RequestRedeemProps;
  requestCreationDate: Date;
}) => {
  const errors: {
    foundLocation?: string;
    foundDate?: string;
    damageIssues?: string;
    mobileNumber?: string;
    bankName?: string;
    accountNumber?: string;
    ifscCode?: string;
    accountHolderName?: string;
    images?: string;
  } = {};

  const isFutureDate = (dateString: string) => {
    const selectedDate = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return selectedDate > today;
  };

  const isBeforeRequestCreationDate = (dateString: string) => {
    const selectedDate = new Date(dateString);
    const requestDate = new Date(requestCreationDate);
    requestDate.setHours(0, 0, 0, 0);
    return selectedDate < requestDate;
  };

  if (!requestRedeemDetails.foundLocation.trim()) {
    errors.foundLocation = "Location of the Product Found is required";
  }

  if (!requestRedeemDetails.foundDate.trim()) {
    errors.foundDate = "Found Date is required";
  } else if (isFutureDate(requestRedeemDetails.foundDate)) {
    errors.foundDate = "Found Date cannot be in the future";
  } else if (isBeforeRequestCreationDate(requestRedeemDetails.foundDate)) {
    errors.foundDate = "Found Date cannot be before the request creation date";
  }

  if (requestRedeemDetails.damageIssues.trim().length === 0) {
    errors.damageIssues =
      "Please provide details about any damage issues or enter 'None'";
  }

  if (!requestRedeemDetails.bankName.trim()) {
    errors.bankName = "Bank Name is required";
  }

  if (!requestRedeemDetails.accountNumber.trim()) {
    errors.accountNumber = "Account Number is required";
  } else if (!/^\d{6,}$/.test(requestRedeemDetails.accountNumber)) {
    errors.accountNumber = "Account Number must be at least 6 digits";
  }

  if (!requestRedeemDetails.ifscCode.trim()) {
    errors.ifscCode = "IFSC Code is required";
  } else if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(requestRedeemDetails.ifscCode)) {
    errors.ifscCode = "Invalid IFSC Code format";
  }

  if (!requestRedeemDetails.accountHolderName.trim()) {
    errors.accountHolderName = "Account Holder Name is required";
  } else if (requestRedeemDetails.accountHolderName.length < 3) {
    errors.accountHolderName =
      "Account Holder Name must be at least 3 characters";
  }

  if (!requestRedeemDetails.mobileNumber.trim()) {
    errors.mobileNumber = "Mobile Number is required";
  } else if (!/^\d{10}$/.test(requestRedeemDetails.mobileNumber)) {
    errors.mobileNumber = "Mobile Number must be 10 digits";
  }

  if (
    !requestRedeemDetails.images ||
    requestRedeemDetails.images.length === 0
  ) {
    errors.images = "At least one image is required";
  }

  return errors;
};

export default validateRequestRedeemFormEntries;
