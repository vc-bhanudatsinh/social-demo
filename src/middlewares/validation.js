import joi from "joi";

const validate = (schema) => async (req, res, next) => {
  try {
    const options = {
      abortEarly: true,
      allowUnknown: true,
      stripUnknown: true,
    };
    const { value, error } = schema.validate(req, options);
    if (error)
      return res.status(400).send({
        message: error.message,
        error: "Bad Request",
      });
    next();
  } catch (error) {
    next(error);
  }
};

export default validate;
