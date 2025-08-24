const User = require("../../models/userTable");

const getDoctors = async (req, res) => {
  try {
    const doctors = await User.find(
      { role: "Doctor" },
      {
        name: 1,
        status: 1,
        contact_number: 1,
        "profile.department": 1,
        "profile.qualification": 1,
        "profile.availability": 1,
      }
    ).lean();
    console.log(doctors);

    res.status(200).json({
      message: "Doctors fetched successfully",
      doctors,
    });
  } catch (error) {
    console.error("Get Doctors Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const updateDoctor = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    console.log("=== UPDATE DOCTOR DEBUG ===");
    console.log("Doctor ID from params:", id);
    console.log("Update data:", JSON.stringify(updateData, null, 2));

    // Check if ID exists
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Doctor ID is required",
      });
    }

    // Validate required fields - REMOVED EMAIL REQUIREMENT
    if (!updateData.name) {
      return res.status(400).json({
        success: false,
        message: "Name is required",
      });
    }

    // Prepare update object - REMOVED EMAIL
    const updateObject = {
      name: updateData.name,
      contact_number: updateData.contact_number,
      status: updateData.status,
    };

    // Update profile fields if provided
    if (updateData.department) {
      updateObject["department"] = updateData.department;
    }
    if (updateData.qualification) {
      updateObject["qualification"] = updateData.qualification;
    }
    if (updateData.availability) {
      updateObject["availability"] = updateData.availability;
    }

    console.log("📝 Update object:", JSON.stringify(updateObject, null, 2));

    const queryCondition = {
      $and: [{ $or: [{ _id: id }, { user_id: id }] }, { role: "Doctor" }],
    };

    // First, check if the doctor exists
    const doctorExists = await User.findOne(queryCondition);
    
    if (!doctorExists) {
      console.log("❌ Doctor not found with ID:", id);
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    // Proceed with update
    const updatedDoctor = await User.findOneAndUpdate(
      queryCondition,
      { $set: updateObject },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedDoctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    console.log("✅ Doctor updated successfully");
    res.status(200).json({
      success: true,
      message: "Doctor updated successfully",
      data: updatedDoctor,
    });
  } catch (error) {
    console.error("❌ Error updating doctor:", error);
    res.status(500).json({
      success: false,
      message: "Error updating doctor",
      error: error.message,
    });
  }
};

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