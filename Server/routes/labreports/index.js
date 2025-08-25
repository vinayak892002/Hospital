const express = require("express");
const router = express.Router();

const {
  addReport,
  getPatients,
  getReports,
  updateReport,
  deleteReport,
} = require("../../controllers/labreports/index");

router.get("/getPatients", getPatients);
router.post("/getReports", getReports);

router.post("/addReport", addReport);
router.put("/updateReport/:id", updateReport);
router.delete("/deleteReport/:id", deleteReport);

module.exports = router;
