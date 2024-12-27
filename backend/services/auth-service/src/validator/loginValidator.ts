import { check } from "express-validator";

const loginValidator = [
  check("userEmail")
    .notEmpty()
    .withMessage("Email can't be empty.")
    .isEmail()
    .withMessage("Email must be Provided."),

  check("userPassword").notEmpty().withMessage("Password can't be empty."),
];

export default loginValidator;
