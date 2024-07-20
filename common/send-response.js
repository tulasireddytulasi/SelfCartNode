const Responses = require("./responses.js");

const sendResponse = (resp, responseObject) => {
  const response = responseObject
    ? responseObject
    : Responses.INTERNAL_SERVER_ERROR;

  return resp.status(response.statusCode).json(response.response);
};

module.exports = { sendResponse };
