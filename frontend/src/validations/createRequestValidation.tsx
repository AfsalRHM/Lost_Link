import { RequestProps } from "../interface/IrequestProps";
import { ValidationErrorData } from "./loginDetails";

const validateCreateRequestEntries = (requestDetails: RequestProps) => {
  const errors: {
    productName?: ValidationErrorData;
    requestReward?: ValidationErrorData;
    productCategory?: ValidationErrorData;
    travelMode?: ValidationErrorData;
    travelRoutes?: ValidationErrorData;
    missingPlace?: ValidationErrorData;
    missingDate?: ValidationErrorData;
    expirationLimit?: ValidationErrorData;
    images?: ValidationErrorData;
    additionalInfo?: ValidationErrorData;
  } = {};

  const inputDate = new Date(requestDetails.missingDate);
  const today = new Date();

  if (!requestDetails.productName.trim()) {
    errors.productName = {
      display: true,
      content: "Product Name is required",
    };
  }
  if (requestDetails.requestReward !== undefined && requestDetails.requestReward < 0) {
    errors.requestReward = {
      display: true,
      content: "Invalid Reward Amount",
    };
  }
  if (
    requestDetails.travelMode &&
    (!requestDetails.travelMode.trim() ||
      requestDetails.travelMode.trim().length <= 2)
  ) {
    errors.travelMode = {
      display: true,
      content: "Invalid Mode of Travel",
    };
  }
  if (
    Array.isArray(requestDetails.travelRoutes) &&
    requestDetails.travelRoutes.length === 0
  ) {
    errors.travelRoutes = {
      display: true,
      content: "Invalid Travel Routes",
    };
  }
  if (
    requestDetails.missingPlace &&
    (!requestDetails.missingPlace.trim() ||
      requestDetails.missingPlace.trim().length <= 2)
  ) {
    errors.missingPlace = {
      display: true,
      content: "Invalid Place",
    };
  }
  if (requestDetails.missingDate && !Date.parse(requestDetails.missingDate)) {
    errors.missingDate = {
      display: true,
      content: "Invalid Missing Date",
    };
  } else if (isNaN(inputDate.getTime()) || inputDate >= today) {
    errors.missingDate = {
      display: true,
      content:
        "Missing Date must be a valid date that is today or earlier than today",
    };
  }
  if (!requestDetails.productCategory.trim()) {
    errors.productCategory = {
      display: true,
      content: "Product Category is required",
    };
  }
  if (!requestDetails.expirationLimit.trim()) {
    errors.expirationLimit = {
      display: true,
      content: "Expiration Limit is required",
    };
  }
  if (
    Array.isArray(requestDetails.images) &&
    requestDetails.images.length === 0
  ) {
    errors.images = {
      display: true,
      content: "At least one image is required",
    };
  } else if (requestDetails.images.length >= 5) {
    errors.images = {
      display: true,
      content: "At most five images will accept",
    };
  }

  return errors;
};

export default validateCreateRequestEntries;
