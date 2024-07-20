const router = require("express").Router();
const { getStaticData } = require("../controller/static-data-controller.js");

/// Get static-data
router.get("/static-data/:parameter", getStaticData);

module.exports = router;
