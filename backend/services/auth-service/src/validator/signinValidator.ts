import { check } from "express-validator";

const signinValidator = [
  check("userFullName")
    .notEmpty()
    .withMessage("Full Name can't be empty.")
    .isLength({ min: 4 })
    .withMessage("Full Name must be at least 4 characters long.")
    .isLength({ max: 30 })
    .withMessage("Full Name must be at most 30 characters long."),

  check("userName")
    .notEmpty()
    .withMessage("User Name can't be empty.")
    .isLength({ min: 4 })
    .withMessage("User Name must be at least 4 characters long.")
    .isLength({ max: 30 })
    .withMessage("User Name must be at most 30 characters long."),

  check("userLocation")
    .notEmpty()
    .withMessage("User Location can't be empty.")
    .isLength({ min: 2 })
    .withMessage("User Location must be at least 2 characters long.")
    .isLength({ max: 50 })
    .withMessage("User Location must be at most 50 characters long."),

  check("userEmail")
    .notEmpty()
    .withMessage("Email can't be empty.")
    .isEmail()
    .withMessage("Invalid Email.")
    .matches(/^\S*$/)
    .withMessage("Email can't include spaces.")
    .matches(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/)
    .withMessage("Email can only include lowercase letters."),

  check("userPassword")
    .notEmpty()
    .withMessage("Password is required.")
    .matches(/^\S*$/)
    .withMessage("Password can't include spaces.")
    .matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/)
    .withMessage(
      "Password must have at least 8 characters, one uppercase letter, one number, and one special character."
    ),
];

export default signinValidator;
