import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Row,
  Col,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Alert,
  Spinner,
} from "reactstrap";
import { Edit2, Save, X, Trash2, RefreshCw, Calendar, Plus, Search } from "lucide-react";

const AppointmentManagement = () => {
  const baseURL = "http://localhost:1333/citius/appointment";
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [createData, setCreateData] = useState({
    patient_id: "",
    doctor_id: "",
    appointment_date: "",
    notes: ""
  });

  // Modal state for create appointment
  const [createModal, setCreateModal] = useState(false);

  // Dropdown options (replace with API fetch)
  const [patientOptions, setPatientOptions] = useState([]);
  const [doctorOptions, setDoctorOptions] = useState([]);

  // Example static arrays for now
  useEffect(() => {
    // TODO: Replace with API call
    setPatientOptions([
      { id: "p1", name: "John Doe" },
      { id: "p2", name: "Jane Smith" },
      { id: "p3", name: "Alice Johnson" },
    ]);
    setDoctorOptions([
      { id: "d1", name: "Dr. House" },
      { id: "d2", name: "Dr. Strange" },
      { id: "d3", name: "Dr. Watson" },
    ]);
    // Example API fetch code:
    // fetch('http://localhost:1333/api/patients')
    //   .then(res => res.json())
    //   .then(data => setPatientOptions(data));
    // fetch('http://localhost:1333/api/doctors')
    //   .then(res => res.json())
    //   .then(data => setDoctorOptions(data));
  }, []);

  const [searchFilter, setSearchFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");

  // Fetch appointments from API
  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await fetch(baseURL);
      const data = await response.json();
      if (response.ok && data.success) {
        setAppointments(data.data);
        setFilteredAppointments(data.data);
      } else {
        setError(data.message || `Failed: ${response.status}`);
      }
    } catch (err) {
      console.error(err);
      setError("Network error: Unable to fetch appointments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  // Filtering
  useEffect(() => {
    let filtered = appointments;
    if (searchFilter.trim()) {
      filtered = filtered.filter((a) =>
        a.patient_id?.name?.toLowerCase().includes(searchFilter.toLowerCase()) ||
        a.doctor_id?.name?.toLowerCase().includes(searchFilter.toLowerCase())
      );
    }
    if (statusFilter !== "all") {
      filtered = filtered.filter((a) => a.status === statusFilter);
    }
    if (dateFilter.trim()) {
      const filterDate = new Date(dateFilter).getTime();
      filtered = filtered.filter((a) => 
        new Date(a.appointment_date).toDateString() === new Date(filterDate).toDateString()
      );
    }
    setFilteredAppointments(filtered);
  }, [searchFilter, statusFilter, dateFilter, appointments]);

  const handleEdit = (appointment) => {
    setEditingId(appointment._id);
    setEditData({
      appointment_date: new Date(appointment.appointment_date).toISOString().slice(0, 16),
      notes: appointment.notes || "",
      status: appointment.status,
    });
    setError("");
    setSuccess("");
  };

  const handleSave = async (appointmentId) => {
    try {
      const appointment = appointments.find(a => a._id === appointmentId);
      const response = await fetch(`${baseURL}/${appointment?._id}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ...editData,
          appointment_date: new Date(editData.appointment_date).getTime()
        }),
      });
      const data = await response.json();
      if (data.success) {
        setSuccess("Appointment updated successfully");
        await fetchAppointments();
        setEditingId(null);
        setEditData({});
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError(data.message || "Failed to update appointment");
      }
    } catch (err) {
      console.error(err);
      setError("Network error: Unable to update appointment");
    }
  };

  const handleDelete = async (appointmentId) => {
    if (window.confirm("Are you sure you want to delete this appointment?")) {
      try {
        const appointment = appointments.find(a => a._id === appointmentId);
        const response = await fetch(`${baseURL}/${appointment?._id}`, {
          method: "DELETE"
        });
        const data = await response.json();
        if (data.success) {
          setSuccess("Appointment deleted successfully");
          await fetchAppointments();
          setTimeout(() => setSuccess(""), 3000);
        } else {
          setError(data.message || "Failed to delete appointment");
        }
      } catch (err) {
        console.error(err);
        setError("Network error: Unable to delete appointment");
      }
    }
  };

  const handleCreate = async () => {
    if (!createData.patient_id || !createData.doctor_id || !createData.appointment_date) {
      setError("Please fill in all required fields.");
      return;
    }
    try {
      const response = await fetch(baseURL, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ...createData,
          appointment_date: new Date(createData.appointment_date).getTime()
        }),
      });
      const data = await response.json();
      if (data.success) {
        setSuccess("Appointment created successfully");
        await fetchAppointments();
        setCreateData({ patient_id: "", doctor_id: "", appointment_date: "", notes: "" });
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError(data.message || "Failed to create appointment");
      }
    } catch (err) {
      console.error(err);
      setError("Network error: Unable to create appointment");
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

  const handleCreateInputChange = (field, value) => {
    setCreateData((prev) => ({ ...prev, [field]: value }));
  };

  const clearFilters = () => {
    setSearchFilter("");
    setStatusFilter("all");
    setDateFilter("");
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString() + " " + 
           new Date(timestamp).toLocaleTimeString();
  };

  const getStatusBadge = (status) => {
    const colors = {
      Scheduled: "bg-blue-100 text-blue-800",
      Completed: "bg-green-100 text-green-800", 
      Cancelled: "bg-red-100 text-red-800"
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[status] || "bg-gray-100 text-gray-800"}`}>
        {status}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100 flex-column">
        <Spinner color="primary" style={{ width: "3rem", height: "3rem" }} />
        <p className="mt-4 text-secondary">Loading appointments...</p>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <Card className="mb-4">
        <CardHeader className="d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center">
            <Calendar className="me-2 text-primary" size={32} />
            <h1 className="mb-0 fw-bolder fs-3 text-dark">Appointment Management</h1>
          </div>
          <Button color="secondary" outline onClick={fetchAppointments}>
            <RefreshCw className="me-2" size={18} /> Refresh
          </Button>
        </CardHeader>
        <CardBody>
          {error && <Alert color="danger">{error}</Alert>}
          {success && <Alert color="success">{success}</Alert>}
          <Card className="mb-4">
            <CardHeader>
              <h2 className="mb-0 fw-bolder fs-4 text-dark">Create New Appointment</h2>
            </CardHeader>
            <CardBody>
              <Form>
                <Row>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="patientId">Patient</Label>
                      <Input
                        id="patientId"
                        type="select"
                        value={createData.patient_id}
                        onChange={(e) => handleCreateInputChange("patient_id", e.target.value)}
                      >
                        <option value="">Select Patient</option>
                        {patientOptions.map((p) => (
                          <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                      </Input>
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="doctorId">Doctor</Label>
                      <Input
                        id="doctorId"
                        type="select"
                        value={createData.doctor_id}
                        onChange={(e) => handleCreateInputChange("doctor_id", e.target.value)}
                      >
                        <option value="">Select Doctor</option>
                        {doctorOptions.map((d) => (
                          <option key={d.id} value={d.id}>{d.name}</option>
                        ))}
                      </Input>
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="appointmentDate">Appointment Date & Time</Label>
                      <Input
                        id="appointmentDate"
                        type="datetime-local"
                        value={createData.appointment_date}
                        onChange={(e) => handleCreateInputChange("appointment_date", e.target.value)}
                      />
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="notes">Notes</Label>
                      <Input
                        id="notes"
                        type="textarea"
                        rows={3}
                        placeholder="Additional notes (optional)"
                        value={createData.notes}
                        onChange={(e) => handleCreateInputChange("notes", e.target.value)}
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <div className="d-flex justify-content-end">
                  <Button color="primary" onClick={handleCreate}>Create Appointment</Button>
                </div>
              </Form>
            </CardBody>
          </Card>
          <Card className="mb-4">
            <CardHeader>
              <Row className="align-items-center">
                <Col md={4}>
                  <FormGroup className="mb-0 position-relative">
                    <Search className="position-absolute" style={{ left: 10, top: 12, color: '#adb5bd' }} size={16} />
                    <Input
                      style={{ paddingLeft: 32 }}
                      type="text"
                      placeholder="Search patient/doctor"
                      value={searchFilter}
                      onChange={(e) => setSearchFilter(e.target.value)}
                    />
                  </FormGroup>
                </Col>
                <Col md={3}>
                  <FormGroup className="mb-0">
                    <Input
                      type="select"
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                    >
                      <option value="all">All Status</option>
                      <option value="Scheduled">Scheduled</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                    </Input>
                  </FormGroup>
                </Col>
                <Col md={3}>
                  <FormGroup className="mb-0">
                    <Input
                      type="date"
                      value={dateFilter}
                      onChange={(e) => setDateFilter(e.target.value)}
                    />
                  </FormGroup>
                </Col>
                <Col md={2} className="d-flex justify-content-end">
                  <Button color="secondary" outline onClick={clearFilters}>Clear Filters</Button>
                </Col>
              </Row>
            </CardHeader>
            <CardBody className="p-0">
              <div className="table-responsive">
                <table className="table table-bordered table-hover mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Patient</th>
                      <th>Doctor</th>
                      <th>Department</th>
                      <th>Date & Time</th>
                      <th>Status</th>
                      <th>Notes</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAppointments.map((appointment) => (
                      <tr key={appointment._id}>
                        <td>{appointment.patient_id?.name || "Unknown"}</td>
                        <td>{appointment.doctor_id?.name || "Unknown"}</td>
                        <td>{appointment.doctor_id?.profile?.department || "N/A"}</td>
                        <td>
                          {editingId === appointment._id ? (
                            <Input
                              type="datetime-local"
                              value={editData.appointment_date}
                              onChange={(e) => handleInputChange("appointment_date", e.target.value)}
                              size="sm"
                            />
                          ) : (
                            formatDate(appointment.appointment_date)
                          )}
                        </td>
                        <td>
                          {editingId === appointment._id ? (
                            <Input
                              type="select"
                              value={editData.status}
                              onChange={(e) => handleInputChange("status", e.target.value)}
                              size="sm"
                            >
                              <option value="Scheduled">Scheduled</option>
                              <option value="Completed">Completed</option>
                              <option value="Cancelled">Cancelled</option>
                            </Input>
                          ) : (
                            getStatusBadge(appointment.status)
                          )}
                        </td>
                        <td>
                          {editingId === appointment._id ? (
                            <Input
                              type="textarea"
                              rows={2}
                              value={editData.notes}
                              onChange={(e) => handleInputChange("notes", e.target.value)}
                              placeholder="Notes"
                              size="sm"
                            />
                          ) : (
                            <span title={appointment.notes} className="d-block text-truncate" style={{ maxWidth: 200 }}>
                              {appointment.notes || "No notes"}
                            </span>
                          )}
                        </td>
                        <td>
                          {editingId === appointment._id ? (
                            <div className="d-flex gap-2">
                              <Button color="success" size="sm" onClick={() => handleSave(appointment._id)}>
                                <Save className="me-1" size={16} /> Save
                              </Button>
                              <Button color="secondary" size="sm" onClick={handleCancel}>
                                <X className="me-1" size={16} /> Cancel
                              </Button>
                            </div>
                          ) : (
                            <div className="d-flex gap-2">
                              <Button color="primary" size="sm" onClick={() => handleEdit(appointment)}>
                                <Edit2 className="me-1" size={16} /> 
                              </Button>
                              <Button color="danger" size="sm" onClick={() => handleDelete(appointment._id)}>
                                <Trash2 className="me-1" size={16} />
                              </Button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {filteredAppointments.length === 0 && (
                <div className="text-center py-5">
                  <Calendar className="mb-3 text-secondary" size={48} />
                  <h3 className="fw-bolder fs-5 text-dark mb-2">No appointments found</h3>
                  <p className="text-secondary">Try adjusting your filters or create a new appointment.</p>
                </div>
              )}
            </CardBody>
          </Card>
        </CardBody>
      </Card>
    </div>
  );
};

export default AppointmentManagement;