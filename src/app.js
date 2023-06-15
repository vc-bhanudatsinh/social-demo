import express from "express";

import config from "./config/envConfig.js";
import connectDb from "./db/connection.js";
import router from "./routes/index.js";
import ApiError from "./utils/apiError.js";

import { errorConverter, errorHandler } from "./middlewares/error.js";

const app = express();

connectDb();

app.use(express.json({ limit: "50mb" }));

app.use("/api", router);

app.use(async (req, res, next) => {
  next(new ApiError(404, "NOT FOUND"));
});

app.use(errorConverter);
app.use(errorHandler);
app.listen(config.port, console.log("Server is running on --", config.port));
