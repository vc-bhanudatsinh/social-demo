import mongoose from "mongoose";

const blockListToken = new mongoose({
  token: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.SchemaType.ObjectId,
    ref: "User",
  },
});

const BlockListToken = mongoose.model("BlockListToken", blockListToken);

export default BlockListToken;
