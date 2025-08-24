const express = require("express");
const {
  upsertPrescription,
  getPrescriptionByAppointment,
  deletePrescription,
} = require("../controllers/prescriptionController");

const router = express.Router();

router.post("/prescriptions", upsertPrescription);
router.get("/prescriptions/:appointment_id", getPrescriptionByAppointment);
router.delete("/prescriptions/:prescription_id", deletePrescription);

module.exports = router;