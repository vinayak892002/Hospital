const express = require("express");
const router = express.Router();
const {
  getDoctors,
  updateDoctor,
  deleteDoctor,
} = require("../../controllers/doctor/index");


router.get("/getdoctors", getDoctors);

// Update doctor information
router.post("/update-doctor/:id", updateDoctor);

// Delete doctor
router.delete("/delete-doctor/:id", deleteDoctor);

module.exports = router;


