const Medicine = require("../../models/medicenesTable");

const addMedicine = async (req, res) => {
  try {
    const { medicine_id, name, stock, expiry_date, unit_price } = req.body;

    const newMedicine = new Medicine({
      medicine_id,
      name,
      stock,
      expiry_date,
      unit_price,
    });

    const savedMedicine = await newMedicine.save();
    res.status(201).json(savedMedicine);
  } catch (error) {
    res.status(500).json({ message: "Error adding medicine", error });
  }
};

const getMedicines = async (req, res) => {
  try {
    const medicines = await Medicine.find();
    res.status(200).json(medicines);
  } catch (error) {
    res.status(500).json({ message: "Error fetching medicines", error });
  }
};

const updateMedicine = async (req, res) => {
  try {
    const { id } = req.params; // <-- MongoDB _id from URL

    // Update medicine by _id
    const updatedMedicine = await Medicine.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedMedicine) {
      return res.status(404).json({ message: "Medicine not found" });
    }

    res.status(200).json(updatedMedicine);
  } catch (error) {
    res.status(500).json({ message: "Error updating medicine", error });
  }



  // try {
  //   const { medicineId } = req.params;

  //   // findByIdAndUpdate -> updates document and returns updated one (if new: true)
  //   // const updatedMedicine = await Medicine.findOneAndUpdate(
  //   //   medicineId,
  //   //   req.body,
  //   //   { new: true, runValidators: true } // return updated doc, validate schema
  //   // );

  //   const updatedMedicine = await Medicine.findByIdAndUpdate(
  //     medicineId,
  //     req.body,
  //     { new: true, runValidators: true }
  //   );

  //   if (!updatedMedicine) {
  //     return res.status(404).json({ message: "Medicine not found" });
  //   }

  //   res.status(200).json(updatedMedicine);
  // } catch (error) {
  //   res.status(500).json({ message: "Error updating medicine", error });
  // }
};

const deleteMedicine = async (req, res) => {
  try {
    const { medicineId } = req.params;

    // const deletedMedicine = await Medicine.findOneAndDelete({ medicine_id: medicineId });
    const deletedMedicine = await Medicine.findByIdAndDelete(medicineId);

    if (!deletedMedicine) {
      return res.status(404).json({ message: "Medicine not found" });
    }

    res.status(200).json({ message: "Medicine deleted successfully", deletedMedicine });
  } catch (error) {
    res.status(500).json({ message: "Error deleting medicine", error });
  }
};


module.exports = {
  getMedicines,
  addMedicine,
  updateMedicine,
  deleteMedicine
};