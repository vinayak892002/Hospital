import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import {
  Edit2,
  Save,
  X,
  Trash2,
  RefreshCw,
  AlertCircle,
  Users,
} from "lucide-react";
import {
  Form,
  InputGroup,
  Button,
  Spinner,
  Alert,
  Row,
  Col,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";

const DoctorManagement = () => {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [searchFilter, setSearchFilter] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Fetch doctors
  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:1333/citius/getdoctors");
      const data = await response.json();
      if (response.ok) {
        setDoctors(data.doctors);
        setFilteredDoctors(data.doctors);
      } else {
        setError(data.message || `Failed: ${response.status}`);
      }
    } catch (err) {
      console.error(err);
      setError("Network error: Unable to fetch doctors");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  // Filtering
  useEffect(() => {
    let filtered = doctors;
    if (searchFilter.trim()) {
      filtered = filtered.filter((d) =>
        d.name?.toLowerCase().includes(searchFilter.toLowerCase())
      );
    }
    if (departmentFilter.trim()) {
      filtered = filtered.filter((d) =>
        d.department?.toLowerCase().includes(departmentFilter.toLowerCase())
      );
    }
    if (statusFilter !== "all") {
      filtered = filtered.filter((d) =>
        statusFilter === "active" ? d.status : !d.status
      );
    }
    setFilteredDoctors(filtered);
  }, [searchFilter, departmentFilter, statusFilter, doctors]);

  const handleEdit = (doctor) => {
    setEditingId(doctor._id);
    setEditData({
      name: doctor.name || "",
      contact_number: doctor.contact_number || "",
      department: doctor.department || "",
      qualification: doctor.qualification || "",
      status: doctor.status,
      availability: doctor.availability || "",
    });
    setError("");
    setSuccess("");
  };

  const handleSave = async (doctorId) => {
    try {
      const response = await fetch(`/api/doctor/update-doctor/${doctorId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editData),
      });
      const data = await response.json();
      if (data.success) {
        setSuccess("Doctor updated successfully");
        await fetchDoctors();
        setEditingId(null);
        setEditData({});
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError(data.message || "Failed to update doctor");
      }
    } catch (err) {
      console.error(err);
      setError("Network error: Unable to update doctor");
    }
  };

  const handleDelete = async (doctorId) => {
    if (window.confirm("Are you sure you want to delete this doctor?")) {
      try {
        const response = await fetch(`/api/doctor/delete-doctor/${doctorId}`, {
          method: "DELETE",
        });
        const data = await response.json();
        if (data.success) {
          setSuccess("Doctor deleted successfully");
          await fetchDoctors();
          setTimeout(() => setSuccess(""), 3000);
        } else {
          setError(data.message || "Failed to delete doctor");
        }
      } catch (err) {
        console.error(err);
        setError("Network error: Unable to delete doctor");
      }
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditData({});
    setError("");
  };

  const handleInputChange = (field, value) => {
    setEditData((prev) => ({ ...prev, [field]: value }));
  };

  const clearFilters = () => {
    setSearchFilter("");
    setDepartmentFilter("");
    setStatusFilter("all");
  };

  const columns = [
    {
      name: "Name",
      selector: (row) => row.name,
      cell: (row) =>
        editingId === row._id ? (
          <Form.Control
            value={editData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            placeholder="Name"
          />
        ) : (
          row.name
        ),
      sortable: true,
    },
    {
      name: "Contact",
      selector: (row) => row.contact_number,
      cell: (row) =>
        editingId === row._id ? (
          <Form.Control
            value={editData.contact_number}
            onChange={(e) =>
              handleInputChange("contact_number", e.target.value)
            }
          />
        ) : (
          row.contact_number || "N/A"
        ),
      sortable: true,
    },
    {
      name: "Department",
      selector: (row) => row.department,
      cell: (row) =>
        editingId === row._id ? (
          <Form.Control
            value={editData.department}
            onChange={(e) => handleInputChange("department", e.target.value)}
          />
        ) : (
          row.department || "Not assigned"
        ),
      sortable: true,
    },
    {
      name: "Qualification",
      selector: (row) => row.qualification,
      cell: (row) =>
        editingId === row._id ? (
          <Form.Control
            value={editData.qualification}
            onChange={(e) => handleInputChange("qualification", e.target.value)}
          />
        ) : (
          row.qualification || "Not specified"
        ),
    },
    {
      name: "Availability",
      selector: (row) => row.availability,
      cell: (row) => (
        <OverlayTrigger
          placement="top"
          overlay={
            <Tooltip>{row.availability || "No availability info"}</Tooltip>
          }
        >
          <span
            className="text-truncate d-inline-block"
            style={{ maxWidth: "150px", cursor: "pointer" }}
          >
            {row.availability || "N/A"}
          </span>
        </OverlayTrigger>
      ),
    },
    {
      name: "Status",
      selector: (row) => row.status,
      cell: (row) =>
        editingId === row._id ? (
          <Form.Select
            value={editData.status.toString()}
            onChange={(e) =>
              handleInputChange("status", e.target.value === "true")
            }
          >
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </Form.Select>
        ) : (
          <span className={`badge ${row.status ? "bg-success" : "bg-danger"}`}>
            {row.status ? "Active" : "Inactive"}
          </span>
        ),
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row) =>
        editingId === row._id ? (
          <div className="d-flex gap-2">
            <Button
              size="sm"
              variant="success"
              onClick={() => handleSave(row._id)}
            >
              <Save size={12} /> Save
            </Button>
            <Button size="sm" variant="secondary" onClick={handleCancel}>
              <X size={12} /> Cancel
            </Button>
          </div>
        ) : (
          <div className="d-flex gap-2">
            <Button size="sm" variant="primary" onClick={() => handleEdit(row)}>
              <Edit2 size={12} /> Edit
            </Button>
            <Button
              size="sm"
              variant="danger"
              onClick={() => handleDelete(row._id)}
            >
              <Trash2 size={12} /> Delete
            </Button>
          </div>
        ),
    },
  ];

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 flex-column">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading doctors...</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="d-flex align-items-center mb-3">
        <Users size={32} className="text-primary me-3" />
        <div>
          <h3>Doctor Management</h3>
          <p className="text-muted mb-0">Manage healthcare professionals</p>
        </div>
        <Button
          variant="outline-primary"
          className="ms-auto"
          onClick={fetchDoctors}
        >
          <RefreshCw size={16} /> Refresh
        </Button>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      <Row className="mb-3">
        <Col md={3}>
          <InputGroup>
            <Form.Control
              placeholder="Search name"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
            />
          </InputGroup>
        </Col>
        <Col md={3}>
          <InputGroup>
            <Form.Control
              placeholder="Department"
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
            />
          </InputGroup>
        </Col>
        <Col md={3}>
          <Form.Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </Form.Select>
        </Col>
        <Col md={3}>
          <Button variant="secondary" className="w-100" onClick={clearFilters}>
            Clear Filters
          </Button>
        </Col>
      </Row>

      <DataTable
        columns={columns}
        data={filteredDoctors}
        pagination
        highlightOnHover
        striped
        responsive
        persistTableHead
        noHeader
      />

      {filteredDoctors.length === 0 && (
        <div className="text-center mt-5">
          <Users size={48} className="text-muted mb-2" />
          <h5>No doctors found</h5>
        </div>
      )}
    </div>
  );
};

export default DoctorManagement;
