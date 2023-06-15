import httpStatus from "http-status";

import User from "../db/models/userModel.js";
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
  const userProfile = await userService.getUserProfile(req.user.id);
  if (!userProfile)
    return apiResponse(
      res,
      httpStatus.NOT_FOUND,
      replaceMessage(apiMessage.doesNotExistResource, "User")
    );
  return apiResponse(
    res,
    httpStatus.OK,
    replaceMessage(apiMessage.fetchedResource, "User Profile"),
    userProfile
  );
};

export const editUserProfile = async (req, res, next) => {
  const keys = Object.keys(req.body);
  const userProfile = {};
  for (let i = 0; i < keys.length; i++) {
    if (keys[i] !== "email") {
      if (keys[i] === "newEmail") userProfile["email"] = req.body[keys[i]];
      userProfile[keys[i]] = req.body[keys[i]];
    }
  }
  const isUpdated = await userService.updateProfile(
    req.body.email,
    userProfile
  );
  if (isUpdated.matchedCount === 0)
    return apiResponse(
      res,
      httpStatus.OK,
      replaceMessage(apiMessage.incorrectResource, "Email")
    );
  else if (isUpdated.modifiedCount === 0)
    return apiResponse(
      res,
      httpStatus.OK,
      replaceMessage(apiMessage.noUpdateResource, "Profile")
    );
  return apiResponse(
    res,
    httpStatus.OK,
    replaceMessage(apiMessage.successUpdateResource, "Profile")
  );
};
