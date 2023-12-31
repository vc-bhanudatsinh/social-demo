import joi from "joi";

export const userSignUpSchema = joi.object().keys({
  body: joi.object().keys({
    firstName: joi.string().min(2).max(20).required().messages({
      "string.base": "First Name should be string",
      "string.empty": "First Name should be not empty",
      "string.min": "First Name length should be min 2",
      "string.max": "First Name length should be max 20",
      "any.required": "First Name is required field",
    }),
    lastName: joi.string().min(2).max(20).required().messages({
      "string.base": "Last Name should be string",
      "string.empty": "Last Name should be not empty",
      "string.min": "Last Name length should be min 2",
      "string.max": "Last Name length should be max 20",
      "any.required": "Last Name is required field",
    }),
    password: joi.string().min(8).max(20).required().messages({
      "string.base": "Password should be string",
      "string.min": "Password length should be greater than 8",
      "string.max": "Password length should be less than 20",
      "string.empty": "Password should can not contain empty value",
      "any.required": "Password is a required field",
    }),
    phoneNo: joi
      .number()
      .min(10 ** 9)
      .max(10 ** 10 - 1)
      .messages({
        "number.base": "Phone Number should be number",
        "number.min": "Phone Number should contain 10 digit only",
        "number.max": "Phone Number should contain 10 digit only",
        "number.empty": "Phone Number can not be empty",
      }),
    email: joi
      .string()
      .required()
      .custom((value, helper) => {
        const regex = new RegExp("[^@ \t\r\n]+@[^@ \t\r\n]+.[^@ \t\r\n]+");
        if (!regex.test(value))
          return helper.message(`${value} is not a valid Email`);
      })
      .messages({
        "string.base": "Email should be string",
        "string.required": "Email is a required field",
        "string.empty": "Email can not be empty",
      }),
  }),
});

export const userLoginSchema = joi.object().keys({
  body: joi.object().keys({
    email: joi
      .string()
      .required()
      .custom((value, helper) => {
        const regex = new RegExp("[^@ \t\r\n]+@[^@ \t\r\n]+.[^@ \t\r\n]+");
        if (!regex.test(value))
          return helper.message(`${value} is not a valid Email`);
      })
      .messages({
        "string.base": "Email should be string",
        "string.empty": "Email can not be empty",
        "any.required": "Email is a required field",
      }),
    password: joi.string().min(8).max(20).required().messages({
      "string.base": "Password should be string",
      "string.min": "Password length should be greater than 8",
      "string.max": "Password length should be less than 20",
      "string.empty": "Password should can not contain empty value",
      "any.required": "Password is a required field",
    }),
  }),
});

export const changPasswordSchema = joi.object().keys({
  body: joi.object().keys({
    password: joi.string().min(8).max(20).required().messages({
      "string.base": "Password should be string",
      "string.min": "Password length should be greater than 8",
      "string.max": "Password length should be less than 20",
      "string.empty": "Password should can not contain empty value",
      "any.required": "Password is a required field",
    }),
    confirmPassword: joi.string().min(8).max(20).required().messages({
      "string.base": "Confirm Password should be string",
      "string.min": "Confirm Password length should be greater than 8",
      "string.max": "Confirm Password length should be less than 20",
      "string.empty": "Confirm Password should can not contain empty value",
      "any.required": "Confirm Password is a required field",
    }),
  }),
});
