const { v4: uuidv4 } = require("uuid");
const LabReport = require("../../models/labReportsTable");
const User = require("../../models/userTable");

// Add report
const addReport = async (req, res) => {
  try {
    const { patient_id, test_name, result_summary, created_by, report_file } =
      req.body;

    if (!patient_id || !test_name) {
      return res
        .status(400)
        .json({ message: "patient_id and test_name are required" });
    }

    const newReport = new LabReport({
      report_id: uuidv4(),
      patient_id,
      test_name,
      result_summary,
      created_by,
      report_file: report_file || null,
    });

    await newReport.save();

    return res.status(200).json({
      message: "Report added successfully",
      data: newReport,
    });
  } catch (error) {
    console.error("Error adding report:", error);
    res
      .status(500)
      .json({ message: "Error adding report", error: error.message });
  }
};

// Get patients
const getPatients = async (req, res) => {
  try {
    const patients = await User.find(
      { role: "Patient" },
      { user_id: 1, name: 1 }
    );
    res.status(200).json(patients);
  } catch (error) {
    console.error("Error fetching patients:", error);
    res
      .status(500)
      .json({ message: "Error fetching patients", error: error.message });
  }
};

const getReports = async (req, res) => {
  try {
    const { role, user_id } = req.body;

    let reports;

    if (role === "Doctor") {
      reports = await LabReport.find();
    } else if (role === "Patient") {
      reports = await LabReport.find({ patient_id: user_id });
    } else {
      return res.status(403).json({ message: "Unauthorized role" });
    }

    const patientIds = [...new Set(reports.map((report) => report.patient_id))];

    const users = await User.find(
      { user_id: { $in: patientIds } },
      { user_id: 1, name: 1 }
    );

    // map user_id -> name
    const userMap = {};
    users.forEach((user) => {
      userMap[user.user_id] = user.name;
    });

    // enrich reports with patient_name
    const reportsWithPatientName = reports.map((report) => ({
      ...report.toObject(),
      patient_name: userMap[report.patient_id] || "Unknown",
    }));

    return res.status(200).json({
      message: "Reports fetched successfully",
      data: reportsWithPatientName,
    });
  } catch (error) {
    console.error("Error fetching reports:", error);
    return res
      .status(500)
      .json({ message: "Error fetching reports", error: error.message });
  }
};

// Update report
const updateReport = async (req, res) => {
  try {
    const { id } = req.params;
    const { patient_id, test_name, result_summary, report_file } = req.body;

    if (!patient_id || !test_name) {
      return res
        .status(400)
        .json({ message: "patient_id and test_name are required" });
    }

    const updatedReport = await LabReport.findOneAndUpdate(
      { report_id: id },
      { patient_id, test_name, result_summary, report_file },
      { new: true }
    );

    if (!updatedReport) {
      return res.status(404).json({ message: "Report not found" });
    }

    return res.status(200).json({
      message: "Report updated successfully",
      data: updatedReport,
    });
  } catch (error) {
    console.error("Error updating report:", error);
    res
      .status(500)
      .json({ message: "Error updating report", error: error.message });
  }
};

// Delete report
const deleteReport = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedReport = await LabReport.findOneAndDelete({ report_id: id });

    if (!deletedReport) {
      return res.status(404).json({ message: "Report not found" });
    }

    return res.status(200).json({
      message: "Report deleted successfully",
      data: deletedReport,
    });
  } catch (error) {
    console.error("Error deleting report:", error);
    res
      .status(500)
      .json({ message: "Error deleting report", error: error.message });
  }
};

module.exports = {
  addReport,
  getPatients,
  getReports,
  updateReport,
  deleteReport,
};
