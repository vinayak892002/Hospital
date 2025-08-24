import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import {
  Edit2,
  Save,
  X,
  Trash2,
  RefreshCw,
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
        console.log("Fetched doctors:", data.doctors); // Debug log
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

  // Fixed filtering to handle nested profile structure
  useEffect(() => {
    let filtered = doctors;
    
    if (searchFilter.trim()) {
      filtered = filtered.filter((d) =>
        d.name?.toLowerCase().includes(searchFilter.toLowerCase())
      );
    }
    
    if (departmentFilter.trim()) {
      filtered = filtered.filter((d) =>
        d.profile?.department?.toLowerCase().includes(departmentFilter.toLowerCase())
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
      department: doctor.profile?.department || "",
      qualification: doctor.profile?.qualification || "",
      status: doctor.status,
    });
    setError("");
    setSuccess("");
  };

  const handleSave = async (doctorId) => {
    try {
      // Prepare the update payload to match backend expectations
      const updatePayload = {
        name: editData.name,
        contact_number: editData.contact_number,
        department: editData.department,
        qualification: editData.qualification,
        status: editData.status,
      };

      console.log("Sending update payload:", updatePayload); // Debug log

      const response = await fetch(`http://localhost:1333/citius/update-doctor/${doctorId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatePayload),
      });
      
      const data = await response.json();
      console.log("Update response:", data); // Debug log
      
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
        const response = await fetch(`http://localhost:1333/citius/delete-doctor/${doctorId}`, {
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

  // Format availability for display
  const formatAvailability = (availability) => {
    if (!availability) return "N/A";
    
    if (typeof availability === 'object') {
      const days = Object.entries(availability)
        .map(([day, time]) => `${day}: ${time}`)
        .join(', ');
      return days.length > 50 ? days.substring(0, 50) + '...' : days;
    }
    
    return availability.toString();
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
          row.name || "N/A"
        ),
      sortable: true,
      minWidth: "150px",
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
            placeholder="Contact Number"
          />
        ) : (
          row.contact_number || "N/A"
        ),
      sortable: true,
      minWidth: "120px",
    },
    {
      name: "Department",
      selector: (row) => row.profile?.department,
      cell: (row) =>
        editingId === row._id ? (
          <Form.Control
            value={editData.department}
            onChange={(e) =>
              handleInputChange("department", e.target.value)
            }
            placeholder="Department"
          />
        ) : (
          row.profile?.department || "Not assigned"
        ),
      sortable: true,
      minWidth: "130px",
    },
    {
      name: "Qualification",
      selector: (row) => row.profile?.qualification,
      cell: (row) =>
        editingId === row._id ? (
          <Form.Control
            value={editData.qualification}
            onChange={(e) =>
              handleInputChange("qualification", e.target.value)
            }
            placeholder="Qualification"
          />
        ) : (
          row.profile?.qualification || "Not specified"
        ),
      minWidth: "130px",
    },
    {
      name: "Availability",
      selector: (row) => row.profile?.availability,
      cell: (row) => (
        <OverlayTrigger
          placement="top"
          overlay={
            <Tooltip>
              {row.profile?.availability ? 
                (typeof row.profile.availability === 'object' ? 
                  JSON.stringify(row.profile.availability, null, 2) : 
                  row.profile.availability) : 
                "No availability info"}
            </Tooltip>
          }
        >
          <span
            className="text-truncate d-inline-block"
            style={{ maxWidth: "150px", cursor: "pointer" }}
          >
            {formatAvailability(row.profile?.availability)}
          </span>
        </OverlayTrigger>
      ),
      minWidth: "150px",
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
      center: true,
      minWidth: "100px",
    },
    {
      name: "Actions",
      cell: (row) =>
        editingId === row._id ? (
          <div className="d-flex gap-1">
            <Button
              size="sm"
              variant="success"
              onClick={() => handleSave(row._id)}
            >
              <Save size={12} />
            </Button>
            <Button size="sm" variant="secondary" onClick={handleCancel}>
              <X size={12} />
            </Button>
          </div>
        ) : (
          <div className="d-flex gap-1">
            <Button size="sm" variant="primary" onClick={() => handleEdit(row)}>
              <Edit2 size={12} />
            </Button>
            <Button
              size="sm"
              variant="danger"
              onClick={() => handleDelete(row._id)}
            >
              <Trash2 size={12} />
            </Button>
          </div>
        ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      minWidth: "120px",
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
          <p className="text-muted mb-0">
            Manage healthcare professionals ({filteredDoctors.length} doctors)
          </p>
        </div>
        <Button
          variant="outline-primary"
          className="ms-auto"
          onClick={fetchDoctors}
        >
          <RefreshCw size={16} /> Refresh
        </Button>
      </div>

      {error && (
        <Alert variant="danger" dismissible onClose={() => setError("")}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert variant="success" dismissible onClose={() => setSuccess("")}>
          {success}
        </Alert>
      )}

      <Row className="mb-3">
        <Col md={3}>
          <InputGroup>
            <Form.Control
              placeholder="Search by name..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
            />
          </InputGroup>
        </Col>
        <Col md={3}>
          <InputGroup>
            <Form.Control
              placeholder="Filter by department..."
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
            <option value="active">Active Only</option>
            <option value="inactive">Inactive Only</option>
          </Form.Select>
        </Col>
        <Col md={3}>
          <Button variant="secondary" className="w-100" onClick={clearFilters}>
            Clear Filters
          </Button>
        </Col>
      </Row>

      <div className="mb-3">
        <small className="text-muted">
          Showing {filteredDoctors.length} of {doctors.length} doctors
        </small>
      </div>

      <DataTable
        columns={columns}
        data={filteredDoctors}
        pagination
        paginationPerPage={10}
        paginationRowsPerPageOptions={[5, 10, 15, 20]}
        highlightOnHover
        striped
        responsive
        persistTableHead
        noHeader
        defaultSortFieldId="name"
      />

      {filteredDoctors.length === 0 && !loading && (
        <div className="text-center mt-5">
          <Users size={48} className="text-muted mb-2" />
          <h5>No doctors found</h5>
          <p className="text-muted">
            {doctors.length === 0 
              ? "No doctors available in the system."
              : "Try adjusting your search filters."}
          </p>
        </div>
      )}
    </div>
  );
};

export default DoctorManagement;