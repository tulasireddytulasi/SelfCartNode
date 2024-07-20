const Joi = require("joi");
const ValidateAccessToken = require("./verify-auth-token.js");
const Responses = require("../common/responses.js");
const Constants = require("../utils/constants.js");

const validateUserDetailsPayload = (req, res, next) => {
  const {
    fullName,
    mobileNumber,
    email,
    roles,
    organizationIds,
    locationIds,
    createdBefore,
    createdAfter,
  } = req.body;

  // Check if at least one field is not empty or present
  if (
    fullName ||
    mobileNumber ||
    email ||
    (roles && roles.length > 0) ||
    (organizationIds && organizationIds.length > 0) ||
    (locationIds && locationIds.length > 0) ||
    createdBefore ||
    createdAfter
  ) {
    // At least one field is present, proceed to the next middleware/route handler
    next();
  } else {
    // None of the fields are present, return a 400 Bad Request response
    return res.status(400).json({ status: 400, message: "invalid payload." });
  }
};

const userRolesValidate = async (req, res, next) => {
  /// Validate the user roles details
  const rolesSchema = Joi.object({
    roles: Joi.array()
      .items(
        Joi.string().valid(
          Constants.ADMIN,
          Constants.LOCAL_COORDINATOR,
          Constants.REMOTE_SPECIALIST,
          Constants.VOLUNTEER
        )
      )
      .unique()
      .required(),
  });

  const { error } = rolesSchema.validate(req.body);

  /// If validation fails, send an error response with the validation error details
  if (error) {
    return functions.sendResponse(res, {
      statusCode: 400,
      response: {
        error: error.details[0].message,
      },
    });
  }

  next();
};

module.exports = { validateUserDetailsPayload, userRolesValidate };
