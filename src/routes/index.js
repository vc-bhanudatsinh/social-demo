import express from "express";

import userRouter from "./userRouter.js";
import authRouter from "./authRouter.js";
import postRouter from "./postRouter.js";
import commentRouter from "./commentRouter.js";

const router = express.Router();

router.use("/user", userRouter);
router.use("/auth", authRouter);
router.use("/post", postRouter);
router.use("/comment", commentRouter);
export default router;
