const express = require("express");
const router = express.Router();
const { getUsers,
    updateDepartment,
  getDepartment,
  deleteDepartment
} = require("../../controllers/manageDepartment/index");


//get all users
router.get("/getUsers",getUsers);

// Get department for user
router.get("/:id/department", getDepartment);

// Update department (Admin only)
router.put("/department", updateDepartment);

// Delete department (Admin only)
router.delete("/:id/department", deleteDepartment);



module.exports = router;


