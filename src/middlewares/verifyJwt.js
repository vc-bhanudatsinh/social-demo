import jwt from "jsonwebtoken";
import httpStatus from "http-status";

import config from "../config/envConfig.js";
import * as auth from "../utils/auth.js";
import catchWraper from "../utils/catchWrapper.js";
import apiResponse from "../utils/apiResponse.js";
import * as userService from "../services/userService.js";
import * as apiMessage from "../constants/messageConstant.js";
import { replaceMessage } from "../utils/apiResponse.js";

export const verifyJwtToken = catchWraper(async (req, res, next) => {
  const bearerToken = req.headers?.authorization;
  if (!bearerToken)
    return apiResponse(
      res,
      httpStatus.FORBIDDEN,
      replaceMessage(apiMessage.missingResource, "Token")
    );
  const token = bearerToken.split(" ")[1];

  const data = auth.verifyToken(token, config.accessSecret);

  const user = await userService.getUserPrivateDetails(data.id);
  if (!user)
    return apiResponse(
      res,
      httpStatus.FORBIDDEN,
      replaceMessage(apiMessage.doesNotExistResource, "User")
    );

  const compareOtpHash = await auth.compareHashPassword(
    user.passwordChangeOtp,
    data.ref
  );
  if (!compareOtpHash)
    return apiResponse(res, httpStatus.FORBIDDEN, apiMessage.passwordChanged);
  req.user = user;
  next();
});
