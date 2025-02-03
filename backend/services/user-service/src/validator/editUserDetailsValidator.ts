import { check } from "express-validator";

const updateUserDataValidator = [
  check("formData.fullName")
    .notEmpty()
    .withMessage("Full Name can't be empty.")
    .isLength({ min: 4 })
    .withMessage("Full Name must be at least 4 characters long.")
    .isLength({ max: 30 })
    .withMessage("Full Name must be at most 30 characters long.")
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage("Full Name can only contain letters and spaces."),

  check("formData.userName")
    .notEmpty()
    .withMessage("User Name can't be empty.")
    .isLength({ min: 4 })
    .withMessage("User Name must be at least 4 characters long.")
    .isLength({ max: 30 })
    .withMessage("User Name must be at most 30 characters long.")
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage("User Name can only contain letters, numbers, and underscores."),

  check("formData.phone")
    .isNumeric()
    .withMessage("Phone Number must contain only numbers.")
    .isLength({ min: 10, max: 10 })
    .withMessage("Phone Number must be exactly 10 digits.")
    .matches(/^[1-9][0-9]{9}$/)
    .withMessage("Invalid Phone Number."),
];

export default updateUserDataValidator;