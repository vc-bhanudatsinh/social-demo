import User from "../db/models/userModel.js";

export const getAllUsers = async () => {
  return await User.find({}, { __v: 0, _id: 0 });
};

export const getUserProfile = async (id) => {
  return await User.findById(id, {
    __v: 0,
    _id: 0,
    password: 0,
    passwordChangeOtp: 0,
  });
};

export const updateProfile = async (email, data) => {
  return await User.updateOne({ email }, data);
};

export const getUserObjectId = async (email) => {
  return await User.findOne({ email }, { _id: 1 });
};

export const getUserIds = async (data) => {
  return await User.find(
    {
      username: {
        $in: data,
      },
    },
    { __id: 1 }
  );
};

export const getUserId = async (email) => {
  return await User.findOne({ email }, { _id: 1 }).exec();
};

export const getUserPrivateDetails = async (id) => {
  return await User.findById(id, { _id: 1, passwordChangeOtp: 1, email: 1 });
};

export const changePassword = async (email, password, passwordChangeOtp) => {
  return await User.updateOne({ email }, { password, passwordChangeOtp });
};
