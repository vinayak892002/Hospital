const mongoose = require("mongoose");


const labReportSchema = new mongoose.Schema({
  report_id: { type: String, default: null},
  appointment_id: { type: String, ref: "Appointments"},
  patient_id: { type: String, ref: "Users", required: true },
  test_name: { type: String, required: true },
  result_summary: { type: String },
  report_file: { type: String },
  created_by: { type: String, ref: "Users" },
  created_at: { type: Date, default: Date.now }
});

const labReportModel = mongoose.model("LabReports", labReportSchema);
module.exports = labReportModel;
