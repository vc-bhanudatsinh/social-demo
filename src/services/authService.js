import User from "../db/models/userModel.js";

export const createUser = async (data) => User.create(data);

export const getUserPassword = async (email) =>
  User.findOne({ email }, { password: 1, _id: 1, passwordChangeOtp: 1 });

export const changePassword = async (id, password, passwordChangeOtp) =>
  User.updateOne({ _id: id }, { password, passwordChangeOtp });
