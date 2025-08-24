const express = require('express');
const router = express.Router();

// Import appointment controllers
const {
  checkAppointmentPermission,
  createAppointment,
  getAppointments,
  getAppointmentById,
  updateAppointment,
  deleteAppointment
} = require('../../controllers/appointment.controller.js'); // Adjust path as needed

// Middleware to authenticate user (you'll need to implement this)
// const authenticateToken = require('../middleware/auth'); // Adjust path as needed

// Apply authentication and permission check to all routes
// router.use(authenticateToken);
router.use(checkAppointmentPermission);

// Routes
router.post('/appointment', createAppointment);
router.get('/appointment', getAppointments);
router.get('/appointment/:appointmentId', getAppointmentById);
router.put('/appointment/:appointmentId', updateAppointment);
router.delete('/appointment/:appointmentId', deleteAppointment);

module.exports = router;