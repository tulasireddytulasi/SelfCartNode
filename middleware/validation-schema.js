const Joi = require("joi");

const userUpdateSchema = Joi.object({
  version: Joi.number().integer().min(1),
  userName: Joi.string().optional(),
  salutation: Joi.string().optional(),
  firstName: Joi.string().optional(),
  middleName: Joi.string().optional(),
  lastName: Joi.string().optional(),
  email: Joi.string().email().optional(),
  mobileNumber: Joi.string().optional(),
  gender: Joi.string().valid("male", "female", "other").optional(),
  roles: Joi.array().items(Joi.string()).optional(),
  organizations: Joi.array().items(Joi.string()).optional(),
  locations: Joi.array().items(Joi.string()).optional(),
  isDeleted: Joi.boolean().optional(),
  createdBy: Joi.string().optional(),
  createdOn: Joi.date().optional(),
  lastModifiedBy: Joi.string().optional(),
  lastModifiedOn: Joi.date().optional(),
  profileName: Joi.string().optional(),
  fullNameSearchable: Joi.string().optional(),
  fullName: Joi.string().optional(),
});

// Function to validate user details
const validateUserUpdate = (data) => {
  return userUpdateSchema.validate(data);
};

module.exports = { validateUserUpdate };
