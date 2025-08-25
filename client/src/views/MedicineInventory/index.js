import { useEffect, useState } from "react";
import "./index.css";
import { useNavigate } from "react-router-dom";
import Logout from "../logout";
{
  /* const medicineSchema = new mongoose.Schema({
  medicine_id: { type: String, default: null },
  name: { type: String, required: true },
  stock: { type: Number, default: 0 },
  expiry_date: { type: Number },
  unit_price: { type: Number, default: 0 },
}); */
}

const index = () => {
  const [filteredMedicines, setFilteredMedicines] = useState([]); // Stores filtered medicines based on search
  const [searchTerm, setSearchTerm] = useState(""); // Stores the search input value
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const dataTemplate = {
    medicine_id: "",
    name: "",
    stock: "",
    expiry_date: "",
    unit_price: "",
  };
  const [inputData, setInputData] = useState(dataTemplate);
  const [medicines, setMedicines] = useState([]);

  const handleInputChange = (key, value) => {
    setInputData({
      ...inputData,
      [key]: value,
    });
  };
  useEffect(() => {
    const hmsToken = localStorage.getItem("hmsToken");
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));

    if (userInfo.role !== "Doctor") {
      navigate("/login");
    }
  }, []);

  const handleSubmit = async () => {
    console.log(inputData);
    setIsOpen(false);

    if (!inputData.medicine_id || inputData.medicine_id.trim() === "") {
      alert("Medicine ID is required");
      return;
    }
    if (!inputData.name || inputData.name.trim() === "") {
      alert("Medicine name is required");
      return;
    }

    if (inputData.stock < 0) {
      alert("Stock must be a valid non-negative number");
      return;
    }
    if (inputData.unit_price < 0) {
      alert("Price must be a valid non-negative number");
      return;
    }
    if (inputData.expiry_date == "") {
      alert("Date cannot be empty");
      return;
    }
    const today = new Date();
    const enteredDate = new Date(inputData.expiry_date);

    // reset time so only date comparison works
    today.setHours(0, 0, 0, 0);
    enteredDate.setHours(0, 0, 0, 0);
    if (enteredDate < today) {
      alert("Expiry Date cannot be earlier than today's date");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:1333/citius/inventory/add-one",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(inputData),
        }
      );

      const data = await response.json();
      console.log("Server Response:", data);

      if (response.ok) {
        alert("Medicine added successfully!");
        setMedicines((prev) => [...prev, inputData]); /// inputData==> data karaych ahe
      } else {
        alert("Error: " + data.error);
      }
    } catch (error) {
      console.error("Fetch error:", err);
      alert("Something went wrong!");
    }
    setInputData(dataTemplate);
  };

  const fetchMedicines = async () => {
    try {
      const response = await fetch(
        "http://localhost:1333/citius/inventory/get-all"
      );
      const data = await response.json();
      setMedicines(data);
      setFilteredMedicines(data);
    } catch (error) {
      console.error("Error fetching medicines:", error);
    }
  };

  const handleDelete = async (medicineId) => {
    try {
      const response = await fetch(
        `http://localhost:1333/citius/inventory/delete-by-id/${medicineId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete medicine");
      }

      const data = await response.json();
      setMedicines((prev) => prev.filter((med) => med._id !== medicineId));
      alert("deleted the messasge");
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchMedicines();
  }, []);

  useEffect(() => {
    const lowerSearch = searchTerm.toLowerCase(); // Make search case-insensitive

    const filtered = medicines.filter(
      (med) =>
        med.name.toLowerCase().includes(lowerSearch) || // Match by name
        med.medicine_id?.toLowerCase().includes(lowerSearch) // Match by ID
    );

    setFilteredMedicines(filtered); // Update filtered list
  }, [searchTerm, medicines]);

  const [isUpdate, setIsUpdate] = useState(false);

  const handleUpdate = (med) => {
    setIsUpdate(true);
    setInputData(med);
  };

  const onUpdate = async () => {
    console.log(inputData);
    setIsUpdate(false);

    try {
      const response = await fetch(
        `http://localhost:1333/citius/inventory/update-by-id/${inputData._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(inputData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update medicine");
      }

      const data = await response.json();
      console.log("Medicine updated:", data);
      setMedicines((prev) =>
        prev.map((med) => (med.medicine_id === data.medicine_id ? data : med))
      );

      setFilteredMedicines((prev) =>
        prev.map((med) => (med.medicine_id === data.medicine_id ? data : med))
      );
      setInputData(dataTemplate);
      return data;
    } catch (error) {
      console.error("Error updating medicine:", error);
    }
  };

  return (
    <>
      <Logout />
      <div className="prashilOuterContainer">
        <div className="prashilinnerContainer">
          <div className="prashilSearchContainer">
            <input
              className="prashilSearchBoxInput"
              type="text"
              placeholder="Search Medicine by Name, Id, Category.."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              className="prashilAddButton"
              onClick={() => setIsOpen(true)}
            >
              Add Medicine
            </button>
          </div>
          {isOpen && (
            <div className="prashilAddModalDiv">
              <div className="prashilAddModalHeader">Add Medicine Details</div>
              <div className="prashilAddModalForm">
                <label>Medicine Id</label>
                <input
                  type="text"
                  placeholder="Enter Medicine Id"
                  onChange={(e) =>
                    handleInputChange("medicine_id", e.target.value)
                  }
                />
                <label>Medicine Name</label>
                <input
                  type="text"
                  placeholder="Enter Medicine Name"
                  onChange={(e) => handleInputChange("name", e.target.value)}
                />
                <label>Quantity</label>
                <input
                  type="number"
                  placeholder="Enter Number of Items"
                  onChange={(e) => handleInputChange("stock", e.target.value)}
                />
                <label>Price</label>
                <input
                  type="number"
                  placeholder="Enter Price/Unit"
                  onChange={(e) =>
                    handleInputChange("unit_price", e.target.value)
                  }
                />
                <label>Expiry Date</label>
                <input
                  type="date"
                  placeholder="Enter Expiry Date"
                  onChange={(e) =>
                    handleInputChange("expiry_date", e.target.value)
                  }
                />
              </div>
              <div className="prashilAddModalButtonDiv">
                <button
                  onClick={() => setIsOpen(false)}
                  className="prashilAddModalButton prashilBlue"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleSubmit()}
                  className="prashilAddModalButton"
                >
                  Add
                </button>
              </div>
            </div>
          )}
          {isUpdate && (
            <div className="prashilAddModalDiv ">
              <div className="prashilAddModalHeader prashilYellow">
                Update Medicine Details
              </div>
              <div className="prashilAddModalForm">
                <label>Medicine Id</label>
                <input
                  type="text"
                  placeholder="Enter Medicine Id"
                  value={inputData.medicine_id}
                  onChange={(e) =>
                    handleInputChange("medicine_id", e.target.value)
                  }
                />
                <label>Medicine Name</label>
                <input
                  type="text"
                  placeholder="Enter Medicine Name"
                  value={inputData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                />
                <label>Quantity</label>
                <input
                  type="number"
                  placeholder="Enter Number of Items"
                  value={inputData.stock}
                  onChange={(e) => handleInputChange("stock", e.target.value)}
                />
                <label>Price</label>
                <input
                  type="number"
                  placeholder="Enter Price/Unit"
                  value={inputData.unit_price}
                  onChange={(e) =>
                    handleInputChange("unit_price", e.target.value)
                  }
                />
                <label>Expiry Date</label>
                <input
                  type="date"
                  placeholder="Enter Expiry Date"
                  value={inputData.expiry_date}
                  onChange={(e) =>
                    handleInputChange("expiry_date", e.target.value)
                  }
                />
              </div>
              <div className="prashilAddModalButtonDiv">
                <button
                  onClick={() => setIsUpdate(false)}
                  className="prashilAddModalButton prashilBlue"
                >
                  Cancel
                </button>
                <button
                  onClick={() => onUpdate()}
                  className="prashilAddModalButton prashilYellow"
                >
                  Update
                </button>
              </div>
            </div>
          )}
          <div className="prashilResultTable">
            {/* <ul>
            {filteredMedicines.map((med) => (
              <li key={med._id}>
                {med.name}, {med.medicine_id} — Stock: {med.stock}, Price: ₹{med.unit_price}, expiry: {med.expiry_date}
                <button onClick={() => handleDelete(med._id)}>Delete</button>
              </li>
            ))}
          </ul> */}
            <table
              border="1"
              style={{
                width: "100%",
                borderCollapse: "collapse",
                border: "none",
              }}
            >
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Medicine ID</th>
                  <th>Stock</th>
                  <th>Price (₹)</th>
                  <th>Expiry Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredMedicines.map((med) => (
                  <tr key={med._id}>
                    <td>{med.name}</td>
                    <td>{med.medicine_id}</td>
                    <td>{med.stock}</td>
                    <td>{med.unit_price}</td>
                    <td>{med.expiry_date}</td>
                    <td className="prashilButtonDIv">
                      <button
                        onClick={() => handleUpdate(med)}
                        className="prashilYellow prashilBTN"
                      >
                        Update
                      </button>
                      <button
                        onClick={() => handleDelete(med._id)}
                        className="prashilRed prashilBTN"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default index;
