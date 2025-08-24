import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useState } from "react";

const Prescription = ({ appointmentId, doctorId }) => {
  const [diagnosis, setDiagnosis] = useState("");
  const [medicines, setMedicines] = useState([{ name: "", dosage: "" }]);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    // fetch prescription if exists
    axios
      .get(`http://localhost:1333/api/prescriptions/${appointmentId}`)
      .then((res) => {
        if (res.data) {
          setDiagnosis(res.data.diagnosis);
          setMedicines(res.data.medicines);
          setIsEditing(true);
        }
      })
      .catch(() => setIsEditing(false));
  }, [appointmentId]);

  const handleMedicineChange = (index, field, value) => {
    const updated = [...medicines];
    updated[index][field] = value;
    setMedicines(updated);
  };

  const addMedicineField = () => {
    setMedicines([...medicines, { name: "", dosage: "" }]);
  };

  const savePrescription = async () => {
    await axios.post("http://localhost:1333/api/prescriptions", {
      appointment_id: appointmentId,
      diagnosis,
      medicines,
      created_by: doctorId,
    });
    alert(isEditing ? "Prescription updated!" : "Prescription created!");
  };

  return (
    <div className="card p-3 shadow-sm">
      <h5 className="card-title">
        {isEditing ? "Edit Prescription" : "New Prescription"}
      </h5>

      <div className="mb-3">
        <label className="form-label">Diagnosis</label>
        <textarea
          className="form-control"
          value={diagnosis}
          onChange={(e) => setDiagnosis(e.target.value)}
        />
      </div>

      <h6>Medicines</h6>
      {medicines.map((med, idx) => (
        <div key={idx} className="d-flex gap-2 mb-2">
          <input
            type="text"
            className="form-control"
            placeholder="Medicine name"
            value={med.name}
            onChange={(e) => handleMedicineChange(idx, "name", e.target.value)}
          />
          <input
            type="text"
            className="form-control"
            placeholder="Dosage (e.g. '1-0-1')"
            value={med.dosage}
            onChange={(e) =>
              handleMedicineChange(idx, "dosage", e.target.value)
            }
          />
        </div>
      ))}
      <button className="btn btn-secondary btn-sm mb-3" onClick={addMedicineField}>
        + Add Medicine
      </button>

      <div>
        <button className="btn btn-primary" onClick={savePrescription}>
          {isEditing ? "Update" : "Save"}
        </button>
      </div>
    </div>
  );
};

export default Prescription;
