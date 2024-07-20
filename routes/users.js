const router = require("express").Router();

const { validateUserDetailsPayload } = require("../middleware/users.js");
const {
  filterUserDetails,
} = require("../controller/user-details-controller.js");
router.post("/auth/fetch-users", validateUserDetailsPayload, filterUserDetails);

module.exports = router;
