const express = require("express");
const router = express.Router();

// Import appointment controllers
const {
  checkAppointmentPermission,
  createAppointment,
  getAppointments,
  getAppointmentById,
  updateAppointment,
  deleteAppointment,
} = require("../../controllers/manageAppointment/index"); // Adjust path as needed

const User= require('../../models/userTable'); 

// Middleware to authenticate user (you'll need to implement this)
// const authenticateToken = require('../middleware/auth'); // Adjust path as needed

// Apply authentication and permission check to all routes
// router.use(authenticateToken);
router.use(checkAppointmentPermission);

// Routes
router.post("/createappointment", createAppointment);
router.post("/getappointments", getAppointments);
router.post("/getappointmentid/:appointmentId", getAppointmentById);
router.post("/updateappointment/:appointmentId", updateAppointment);
router.delete("/appointment/:appointmentId", deleteAppointment);

router.post("/patient", async (req, res) => {
  const { role, user_id } = req.body;

  try {
    let result = {};
    
    if (role == "Patient") {
      // If role is patient, fetch the specific patient AND all doctors
      const patientRecord = await User.find(
        { 
          role: "Patient", 
          user_id: user_id 
        },
        { user_id: 1, name: 1 }
      );
      
      const doctors = await User.find(
        { role: "Doctor" },
        { user_id: 1, name: 1 }
      );

      result = {
        patients: patientRecord,
        doctors: doctors
      };
      
    } else if (role === "Doctor") {
      // If role is Doctor, find the specific doctor record AND all patients
      const doctorRecord = await User.find(
        { 
          role: "Doctor",
          user_id: user_id 
        },
        { user_id: 1, name: 1 }
      );
      
      const patients = await User.find(
        { role: "Patient" },
        { user_id: 1, name: 1 }
      );

      result = {
        doctors: doctorRecord,
        patients: patients
      };
      
    } else if (role === "Admin") {
      // If role is Admin, find all doctors AND all patients
      const doctors = await User.find(
        { role: "Doctor" },
        { user_id: 1, name: 1 }
      );
      
      const patients = await User.find(
        { role: "Patient" },
        { user_id: 1, name: 1 }
      );

      result = {
        doctors: doctors,
        patients: patients
      };
      
    } else {
      // Handle invalid role
      return res.status(403).json({ 
        message: "Unauthorized: Invalid role" 
      });
    }

    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching patients:", error);
    res
      .status(500)
      .json({ message: "Error fetching patients", error: error.message });
  }
});

module.exports = router;
