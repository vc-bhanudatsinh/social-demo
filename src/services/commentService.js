import Post from "../db/models/postModel.js";

export const createComment = async (data, id) =>
  Post.updateOne({ _id: id }, { $push: { comments: data } });
