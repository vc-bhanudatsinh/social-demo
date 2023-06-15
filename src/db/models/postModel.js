import mongoose from "mongoose";
import commentSchema from "./commentModel.js";

const post = new mongoose.Schema({
  title: {
    type: String,
    min: [2, "Title length should be greater than 2"],
    required: [true, "Title is required"],
  },
  description: {
    type: String,
    min: [15, "Description should be of length greater than 15"],
    required: [true, "Description is required"],
  },
  mentions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  comments: [commentSchema],
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "UserId is required"],
  },
  createdAt: {
    type: Date,
    require: [true, "Post create Date is required"],
    default: function () {
      return new Date();
    },
  },
  postType: {
    type: String,
    enums: ["private", "public"],
    required: [true, "PostTpe is required"],
  },
  shareOnly: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      require: function () {
        if (this.postType === "private") return true;
        return false;
      },
    },
  ],
});

const Post = mongoose.model("Post", post);

export default Post;
