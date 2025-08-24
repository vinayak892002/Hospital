const Billing = require("../../models/billingTable");
// GET all billing records
const getBilling = async (req, res) => {
    try {
        const bills = await Billing.find({})
            .select("-__v") // Exclude any internal mongoose version field
            .lean();

        res.status(200).json({
            message: "Billing records fetched successfully",
            billing: bills,
        });
    } catch (error) {
        console.error("Get Billing Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

const createBilling = async (req, res) => {
    try {
        const {
            bill_id,
            patient_id,
            appointment_id,
            doctor_id,
            services,
            total_amount,
            payment_status,
            payment_mode,
            created_at,
            hospital_id,
            department_id,
            partial_paid_amount,
        } = req.body;

        // Optionally validate required fields here
        if (
            !bill_id ||
            !patient_id ||
            !total_amount ||
            !payment_status ||
            !payment_mode
        ) {
            return res.status(400).json({
                message:
                    "bill_id, patient_id, total_amount, payment_status, payment_mode are required",
            });
        }

        const newBilling = new Billing({
            bill_id,
            patient_id,
            appointment_id,
            doctor_id,
            services,
            total_amount,
            payment_status,
            payment_mode,
            created_at: created_at ? new Date(created_at) : undefined,
            hospital_id,
            department_id,
            partial_paid_amount,
        });

        await newBilling.save();

        res.status(201).json({
            message: "Billing record created successfully",
            billing: newBilling,
        });
    } catch (error) {
        console.error("Create Billing Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// UPDATE billing record by ID
const updateBilling = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        // Basic validation if needed
        if (!updateData.payment_status || !updateData.payment_mode) {
            return res.status(400).json({
                success: false,
                message: "payment_status and payment_mode are required",
            });
        }

        // Update record
        const updatedBill = await Billing.findOneAndUpdate(
            { $or: [{ _id: id }, { bill_id: id }] },
            { $set: updateData },
            { new: true, runValidators: true }
        ).lean();

        if (!updatedBill) {
            return res.status(404).json({
                success: false,
                message: "Billing record not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Billing record updated successfully",
            data: updatedBill,
        });
    } catch (error) {
        console.error("Error updating billing:", error);
        res.status(500).json({
            success: false,
            message: "Error updating billing",
            error: error.message,
        });
    }
};

// SOFT DELETE billing record by ID (e.g., mark payment_status as 'Cancelled' or add a 'deleted' flag)
const deleteBilling = async (req, res) => {
    try {
        const { id } = req.params;

        // Here, using payment_status: 'Cancelled' as soft delete flag
        const deletedBill = await Billing.findOneAndUpdate(
            { $or: [{ _id: id }, { bill_id: id }] },
            { $set: { payment_status: "Cancelled" } },
            { new: true }
        ).lean();

        if (!deletedBill) {
            return res.status(404).json({
                success: false,
                message: "Billing record not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Billing record cancelled (soft deleted) successfully",
            data: deletedBill,
        });
    } catch (error) {
        console.error("Error deleting billing:", error);
        res.status(500).json({
            success: false,
            message: "Error deleting billing",
            error: error.message,
        });
    }
}

module.exports = {
    // Billing
    getBilling,
    createBilling,
    updateBilling,
    deleteBilling
}