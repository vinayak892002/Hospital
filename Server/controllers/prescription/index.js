const Appointment = require("../../models/appointmentTable");

// Create or Update Prescription for an Appointment
const upsertPrescription = async (req, res) => {
  try {
    const { appointment_id, diagnosis, medicines } = req.body;

    // Find appointment
    let appointment = await Appointment.findOne({ appointment_id });
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    // Upsert prescription
    appointment.prescription = {
      diagnosis,
      medicines,
    };

    await appointment.save();

    return res.json({
      message: "Prescription saved successfully",
      prescription: appointment.prescription,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get Prescription by Appointment
const getPrescriptionByAppointment = async (req, res) => {
  try {
    const { appointment_id } = req.params;

    const appointment = await Appointment.findOne({ appointment_id });
    if (!appointment || !appointment.prescription) {
      return res.status(404).json({ message: "Prescription not found" });
    }

    res.json(appointment.prescription);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete Prescription from Appointment
const deletePrescription = async (req, res) => {
  try {
    const { appointment_id } = req.params;

    const appointment = await Appointment.findOne({ appointment_id });
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    appointment.prescription = undefined; // remove prescription
    await appointment.save();

    res.json({ message: "Prescription deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  upsertPrescription,
  getPrescriptionByAppointment,
  deletePrescription,
};
