import express from "express";

import validate from "../middlewares/validation.js";

import { verifyJwtToken } from "../middlewares/verifyJwt.js";

import * as postValidation from "../validation/postValidation.js";
import * as postController from "../controllers/postController.js";
const postRouter = express.Router();

postRouter.post(
  "/",
  validate(postValidation.createPostSchema),
  verifyJwtToken,
  postController.createPost
);
postRouter.get("/", verifyJwtToken, postController.getUserPost);

export default postRouter;
