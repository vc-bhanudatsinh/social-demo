import jwt from "jsonwebtoken";
import httpStatus from "http-status";

import config from "../config/envConfig.js";
import catchWraper from "../utils/catchWrapper.js";
import apiResponse from "../utils/apiResponse.js";
import User from "../db/models/userModel.js";

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

  const data = jwt.verify(token, config.accessSecret);

  const user = await User.findById(data.id);
  if (!user)
    return apiResponse(
      res,
      httpStatus.FORBIDDEN,
      replaceMessage(apiMessage.doesNotExistResource("User"))
    );
  req.user = user;
  next();
});
