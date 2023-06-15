import express from "express";

import validate from "../middlewares/validation.js";
import catchWraper from "../utils/catchWrapper.js";
import { duplicateDataError } from "../middlewares/error.js";

import * as authController from "../controllers/authController.js";
import * as authValidation from "../validation/authValidation.js";

const authRouter = express.Router();

authRouter.post(
  "/signup",
  validate(authValidation.userSignUpSchema),
  catchWraper(authController.userSignUp),
  duplicateDataError
);

authRouter.post(
  "/login",
  validate(authValidation.userLoginSchema),
  catchWraper(authController.loginUser)
);

authRouter.patch(
  "/password",
  validate(authValidation.changPasswordSchema),
  verifyJwtToken,
  catchWraper(authController.changePassword)
);
export default authRouter;
