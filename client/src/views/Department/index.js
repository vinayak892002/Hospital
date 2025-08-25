import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import Logout from "../logout";

const Department = () => {
  const [users, setUsers] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]); // store selected users
  const [bulkDepartment, setBulkDepartment] = useState(""); // new department to set

  // Fetch all users
  useEffect(() => {
    fetch("http://localhost:1333/citius/getUsers")
      .then((res) => res.json())
      .then((data) => {
        // Filter only doctors
        const doctors = data.users.filter((u) => u.role === "Doctor");
        setUsers(doctors);
      })
      .catch((err) => console.error("Error fetching users:", err));
  }, []);

  // Update department for selected users
  const updateSelectedDepartments = () => {
    if (selectedRows.length === 0) {
      alert("Please select at least one user.");
      return;
    }
    if (!bulkDepartment.trim()) {
      alert("Please enter a department name.");
      return;
    }

    const updates = selectedRows.map((row) => ({
      id: row.user_id,
      department: bulkDepartment,
    }));

    console.log(JSON.stringify({ updates }));

    fetch("http://localhost:1333/citius/department", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ updates: updates }),
    })
      .then((res) => res.json())
      .then((data) => {
        alert(data.message || "Departments updated successfully");

        // Refresh users
        fetch("http://localhost:1333/citius/getUsers")
          .then((res) => res.json())
          .then((data) => {
            const doctors = data.users.filter((u) => u.role === "Doctor");
            setUsers(doctors);
          });

        setSelectedRows([]);
        setBulkDepartment("");
      })
      .catch((err) => console.error("Error updating departments:", err));
  };

  // Table columns
  const columns = [
    {
      name: "Name",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "Email",
      selector: (row) => row.email,
    },
    {
      name: "Department",
      selector: (row) => row.profile?.department || "Not Assigned",
    },
  ];

  return (
    <>
      <Logout />
      <div style={{ padding: "20px", fontFamily: "Arial" }}>
        <h2 style={{ textAlign: "center", color: "#333" }}>
          Manage Doctor Departments
        </h2>

        <DataTable
          columns={columns}
          data={users}
          selectableRows
          onSelectedRowsChange={({ selectedRows }) =>
            setSelectedRows(selectedRows)
          }
          highlightOnHover
          pagination
          striped
        />

        {selectedRows.length > 0 && (
          <div style={{ marginTop: "20px", textAlign: "center" }}>
            <input
              type="text"
              value={bulkDepartment}
              onChange={(e) => setBulkDepartment(e.target.value)}
              placeholder="Enter new department"
              style={{
                padding: "8px",
                width: "250px",
                marginRight: "10px",
                borderRadius: "5px",
                border: "1px solid #ccc",
              }}
            />
            <button
              onClick={updateSelectedDepartments}
              style={{
                padding: "10px 20px",
                background: "green",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Update Selected
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default Department;

// import React, { useEffect, useState } from "react";

// const Department = () => {
//   const [users, setUsers] = useState([]);
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [newDepartment, setNewDepartment] = useState("");

//   // Fetch all users
//   useEffect(() => {
//     fetch("http://localhost:1333/citius/getUsers")
//       .then((res) => res.json())
//       .then((data) => setUsers(data.users))
//       .catch((err) => console.error("Error fetching users:", err));
//   }, []);

//   // Fetch department of a specific user
//   const fetchDepartment = (id) => {
//     fetch(`http://localhost:1333/citius/${id}/department`)
//       .then((res) => res.json())
//       .then((data) => {
//         setSelectedUser({ id, department: data.department });
//         setNewDepartment(data.department || "");
//       })
//       .catch((err) => console.error("Error fetching department:", err));
//   };

//   // Update department for a user
// const updateDepartment = (e) => {
//   e.preventDefault();

//   fetch("http://localhost:1333/citius/department", {
//     method: "PUT",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({
//       id: selectedUser.id,
//       department: newDepartment,
//       role: selectedUser.role  //'Admin'
//     }),
//   })
//     .then((res) => res.json())
//     .then((data) => {
//       alert(data.message);
//       setSelectedUser(null); // close modal
//       // refresh users list
//       fetch("http://localhost:1333/citius/getUsers")
//         .then((res) => res.json())
//         .then((data) => setUsers(data.users));
//     })
//     .catch((err) => console.error("Error updating department:", err));
// };

//   return (
//     <div style={{ padding: "20px", fontFamily: "Arial" }}>
//       <h2 style={{ textAlign: "center", color: "#333" }}>Manage Departments</h2>

//       {/* Users list */}
//       {users.map((user) => (
//         <div
//           key={user._id}
//           style={{
//             border: "1px solid #ccc",
//             borderRadius: "10px",
//             padding: "15px",
//             marginBottom: "15px",
//             backgroundColor: "#f9f9f9",
//           }}
//         >
//           <h3 style={{ margin: "0 0 10px 0", color: "#007bff" }}>
//             {user.name} ({user.role})
//           </h3>
//           <p style={{ margin: "5px 0" }}>
//             <strong>Email:</strong> {user.email}
//           </p>
//           <p style={{ margin: "5px 0" }}>
//             <strong>Role:</strong> {user.role}
//           </p>
//           <p style={{ margin: "5px 0" }}>
//             <strong>Department:</strong>{" "}
//             {user.profile?.department || "Not Assigned"}
//           </p>

//           <button
//             onClick={() => fetchDepartment(user._id)}
//             style={{
//               padding: "8px 12px",
//               background: "#007bff",
//               color: "white",
//               border: "none",
//               borderRadius: "5px",
//               cursor: "pointer",
//             }}
//           >
//             Edit Department
//           </button>
//         </div>
//       ))}

//       {/* Popup Modal */}
//       {selectedUser && (
//         <div
//           style={{
//             position: "fixed",
//             top: "0",
//             left: "0",
//             width: "100%",
//             height: "100%",
//             background: "rgba(0,0,0,0.5)",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//           }}
//         >
//           <div
//             style={{
//               background: "#fff",
//               padding: "20px",
//               borderRadius: "10px",
//               width: "400px",
//               boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
//             }}
//           >
//             <h3 style={{ marginBottom: "15px" }}>
//               Edit Department for User
//             </h3>
//             <form onSubmit={updateDepartment}>
//               <input
//                 type="text"
//                 value={newDepartment}
//                 onChange={(e) => setNewDepartment(e.target.value)}
//                 placeholder="Enter new department"
//                 style={{
//                   padding: "8px",
//                   width: "100%",
//                   marginBottom: "15px",
//                   borderRadius: "5px",
//                   border: "1px solid #ccc",
//                 }}
//               />
//               <div style={{ textAlign: "right" }}>
//                 <button
//                   type="button"
//                   onClick={() => setSelectedUser(null)}
//                   style={{
//                     padding: "8px 15px",
//                     marginRight: "10px",
//                     background: "#ccc",
//                     color: "#000",
//                     border: "none",
//                     borderRadius: "5px",
//                     cursor: "pointer",
//                   }}
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   style={{
//                     padding: "8px 15px",
//                     background: "green",
//                     color: "white",
//                     border: "none",
//                     borderRadius: "5px",
//                     cursor: "pointer",
//                   }}
//                 >
//                   Save
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Department;
