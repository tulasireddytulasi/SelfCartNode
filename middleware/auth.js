const {
  validateEmail,
  validateMobileNumber,
} = require("../utils/validator.js");
const { validateUserUpdate } = require("./validation-schema.js");
const Responses = require("../common/responses.js");
const ValidateAccessToken = require("./verify-auth-token.js");
const Authentication = require("../database/authentication-db.js");

const emailAndMobileNoValidate = async (req) => {
  const email = req.body.email ? req.body.email : null;
  const mobileNumber = req.body.mobileNumber ? req.body.mobileNumber : null;
  if (email) {
    const validateEmailId = await validateEmail(email);
    if (!email || typeof email !== "string" || !validateEmailId) {
      return {
        statusCode: 400,
        message: "Invalid email",
      };
    }
  } else if (mobileNumber) {
    const validateMobileN0 = await validateMobileNumber(mobileNumber);
    if (
      !mobileNumber ||
      typeof mobileNumber !== "string" ||
      !validateMobileN0
    ) {
      return {
        statusCode: 400,
        message: "Invalid mobile no",
      };
    }
  } else {
    return {
      statusCode: 400,
      message:
        "Please provide at least one contact method (mobile number or email ID).",
    };
  }
};

const authValidate = async (req, res, next) => {
  const emailValid = await emailAndMobileNoValidate(req);
  if (emailValid) {
    return res
      .status(emailValid.statusCode)
      .json({ status: emailValid.statusCode, message: emailValid.message });
  }
  next();
};
const validateUserExists = async (req, res, next) => {
  const userDetails = await Authentication.getUserDetails({
    email: req.body.email,
    mobileNumber: req.body.mobileNumber,
  });
  if (userDetails) {
    next();
  } else {
    return functions.sendResponse(res, Responses.USER_NOT_REGISTERED);
  }
};

const loginValidate = async (req, res, next) => {
  const { otp } = req.body;
  const emailAndMobileNoValid = await emailAndMobileNoValidate(req);
  if (emailAndMobileNoValid) {
    return res.status(emailAndMobileNoValid.statusCode).json({
      status: emailAndMobileNoValid.statusCode,
      message: emailAndMobileNoValid.message,
    });
  }
  if (!otp || typeof otp !== "string") {
    return res.status(400).json({ message: "Invalid Otp" });
  }

  next();
};

const verifyOTPValidate = async (req, res, next) => {
  const { otp } = req.body;
  const emailAndMobileNoValid = await emailAndMobileNoValidate(req);
  if (emailAndMobileNoValid) {
    const otpMessage = {
      statusCode: emailAndMobileNoValid.statusCode,
      response: {
        message: emailAndMobileNoValid.message,
      },
    };
    return functions.sendResponse(res, otpMessage);
  }
  if (!otp || typeof otp !== "string") {
    return functions.sendResponse(res, Responses.INVALID_OTP);
  }

  next();
};

const getUserValidate = async (req, res, next) => {
  const { id } = req.query;
  if (!id) return functions.sendResponse(res, Responses.USER_ID_REQUIRED);

  next();
};

const updateUserValidate = async (req, res, next) => {
  const { id } = req.query;
  if (!id) {
    return functions.sendResponse(res, Responses.USER_ID_REQUIRED);
  }

  const userUpdateData = req.body;
  /// Validate the user details
  const { error } = validateUserUpdate(userUpdateData);
  if (error) {
    /// If validation fails, send an error response with the validation error details
    return functions.sendResponse(res, {
      statusCode: 400,
      response: {
        error: error.details[0].message,
      },
    });
  }
  next();
};

const refreshTokenValidate = async (req, res, next) => {
  const { refreshToken } = req.body;

  if (!refreshToken)
    return res.status(401).json({ message: "Refresh token required" });
  next();
};

const logoutValidate = async (req, res, next) => {
  // const tokenResult = await ValidateAccessToken(req);
  // if (!tokenResult)
  //   return functions.sendResponse(res, Responses.UNAUTHORIZED_REQUEST);
  // const { id } = tokenResult.message;
  // req.userId = id;
  req.id = req.userId;
  next();
};

module.exports = {
  validateUserExists,
  authValidate,
  loginValidate,
  verifyOTPValidate,
  updateUserValidate,
  refreshTokenValidate,
  getUserValidate,
  logoutValidate,
};
