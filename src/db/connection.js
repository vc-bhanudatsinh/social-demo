import mongoose from "mongoose";

import config from "../config/envConfig.js";

const connectionUrl = `${config.dbConnectionString}/${config.dbName}`;

const connectDb = async () => {
  try {
    await mongoose.connect(connectionUrl);
    console.log("DB is connected Successfully");
  } catch (error) {
    throw new ApiError(500, error.message);
  }
};

export default connectDb;
