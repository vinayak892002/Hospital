const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const prescriptionSchema = new mongoose.Schema({
  prescription_id: {
    type: String,
    default: uuidv4,
    unique: true,
  },
  appointment_id: {
    type: String,
    required: true,
  },
  diagnosis: {
    type: String,
    required: true,
  },
  medicines: {
    type: [
      {
        name: String,
        dosage: String,
      },
    ],
    default: [],
  },
  created_by: {
    type: String,
    required: true, // doctor_id
  },
});

module.exports = mongoose.model("Prescription", prescriptionSchema);