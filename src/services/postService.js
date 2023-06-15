import mongoose from "mongoose";
import Post from "../db/models/postModel.js";

export const createPost = async (data) => {
  return Post.create(data);
};

export const getUserPosts = async (userId, limit = 5, skip = 0) => {
  userId = new mongoose.Types.ObjectId(userId);
  const pipeline = [
    {
      $match: {
        $or: [
          { userId: { $eq: userId } },
          { mentions: { $elemMatch: { $eq: userId } } },
          { shareOnly: { $elemMatch: { $eq: userId } } },
          { postType: "public" },
        ],
      },
    },
    {
      $project: {
        _id: 0,
        __v: 0,
      },
    },
    {
      $sort: { createdAt: 1 },
    },
    {
      $group: {
        _id: null,
        count: {
          $sum: 1,
        },
        document: {
          $push: "$$ROOT",
        },
      },
    },
    {
      $unwind: "$document",
    },
    {
      $skip: skip,
    },
    {
      $limit: limit,
    },
    {
      $group: {
        _id: null,
        totalPosts: {
          $first: "$count",
        },
        results: {
          $push: "$document",
        },
      },
    },
    {
      $addFields: {
        totalPage: {
          $ceil: {
            $divide: ["$totalPosts", limit],
          },
        },
      },
    },
  ];
  return await Post.aggregate(pipeline);
};

export const getPostById = async (id) => {
  return await Post.findById(id);
};
