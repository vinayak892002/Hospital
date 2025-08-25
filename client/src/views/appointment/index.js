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
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";
import {
  Eye,
  Pill,
  Edit2,
  Save,
  X,
  Trash2,
  RefreshCw,
  Calendar,
  Plus,
  Search,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Logout from "../logout";

const AppointmentManagement = () => {
  const baseURL = "http://localhost:1333/citius";
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const hmsToken = localStorage.getItem("hmsToken");
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  const role = userInfo.role;
  const user_id = userInfo.user_id;

  // Create modal state
  const [createModal, setCreateModal] = useState(false);
  const [createData, setCreateData] = useState({
    patient_id: "",
    doctor_id: "",
    appointment_date: "",
    notes: "",
  });

  const handleView = (appointment) => {
    console.log(
      appointment.appointment_id,
      appointment.doctor.user_id,
      appointment
    );

    navigate("/doctor/prescription", {
      state: {
        appointmentId: appointment.appointment_id,
        doctorId: appointment.doctor.user_id,
      },
    });
  };
  // Edit modal state
  const [editModal, setEditModal] = useState(false);
  const [editData, setEditData] = useState({});
  const [currentEditingId, setCurrentEditingId] = useState(null);

  // Dropdown options (replace with API fetch)
  const [patientOptions, setPatientOptions] = useState([]);
  const [doctorOptions, setDoctorOptions] = useState([]);

  // Example static arrays for now
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await fetch("http://localhost:1333/citius/patient", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            role: role,
            user_id: user_id,
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.patients) {
          const formattedPatients = data.patients.map((patient) => ({
            id: patient.user_id || patient._id,
            name: patient.name,
          }));
          setPatientOptions(formattedPatients);
        }

        if (data.doctors) {
          const formattedDoctors = data.doctors.map((doctor) => ({
            id: doctor.user_id || doctor._id,
            name: doctor.name,
          }));
          setDoctorOptions(formattedDoctors);
        }
      } catch (error) {
        console.error("Error fetching patients:", error);
      }
    };

    if (role && user_id) {
      fetchPatients();
      // fetchDoctors();
    }
  }, []);

  const [searchFilter, setSearchFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");

  // Fetch appointments from API
  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${baseURL}/getappointments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          role: role,
          user_id: user_id,
        }),
      });
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
      filtered = filtered.filter(
        (a) =>
          a.patient?.name?.toLowerCase().includes(searchFilter.toLowerCase()) ||
          a.doctor?.name?.toLowerCase().includes(searchFilter.toLowerCase())
      );
    }
    if (statusFilter !== "all") {
      filtered = filtered.filter((a) => a.status === statusFilter);
    }
    if (dateFilter.trim()) {
      const filterDate = new Date(dateFilter).getTime();
      filtered = filtered.filter(
        (a) =>
          new Date(a.appointment_date).toDateString() ===
          new Date(filterDate).toDateString()
      );
    }
    setFilteredAppointments(filtered);
  }, [searchFilter, statusFilter, dateFilter, appointments]);

  // Create appointment functions
  const toggleCreateModal = () => {
    setCreateModal(!createModal);
    if (!createModal) {
      setCreateData({
        patient_id: "",
        doctor_id: "",
        appointment_date: "",
        notes: "",
      });
      setError("");
      setSuccess("");
    }
  };

  const handleCreateInputChange = (field, value) => {
    setCreateData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCreate = async () => {
    console.log("running");

    if (
      !createData.patient_id ||
      !createData.doctor_id ||
      !createData.appointment_date
    ) {
      setError("Please fill in all required fields.");
      return;
    }
    try {
      const response = await fetch(`${baseURL}/createappointment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...createData,
          appointment_date: new Date(createData.appointment_date).getTime(),
        }),
      });
      const data = await response.json();
      if (data.success) {
        setSuccess("Appointment created successfully");
        await fetchAppointments();
        setCreateData({
          patient_id: "",
          doctor_id: "",
          appointment_date: "",
          notes: "",
        });
        setCreateModal(false);
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError(data.message || "Failed to create appointment");
      }
    } catch (err) {
      console.error(err);
      setError("Network error: Unable to create appointment");
    }
  };

  // Edit appointment functions
  const toggleEditModal = () => {
    setEditModal(!editModal);
    if (!editModal) {
      setEditData({});
      setCurrentEditingId(null);
      setError("");
      setSuccess("");
    }
  };

  const handleEdit = (appointment) => {
    setCurrentEditingId(appointment._id);
    setEditData({
      appointment_date: new Date(appointment.appointment_date)
        .toISOString()
        .slice(0, 16),
      notes: appointment.notes || "",
      status: appointment.status,
    });
    setEditModal(true);
    setError("");
    setSuccess("");
  };

  const handleEditInputChange = (field, value) => {
    setEditData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      const appointment = appointments.find((a) => a._id === currentEditingId);
      const response = await fetch(
        `${baseURL}/updateappointment/${appointment?.appointment_id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            role: role,
            user_id: user_id,
            ...editData,
            appointment_date: new Date(editData.appointment_date).getTime(),
          }),
        }
      );
      const data = await response.json();
      if (data.success) {
        setSuccess("Appointment updated successfully");
        await fetchAppointments();
        setEditModal(false);
        setEditData({});
        setCurrentEditingId(null);
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
        const appointment = appointments.find((a) => a._id === appointmentId);
        const response = await fetch(
          `${baseURL}/appointment/${appointment?.appointment_id}`,
          {
            method: "DELETE",
          }
        );
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

  const clearFilters = () => {
    setSearchFilter("");
    setStatusFilter("all");
    setDateFilter("");
  };

  const formatDate = (timestamp) => {
    return (
      new Date(timestamp).toLocaleDateString() +
      " " +
      new Date(timestamp).toLocaleTimeString()
    );
  };

  const getStatusBadge = (status) => {
    const colors = {
      Scheduled: "bg-blue-100 text-blue-800",
      Completed: "bg-green-100 text-green-800",
      Cancelled: "bg-red-100 text-red-800",
    };
    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${
          colors[status] || "bg-gray-100 text-gray-800"
        }`}
      >
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
    <>
      <Logout />
      <div className="container py-4">
        <Card className="mb-4">
          <CardHeader className="d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center">
              <Calendar className="me-2 text-primary" size={32} />
              <h1 className="mb-0 fw-bolder fs-3 text-dark">
                Appointment Management
              </h1>
            </div>
            <div className="d-flex gap-2">
              <Button color="success" onClick={toggleCreateModal}>
                <Plus className="me-2" size={18} /> New Appointment
              </Button>
              <Button color="secondary" outline onClick={fetchAppointments}>
                <RefreshCw className="me-2" size={18} /> Refresh
              </Button>
            </div>
          </CardHeader>
          <CardBody>
            {error && <Alert color="danger">{error}</Alert>}
            {success && <Alert color="success">{success}</Alert>}

            <Card className="mb-4">
              <CardHeader>
                <Row className="align-items-center">
                  <Col md={4}>
                    <FormGroup className="mb-0 position-relative">
                      <Search
                        className="position-absolute"
                        style={{ left: 10, top: 12, color: "#adb5bd" }}
                        size={16}
                      />
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
                    <Button color="secondary" outline onClick={clearFilters}>
                      Clear Filters
                    </Button>
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
                        <tr key={appointment.appointment_id}>
                          <td>{appointment.patient?.name || "Unknown"}</td>
                          <td>{appointment.doctor?.name || "Unknown"}</td>
                          <td>
                            {appointment.doctor?.profile?.department || "N/A"}
                          </td>
                          <td>{formatDate(appointment.appointment_date)}</td>
                          <td>{getStatusBadge(appointment.status)}</td>
                          <td>
                            <span
                              title={appointment.notes}
                              className="d-block text-truncate"
                              style={{ maxWidth: 200 }}
                            >
                              {appointment.notes || "No notes"}
                            </span>
                          </td>
                          <td>
                            <div className="d-flex gap-2">
                              {role === "Patient" ? (
                                // Only View for Patient
                                <Button
                                  color="info"
                                  size="sm"
                                  onClick={() => handleView(appointment)}
                                >
                                  <Eye className="me-1" size={16} />{" "}
                                  {/* import { Eye } from "lucide-react" */}
                                </Button>
                              ) : (
                                // Edit + Delete for Admin, Doctor, Receptionist
                                <>
                                  <Button
                                    color="primary"
                                    size="sm"
                                    onClick={() => handleEdit(appointment)}
                                  >
                                    <Edit2 className="" size={16} />
                                  </Button>

                                  <Button
                                    color="secondary"
                                    size="sm"
                                    onClick={() => handleView(appointment)}
                                  >
                                    <Pill className="" size={16} />
                                  </Button>

                                  <Button
                                    color="danger"
                                    size="sm"
                                    onClick={() =>
                                      handleDelete(appointment._id)
                                    }
                                  >
                                    <Trash2 className="" size={16} />
                                  </Button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {filteredAppointments.length === 0 && (
                  <div className="text-center py-5">
                    <Calendar className="mb-3 text-secondary" size={48} />
                    <h3 className="fw-bolder fs-5 text-dark mb-2">
                      No appointments found
                    </h3>
                    <p className="text-secondary">
                      Try adjusting your filters or create a new appointment.
                    </p>
                  </div>
                )}
              </CardBody>
            </Card>
          </CardBody>
        </Card>

        {/* Create Appointment Modal */}
        <Modal isOpen={createModal} toggle={toggleCreateModal} size="lg">
          <ModalHeader toggle={toggleCreateModal}>
            <div className="d-flex align-items-center">
              <Plus className="me-2 text-success" size={24} />
              Create New Appointment
            </div>
          </ModalHeader>
          <ModalBody>
            {error && <Alert color="danger">{error}</Alert>}
            <Form>
              <Row>
                <Col md={6}>
                  <FormGroup>
                    <Label for="createPatientId">
                      Patient <span className="text-danger">*</span>
                    </Label>
                    <Input
                      id="createPatientId"
                      type="select"
                      value={createData.patient_id}
                      onChange={(e) =>
                        handleCreateInputChange("patient_id", e.target.value)
                      }
                    >
                      <option value="">Select Patient</option>
                      {patientOptions.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name}
                        </option>
                      ))}
                    </Input>
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Label for="createDoctorId">
                      Doctor <span className="text-danger">*</span>
                    </Label>
                    <Input
                      id="createDoctorId"
                      type="select"
                      value={createData.doctor_id}
                      onChange={(e) =>
                        handleCreateInputChange("doctor_id", e.target.value)
                      }
                    >
                      <option value="">Select Doctor</option>
                      {doctorOptions.map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.name}
                        </option>
                      ))}
                    </Input>
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <FormGroup>
                    <Label for="createAppointmentDate">
                      Appointment Date & Time{" "}
                      <span className="text-danger">*</span>
                    </Label>
                    <Input
                      id="createAppointmentDate"
                      type="datetime-local"
                      value={createData.appointment_date}
                      onChange={(e) =>
                        handleCreateInputChange(
                          "appointment_date",
                          e.target.value
                        )
                      }
                    />
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Label for="createNotes">Notes</Label>
                    <Input
                      id="createNotes"
                      type="textarea"
                      rows={3}
                      placeholder="Additional notes (optional)"
                      value={createData.notes}
                      onChange={(e) =>
                        handleCreateInputChange("notes", e.target.value)
                      }
                    />
                  </FormGroup>
                </Col>
              </Row>
            </Form>
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={toggleCreateModal}>
              <X className="me-2" size={16} />
              Cancel
            </Button>
            <Button color="success" onClick={handleCreate}>
              <Plus className="me-2" size={16} />
              Create Appointment
            </Button>
          </ModalFooter>
        </Modal>

        {/* Edit Appointment Modal */}
        <Modal isOpen={editModal} toggle={toggleEditModal} size="lg">
          <ModalHeader toggle={toggleEditModal}>
            <div className="d-flex align-items-center">
              <Edit2 className="me-2 text-primary" size={24} />
              Edit Appointment
            </div>
          </ModalHeader>
          <ModalBody>
            {error && <Alert color="danger">{error}</Alert>}
            <Form>
              <Row>
                <Col md={6}>
                  <FormGroup>
                    <Label for="editAppointmentDate">
                      Appointment Date & Time
                    </Label>
                    <Input
                      id="editAppointmentDate"
                      type="datetime-local"
                      value={editData.appointment_date || ""}
                      onChange={(e) =>
                        handleEditInputChange(
                          "appointment_date",
                          e.target.value
                        )
                      }
                    />
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Label for="editStatus">Status</Label>
                    <Input
                      id="editStatus"
                      type="select"
                      value={editData.status || ""}
                      onChange={(e) =>
                        handleEditInputChange("status", e.target.value)
                      }
                    >
                      <option value="Scheduled">Scheduled</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                    </Input>
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <FormGroup>
                    <Label for="editNotes">Notes</Label>
                    <Input
                      id="editNotes"
                      type="textarea"
                      rows={4}
                      placeholder="Additional notes"
                      value={editData.notes || ""}
                      onChange={(e) =>
                        handleEditInputChange("notes", e.target.value)
                      }
                    />
                  </FormGroup>
                </Col>
              </Row>
            </Form>
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={toggleEditModal}>
              <X className="me-2" size={16} />
              Cancel
            </Button>
            <Button color="primary" onClick={handleSave}>
              <Save className="me-2" size={16} />
              Save Changes
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    </>
  );
};

export default AppointmentManagement;
