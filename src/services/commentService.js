import mongoose from "mongoose";
import Post from "../db/models/postModel.js";

export const createComment = async (data, id) => {
  return await Post.updateOne({ id }, { $push: { comments: data } });
};

export const getComments = async (id, startIndex, limit) => {
  console.log("limit", limit, startIndex);
  const postId = new mongoose.Types.ObjectId(id);
  const pipeline = [
    {
      $match: {
        _id: postId,
      },
    },
    {
      $unwind: "$comments",
    },
    {
      $sort: { "comments.createdAt": -1 },
    },
    {
      $group: {
        _id: "$_id",
        title: { $first: "$title" },
        description: { $first: "$description" },
        mentions: { $first: "$mentions" },
        createdAt: { $first: "$createdAt" },
        shareOnly: { $first: "$shareOnly" },
        comments: {
          $push: "$comments",
        },
      },
    },
    {
      $project: {
        totalComments: {
          $size: "$comments",
        },
        totalPages: {
          $ceil: {
            $divide: [{ $size: "$comments" }, limit],
          },
        },
        comments: {
          $slice: ["$comments", startIndex, limit],
        },
      },
    },
  ];
  return await Post.aggregate(pipeline);
};
