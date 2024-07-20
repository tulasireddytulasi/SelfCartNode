class Responses {
  static INTERNAL_SERVER_ERROR = {
    statusCode: 500,
    response: {
      message: "Internal Server Error!",
    },
  };

  static UNAUTHORIZED_REQUEST = {
    statusCode: 401,
    response: {
      message: "Unauthorized request!",
    },
  };

  static INVALID_OTP = {
    statusCode: 400,
    response: {
      statusCode: 10001,
      message: "Invalid OTP!",
    },
  };

  static OTP_SUCCESS = {
    statusCode: 200,
    response: {
      statusCode: 20000,
      message: "OTP sent successfully",
    },
  };

  static OTP_VALID = {
    statusCode: 200,
    response: {
      statusCode: 20000,
      message: "OTP is valid",
    },
  };

  static FAILED_TO_SEND_OTP = {
    statusCode: 400,
    response: {
      statusCode: 10001,
      message: "Failed to send OTP",
    },
  };

  static FAILED_TO_VALIDATE_OTP = {
    statusCode: 400,
    response: {
      statusCode: 10001,
      message: "Failed to validate OTP",
    },
  };

  static ERROR_DURING_SEND_OTP = {
    statusCode: 400,
    response: {
      statusCode: 10001,
      message: "Error during send OTP",
    },
  };

  static USER_ID_REQUIRED = {
    statusCode: 400,
    response: {
      message: "user id is required",
    },
  };

  static EMAIL_ID_ALREADY_TAKEN = {
    statusCode: 400,
    response: {
      message: "This email id already taken, please use another one.",
    },
  };

  static MOBILE_NO_ALREADY_TAKEN = {
    statusCode: 400,
    response: {
      message: "This mobile number already taken, please use another one.",
    },
  };

  static USER_DETAILS_UPDATE_ERROR = {
    statusCode: 500,
    response: {
      message: "Error during user details update",
    },
  };

  static OTP_REQUEST_LIMIT_EXCEEDED = {
    statusCode: 429,
    response: {
      statusCode: 500,
      message: "Request limit exceeded, please try after 1 hour",
    },
  };

  static GET_USER_DETAILS_ERROR = {
    statusCode: 500,
    response: {
      message: "Error during fetching user details",
    },
  };

  static GET_PATIENT_DETAILS_ERROR = {
    statusCode: 500,
    response: {
      message: "Error during fetching patient details",
    },
  };

  static USER_LOGOUT = {
    statusCode: 200,
    response: {
      message: "User successfully logout",
    },
  };

  static USER_LOGOUT_ERROR = {
    statusCode: 500,
    response: {
      message: "Error during  user logout",
    },
  };

  static CREATE_STATIC_DATA_ERROR = {
    statusCode: 500,
    response: {
      message: "Error during static data creation",
    },
  };

  static UPDATE_STATIC_DATA_ERROR = {
    statusCode: 500,
    response: {
      message: "Error during updating static data",
    },
  };

  static GET_STATIC_DATA_ERROR = {
    statusCode: 500,
    response: {
      message: "Error during fetching the static data",
    },
  };

  static USER_NOT_FOUND = {
    statusCode: 404,
    response: {
      message: "no users found for givern query",
    },
  };

  static PATIENT_NOT_FOUND = {
    statusCode: 404,
    response: {
      message: "no patients found for givern query",
    },
  };

  static PATIENT_REGISTRATION_ERROR = {
    statusCode: 500,
    response: {
      message: "Error during patient registration",
    },
  };

  static UPDATE_PATIENT_ERROR = {
    statusCode: 500,
    response: {
      message: "Error during updating patient data",
    },
  };

  static CASE_ERROR = {
    statusCode: 500,
    response: {
      message: "Error during creating case",
    },
  };

  static UPDATE_CASE_ERROR = {
    statusCode: 500,
    response: {
      message: "Error during updating case details",
    },
  };

  static USER_NOT_REGISTERED = {
    statusCode: 404,
    response: {
      message: "User not registered, contact admin",
    },
  };

  static CDR_ERROR = {
    statusCode: 500,
    response: {
      message: "Error during creating cdr details",
    },
  };

  static UPDATE_CDR_ERROR = {
    statusCode: 500,
    response: {
      message: "Error during updating cdr details",
    },
  };

  static ADD_ROLES_ERROR = {
    statusCode: 500,
    response: {
      message: "Error during adding user roles",
    },
  };

  static REMOVE_ROLES_ERROR = {
    statusCode: 500,
    response: {
      message: "Error during removing user roles",
    },
  };
}

module.exports = Responses;
