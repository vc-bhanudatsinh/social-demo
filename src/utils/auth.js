import bcrypt from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import User from "../db/models/userModel.js";

export const passwordHash = async (password) => {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    return hashedPassword;
  } catch (error) {
    return error;
  }
};

export const compareHashPassword = async (password, hashedPassword) => {
  try {
    return await bcrypt.compare(password, hashedPassword);
  } catch (error) {
    return error;
  }
};

export const createToken = (data, secretKey) => {
  try {
    const token = jwt.sign(data, secretKey, { expiresIn: 60 * 60 });
    return token;
  } catch (error) {
    return error;
  }
};

export const verifyToken = (token, secretKey) => {
  try {
    return jwt.verify(token, secretKey);
  } catch (error) {
    return error;
  }
};

export const generateOtpHash = async (email) => {
  return crypto.randomBytes(10).toString("base64").slice(0, 10);
};
