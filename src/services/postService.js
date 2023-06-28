import mongoose from "mongoose";
import Post from "../db/models/postModel.js";

export const createPost = async (data) => Post.create(data);

export const getPostById = async (id) => Post.findById(id).lean();

export const getPostLists = async (
  userId,
  limit,
  skip,
  searchedComment,
  searchedUserId
) => {
  const searchQuery = [
    {
      $unwind: {
        path: "$comments",
        includeArrayIndex: "string",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $match: {
        $or: [
          { "comments.comment": searchedComment },
          { title: searchedComment },
          { description: searchedComment },
        ],
      },
    },
    {
      $group: {
        _id: "$_id",
        title: {
          $first: "$title",
        },
        description: {
          $first: "$description",
        },
        postType: {
          $first: "$postType",
        },
        mentions: {
          $first: "$mentions",
        },
        createdAt: {
          $first: "$createdAt",
        },
        shareOnly: {
          $first: "$shareOnly",
        },
        comments: {
          $push: "$comments",
        },
      },
    },
  ];

  const orQuery = [
    {
      postType: "public",
    },
  ];

  const pipeline = [
    {
      $match: {
        $or: orQuery,
      },
    },
    {
      $unset: "comments",
    },
    {
      $group: {
        _id: null,
        results: {
          $push: "$$ROOT",
        },
      },
    },
    {
      $project: {
        totalPost: {
          $size: "$results",
        },
        totalPage: {
          $ceil: {
            $divide: [
              {
                $size: "$results",
              },
              limit,
            ],
          },
        },
        results: {
          $slice: ["$results", skip, limit],
        },
        _id: 0,
      },
    },
  ];

  if (searchedUserId) {
    console.log(".............................searchedUserId", searchedUserId);
    orQuery.push({
      postType: "private",
      $and: [
        {
          $or: [
            {
              userId: userId,
            },
            {
              shareOnly: userId,
            },
          ],
        },
        {
          $or: [
            {
              shareOnly: searchedUserId,
            },
            {
              mentions: searchedUserId,
            },
            {
              "comments.mentions": searchedUserId,
            },
          ],
        },
      ],
    });
    pipeline.splice(1, 0, {
      $addFields: {
        comment: {
          $filter: {
            input: "$comments",
            as: "comments",
            cond: {
              $in: [searchedUserId, "$$comments.mentions"],
            },
          },
        },
      },
    });
    pipeline.splice(2, 0, {
      $addFields: {
        comment: {
          $cond: [
            {
              $eq: [
                {
                  $size: "$comment",
                },
                0,
              ],
            },
            {
              $cond: [
                {
                  $eq: [
                    {
                      $size: "$comments",
                    },
                    0,
                  ],
                },
                {},
                {
                  $last: "$comments",
                },
              ],
            },
            "$comment",
          ],
        },
      },
    });

    if (searchedUserId !== userId) {
      orQuery.push({
        postType: "private",
        userId: searchedUserId,
        shareOnly: userId,
      });
    } else {
      orQuery.push({
        postType: "private",
        userId: searchedUserId,
      });
    }
  }
  if (searchedComment) pipeline.splice(1, 0, ...searchQuery);
  return Post.aggregate(pipeline);
};

export const getPostDetailsId = async (
  id,
  startIndex,
  limit,
  endIndex,
  userId
) => {
  const postId = new mongoose.Types.ObjectId(id);
  console.log("postId", postId);
  console.log("userId", userId);
  const pipeline = [
    {
      $match: {
        _id: postId,
        $or: [
          {
            postType: "public",
          },
          {
            postType: "private",
            $or: [{ shareOnly: userId }, { userId: userId }],
          },
        ],
      },
    },
    {
      $addFields: {
        comments: {
          $slice: [{ $reverseArray: "$comments" }, startIndex, endIndex],
        },
        totalComments: {
          $size: "$comments",
        },
        totalPages: {
          $ceil: {
            $divide: [{ $size: "$comments" }, limit],
          },
        },
      },
    },
  ];
  return await Post.aggregate(pipeline);
};
