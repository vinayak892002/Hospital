const User = require("../../models/userTable");

// Get all doctors - simple fetch without filtering

// const getDoctors = async (req, res) => {
//   try {
//     const doctors = await User.find({ role: "Doctor" })
//       .select("-password") // Exclude password from response
//       .sort({ created_at: -1 });

//     res.status(200).json({
//       success: true,
//       data: doctors,
//       count: doctors.length
//     });
//   } catch (error) {
//     console.error("Error fetching doctors:", error);
//     res.status(500).json({
//       success: false,
//       message: "Error fetching doctors",
//       error: error.message
//     });
//   }
// };

const getDoctors = async (req, res) => {
  try {
    const doctors = await User.find(
      { role: "Doctor" },
      {
        role: 1,
        name: 1,
        status: 1,
        contact_number: 1,
        department: 1,
        qualification: 1,
        availability: 1,
      }
    ).lean();

    res.status(200).json({
      message: "Doctors fetched successfully",
      doctors,
    });
  } catch (error) {
    console.error("Get Doctors Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Update doctor information
const updateDoctor = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Validate required fields
    if (!updateData.name || !updateData.email) {
      return res.status(400).json({
        success: false,
        message: "Name and email are required",
      });
    }

    // Check if email is already taken by another user
    const existingUser = await User.findOne({
      email: updateData.email,
      _id: { $ne: id },
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email is already registered with another account",
      });
    }

    // Prepare update object
    const updateObject = {
      name: updateData.name,
      email: updateData.email,
      contact_number: updateData.contact_number,
      status: updateData.status,
    };

    // Update profile fields if provided
    if (updateData.department) {
      updateObject["profile.department"] = updateData.department;
    }
    if (updateData.qualification) {
      updateObject["profile.qualification"] = updateData.qualification;
    }

    const updatedDoctor = await User.findOneAndUpdate(
      {
        $and: [{ $or: [{ _id: id }, { user_id: id }] }, { role: "Doctor" }],
      },
      { $set: updateObject },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedDoctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Doctor updated successfully",
      data: updatedDoctor,
    });
  } catch (error) {
    console.error("Error updating doctor:", error);
    res.status(500).json({
      success: false,
      message: "Error updating doctor",
      error: error.message,
    });
  }
};

// Delete doctor (soft delete by setting status to false)
const deleteDoctor = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedDoctor = await User.findOneAndUpdate(
      {
        $and: [{ $or: [{ _id: id }, { user_id: id }] }, { role: "Doctor" }],
      },
      { $set: { status: false } }, // Soft delete
      { new: true }
    ).select("-password");

    if (!deletedDoctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Doctor deleted successfully",
      data: deletedDoctor,
    });
  } catch (error) {
    console.error("Error deleting doctor:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting doctor",
      error: error.message,
    });
  }
};

module.exports = {
  getDoctors,
  updateDoctor,
  deleteDoctor,
};
