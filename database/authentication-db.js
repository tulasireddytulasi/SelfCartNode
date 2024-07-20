const { UserDetailsModel } = require("../model/user-model.js");
const AuthModel = require("../model/auth-model.js");
class Authentication {
  async createAuth({
    userId,
    token,
    refreshToken,
    accessTokenExpiresIn,
    refreshTokenExpiresIn,
    otpExpiresIn,
    email,
    mobileNumber,
    otp,
    createdBy,
    createdOn,
    lastModifiedOn,
  }) {
    try {
      /// Create a new user
      const newUser = new AuthModel({
        userId: userId ? userId : null,
        token: token ? token : null,
        refreshToken: refreshToken ? refreshToken : null,
        accessTokenExpiresIn: accessTokenExpiresIn
          ? accessTokenExpiresIn
          : null,
        refreshTokenExpiresIn: refreshTokenExpiresIn
          ? refreshTokenExpiresIn
          : null,
        otpExpiresIn: otpExpiresIn ? otpExpiresIn : null,
        email: email ? email : null,
        mobileNumber: mobileNumber ? mobileNumber : null,
        otp: otp ? otp : null,
        createdBy: createdBy ? createdBy : null,
        createdOn: createdOn ? createdOn : null,
        lastModifiedOn: lastModifiedOn ? lastModifiedOn : null,
      });
      const userResult = await newUser.save();
      return userResult;
    } catch (error) {
      return false;
    }
  }

  async updateAuth(data) {
    try {
      /// Update auth user
      const findAuthUser = data.mobileNumber
        ? { mobileNumber: data.mobileNumber }
        : { email: data.email };
      const updateAuthUser = AuthModel.findOneAndUpdate(findAuthUser, data);
      return updateAuthUser;
    } catch (error) {
      return false;
    }
  }

  async updateAuthToken({
    token,
    refreshToken,
    mobileNumber,
    email,
    lastModifiedOn,
  }) {
    try {
      /// Update auth user
      const findAuthUser = mobileNumber
        ? { mobileNumber: mobileNumber }
        : { email: email };
      const payload = {
        token,
        refreshToken,
        lastModifiedOn,
      };
      const updateAuthUser = AuthModel.findOneAndUpdate(findAuthUser, payload);
      return updateAuthUser;
    } catch (error) {
      return false;
    }
  }

  async createUser({
    userId,
    version,
    userName,
    salutation,
    firstName,
    middleName,
    lastName,
    email,
    mobileNumber,
    gender,
    roles,
    organizations,
    locations,
    isDeleted,
    createdBy,
    createdOn,
    lastModifiedBy,
    lastModifiedOn,
    profileName,
    fullNameSearchable,
    fullName,
  }) {
    try {
      /// Create a new user
      const newUser = new UserDetailsModel({
        userId,
        version,
        userName,
        salutation: salutation ? salutation : null,
        firstName: firstName ? firstName : null,
        middleName: middleName ? middleName : null,
        lastName: lastName ? lastName : null,
        email: email ? email : null,
        mobileNumber: mobileNumber ? mobileNumber : null,
        gender: gender ? gender : null,
        roles: roles ? roles : null,
        organizations: organizations ? organizations : null,
        locations: locations ? locations : null,
        isDeleted: isDeleted ? isDeleted : null,
        createdBy: createdBy,
        createdOn: createdOn,
        lastModifiedBy: lastModifiedBy ? lastModifiedBy : null,
        lastModifiedOn: lastModifiedOn ? lastModifiedOn : null,
        profileName: profileName ? profileName : null,
        fullNameSearchable: fullNameSearchable ? fullNameSearchable : null,
        fullName: fullName ? fullName : null,
      });
      const newUserResult = await newUser.save();
      return newUserResult;
    } catch (error) {
      return false;
    }
  }

  async updateUserDetails({ userId, payload }) {
    try {
      let response;
      /// Update user details
      const updateUser = await UserDetailsModel.findOneAndUpdate(
        { userId },
        {
          $inc: { version: 1 },
          $set: payload,
        },
        { returnDocument: "after" }
      ).then((result) => {
        if (result) {
          response = { statusCode: 200, message: result };
        } else {
          response = { statusCode: 404, message: "user not found" };
        }
      });
      return response;
    } catch (error) {
      return { statusCode: 500, message: "Error during user details update" };
    }
  }

  async getUserDetails({ userId, email, mobileNumber }) {
    let payload;
    if (email) {
      payload = { email };
    } else if (mobileNumber) {
      payload = { mobileNumber };
    } else if (userId) {
      payload = { userId };
    }

    try {
      const existingUser = await UserDetailsModel.findOne(payload);
      return existingUser;
    } catch (error) {
      return error;
    }
  }
}

const authentication = new Authentication();
module.exports = authentication;
