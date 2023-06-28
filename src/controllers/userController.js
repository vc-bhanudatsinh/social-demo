import httpStatus from "http-status";

import apiResponse, { replaceMessage } from "../utils/apiResponse.js";
import * as userService from "../services/userService.js";
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
  // success response
  return apiResponse(
    res,
    httpStatus.OK,
    replaceMessage(apiMessage.fetchedResource, "User Profile"),
    req.user
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
  if (keys.length === 0)
    return apiResponse(
      res,
      400,
      replaceMessage(apiMessage.doesNotExistResource, "Updated fields")
    );

  // data to update in user collection
  const userProfile = {};
  for (let i = 0; i < keys.length; i++) {
    userProfile[keys[i]] = req.body[keys[i]];
  }

  // update profile data in db
  const isUpdated = await userService.updateProfile(
    req.user["_id"],
    userProfile
  );

  // user profile data not updated
  if (isUpdated.modifiedCount === 0)
    return apiResponse(
      res,
      httpStatus.NOT_MODIFIED,
      replaceMessage(apiMessage.noUpdateResource, "Profile")
    );

  // success response
  return apiResponse(
    res,
    httpStatus.OK,
    replaceMessage(apiMessage.successUpdateResource, "Profile")
  );
};
