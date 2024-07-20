const Responses = require("../common/responses.js");
const Authentication = require("../database/authentication-db.js");
const Constants = require("../utils/constants.js");

const addOrDeleteUserRole = async (req, res) => {
  try {
    /// The variable [loggedInUserId] represents the user ID of the currently logged-in user.
    const loggedInUserId = req.userId;

    /// The variable [userId] corresponds to the user ID obtained as a parameter.
    const userId = req.params.userId;

    const roles = req.body.roles;

    const loggedInUserDetails = await Authentication.getUserDetails({
      userId: loggedInUserId,
    });

    const loggedInUserRoles = loggedInUserDetails.roles || [];

    /// Check this user has access to add or remove roles
    const checkRoles =
      loggedInUserRoles.includes(Constants.ADMIN) ||
      loggedInUserRoles.includes(Constants.LOCAL_COORDINATOR);
    if (loggedInUserRoles.length == 0 || !checkRoles) {
      return functions.sendResponse(res, {
        statusCode: 404,
        response: { message: "This user has no access to add or remove roles" },
      });
    }

    /// Check userId exists or not
    const userDetails = await Authentication.getUserDetails({
      userId,
    });

    /// If user doesn't exists return error response
    if (!userDetails) {
      return functions.sendResponse(res, {
        statusCode: 404,
        response: {
          message: `No user found with this userId: ${userId}`,
        },
      });
    }

    const existingUserRoles = userDetails.roles || [];

    let newUserRoles = [];

    /// Check the user has any roles or not
    if (req.method === "DELETE" && existingUserRoles.length === 0) {
      return functions.sendResponse(res, {
        statusCode: 404,
        response: {
          message: `No roles found to remove of this user ID: ${userId}`,
        },
      });
    }

    /// When the HTTP method is "DELETE," this code snippet removes the roles associated with the user.
    if (req.method === "DELETE" && existingUserRoles.length > 0) {
      const finalRolesList = existingUserRoles.filter(
        (item) => !roles.includes(item)
      );
      newUserRoles = finalRolesList;
    }

    /// When the HTTP method is "POST," this code snippet adds the roles associated with the user.
    if (req.method === "POST") {
      if (existingUserRoles.length > 0) {
        const mergedRoles = roles.concat(existingUserRoles);
        const finalRolesList = Array.from(new Set(mergedRoles));
        newUserRoles = finalRolesList;
      } else {
        newUserRoles = req.body.roles;
      }
    }

    const requestObject = { roles: newUserRoles };

    const updateUserResponse = await Authentication.updateUserDetails({
      userId: userId,
      payload: requestObject,
    });

    const updateResponseResult =
      updateUserResponse.statusCode === 200
        ? {
            message:
              req.method != "DELETE"
                ? "User roles added successfully."
                : "User roles removed successfully.",
          }
        : {
            message: updateUserResponse.message,
          };
    return functions.sendResponse(res, {
      statusCode: updateUserResponse.statusCode,
      response: updateResponseResult,
    });
  } catch (error) {
    const errorMessage =
      req.method != "DELETE"
        ? Responses.ADD_ROLES_ERROR
        : Responses.REMOVE_ROLES_ERROR;
    return functions.sendResponse(res, errorMessage);
  }
};

module.exports = {
  addOrDeleteUserRole,
};
