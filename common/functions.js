const CryptoJS = require("crypto-js");

// Generate OTP
const generateOTP = () => {
  const newOTPValue = Math.floor(100000 + Math.random() * 900000); // Generate a 6-digit OTP
  return newOTPValue;
};

function encryptedData(plaintext) {
  const secretKey = process.env.OTP_SECRET_KEY;
  const encryptedData = CryptoJS.AES.encrypt(plaintext, secretKey).toString();
  return encryptedData;
}

function decryptedData(encryptedText) {
  const secretKey = process.env.OTP_SECRET_KEY;
  const decryptedData = CryptoJS.AES.decrypt(encryptedText, secretKey).toString(
    CryptoJS.enc.Utf8
  );
  return decryptedData;
}

function compareDatesInSeconds(fromDate, toDate) {
  const fromDatetimestamp = fromDate.getTime(); // Get the timestamp of fromDate in milliseconds
  const toDatetimestamp = toDate.getTime(); // Get the timestamp of toDate in milliseconds

  const differenceInSecondsValue = Math.abs(
    (toDatetimestamp - fromDatetimestamp) / 1000
  ); // Calculate the difference in seconds
  const differenceInSeconds = parseInt(differenceInSecondsValue);
  return differenceInSeconds;
}

module.exports = {
  generateOTP,
  encryptedData,
  decryptedData,
  compareDatesInSeconds,
};
