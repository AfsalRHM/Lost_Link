import { check } from "express-validator";

const verifyotpValidator = [
  check("userEmail")
    .notEmpty()
    .withMessage("Email can't be empty.")
    .isEmail()
    .withMessage("Invalid Email.")
    .matches(/^\S*$/)
    .withMessage("Email can't include spaces.")
    .matches(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/)
    .withMessage("Email can only include lowercase letters."),

  check("userEnteredOTP")
    .notEmpty()
    .withMessage("OTP can't be empty.")
    .isLength({ min: 6, max: 6 })
    .withMessage("OTP must be exactly 6 characters long.")
    .isNumeric()
    .withMessage("OTP must contain only numeric values."),
];

export default verifyotpValidator;
