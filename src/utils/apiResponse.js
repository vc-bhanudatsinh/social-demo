const apiResponse = (res, statusCode, message, data = []) => {
  return res.status(statusCode).send({ code: statusCode, message, data });
};

export const replaceMessage = (message, data) => {
  return message.replace("##", data);
};
export default apiResponse;
