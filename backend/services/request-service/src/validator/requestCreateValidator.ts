import { check } from "express-validator";

const requestDetailsValidator = [
  check("productName")
    .trim()
    .notEmpty()
    .withMessage("Product Name is required"),

  check("requestReward")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Invalid Reward Amount"),

  check("travelMode")
    .optional()
    .trim()
    .isLength({ min: 3 })
    .withMessage("Invalid Mode of Travel"),

  check("travelRoutes")
    .optional()
    .custom((value) => Array.isArray(value) && value.length > 0)
    .withMessage("Invalid Travel Routes"),

  check("missingPlace")
    .optional()
    .trim()
    .isLength({ min: 3 })
    .withMessage("Invalid Place"),

  check("missingDate")
    .optional()
    .custom((value) => {
      const inputDate = new Date(value);
      const today = new Date();
      return !isNaN(inputDate.getTime()) && inputDate < today;
    })
    .withMessage(
      "Missing Date must be a valid date that is today or earlier than today"
    ),

  check("productCategory")
    .trim()
    .notEmpty()
    .withMessage("Product Category is required"),

  check("expirationLimit")
    .trim()
    .notEmpty()
    .withMessage("Expiration Limit is required"),

  check("images")
    .optional()
    .custom(
      (value) => Array.isArray(value) && value.length > 0 && value.length <= 5
    )
    .withMessage(
      "At least one image is required and at most five images will be accepted"
    ),
];

export default requestDetailsValidator;
