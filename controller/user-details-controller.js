const Authentication = require("../database/authentication-db.js");
const Responses = require("../common/responses.js");
const { UserDetailsModel } = require("../model/user-model.js");

const getUserDetails = async (req, res) => {
  try {
    const { id } = req.query;
    const userDetails = await Authentication.getUserDetails({ userId: id });
    if (userDetails) {
      if (userDetails.userId) {
        return functions.sendResponse(res, {
          statusCode: 200,
          response: {
            user: userDetails,
          },
        });
      } else {
        return functions.sendResponse(res, Responses.GET_USER_DETAILS_ERROR);
      }
    } else {
      return functions.sendResponse(res, {
        statusCode: 404,
        response: {
          message: `No user found with this userId: ${id}`,
        },
      });
    }
  } catch (error) {
    return functions.sendResponse(res, Responses.GET_USER_DETAILS_ERROR);
  }
};

const filterUserDetails = async (req, res) => {
  try {
    const {
      fullName,
      mobileNumber,
      email,
      roles,
      organizationIds,
      locationIds,
      createdAfter,
      createdBefore,
    } = req.body;

    const query = {};

    if (fullName) {
      query.fullName = fullName;
    }
    if (mobileNumber) {
      query.mobileNumber = mobileNumber;
    }
    if (email) {
      query.email = email;
    }
    if (roles && roles.length > 0) {
      query.roles = { $in: roles };
    }
    if (organizationIds && organizationIds.length > 0) {
      query.organizations = { $in: organizationIds };
    }
    if (locationIds && locationIds.length > 0) {
      query.locations = { $in: locationIds };
    }

    // Adding date filtering conditions
    if (createdAfter) {
      query.createdOn = { $gte: new Date(createdAfter) };
    }
    if (createdBefore) {
      query.createdOn = { ...query.createdOn, $lte: new Date(createdBefore) };
    }

    const userDetails = await UserDetailsModel.find(query).exec();

    if (userDetails.length > 0) {
      return res.json(userDetails);
    } else {
      return functions.sendResponse(res, Responses.USER_NOT_FOUND);
    }
  } catch (error) {
    return functions.sendResponse(res, Responses.GET_USER_DETAILS_ERROR);
  }
};

module.exports = {
  getUserDetails,
  filterUserDetails,
};
