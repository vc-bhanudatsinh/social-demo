import User from "../db/models/userModel.js";
import mongoose from "mongoose";

export const getAllUsers = async () => User.find({}, { __v: 0, _id: 0 }).lean();

export const getUserProfile = async (id) =>
  User.findById(id, {
    __v: 0,
    password: 0,
    passwordChangeOtp: 0,
  }).lean();
// send _id in profile
export const updateProfile = async (id, data) =>
  User.updateOne({ _id: id }, data);

export const getUserObjectId = async (email) =>
  User.findOne({ email }, { _id: 1 }).lean();

export const validateUserIds = async (data) => {
  data = data.map((id) => new mongoose.Types.ObjectId(id));
  return User.find(
    {
      _id: {
        $in: data,
      },
    },
    { _id: 1 }
  ).lean();
};

export const getUserId = async (email) =>
  User.findOne({ email }, { _id: 1 }).exec();

export const getUserDetails = (id) =>
  User.findById(id, { _id: 1, password: 0, _v: 0 }).lean();
