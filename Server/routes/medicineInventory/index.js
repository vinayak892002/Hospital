const express = require("express");
const router = express.Router();
const { getMedicines, addMedicine, updateMedicine, deleteMedicine } = require("../../controllers/medicineInventory");

router.get("/inventory/get-all", getMedicines);
router.post("/inventory/add-one", addMedicine);
router.patch("/inventory/update-by-id/:id", updateMedicine);
router.delete("/inventory/delete-by-id/:medicineId", deleteMedicine);

module.exports = router;