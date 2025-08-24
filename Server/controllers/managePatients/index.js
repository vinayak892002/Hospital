const { v4: uuidv4 } = require("uuid");

const User = require("../../models/userTable");
const { use } = require("react");

const getAllPatients = async (req, res) => {
  try {
    const patients = await User.find({ role: "Patient" });

    res.status(200).json(patients);
  } catch (error) {
    console.error("Error fetching patients:", error);
    res
      .status(500)
      .json({ message: "Error fetching patients", error: error.message });
  }
};

const updatePatient = async (req, res) => {
  try {
    const { user_id, profile, name, email, contact_number, status } = req.body;

    if (!user_id) {
      return res.status(400).json({ message: "Patient user_id is required" });
    }

    const updatedPatient = await User.findOneAndUpdate(
      { user_id },
      {
        name,
        email,
        contact_number,
        status,
        profile,
      },
      { new: true }
    );

    if (!updatedPatient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    res.status(200).json({
      message: "Patient updated successfully",
      data: updatedPatient,
    });
  } catch (error) {
    console.error("Error updating patient:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const deletePatient = async (req, res) => {
  try {
    const { user_id } = req.body;

    if (!user_id) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const deletedPatient = await User.findOneAndDelete({ user_id });

    if (!deletedPatient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    return res.status(200).json({ message: "Patient deleted successfully" });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getAllPatients,
  updatePatient,
  deletePatient,
};
