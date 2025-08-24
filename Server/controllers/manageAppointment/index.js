const User = require("../../models/userTable");
const Appointment = require("../../models/appointmentTable");
const { v4: uuidv4 } = require("uuid");

const checkAppointmentPermission = (req, res, next) => {
  const allowedRoles = ["Patient", "Receptionist", "Doctor"];

  next();
};

// Create a new appointment
const createAppointment = async (req, res) => {
  try {
    const { patient_id, doctor_id, appointment_date, notes } = req.body;
    const { userRole } = req.body;

    // Create new appointment
    const newAppointment = new Appointment({
      appointment_id: uuidv4(),
      patient_id,
      doctor_id,
      appointment_date: parseInt(appointment_date),
      status: "Scheduled",
      notes: notes || null,
    });

    await newAppointment.save();

    res.status(201).json({
      success: true,
      message: "Appointment created successfully",
    });
  } catch (error) {
    console.error("Error creating appointment:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Get all appointments (with role-based filtering)
const getAppointments = async (req, res) => {
  try {
    const { role, user_id } = req.body;

    let filter = {};

    if (role === "Patient") {
      filter.patient_id = user_id;
    } else if (role === "Receptionist" || role === "Doctor") {
      filter = {};
    } else {
      return res.status(403).json({
        success: false,
        message: "Unauthorized: Invalid role",
      });
    }

    const appointments = await Appointment.find(filter);

    const patientIds = [
      ...new Set(appointments.map((apt) => apt.patient_id).filter((id) => id)),
    ];
    const doctorIds = [
      ...new Set(appointments.map((apt) => apt.doctor_id).filter((id) => id)),
    ];

    const patients = await User.find({ user_id: { $in: patientIds } });
    const doctors = await User.find({ user_id: { $in: doctorIds } });

    const patientMap = {};
    const doctorMap = {};

    patients.forEach((patient) => {
      patientMap[patient.user_id] = patient;
    });

    doctors.forEach((doctor) => {
      doctorMap[doctor.user_id] = doctor;
    });

    const appointmentsWithDetails = appointments.map((appointment) => ({
      ...appointment.toObject(),
      patient: patientMap[appointment.patient_id] || null,
      doctor: doctorMap[appointment.doctor_id] || null,
    }));

    const total = appointments.length;

    res.status(200).json({
      success: true,
      data: appointmentsWithDetails,
      total: total,
    });
  } catch (error) {
    console.error("Error fetching appointments:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Get single appointment by ID

// Update appointment (reschedule, add notes, etc.)
const updateAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const { appointment_date, notes, status } = req.body;
    const userRole = req.body.role;
    const userId = req.body.user_id;

    const appointment = await Appointment.findOne({
      appointment_id: appointmentId,
    });

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    // Role-based update restrictions
    const updateData = {};

    updateData.appointment_date = parseInt(appointment_date);

    if (notes !== undefined) {
      updateData.notes = notes;
    }

    if (status && ["Scheduled", "Completed", "Cancelled"].includes(status)) {
      // Only doctors and receptionists can mark appointments as completed
      if (
        status === "Completed" &&
        !["Doctor", "Receptionist"].includes(userRole)
      ) {
        return res.status(403).json({
          success: false,
          message:
            "Only doctors and receptionists can mark appointments as completed",
        });
      }
      updateData.status = status;
    }

    const updatedAppointment = await Appointment.findOneAndUpdate(
      { appointment_id: appointmentId },
      updateData,
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Appointment updated successfully",
    });
  } catch (error) {
    console.error("Error updating appointment:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Delete/Cancel appointment
const deleteAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.params;

    const appointment = await Appointment.findOne({
      appointment_id: appointmentId,
    });

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    await Appointment.findOneAndDelete({ appointment_id: appointmentId });

    res.status(200).json({
      success: true,
      message: "Appointment deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting appointment:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

module.exports = {
  checkAppointmentPermission,
  createAppointment,
  getAppointments,
  updateAppointment,
  deleteAppointment,
};
