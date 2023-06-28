import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  comment: {
    type: String,
    min: [10, "comment Should be greater than 10"],
    required: true,
  },
  mentions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  createdAt: {
    type: Date,
    require: [true, "Comment create Date is required"],
    default: function () {
      return new Date();
    },
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

export default commentSchema;
