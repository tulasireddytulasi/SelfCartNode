const validateEmail = async (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

const validateMobileNumber = async (mobileNumber) => {
  // Regular expression to validate a mobile number
  const mobileNumberPattern = /^[0-9]{10}$/;
  return mobileNumberPattern.test(mobileNumber);
};

module.exports = { validateEmail, validateMobileNumber };
