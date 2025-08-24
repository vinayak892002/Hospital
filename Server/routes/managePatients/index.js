const express = require("express");
const router = express.Router();

const {
  getAllPatients,
  updatePatient,
  deletePatient,
} = require("../../controllers/managePatients/index");

router.get("/getAllPatients", getAllPatients);
router.post("/updatePatient", updatePatient);
router.post("/deletePatient", deletePatient);

module.exports = router;
