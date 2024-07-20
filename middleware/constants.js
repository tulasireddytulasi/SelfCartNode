const constantsValidate = async (req, res, next) => {
  const { key, value } = req.body;

  if (!key) {
    return res.status(400).json({ status: 400, message: "Key required" });
  } else if (typeof key !== "string") {
    return res.status(400).json({ status: 400, message: "Invalid data type" });
  } else if (!value) {
    return res.status(400).json({ status: 400, message: "Value required" });
  }

  next();
};

module.exports = { constantsValidate };
