const express = require('express');
const router = express.Router();
const { getBilling,createBilling, updateBilling, deleteBilling} = require("../../controllers/analytics");

// GET /citius/billing
router.get('/billings', getBilling);
router.post('/billings',createBilling);
router.put("/billings/:id", updateBilling);
router.delete("/billings/:id", deleteBilling);

module.exports = router;