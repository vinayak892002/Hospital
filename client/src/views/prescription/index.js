import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Prescription = () => {
  const [diagnosis, setDiagnosis] = useState("");
  const [medicines, setMedicines] = useState([{ name: "", dosage: "" }]);
  const [isEditing, setIsEditing] = useState(false);
  const [role, setRole] = useState("");

  const location = useLocation();
  const navigate = useNavigate();

  const { appointmentId, doctorId } = location.state || {};

  useEffect(() => {
    // ✅ Get user role from localStorage
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (userInfo?.role) {
      setRole(userInfo.role);
    }

    const fetchPrescription = async () => {
      try {
        const res = await fetch(
          `http://localhost:1333/citius/prescriptions/${appointmentId}`
        );
        if (!res.ok) throw new Error("No prescription found");
        const data = await res.json();

        if (data) {
          setDiagnosis(data.diagnosis);
          setMedicines(data.medicines || []);
          setIsEditing(true);
        }
      } catch (err) {
        console.warn("Prescription not found:", err.message);
        setIsEditing(false);
      }
    };

    if (appointmentId) {
      fetchPrescription();
    }
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
    try {
      const res = await fetch("http://localhost:1333/citius/prescriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          appointment_id: appointmentId,
          diagnosis,
          medicines,
          created_by: doctorId,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        alert(isEditing ? "Prescription updated!" : "Prescription created!");
        navigate("/doctor/appointment");
      } else {
        alert(data.message || "Failed to save prescription");
      }
    } catch (err) {
      console.error("Error saving prescription:", err);
      alert("Network error while saving prescription");
    }
  };

  return (
    <>
      <Logout />
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
            disabled={role === "Patient"} // ✅ Patient can't edit
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
              onChange={(e) =>
                handleMedicineChange(idx, "name", e.target.value)
              }
              disabled={role === "Patient"} // ✅ Patient can't edit
            />
            <input
              type="text"
              className="form-control"
              placeholder="Dosage (e.g. '1-0-1')"
              value={med.dosage}
              onChange={(e) =>
                handleMedicineChange(idx, "dosage", e.target.value)
              }
              disabled={role === "Patient"} // ✅ Patient can't edit
            />
          </div>
        ))}

        {role !== "Patient" && ( // ✅ Only Doctor/Admin can add medicines
          <button
            className="btn btn-secondary btn-sm mb-3"
            onClick={addMedicineField}
          >
            + Add Medicine
          </button>
        )}

        <div className="d-flex gap-2">
          {role !== "Patient" && ( // ✅ Hide save/update for Patient
            <button className="btn btn-primary" onClick={savePrescription}>
              {isEditing ? "Update" : "Save"}
            </button>
          )}
          <button
            className="btn btn-outline-secondary"
            onClick={() => navigate("/doctor/appointment")}
          >
            Back
          </button>
        </div>
      </div>
    </>
  );
};

export default Prescription;
