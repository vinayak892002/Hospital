const { v4: uuidv4 } = require("uuid");
const LabReport = require("../../models/labReportsTable");
const User = require("../../models/userTable"); // Import user model

// --- CREATE New Lab Report ---
const createLabReport = async (req, res) => {
  try {
    const {
      appointment_id,
      patient_id,
      test_name,
      result_summary,
      created_by,
    } = req.body;

    const report_file = req.file ? req.file.path : null;

    const newLabReport = new LabReport({
      report_id: uuidv4(),
      appointment_id,
      patient_id,
      test_name,
      result_summary,
      report_file,
      created_by,
      created_at: Date.now(),
    });

    await newLabReport.save();
    res.status(200).json({ message: "Lab report created successfully", report: newLabReport });
  } catch (error) {
    console.error("LabReport Create Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// --- GET All Lab Reports (or filter by patient, doctor, etc) ---
const getLabReports = async (req, res) => {
  try {
    const filter = {};
    if (req.query.patient_id) filter.patient_id = req.query.patient_id;
    if (req.query.created_by) filter.created_by = req.query.created_by;
    const reports = await LabReport.find(filter).sort({ created_at: -1 });
    res.status(200).json({ reports });
  } catch (error) {
    console.error("LabReport Fetch Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// --- GET Single Lab Report ---
const getLabReportById = async (req, res) => {
  try {
    const { id } = req.params;
    const report = await LabReport.findById(id);
    if (!report) {
      return res.status(404).json({ message: "Lab report not found" });
    }
    res.status(200).json({ report });
  } catch (error) {
    console.error("LabReport FetchById Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// --- UPDATE Lab Report ---
const updateLabReport = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Only replace report_file if a new file was uploaded
    if (req.file && req.file.path) {
      updates.report_file = req.file.path;
    } else {
      // Don't overwrite the existing file path if no new file uploaded
      delete updates.report_file; // ensure it doesn't become undefined or empty
    }

    const report = await LabReport.findByIdAndUpdate(id, updates, { new: true });
    if (!report) {
      return res.status(404).json({ message: "Lab report not found" });
    }
    res.status(200).json({ message: "Lab report updated", report });
  } catch (error) {
    console.error("LabReport Update Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


// --- DELETE Lab Report ---
const deleteLabReport = async (req, res) => {
  try {
    const { id } = req.params;
    const report = await LabReport.findByIdAndDelete(id);
    if (!report) {
      return res.status(404).json({ message: "Lab report not found" });
    }
    res.status(200).json({ message: "Lab report deleted" });
  } catch (error) {
    console.error("LabReport Delete Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// --- GET Patients (for dropdown/autocomplete) ---
const getPatients = async (req, res) => {
  try {
    // Optional: add search by name/email? use req.query.search (frontend can send it)
    const { search } = req.query;
    let filter = { role: "Patient" };
    if (search) {
      filter = {
        ...filter,
        $or: [
          { name: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } }
        ]
      };
    }
    // Select only necessary fields for dropdown
    const users = await User.find(filter, { name: 1, email: 1, _id: 1, role: 1 });
    res.status(200).json({ users });
  } catch (error) {
    console.error("Fetch patients error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  createLabReport,
  getLabReports,
  getLabReportById,
  updateLabReport,
  deleteLabReport,
  getPatients, // <-- Export this for your route
};
