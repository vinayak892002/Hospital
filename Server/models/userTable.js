const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    user_id: { type: String, default: null }, 
  name: { type: String, default: null },
  email: { type: String, default: null },
  password: { type: String, default: null}, // hashed
  role: {
    type: String,
    enum: [
      "Admin",
      "Doctor",
      "Receptionist",
      "Patient",
      "Pharmacist",
      "LabTech",
      "SuperAdmin",
    ],
    required: true,
  },
  contact_number: { type: String ,default: null},
  status: { type: Boolean, default: true },

  profile: {
    gender: { type: String, enum: ["Male", "Female", "Other"], default: null },
    dob: { type: Date ,default: null},
    blood_group: { type: String,default: null },
    address: { type: String,default: null },
    emergency_contact: { type: String ,default: null},
    allergies: [String],

    // Doctor-specific
    department: { type: String ,default: null},
    qualification: { type: String,default: null },
    availability: { type: Map, of: String }, // e.g. { Mon: "10-2", Tue: "2-6" }
  },

  created_at: { type: Date, default: Date.now },
});

const userModel = mongoose.model("Users", userSchema);
module.exports = userModel;
