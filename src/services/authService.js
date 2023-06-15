import User from "../db/models/userModel.js";

export const createUser = async (data) => {
  return await User.create(data);
};

export const getUserPassword = async (email) => {
  return await User.findOne({ email }, { password: 1, _id: 1 });
};
