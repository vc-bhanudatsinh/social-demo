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
    post.userId !== req.user["_id"] &&
    post.mentions.includes(req.user["_id"]) &&
    post.shareOnly.includes(req.user["_id"])
  )
    return apiResponse(
      res,
      httpStatus.UNAUTHORIZED,
      "Not allowed to comment in this post"
    );

  const data = {
    comment,
    userId: req.user["_id"],
  };

  // convert username into ids mentions array
  const userIds = await userService.validateUserIds(mentions);
  data.mentions =
    userIds.length === 0
      ? userIds
      : userIds.map((user) => (user = user["_id"]));
  // create comment in the post
  const createdComment = await commentService.createComment(data, postId);

  if (createdComment.modifiedCount === 0)
    return apiResponse(
      res,
      httpStatus.CONFLICT,
      "Try Again Comment not created"
    );
  return apiResponse(
    res,
    httpStatus.OK,
    replaceMessage(apiMessage.createResource, "Comment")
  );
};
