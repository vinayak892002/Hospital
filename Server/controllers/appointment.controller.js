const User = require('../models/userTable'); // Adjust path as needed
const Appointment = require('../models/appointmentTable'); // Adjust path as needed
const { v4: uuidv4 } = require('uuid');

// Middleware to check if user has permission to manage appointments
const checkAppointmentPermission = (req, res, next) => {
  const allowedRoles = ['Patient', 'Receptionist', 'Doctor'];
  req.user = {
    role: 'Patient',
    user_id: '4a3135b4-e6dd-4224-83d8-f68815a8860d'
  }
  // doctorid 4a3135b4-e6dd-4224-83d8-f68815a8860d
  // if (!req.user || !allowedRoles.includes(req.user.role)) {
  //   return res.status(403).json({
  //     success: false,
  //     message: 'Access denied. Only Patients, Receptionists, and Doctors can manage appointments.'
  //   });
  // }
  
  next();
};

// Create a new appointment
const createAppointment = async (req, res) => {
  try {
    const { patient_id, doctor_id, appointment_date, notes } = req.body;
    const userRole = req.user.role;

    // Validation
    // if (!patient_id || !doctor_id || !appointment_date) {
    //   return res.status(400).json({
    //     success: false,
    //     message: 'Patient ID, Doctor ID, and appointment date are required'
    //   });
    // }

    // // Role-based validation
    // if (userRole === 'Patient' && patient_id !== req.user.user_id) {
    //   return res.status(403).json({
    //     success: false,
    //     message: 'Patients can only create appointments for themselves'
    //   });
    // }

    // // console.log(await User.find({}));
    // // Verify patient exists and is a patient
    // const patient = await User.findOne({ user_id: patient_id, role: 'Patient' });
    // if (!patient) {
    //   return res.status(404).json({
    //     success: false,
    //     message: 'Patient not found'
    //   });
    // }


    // // Verify doctor exists and is a doctor
    // const doctor = await User.findOne({ user_id: doctor_id, role: 'Doctor' });
    // if (!doctor) {
    //   return res.status(404).json({
    //     success: false,
    //     message: 'Doctor not found'
    //   });
    // }

    // // Check if doctor is available (basic check)
    // const existingAppointment = await Appointment.findOne({
    //   doctor_id,
    //   appointment_date: parseInt(appointment_date),
    //   status: { $ne: 'Cancelled' }
    // });

    // if (existingAppointment) {
    //   return res.status(409).json({
    //     success: false,
    //     message: 'Doctor is not available at this time slot'
    //   });
    // }

    // Create new appointment
    const newAppointment = new Appointment({
      appointment_id: uuidv4(),
      patient_id: '4a3135b4-e6dd-4224-83d8-f68815a8860d',
      doctor_id: '4a3135b4-e6dd-4224-83d8-f68815a8860d',
      appointment_date: parseInt(appointment_date),
      status: 'Scheduled',
      notes: notes || null
    });

    await newAppointment.save();

    // Populate patient and doctor details for response
    // const populatedAppointment = await Appointment.findById(newAppointment._id)
    //   .populate('patient_id', 'name email contact_number')
    //   .populate('doctor_id', 'name profile.department profile.qualification');

    const populatedAppointment = await Appointment.findById(newAppointment._id)
      .populate({
        path: 'patient_id',
        match: { user_id: newAppointment.patient_id }, // Match by user_id instead of _id
        select: 'name email contact_number'
      })
      .populate({
        path: 'doctor_id', 
        match: { user_id: newAppointment.doctor_id }, // Match by user_id instead of _id
        select: 'name profile.department profile.qualification'
      });

    res.status(201).json({
      success: true,
      message: 'Appointment created successfully',
      data: populatedAppointment
    });

  } catch (error) {
    console.error('Error creating appointment:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Get all appointments (with role-based filtering)
const getAppointments = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, date } = req.query;
    const userRole = req.user.role;
    const userId = req.user.user_id;

    let filter = {};

    // Role-based filtering
    switch (userRole) {
      case 'Patient':
        filter.patient_id = userId;
        break;
      case 'Doctor':
        filter.doctor_id = userId;
        break;
      case 'Receptionist':
        // Receptionists can see all appointments
        break;
    }

    // Add additional filters
    if (status) {
      filter.status = status;
    }

    if (date) {
      filter.appointment_date = parseInt(date);
    }

    const appointments = await Appointment.find(filter)
      .populate('patient_id', 'name email contact_number profile.gender profile.dob')
      .populate('doctor_id', 'name profile.department profile.qualification')
      .sort({ appointment_date: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Appointment.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: appointments,
      pagination: {
        current_page: parseInt(page),
        total_pages: Math.ceil(total / limit),
        total_appointments: total,
        has_next: page < Math.ceil(total / limit),
        has_prev: page > 1
      }
    });

  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Get single appointment by ID
const getAppointmentById = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const userRole = req.user.role;
    const userId = req.user.user_id;

    const appointment = await Appointment.findOne({ appointment_id: appointmentId })
      .populate('patient_id', 'name email contact_number profile')
      .populate('doctor_id', 'name profile.department profile.qualification');

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    // Role-based access control
    const hasAccess = 
      userRole === 'Receptionist' ||
      (userRole === 'Patient' && appointment.patient_id.user_id === userId) ||
      (userRole === 'Doctor' && appointment.doctor_id.user_id === userId);

    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only view your own appointments.'
      });
    }

    res.status(200).json({
      success: true,
      data: appointment
    });

  } catch (error) {
    console.error('Error fetching appointment:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Update appointment (reschedule, add notes, etc.)
const updateAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const { appointment_date, notes, status } = req.body;
    const userRole = req.user.role;
    const userId = req.user.user_id;

    const appointment = await Appointment.findOne({ appointment_id: appointmentId });

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    // Role-based access control
    const hasAccess = 
      userRole === 'Receptionist' ||
      (userRole === 'Patient' && appointment.patient_id === userId) ||
      (userRole === 'Doctor' && appointment.doctor_id === userId);

    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only update your own appointments.'
      });
    }

    // Role-based update restrictions
    const updateData = {};

    if (appointment_date) {
      // Check if new time slot is available
      const conflictingAppointment = await Appointment.findOne({
        doctor_id: appointment.doctor_id,
        appointment_date: parseInt(appointment_date),
        appointment_id: { $ne: appointmentId },
        status: { $ne: 'Cancelled' }
      });

      if (conflictingAppointment) {
        return res.status(409).json({
          success: false,
          message: 'Doctor is not available at this time slot'
        });
      }

      updateData.appointment_date = parseInt(appointment_date);
    }

    if (notes !== undefined) {
      updateData.notes = notes;
    }

    if (status && ['Scheduled', 'Completed', 'Cancelled'].includes(status)) {
      // Only doctors and receptionists can mark appointments as completed
      if (status === 'Completed' && !['Doctor', 'Receptionist'].includes(userRole)) {
        return res.status(403).json({
          success: false,
          message: 'Only doctors and receptionists can mark appointments as completed'
        });
      }
      updateData.status = status;
    }

    const updatedAppointment = await Appointment.findOneAndUpdate(
      { appointment_id: appointmentId },
      updateData,
      { new: true }
    ).populate('patient_id', 'name email contact_number')
     .populate('doctor_id', 'name profile.department profile.qualification');

    res.status(200).json({
      success: true,
      message: 'Appointment updated successfully',
      data: updatedAppointment
    });

  } catch (error) {
    console.error('Error updating appointment:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Delete/Cancel appointment
const deleteAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const userRole = req.user.role;
    const userId = req.user.user_id;

    const appointment = await Appointment.findOne({ appointment_id: appointmentId });

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    // Role-based access control
    const hasAccess = 
      userRole === 'Receptionist' ||
      (userRole === 'Patient' && appointment.patient_id === userId) ||
      (userRole === 'Doctor' && appointment.doctor_id === userId);

    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only delete your own appointments.'
      });
    }

    if (appointment.status === 'Completed') {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete a completed appointment'
      });
    }

    await Appointment.findOneAndDelete({ appointment_id: appointmentId });

    res.status(200).json({
      success: true,
      message: 'Appointment deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting appointment:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

module.exports = {
  checkAppointmentPermission,
  createAppointment,
  getAppointments,
  getAppointmentById,
  updateAppointment,
  deleteAppointment
};