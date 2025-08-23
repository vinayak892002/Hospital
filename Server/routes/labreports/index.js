const express = require("express");
const router = express.Router();
const multer = require("multer");

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Make sure the 'uploads' directory exists
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  }
});
const upload = multer({ storage: storage });

const {
  createLabReport,
  getLabReports,
  getLabReportById,
  updateLabReport,
  deleteLabReport,
  getPatients,
} = require("../../controllers/labreports/index");



//get patients
router.get("/reports/patients", getPatients);

// Create a new lab report (handle file upload)
router.post("/reports", upload.single("report_file"), createLabReport);

// Get all lab reports
router.get("/reports", getLabReports);

// Get a single lab report by ID
router.get("/reports/:id", getLabReportById);

// Update a specific lab report (handle file upload if needed)
router.put("/reports/:id", upload.single("report_file"), updateLabReport);

// Delete a specific lab report
router.delete("/reports/:id", deleteLabReport);


module.exports = router;
