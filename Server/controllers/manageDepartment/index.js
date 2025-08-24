const User = require("../../models/userTable");



//getallusers
const getUsers = async (req, res) => {
  try {
    const users = await User.find({}); // fetch all users
    
    res.status(200).json({
      message: "Users fetched successfully",
      users,
    });
  } catch (error) {
    console.error("Get Users Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// ✅ Update Department (Admin only)
// const updateDepartment = async (req, res) => {
//   try {
//     const { id } = req.body; // user ID whose department we want to update
//     const { department } = req.body;

//     // Check if requester is Admin
//     // if (req.user.role !== "Admin") {
//     //   return res.status(403).json({ message: "Access denied. Admins only." });
//     // }

//     const user = await User.findByIdAndUpdate(
//       id,
//       { "profile.department": department },
//       { new: true }
//     );

//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     res.status(200).json({
//       message: "Department updated successfully",
//       user,
//     });
//   } catch (error) {
//     console.error("Update Department Error:", error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };

const updateDepartment = async (req, res) => {
  try {
    const { updates } = req.body; // expecting an array of { id, department }

    if (!Array.isArray(updates) || updates.length === 0) {
      return res.status(400).json({ message: "No updates provided" });
    }

    // Run updates in parallel
    const results = await Promise.all(
      updates.map(async ({ id, department }) => {
        try {
          const user = await User.findOneAndUpdate(
            { user_id: id }, // match by user_id, not _id
            { "profile.department": department },
            { new: true }
          );

          if (!user) {
            return { id, status: "failed", reason: "User not found" };
          }

          return { id, status: "success", user };
        } catch (err) {
          return { id, status: "failed", reason: err.message };
        }
      })
    );

    res.status(200).json({
      message: "Department updates processed",
      results,
    });
  } catch (error) {
    console.error("Bulk Update Department Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


// const updateDepartment = async (req, res) => {
//   try {
//     const { id, department, role } = req.body; // taking role from body (not secure, only for testing)

//     // 🔐 Check role from request body
//     // if (role !== "Admin") {
//     //   return res.status(403).json({ message: "Access denied. Only Admins can update departments." });
//     // }

//     // 🔄 Update user department
//     const user = await User.findByIdAndUpdate(
//       id,
//       { "profile.department": department },
//       { new: true }
//     );

//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     res.status(200).json({
//       message: "Department updated successfully",
//       user,
//     });
//   } catch (error) {
//     console.error("Update Department Error:", error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };

module.exports = { updateDepartment };



// ✅ Get Department
const getDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select("name role profile.department");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Department fetched successfully",
      department: user.profile.department,
    });
  } catch (error) {
    console.error("Get Department Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// ✅ Delete Department (set it null) — Admin only
const deleteDepartment = async (req, res) => {
  try {
    const { id } = req.params;

    if (req.user.role !== "Admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    const user = await User.findByIdAndUpdate(
      id,
      { "profile.department": null },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Department deleted successfully",
      user,
    });
  } catch (error) {
    console.error("Delete Department Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};




module.exports = {
  getUsers,
  updateDepartment,
  getDepartment,
  deleteDepartment
};
