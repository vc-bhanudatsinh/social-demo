import bcrypt from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken";

export const passwordHash = async (password) => bcrypt.hash(password, 10);

export const compareHashPassword = async (password, hashedPassword) =>
  bcrypt.compare(password, hashedPassword);

export const createToken = (data, secretKey) =>
  jwt.sign(data, secretKey, { expiresIn: 60 * 60 });

export const verifyToken = (token, secretKey) => jwt.verify(token, secretKey);

export const generateOtpHash = async () =>
  crypto.randomBytes(10).toString("base64").slice(0, 10);
