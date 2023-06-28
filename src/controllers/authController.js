import httpStatus from "http-status";

import config from "../config/envConfig.js";
import * as apiMessage from "../constants/messageConstant.js";
import * as auth from "../utils/auth.js";
import * as authService from "../services/authService.js";

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
  const userData = {
    firstName,
    lastName,
    password: hashPassword,
    email,
  };

  if (phoneNo) userData.phoneNo = phoneNo;

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
      replaceMessage(apiMessage.doesNotExistResource, "Email or Password")
      // Email does not exist or credentials is not right
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
      replaceMessage(apiMessage.incorrectResource, "Email or Password")
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
  const { password } = req.body;

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

  console.log("req.user", typeof req.user["_id"]);
  const isPassChanged = await authService.changePassword(
    req.user["_id"],
    hashNewPassword,
    newChangePasswordOtp
  );

  // send new access token in res
  // send success response
  if (isPassChanged.modifiedCount === 1) {
    const otpHash = await auth.passwordHash(user.passwordChangeOtp);
    const accessToken = auth.createToken(
      { id: userPassword.id, ref: otpHash },
      config.accessSecret
    );
    return apiResponse(
      res,
      200,
      replaceMessage(apiMessage.successUpdateResource, "Password"),
      accessToken
    );
  }
};
