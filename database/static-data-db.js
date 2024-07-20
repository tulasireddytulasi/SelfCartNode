const ConstantsModel = require("../model/constants-model.js");

const getStaticDataByKey = async (key) => {
  try {
    /// Check if the key exists
    const existingKey = await ConstantsModel.findOne({ key });
    if (existingKey) {
      const successMessage = {
        statusCode: 200,
        message: existingKey,
      };
      return successMessage;
    } else {
      const errorMessage = {
        statusCode: 404,
        message: `No data found with this key: ${key}`,
      };
      return errorMessage;
    }
  } catch (error) {
    return false;
  }
};

module.exports = {
  getStaticDataByKey,
};
