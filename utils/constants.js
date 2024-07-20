class Constants {
  static OTP_EXPIRY_TIME_KEY = "otp_expiry_time";
  static ACCESS_TOKEN_EXPIRY_TIME_KEY = "access_token_expiry_time";
  static REFRESH_TOKEN_EXPIRY_TIME_KEY = "refresh_token_expiry_time";
  static OTP_COUNTER_KEY = "otp_counter_key";
  static OTP_EXPIRY_TIME_VALUE = "30s";

  // Role constants
  static ADMIN = "admin";
  static LOCAL_COORDINATOR = "local coordinator";
  static REMOTE_SPECIALIST = "remote specialist";
  static VOLUNTEER = "volunteer";
}

module.exports = Constants;
