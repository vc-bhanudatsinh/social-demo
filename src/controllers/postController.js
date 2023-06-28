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
    userId: req.user["_id"],
  };

  // converting username into ids in shareOnly array
  if (shareOnly) {
    shareOnlyIds = await userService.validateUserIds(shareOnly);
    console.log("shareOnlyIds", shareOnlyIds);

    data.shareOnly =
      shareOnlyIds.length === 0
        ? shareOnlyIds
        : shareOnlyIds.map((user) => (user = user["_id"]));
    console.log("data.shareOnly", data.shareOnly);
  }

  // converting username into ids in mentions array
  if (mentions) {
    // no mention then no error
    userIds = await userService.validateUserIds(mentions);
    console.log("userIds", userIds);
    data.mentions =
      userIds.length === 0
        ? userIds
        : userIds.map((user) => (user = user["_id"]));
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
    httpStatus.CREATED,
    replaceMessage(apiMessage.createResource, "Post"),
    resultPost
  );
};

/**
 * @function getPostLists - get post of users create, shared, mentioned
 * @param {object} req
 * @param {object} res
 * @param {object} next
 * @returns {Promise<void>}
 */
export const getPostLists = async (req, res, next) => {
  const { limit = 5, pageNo = 1 } = req.query;
  let searchUserId = req.query.searchUserId;
  let searchedComment =
    req.query.searchedComment === undefined
      ? req.query.searchedComment
      : new RegExp(req.query.searchedComment);

  console.log("searchUserName", searchUserId, req.user["_id"]);
  console.log("searchUserId", searchUserId);
  if (searchUserId) {
    const isValid = await userService.validateUserIds([searchUserId]);
    console.log("isValid", isValid);
    if (isValid.length === 0)
      return apiResponse(
        res,
        httpStatus.NOT_FOUND,
        replaceMessage(apiMessage.doesNotExistResource, "Filtered User")
      );
    searchUserId = isValid[0]["_id"];
  }

  console.log("searchUserId", searchUserId, searchUserId);
  // formula to skip posts as per page and limit
  const skip = (pageNo - 1) * limit;

  // get posts
  const posts = await postService.getPostLists(
    req.user["_id"],
    +limit,
    +skip,
    searchedComment,
    searchUserId
  );

  // sucess response
  return apiResponse(
    res,
    httpStatus.OK,
    replaceMessage(apiMessage.fetchedResource, "Posts"),
    posts[0]
  );
};
/**
 * @function getPostDetails - Get comment with pagination and search filter
 * @param {object} req
 * @param {object} res
 * @param {object} next
 * @returns {Promise<void>}
 */

export const getPostDetails = async (req, res, next) => {
  const postId = req.params.postId;
  const { limit = 5, pageNo = 1 } = req.query;

  // get index according to page no and limit
  const startIndex = (pageNo - 1) * limit;
  const endIndex = limit;
  console.log("slice", startIndex, endIndex);
  // get comments from db
  const comments = await postService.getPostDetailsId(
    postId,
    +startIndex,
    +limit,
    +endIndex,
    req.user["_id"]
  );

  if (comments.length === 0)
    return apiResponse(
      res,
      httpStatus.NOT_FOUND,
      "Post does not exist or it's private"
    );
  return apiResponse(
    res,
    httpStatus.OK,
    "comment fetched successfully",
    comments[0]
  );
};
