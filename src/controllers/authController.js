import httpStatus from "http-status";
import apiResponse, { replaceMessage } from "../utils/apiResponse.js";
import config from "../config/envConfig.js";
import * as apiMessage from "../constants/messageConstant.js";
import * as auth from "../utils/auth.js";
import * as authService from "../services/authService.js";

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

  // creating the user
  const user = await authService.createUser(userData);

  // creating accessToken
  const accessToken = auth.createToken(
    {
      id: user.id,
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

  // create accessToken
  const accessToken = auth.createToken(
    { id: userData.id },
    config.accessSecret
  );
  return apiResponse(res, httpStatus.OK, "Login Successfully", { accessToken });
};

export const logOutUser = async (req, res) => {
  const { email } = req.params;
};
