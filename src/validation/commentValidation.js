import joi from "joi";

export const createComment = joi.object().keys({
  body: joi.object().keys({
    comment: joi.string().min(5).required().messages({
      "string.base": "Comment should be string",
      "string.min": "Comment length should be min 2",
      "string.empty": "Comment can not be empty",
      "any.required": "Comment is required",
    }),
    mentions: joi.array().items(
      joi.string().required().messages({
        "string.base": "Mentions should be string",
        "string.empty": "Mentions can not be empty",
        "string.min": "Mentions should be greater than length 7",
        "any.required": "Mentions is required",
      })
    ),
    postId: joi.string().min(24).max(24).required().messages({
      "string.base": "Share Only should be string",
      "string.empty": "Share Only can not be empty",
      "string.min": "First Name length should be equal 24",
      "string.max": "First Name length should be equal 24",
      "any.required": "Share Only is required",
    }),
  }),
});

export const getComment = joi.object().keys({
  query: joi.object().keys({
    searchedComment: joi.string().messages({
      "string.base": "Search text should be string",
      "string.empty": "Search text can not be empty",
      "any.required": "Search text is required",
    }),
  }),
});
