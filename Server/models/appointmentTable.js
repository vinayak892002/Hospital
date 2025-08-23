const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  appointment_id: { type: String, default: null },
  patient_id: { type: String, ref: "Users", default: null }, // UUID ref
  doctor_id: { type: String, ref: "Users", default: null },
  appointment_date: { type: Number, default: 0 },
  status: {
    type: String,
    enum: ["Scheduled", "Completed", "Cancelled"],
    default: "Scheduled",
  },
  notes: { type: String, default: null },

  prescription: {
    diagnosis: { type: String },
    medicines: [
      {
        name: { type: String, default: null },
        dosage: { type: String, default: null },
      },
    ],
  },
});

const appointmentModel = mongoose.model("Appointments", appointmentSchema);
module.exports = appointmentModel;
