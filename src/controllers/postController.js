import httpStatus from "http-status";

import apiResponse, { replaceMessage } from "../utils/apiResponse.js";
import * as userService from "../services/userService.js";
import * as postService from "../services/postService.js";
import * as apiMessage from "../constants/messageConstant.js";

/**
 * @function createPost - create post with private and public share
 * @param {object} req
 * @param {object} res
 * @param {object} next
 * @returns {promise<void>}
 */
export const createPost = async (req, res, next) => {
  const { title, description, mentions, postType, shareOnly } = req.body;

  let userIds, shareOnlyIds, post;
  const data = {
    title,
    description,
    postType,
    userId: req.user.id,
  };

  // converting username into ids in shareOnly array
  if (shareOnly) {
    shareOnlyIds = await userService.getUserIds(shareOnly);
    if (shareOnlyIds.length === 0)
      return apiResponse(
        res,
        httpStatus.NOT_FOUND,
        replaceMessage(apiMessage.doesNotExistResource, "User shared")
      );
    data.shareOnly = shareOnlyIds.map((user) => (user = user.id));
  }

  // converting username into ids in mentions array
  if (mentions) {
    userIds = await userService.getUserIds(mentions);
    if (userIds.length === 0)
      return apiResponse(
        res,
        httpStatus.NOT_FOUND,
        replaceMessage(apiMessage.doesNotExistResource, "User mentioned")
      );
    data.mentions = userIds.map((user) => (user = user.id));
  }

  // create post
  post = await postService.createPost(data);

  // success response
  const resultPost = {
    title: post.title,
    description: post.description,
    userId: post.userId,
    mentions: post.mentions,
    createdAt: post.createdAt,
    shareOnly: post.shareOnly,
  };
  return apiResponse(
    res,
    httpStatus.OK,
    replaceMessage(apiMessage.createResource, "Post"),
    resultPost
  );
};

/**
 * @function getUserPost - get post of users create, shared, mentioned
 * @param {object} req
 * @param {object} res
 * @param {object} next
 * @returns {Promise<void>}
 */
export const getUserPost = async (req, res, next) => {
  const { limit, pageNo = 1 } = req.query;

  // formula to skip posts as per page and limit
  const skip = (pageNo - 1) * limit;

  // get posts
  const posts = await postService.getUserPosts(req.user.id, +limit, +skip);

  // sucess response
  return apiResponse(
    res,
    httpStatus.OK,
    replaceMessage(apiMessage.fetchedResource, "Posts"),
    posts[0]
  );
};
