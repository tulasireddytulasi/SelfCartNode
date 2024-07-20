const JWT = require("jsonwebtoken");

const signAccessToken = async (userId, accessTokenExpiryTime) => {
  return new Promise((resolve, reject) => {
    JWT.sign(
      {
        id: userId,
      },
      process.env.JWT_SECRET_TOKEN,
      {
        expiresIn: accessTokenExpiryTime,
      },
      (error, token) => {
        if (error) {
          reject(error);
        }

        resolve(token);
      }
    );
  });
};

const verifyAccessToken = async (sessionToken) => {
  try {
    const decoded = JWT.verify(sessionToken, process.env.JWT_SECRET_TOKEN);
    const successMessage = {
      status: true,
      message: decoded,
    };
    return successMessage;
  } catch (err) {
    const errorMessage = {
      status: false,
      message:
        err.message === "jwt expired" ? err.message : "Unauthorized request",
    };
    return errorMessage;
  }
};

const signRefreshToken = async (userId, refreshTokenExpiryTime) => {
  return new Promise((resolve, reject) => {
    JWT.sign(
      {
        id: userId,
      },
      process.env.JWT_REFRESH_SECRET_TOKEN,
      {
        expiresIn: refreshTokenExpiryTime,
      },
      (error, token) => {
        if (error) {
          reject(error);
        }

        resolve(token);
      }
    );
  });
};

const verifyRefreshToken = async (refreshToken) => {
  try {
    const decodedRefreshToken = JWT.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET_TOKEN
    );
    return decodedRefreshToken;
  } catch (err) {
    return false;
  }
};

module.exports = {
  signAccessToken,
  verifyAccessToken,
  signRefreshToken,
  verifyRefreshToken,
};
