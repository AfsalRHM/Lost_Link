import { check } from "express-validator";

const sendmailValidator = [
  check("recieverEmail")
    .notEmpty()
    .withMessage("Email can't be empty.")
    .isEmail()
    .withMessage("Invalid Email.")
    .matches(/^\S*$/)
    .withMessage("Email can't include spaces.")
    .matches(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/)
    .withMessage("Email can only include lowercase letters."),

  check("recieverName")
    .notEmpty()
    .withMessage("Full Name can't be empty.")
    .isLength({ min: 4 })
    .withMessage("Full Name must be at least 4 characters long.")
    .isLength({ max: 30 })
    .withMessage("Full Name must be at most 30 characters long."),
];

export default sendmailValidator;
