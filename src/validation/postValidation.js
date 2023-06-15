import joi from "joi";

export const createPostSchema = joi.object().keys({
  body: joi.object().keys({
    title: joi.string().min(2).required().messages({
      "string.base": "Title should be string",
      "string.min": "Title should be greater than length 2",
      "any.required": "Title is required",
    }),
    description: joi.string().min(10).required().messages({
      "string.base": "Description should be string",
      "string.min": "Description should be greater than length 2",
      "any.required": "Description is required",
    }),
    mentions: joi.array().items(
      joi.string().required().messages({
        "string.base": "Mentions should be string",
        "string.min": "Mentions should be greater than length 7",
        "any.required": "Mentions is required",
      })
    ),
    postType: joi.string().valid("private", "public").required().messages({
      "string.base": "Post Type should be string",
      "any.required": "Post Type is required",
    }),
    shareOnly: joi
      .array()
      .when("postType", { is: "private", then: joi.array().required() })
      .messages({
        "string.base": "Share Only should be string",
        "string.min": "Share Only should be greater than length 2",
        "any.required": "Share Only is required",
      }),
  }),
});
