const Prescription = require("../models/prescriptions");

// Create or Update Prescription
const upsertPrescription = async (req, res) => {
  try {
    const { appointment_id, diagnosis, medicines, created_by } = req.body;

    let prescription = await Prescription.findOne({ appointment_id });

    if (prescription) {
      // Update existing
      prescription.diagnosis = diagnosis;
      prescription.medicines = medicines;
      await prescription.save();
      return res.json({ message: "Prescription updated", prescription });
    } else {
      // Create new
      prescription = new Prescription({
        appointment_id,
        diagnosis,
        medicines,
        created_by,
      });
      await prescription.save();
      return res.json({ message: "Prescription created", prescription });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get by appointment_id
const getPrescriptionByAppointment = async (req, res) => {
  try {
    const { appointment_id } = req.params;
    const prescription = await Prescription.findOne({ appointment_id });
    if (!prescription) return res.status(404).json({ message: "Not found" });
    res.json(prescription);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete prescription
const deletePrescription = async (req, res) => {
  try {
    const { prescription_id } = req.params;
    await Prescription.deleteOne({ prescription_id });
    res.json({ message: "Prescription deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  upsertPrescription,
  getPrescriptionByAppointment,
  deletePrescription,
};