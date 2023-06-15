import dotenv from "dotenv";

dotenv.config();

const config = {
  port: process.env.PORT,
  dbName: process.env.DB_NAME,
  dbConnectionString: process.env.DB_CONNECTION,
  accessSecret: process.env.ACCESS_SECRET,
  env: process.env.ENV,
};

export default config;
