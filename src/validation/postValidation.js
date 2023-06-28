import joi from "joi";

export const createPostSchema = joi.object().keys({
  body: joi.object().keys({
    title: joi.string().min(2).required().messages({
      "string.base": "Title should be string",
      "string.min": "Title should be greater than length 2",
      "string.empty": "Title can not be empty",
      "any.required": "Title is required",
    }),
    description: joi.string().min(10).required().messages({
      "string.base": "Description should be string",
      "string.min": "Description should be greater than length 2",
      "string.empty": "Description can not be empty",
      "any.required": "Description is required",
    }),
    mentions: joi.array().items(
      joi.string().min(24).required().messages({
        "string.base": "Mentions should be string",
        "string.min":
          "Mentions array value should be of min charchter length 24",
        "string.empty": "Mentions can not be empty",
        "any.required": "Mentions is required",
      })
    ),
    postType: joi.string().valid("private", "public").required().messages({
      "string.base": "Post Type should be string",
      "string.empty": "Post Type can not be empty",
      "any.required": "Post Type is required",
    }),
    shareOnly: joi
      .array()
      .when("postType", { is: "private", then: joi.array().required() })
      .items(
        joi.string().min(24).required().messages({
          "string.base": "Share Only should be string",
          "string.min": "Share Only should be greater than length 24",
          "string.empty": "Share Only can not be empty",
          "any.required": "Share Only is required",
        })
      ),
  }),
});

export const getPostDetailsSchema = joi.object().keys({
  query: joi.object().keys({
    limit: joi.number().required().messages({
      "number.base": "Limit should be number",
      "number.min": "Limit should be greater than length 24",
      "number.empty": "Limit can not be empty",
      "any.required": "Limit is required",
    }),
    pageNo: joi.number().required().messages({
      "number.base": "Page No should be number",
      "number.min": "Page No should be greater than length 24",
      "number.empty": "Page No can not be empty",
      "any.required": "Page No is required",
    }),
  }),
});
