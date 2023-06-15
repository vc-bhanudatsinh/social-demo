import httpStatus from "http-status";

import apiResponse, { replaceMessage } from "../utils/apiResponse.js";

import * as userService from "../services/userService.js";
import * as postService from "../services/postService.js";
import * as commentService from "../services/commentService.js";
import * as apiMessage from "../constants/messageConstant.js";

/**
 * @function createComment - create a comment in specific post
 * @param {object} req
 * @param {object} res
 * @param {object} next
 * @returns {Promise<void>}
 */
export const createComment = async (req, res, next) => {
  const { postId, comment, mentions } = req.body;

  // check for Post exist
  const post = await postService.getPostById(postId);
  if (!post)
    return apiResponse(
      res,
      httpStatus.NOT_FOUND,
      replaceMessage(apiMessage.doesNotExistResource, "Post")
    );

  // check if user is allowed to see the post
  if (
    post.postType === "private" &&
    post.userId !== req.user.id &&
    post.mentions.includes(req.user.id) &&
    post.shareOnly.includes(req.user.id)
  )
    return apiResponse(
      res,
      httpStatus.UNAUTHORIZED,
      "Not allowed to comment in this post"
    );

  const data = {
    comment,
  };

  // convert username into ids mentions array
  data.mentions = await userService.getUserIds(mentions);

  // create comment in the post
  const createdComment = await commentService.createComment(data);

  // check if post is exist
  if (createdComment.matchedCount === 0)
    return apiResponse(
      res,
      httpStatus.NOT_FOUND,
      replaceMessage(apiMessage, "Post")
    );
  return apiResponse(
    res,
    httpStatus.OK,
    replaceMessage(apiMessage.createResource, "Comment")
  );
};

/**
 * @function getComment - Get comment with pagination and search filter
 * @param {object} req
 * @param {object} res
 * @param {object} next
 * @returns {Promise<void>}
 */
export const getComment = async (req, res, next) => {
  const postId = req.params.postId;
  const { limit = 5, pageNo = 1, searchedComment } = req.query;

  // get index according to page no and limit
  const startIndex = (pageNo - 1) * limit;

  // get comments from db
  const comments = await commentService.getComments(
    postId,
    +startIndex,
    +limit,
    new RegExp(searchedComment)
  );
  return apiResponse(
    res,
    httpStatus.OK,
    "comment fetched successfully",
    comments[0]
  );
};
