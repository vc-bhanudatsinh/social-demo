import express from "express";

import catchWraper from "../utils/catchWrapper.js";
import validate from "../middlewares/validation.js";

import * as userValidation from "../validation/userValidation.js";
import * as userController from "../controllers/userController.js";

import { verifyJwtToken } from "../middlewares/verifyJwt.js";
import { duplicateDataError } from "../middlewares/error.js";

const userRouter = express.Router();

userRouter.get("/", verifyJwtToken, catchWraper(userController.getAllUsers));
userRouter.get(
  "/profile/",
  verifyJwtToken,
  catchWraper(userController.getUserProfile)
);

userRouter.patch(
  "/profile",
  validate(userValidation.editProfileSchema),
  verifyJwtToken,
  catchWraper(userController.editUserProfile),
  duplicateDataError
);
export default userRouter;
