const {
  createConstant,
  updateConstant,
} = require("../database/constants-db.js");

const createConstants = async (req, res) => {
  try {
    const { key, value } = req.body;

    const createConstantResponse = await createConstant(key, value);

    return res
      .status(createConstantResponse.statusCode)
      .json({ message: createConstantResponse.message });
  } catch (error) {
    res.status(500).json({ message: "Failed to create constants!" });
  }
};

const UpdateConstants = async (req, res) => {
  try {
    const { key, value } = req.body;

    const updateConstantResponse = await updateConstant(key, value);

    return res
      .status(updateConstantResponse.statusCode)
      .json({ message: updateConstantResponse.message });
  } catch (error) {
    res.status(500).json({ message: "Failed to update constant!" });
  }
};

module.exports = { createConstants, UpdateConstants };
