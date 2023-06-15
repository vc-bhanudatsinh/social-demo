import httpStatus from "http-status";

import apiResponse, { replaceMessage } from "../utils/apiResponse.js";

import * as userService from "../services/userService.js";
import * as postService from "../services/postService.js";
import * as commentService from "../services/commentService.js";
import * as apiMessage from "../constants/messageConstant.js";

export const createComment = async (req, res, next) => {
  const { postId, comment, mentions } = req.body;
  const post = await postService.getPostById(postId);
  if (!post)
    return apiResponse(
      res,
      httpStatus.NOT_FOUND,
      replaceMessage(apiMessage.doesNotExistResource, "Post")
    );
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
  data.mentions = await userService.getUserIds(mentions);
  const createdComment = await commentService.createComment(data);

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

export const getComment = async (req, res, next) => {
  const postId = req.params.postId;
  const { limit = 5, pageNo = 1, searchedComment } = req.query;
  const startIndex = (pageNo - 1) * limit;
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
