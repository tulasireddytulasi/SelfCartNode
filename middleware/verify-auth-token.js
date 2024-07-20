const AuthModel = require("../model/auth-model.js");
const { verifyAccessToken } = require("../helper/jwt-helper.js");
const ValidateAccessToken = async (req) => {
  try {
    const authToken = req.headers["authorization"];
    if (!authToken) return false;

    const bearerToken = authToken.split(" ");
    const token = bearerToken[1];

    const existingUser = await AuthModel.findOne({ token });
    if (!existingUser) return false;

    const tokenResult = await verifyAccessToken(token);
    if (!tokenResult.status) return false;
    return tokenResult;
  } catch (error) {
    return false;
  }
};
module.exports = ValidateAccessToken;
