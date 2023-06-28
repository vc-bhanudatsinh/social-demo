import express from "express";

import validate from "../middlewares/validation.js";

import { verifyJwtToken } from "../middlewares/verifyJwt.js";
import catchWraper from "../utils/catchWrapper.js";
import * as postValidation from "../validation/postValidation.js";
import * as postController from "../controllers/postController.js";
const postRouter = express.Router();

postRouter.post(
  "/",
  validate(postValidation.createPostSchema),
  verifyJwtToken,
  postController.createPost
);

postRouter.get("/", verifyJwtToken, catchWraper(postController.getPostLists));
postRouter.get(
  "/:postId",
  validate(postValidation.getPostDetailsSchema),
  verifyJwtToken,
  catchWraper(postController.getPostDetails)
);

export default postRouter;
