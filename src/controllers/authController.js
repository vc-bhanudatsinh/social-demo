import httpStatus from "http-status";

import config from "../config/envConfig.js";
import * as apiMessage from "../constants/messageConstant.js";
import * as auth from "../utils/auth.js";
import * as authService from "../services/authService.js";
import * as userService from "../services/userService.js";

import apiResponse, { replaceMessage } from "../utils/apiResponse.js";
import { generateOtpHash } from "../utils/auth.js";

/**
 * @function userSignUp - Create a user account
 * @param {object} req
 * @param {object} res
 * @param {object} next
 * @returns {void}
 */
export const userSignUp = async (req, res, next) => {
  const { firstName, lastName, password, email, phoneNo } = req.body;

  // hashing the password
  const hashPassword = await auth.passwordHash(password);

  // create object  as per phoneNo existence
  const userData = !phoneNo
    ? {
        firstName,
        lastName,
        password: hashPassword,
        email,
      }
    : {
        firstName,
        lastName,
        password: hashPassword,
        email,
        phoneNo,
      };

  userData.passwordChangeOtp = await auth.generateOtpHash(email);
  // creating the user
  const user = await authService.createUser(userData);

  const otpHash = await auth.passwordHash(user.passwordChangeOtp);
  // creating accessToken
  const accessToken = auth.createToken(
    {
      id: user.id,
      ref: otpHash,
    },
    config.accessSecret
  );

  // sending back the user details.
  return apiResponse(
    res,
    httpStatus.OK,
    apiMessage.createResource.replace("##", "Users"),
    {
      accessToken,
    }
  );
};

/**
 * @function loginUser - login user with email and password and generate accessToken
 * @param {object} req
 * @param {object} res
 * @returns {Promise<void>}
 */
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  // get username and hash password from db
  const userData = await authService.getUserPassword(email);
  if (!userData)
    return apiResponse(
      res,
      404,
      replaceMessage(apiMessage.doesNotExistResource, "Email")
    );
  // compare passwords
  const isPasswordMatch = await auth.compareHashPassword(
    password,
    userData.password
  );

  // password does not match
  if (!isPasswordMatch)
    return apiResponse(
      res,
      401,
      replaceMessage(apiMessage.incorrectResource, "Password")
    );
  const otpHash = await auth.passwordHash(userData.passwordChangeOtp);
  // create accessToken
  const accessToken = auth.createToken(
    { id: userData.id, ref: otpHash },
    config.accessSecret
  );
  return apiResponse(res, httpStatus.OK, "Login Successfully", { accessToken });
};

/**
 * @function changePassword - Password change of user
 * @param {object} req
 * @param {object} res
 * @param {object} next
 * @returns {Promise <void>}
 */
export const changePassword = async (req, res, next) => {
  const { password, confirmPassword } = req.body;

  // check passowrd is same as confirmPassword
  if (password !== confirmPassword)
    return apiResponse(res, 409, apiMessage.passwordDoesNotMatch);

  // get user password from DB
  const userPassword = await authService.getUserPassword(req.user.email);

  // check new password is same as old password
  const isPassSame = await auth.compareHashPassword(
    password,
    userPassword.password
  );
  if (isPassSame) return apiResponse(res, 409, apiMessage.samePassword);

  // generate new otp password change
  const newChangePasswordOtp = await auth.generateOtpHash(req.user.email);

  // hash new user password
  const hashNewPassword = await auth.passwordHash(password);

  // change password and otp password in db
  const isPassChanged = await userService.changePassword(
    req.user.email,
    hashNewPassword,
    newChangePasswordOtp
  );

  // send success response
  if (isPassChanged.modifiedCount === 1)
    return apiResponse(
      res,
      200,
      replaceMessage(apiMessage.successUpdateResource, "Password")
    );
};
