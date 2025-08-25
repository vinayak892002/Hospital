const mongoose = require("mongoose");

const billingSchema = new mongoose.Schema({
  bill_id: { type: String, required: true, unique: true },
  patient_id: { type: String, ref: "Users", required: true },
  appointment_id: { type: String, ref: "Appointments", required: false },
  doctor_id: { type: String, ref: "Users", required: false },
  services: [
    {
      code: { type: String },
      name: { type: String },
      amount: { type: Number },
      department_id: { type: String },
    },
  ],
  total_amount: { type: Number, required: true },
  payment_status: {
    type: String,
    enum: ["Paid", "Unpaid", "Partially Paid"],
    required: true,
  },
  payment_mode: {
    type: String,
    enum: ["Cash", "Card", "Online"],
    required: true,
  },
  created_at: { type: Date, default: Date.now },
  department_id: { type: String, required: false },
  partial_paid_amount: { type: Number, required: false },
});

const billingModel = mongoose.model("Billing", billingSchema);

module.exports = billingModel;
