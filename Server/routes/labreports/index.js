const express = require("express");
const router = express.Router();

const {
  addReport,
  getPatients,
  getReports,
} = require("../../controllers/labreports/index");

router.get("/getPatients", getPatients);
router.get("/getReports", getReports);

router.post("/addReport", addReport);

module.exports = router;
