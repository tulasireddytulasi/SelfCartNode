const { UserDetailsModel } = require("../model/user-model.js");
const AuthModel = require("../model/auth-model.js");
const nodemailer = require("nodemailer");
const { v4: uuidv4 } = require("uuid");
const {
  generateOTP,
  encryptedData,
  decryptedData,
  compareDatesInSeconds,
} = require("../common/functions.js");
const Authentication = require("../database/authentication-db.js");
const { getConstantKeyValue } = require("../database/constants-db.js");
const Constants = require("../utils/constants.js");
const {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} = require("../helper/jwt-helper.js");
const {
  validateEmail,
  validateMobileNumber,
} = require("../utils/validator.js");

const Responses = require("../common/responses.js");

const sendEmail = async (email, otp) => {
  /// Create a Nodemailer transporter
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.GMAIL_ID,
      pass: process.env.GMAIL_PASSWORD,
    },
  });

  /// Create the email message
  const mailOptions = {
    from: process.env.GMAIL_ID,
    to: email,
    subject: "Verification code",
    text: `${otp} is your OTP to verify your email for Karkinos.`,
  };

  /// Send the email
  const mailResponse = await new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (error, info) => {
      if (info) {
        resolve(info);
      } else if (error) {
        reject(error);
      }
    });
  });
  return mailResponse;
};

const sendOTP = async (req, res) => {
  try {
    const { email, mobileNumber } = req.body;

    /// Check if the user already exists, send OTP
    let existingUser;
    if (mobileNumber) {
      existingUser = await AuthModel.findOne({ mobileNumber });
    } else {
      existingUser = await AuthModel.findOne({ email });
    }
    const otpCounterResult = await getConstantKeyValue(
      Constants.OTP_COUNTER_KEY
    );
    let otpCounter = otpCounterResult ? otpCounterResult.value : 5;
    if (existingUser) {
      const otpExpireTime = existingUser.otpExpiresIn;
      const createdTime = existingUser.createdOn;
      const currentDateTime = new Date();
      const differenceInSeconds = compareDatesInSeconds(
        createdTime,
        currentDateTime
      );

      /// If otp request limit exceeds and time more than 1 hour, delete the auth record and send new otp
      if (
        existingUser.otpCounter > otpCounter - 1 &&
        differenceInSeconds > 3600
      ) {
        if (mobileNumber) {
          await AuthModel.deleteOne({ mobileNumber });
        } else {
          await AuthModel.deleteOne({ email });
        }
      }
      /// If otp request limit exceeds, return the response
      else if (existingUser.otpCounter > otpCounter - 1) {
        return functions.sendResponse(
          res,
          Responses.OTP_REQUEST_LIMIT_EXCEEDED
        );
      } else if (
        differenceInSeconds >= otpExpireTime ||
        !existingUser.otpStatus
      ) {
        /// If otp expire time exceeds or otp status is false the auth record will be deleted
        /// Delete the doc
        if (mobileNumber) {
          await AuthModel.deleteOne({ mobileNumber });
        } else {
          await AuthModel.deleteOne({ email });
        }
      } else {
        const field = {
          otpCounter: ++existingUser.otpCounter,
          mobileNumber: existingUser.mobileNumber,
          email: existingUser.email,
        };

        const updateAuthResponse = await Authentication.updateAuth(field);

        /// If update auth record fails, return error response
        if (!updateAuthResponse) {
          return functions.sendResponse(res, Responses.FAILED_TO_SEND_OTP);
        }
        const decryptedOTP = decryptedData(existingUser.otp);
        let otpResponse;
        if (mobileNumber) {
          /// Send OTP to Mobile No
          return functions.sendResponse(res, Responses.OTP_SUCCESS);
        } else {
          /// Send OTP to Email Id
          otpResponse = await sendEmail(email, decryptedOTP);
        }

        if (otpResponse) {
          return functions.sendResponse(res, Responses.OTP_SUCCESS);
        } else {
          return functions.sendResponse(res, Responses.FAILED_TO_SEND_OTP);
        }
      }
    }

    let otpExpiresIn = 60;

    const constantsDocResult = await getConstantKeyValue(
      Constants.OTP_EXPIRY_TIME_KEY
    );
    if (constantsDocResult) {
      const { value } = constantsDocResult;
      otpExpiresIn = mobileNumber
        ? value["mobile_otp_expiry_time"]
        : value["email_otp_expiry_time"];
    }

    const accessTokenConstantsResult = await getConstantKeyValue(
      Constants.ACCESS_TOKEN_EXPIRY_TIME_KEY
    );
    let accessTokenExpiresIn = accessTokenConstantsResult
      ? accessTokenConstantsResult.value
      : "3000s";

    const refreshTokenConstantsResult = await getConstantKeyValue(
      Constants.REFRESH_TOKEN_EXPIRY_TIME_KEY
    );

    let refreshTokenExpiresIn = refreshTokenConstantsResult
      ? refreshTokenConstantsResult.value
      : "28800s";

    /// Genarate OTP
    const newOTPValue = generateOTP();
    const newOTP = newOTPValue.toString();
    const encryptedOtp = encryptedData(newOTP);
    const createdOn = new Date();
    const lastModifiedOn = new Date();

    const authResponseResult = await Authentication.createAuth({
      accessTokenExpiresIn: accessTokenExpiresIn,
      refreshTokenExpiresIn: refreshTokenExpiresIn,
      otpExpiresIn: otpExpiresIn,
      email: email,
      mobileNumber: mobileNumber,
      otp: encryptedOtp,
      createdOn: createdOn,
      lastModifiedOn: lastModifiedOn,
    });

    if (authResponseResult) {
      let otpResponse;
      if (mobileNumber) {
        /// Send OTP to Mobile No
        return functions.sendResponse(res, Responses.OTP_SUCCESS);
      } else {
        /// Send OTP to Email Id
        otpResponse = await sendEmail(email, newOTP);
      }
      if (otpResponse) {
        return functions.sendResponse(res, Responses.OTP_SUCCESS);
      } else {
        return functions.sendResponse(res, Responses.FAILED_TO_SEND_OTP);
      }
    } else {
      return functions.sendResponse(res, Responses.ERROR_DURING_SEND_OTP);
    }
  } catch (error) {
    const errorMessage = {
      statusCode: 500,
      response: {
        message: error,
      },
    };
    return functions.sendResponse(res, errorMessage);
  }
};

const updateAuthuserDetails = async (fields, userDetails) => {
  try {
    fields.otpStatus = false;
    const updateAuthResponse = await Authentication.updateAuth(fields);

    if (updateAuthResponse) {
      return {
        accessToken: fields.token,
        accessTokenExpiresIn: updateAuthResponse.accessTokenExpiresIn,
        refreshToken: fields.refreshToken,
        refreshTokenExpiresIn: updateAuthResponse.refreshTokenExpiresIn,
        status: "Login successful",
        statusCode: 20000,
        user: userDetails ? userDetails : null,
      };
    } else {
      return {
        statusCode: 10001,
        message: "Failed to update access token and refresh token",
      };
    }
  } catch (error) {
    return {
      statusCode: 10001,
      message: "Failed to update access token and refresh token",
    };
  }
};

const CheckOTPExpiryTime = async ({
  createdDateTime,
  currentDateTime,
  mobileNumber,
  email,
  otpExpireTimeValue,
}) => {
  try {
    const differenceInSeconds = compareDatesInSeconds(
      createdDateTime,
      currentDateTime
    );

    if (differenceInSeconds >= otpExpireTimeValue) {
      /// Delete the auth doc
      const authUserResponse = mobileNumber
        ? await AuthModel.deleteOne({ mobileNumber })
        : await AuthModel.deleteOne({ email });
      return { statusCode: 10001, message: "OTP expired!" };
    }
  } catch (error) {}
};

const userLogin = async (req, res) => {
  try {
    const { mobileNumber, email, otp } = req.body;

    /// Check Auth user exists or not
    const authUserExits = mobileNumber
      ? await AuthModel.findOne({ mobileNumber })
      : await AuthModel.findOne({ email });

    if (!authUserExits) {
      return res
        .status(400)
        .json({ statusCode: 10001, message: "Invalid credentials!" });
    }

    const currentDateTime = new Date();
    const CheckOTPExpiryTimeResponse = await CheckOTPExpiryTime({
      createdDateTime: authUserExits.createdOn,
      currentDateTime: currentDateTime,
      email: email,
      mobileNumber: mobileNumber,
      otpExpireTimeValue: authUserExits.otpExpiresIn,
    });

    if (CheckOTPExpiryTimeResponse) {
      return res.status(400).json(CheckOTPExpiryTimeResponse);
    }

    if (!authUserExits.otpStatus) {
      return res
        .status(400)
        .json({ statusCode: 10001, message: "Invalid credentials!" });
    }

    const decryptedOTP = decryptedData(authUserExits.otp);

    /// Check OTP is valid or not
    if (otp === decryptedOTP) {
      /// Check if the user already exists
      const existingUser = mobileNumber
        ? await UserDetailsModel.findOne({ mobileNumber })
        : await UserDetailsModel.findOne({ email });

      const userId = existingUser ? existingUser.userId : uuidv4();
      const accessTokenValue = await signAccessToken(
        userId,
        authUserExits.accessTokenExpiresIn
      );
      const refreshTokenValue = await signRefreshToken(
        userId,
        authUserExits.refreshTokenExpiresIn
      );
      const createdOn = new Date();
      const lastModifiedOn = new Date();
      const userName = mobileNumber ? mobileNumber : email;
      const createdBy = userId;
      const lastModifiedBy = userId;
      const lastDate = new Date();

      let fields;
      if (existingUser) {
        ///  If user exists
        fields = {
          email: authUserExits.email,
          token: accessTokenValue,
          refreshToken: refreshTokenValue,
          mobileNumber: authUserExits.mobileNumber,
          lastModifiedOn: lastDate,
        };

        if (!authUserExits.token) {
          fields.userId = userId;
          fields.createdBy = userId;
        }

        const updateAuthUser = await updateAuthuserDetails(
          fields,
          existingUser
        );

        if (updateAuthUser.statusCode == 20000) {
          return res.status(200).json(updateAuthUser);
        } else {
          return res.status(400).json(updateAuthUser);
        }
      } else {
        const version = 0;
        const roles = ["volunteer"];
        const userResponse = await Authentication.createUser({
          userId,
          version,
          userName,
          mobileNumber,
          email,
          roles,
          createdOn,
          lastModifiedOn,
          createdBy,
          lastModifiedBy,
        });

        if (userResponse) {
          fields = {
            email: authUserExits.email,
            userId: userId,
            token: accessTokenValue,
            refreshToken: refreshTokenValue,
            mobileNumber: authUserExits.mobileNumber,
            createdBy: userId,
            lastModifiedOn: new Date(),
          };
          const updateAuthUser = await updateAuthuserDetails(
            fields,
            userResponse
          );
          if (updateAuthUser.statusCode == 20000) {
            return res.status(200).json(updateAuthUser);
          } else {
            return res.status(400).json(updateAuthUser);
          }
        } else {
          return res.status(400).json({
            statusCode: 10001,
            message: "Failed to create user details",
          });
        }
      }
    } else {
      return res
        .status(400)
        .json({ statusCode: 10001, message: "Invalid OTP!" });
    }
  } catch (error) {
    res.status(500).json({ message: "Failed to verify OTP!" });
  }
};

const verifyOTP = async (req, res) => {
  try {
    const { mobileNumber, email, otp } = req.body;

    /// Check auth user exists or not
    const authUserExits = mobileNumber
      ? await AuthModel.findOne({ mobileNumber })
      : await AuthModel.findOne({ email });

    if (!authUserExits) {
      return functions.sendResponse(res, Responses.INVALID_OTP);
    }

    const currentDateTime = new Date();
    const CheckOTPExpiryTimeResponse = await CheckOTPExpiryTime({
      createdDateTime: authUserExits.createdOn,
      currentDateTime: currentDateTime,
      email: email,
      mobileNumber: mobileNumber,
      otpExpireTimeValue: authUserExits.otpExpiresIn,
    });

    if (CheckOTPExpiryTimeResponse) {
      return functions.sendResponse(res, Responses.INVALID_OTP);
    }

    const decryptedOTP = decryptedData(authUserExits.otp);

    if (otp === decryptedOTP) {
      return functions.sendResponse(res, Responses.OTP_VALID);
    } else {
      return functions.sendResponse(res, Responses.INVALID_OTP);
    }
  } catch (error) {
    return functions.sendResponse(res, Responses.FAILED_TO_VALIDATE_OTP);
  }
};

const updateUserDetail = async (req, res) => {
  try {
    const requestObject = req.body;
    const { id } = req.query;
    let version;
    let userDetails;

    userDetails = await Authentication.getUserDetails({ userId: id });
    if (!userDetails) {
      return functions.sendResponse(res, {
        statusCode: 400,
        response: {
          message: "No user found with this userId: " + id,
        },
      });
    }

    /// check id and emailid same or not
    if (requestObject.email) {
      const email = requestObject.email;
      const isUserCreatedByEmail = await validateEmail(userDetails.userName);
      if (email === userDetails.email || isUserCreatedByEmail) {
        /// Remove the 'email' property, because user created by email id
        delete requestObject.email;
      } else {
        const userDetailsByEmailId = await Authentication.getUserDetails({
          email,
        });
        if (userDetailsByEmailId) {
          return functions.sendResponse(res, Responses.EMAIL_ID_ALREADY_TAKEN);
        }
      }
    }

    if (requestObject.mobileNumber) {
      const mobileNumber = requestObject.mobileNumber;
      const isUserCreatedByMobileNo = await validateMobileNumber(
        userDetails.userName
      );

      if (
        (userDetails.mobileNumber &&
          mobileNumber.toString() === userDetails.mobileNumber.toString()) ||
        isUserCreatedByMobileNo
      ) {
        /// Remove the 'mobileNumber' property, because user created by mobile no
        delete requestObject.mobileNumber;
      } else {
        const userDetailsByMobileNo = await Authentication.getUserDetails({
          mobileNumber,
        });
        if (userDetailsByMobileNo) {
          return functions.sendResponse(res, Responses.MOBILE_NO_ALREADY_TAKEN);
        }
      }
    }

    const updateUserResponse = await Authentication.updateUserDetails({
      userId: id,
      payload: requestObject,
    });

    const updateResponseResult =
      updateUserResponse.statusCode === 200
        ? {
            message: "User details updated successfully.",
            user: updateUserResponse.message,
          }
        : {
            message: updateUserResponse.message,
          };
    return functions.sendResponse(res, {
      statusCode: updateUserResponse.statusCode,
      response: updateResponseResult,
    });
  } catch (error) {
    return functions.sendResponse(res, Responses.USER_DETAILS_UPDATE_ERROR);
  }
};

const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    const response = await verifyRefreshToken(refreshToken);

    if (response) {
      const { id } = response;
      const newAccessToken = await signAccessToken(id);
      const newRefreshToken = await signRefreshToken(id);

      return res.status(200).json({
        message: "Successfully created new token",
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      });
    } else {
      return res.status(401).json({ message: "Unauthorized request" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Unauthorized request" });
  }
};

const logout = async (req, res) => {
  try {
    const id = req.userId;
    const deleteResponse = await AuthModel.deleteOne({ userId: id });

    if (deleteResponse.deletedCount === 1) {
      return functions.sendResponse(res, Responses.USER_LOGOUT);
    } else {
      return functions.sendResponse(res, Responses.UNAUTHORIZED_REQUEST);
    }
  } catch (error) {
    return functions.sendResponse(res, Responses.USER_LOGOUT_ERROR);
  }
};

module.exports = {
  sendOTP,
  userLogin,
  verifyOTP,
  updateUserDetail,
  refreshToken,
  logout,
};
