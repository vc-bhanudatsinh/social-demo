import mongoose from "mongoose";
import httpStatus from "http-status";
import jwt from "jsonwebtoken";

import ApiError from "../utils/apiError.js";
import config from "../config/envConfig.js";
import * as apiMessage from "../constants/messageConstant.js";

export const duplicateDataError = async (error, req, res, next) => {
  if (error.code === 11000 && error.keyPattern) {
    error = new ApiError(
      409,
      apiMessage.duplicate.replace("##", Object.keys(error.keyPattern)[0])
    );
  }
  next(error);
};

export const errorConverter = async (error, req, res, next) => {
  console.log("error", error);
  const errorClass = [
    {
      class: mongoose.Error,
      statusCode: httpStatus.BAD_REQUEST,
    },
    {
      class: jwt.JsonWebTokenError,
      statusCode: httpStatus.FORBIDDEN,
    },
  ];
  if (!(error instanceof ApiError)) {
    let statusCode;
    if (!error?.statusCode) {
      for (let i = 0; i < errorClass.length; i++) {
        if (error instanceof errorClass[i].class) {
          statusCode = errorClass[i].statusCode;
          break;
        }
      }
      if (!statusCode) statusCode = httpStatus.INTERNAL_SERVER_ERROR;
    } else {
      statusCode = error.statusCode;
    }
    console.log("---------statusCode", statusCode);
    const message = error.message;
    error = new ApiError(statusCode, message, error.stack);
  }
  next(error);
};

export const errorHandler = async (error, req, res, next) => {
  const { statusCode, message } = error;
  console.log("statusCode", statusCode);
  return res.status(statusCode).send({
    code: statusCode,
    message,
    ...(config.env === "development " && { stack: error.stack }),
  });
};
