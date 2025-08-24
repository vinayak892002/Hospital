const mongoose = require("mongoose");


const medicineSchema = new mongoose.Schema({
  medicine_id: { type: String, default: null },
  name: { type: String, required: true },
  stock: { type: Number, default: 0 },
  expiry_date: { type: String },
  unit_price: { type: Number, default: 0 },
});

const medicineModel = mongoose.model("Medicines", medicineSchema);
module.exports = medicineModel;
