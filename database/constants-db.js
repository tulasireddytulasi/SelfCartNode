const ConstantsModel = require("../model/constants-model.js");

const createConstant = async (key, value) => {
  try {
    // Check if the key exists
    const existingKey = await ConstantsModel.findOne({ key });
    if (existingKey) {
      const errorMessage = {
        statusCode: 400,
        message: "This key already exists!",
      };
      return errorMessage;
    }
    // Create a new constant
    const constantsDoc = new ConstantsModel({ key, value });
    const constantsDocResult = await constantsDoc.save();
    const successMessage = {
      statusCode: 201,
      message: "Constants created Successfuly",
    };
    return successMessage;
  } catch (error) {
    const errorMessage = {
      statusCode: 500,
      message: "Error during constants creation",
    };
    return errorMessage;
  }
};

const updateConstant = async (key, value) => {
  // updates Constant
  const updateConstantReslut = await ConstantsModel.findOneAndUpdate(
    { key },
    { value }
  )
    .then((result) => {
      if (result) {
        const successMessage = {
          statusCode: 200,
          message: "Constant updated successfully",
        };
        return successMessage;
      } else {
        const errorMessage = { statusCode: 404, message: "Key not found" };
        return errorMessage;
      }
    })
    .catch((err) => {
      const errorMessage = {
        statusCode: 500,
        message: "Updating constant Failed",
      };
      return errorMessage;
    });

  return updateConstantReslut;
};

const getConstantKeyValue = async (key) => {
  try {
    // Check if the key exists
    const existingKey = await ConstantsModel.findOne({ key });
    return existingKey;
  } catch (error) {
    return false;
  }
};

module.exports = { createConstant, updateConstant, getConstantKeyValue };
