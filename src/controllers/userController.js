import httpStatus from "http-status";

import User from "../db/models/userModel.js";
import apiResponse, { replaceMessage } from "../utils/apiResponse.js";
import * as auth from "../utils/auth.js";
import * as userService from "../services/userService.js";
import * as authService from "../services/authService.js";
import * as apiMessage from "../constants/messageConstant.js";

/**
 * @function getAllUsers - Get all users in db
 * @param {object} req
 * @param {object} res
 * @param {object} next
 * @returns {Promise<void>}
 */
export const getAllUsers = async (req, res, next) => {
  // get all user from db
  const users = await userService.getAllUsers();

  return res.status(httpStatus.OK).send({
    message: replaceMessage(apiMessage.fetchedResource, "Users"),
    data: users,
  });
};

/**
 * @function getUserProfile - get profile details of a user
 * @param {object} req
 * @param {object} res
 * @param {object} next
 * @returns {Promise<void>}
 */
export const getUserProfile = async (req, res, next) => {
  // get user profile from db
  const userProfile = await userService.getUserProfile(req.user.id);

  // profile not found response
  if (!userProfile)
    return apiResponse(
      res,
      httpStatus.NOT_FOUND,
      replaceMessage(apiMessage.doesNotExistResource, "User")
    );

  // success response
  return apiResponse(
    res,
    httpStatus.OK,
    replaceMessage(apiMessage.fetchedResource, "User Profile"),
    userProfile
  );
};

/**
 * @function editUserProfile - edit user profile
 * @param {object} req
 * @param {object} res
 * @param {object} next
 * @returns {Promise<void>}
 */
export const editUserProfile = async (req, res, next) => {
  // get fields to be updated
  const keys = Object.keys(req.body);

  // if there are no fields to updated
  if (keys.length === 1 && keys.includes("email"))
    return apiResponse(
      res,
      400,
      replaceMessage(apiMessage.doesNotExistResource, "Updated fields")
    );

  // data to update in user collection
  const userProfile = {};
  for (let i = 0; i < keys.length; i++) {
    if (keys[i] !== "email") {
      if (keys[i] === "newEmail") userProfile["email"] = req.body[keys[i]];
      userProfile[keys[i]] = req.body[keys[i]];
    }
  }

  // update profile data in db
  const isUpdated = await userService.updateProfile(
    req.body.email,
    userProfile
  );

  // no user profile found
  if (isUpdated.matchedCount === 0)
    return apiResponse(
      res,
      httpStatus.OK,
      replaceMessage(apiMessage.incorrectResource, "Email")
    );
  // user profile data not updated
  else if (isUpdated.modifiedCount === 0)
    return apiResponse(
      res,
      httpStatus.OK,
      replaceMessage(apiMessage.noUpdateResource, "Profile")
    );

  // success response
  return apiResponse(
    res,
    httpStatus.OK,
    replaceMessage(apiMessage.successUpdateResource, "Profile")
  );
};
