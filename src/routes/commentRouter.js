import express from "express";

import validate from "../middlewares/validation.js";
import catchWraper from "../utils/catchWrapper.js";

import * as commentValidation from "../validation/commentValidation.js";
import * as commentController from "../controllers/commentController.js";

import { verifyJwtToken } from "../middlewares/verifyJwt.js";

const commentRouter = express.Router();

commentRouter.post(
  "/",
  validate(commentValidation.createComment),
  verifyJwtToken,
  catchWraper(commentController.createComment)
);

commentRouter.get(
  "/:postId",
  verifyJwtToken,
  catchWraper(commentController.getComment)
);
export default commentRouter;
