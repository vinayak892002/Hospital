const express = require("express");
const router = express.Router();
const {
  updateUser,
  getUserData,
  calProfilePercentage,
} = require("../../controllers/profile/index");
// const fileUploads = require("../../uploadMiddleware/index");

// router.post("/update-user", fileUploads, updateUser);

router.get("/get-user", getUserData);
router.post("/calProfilePercentage", calProfilePercentage);

module.exports = router;
