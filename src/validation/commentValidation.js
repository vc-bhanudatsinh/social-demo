import joi from "joi";

export const createComment = joi.object().keys({
  body: joi.object().keys({
    comment: joi.string().required().messages({
      "string.base": "Share Only should be string",
      "string.required": "Share Only is required",
    }),
    mentions: joi.array().items(
      joi.string().required().messages({
        "string.base": "Mentions should be string",
        "string.min": "Mentions should be greater than length 7",
        "string.required": "Mentions is required",
      })
    ),
    postId: joi.string().required().messages({
      "string.base": "Share Only should be string",
      "string.required": "Share Only is required",
    }),
  }),
});

export const getComment = joi.object().keys({
  query: joi.object().keys({
    searchedComment: joi.string().messages({
      "string.base": "Search text should be string",
      "string.required": "Search text is required",
    }),
  }),
});
