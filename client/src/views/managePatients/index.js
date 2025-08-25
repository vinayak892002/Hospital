import React, { useState, useEffect, useMemo } from "react";
import toast from "react-hot-toast";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  CardHeader,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormGroup,
  Label,
  Input,
  InputGroup,
  InputGroupText,
  Alert,
  Badge,
  Spinner,
} from "reactstrap";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/material_blue.css";
import DataTable from "react-data-table-component";
import {
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  UserCheck,
  Edit3,
  Trash2,
  Search,
  Filter,
  Users,
  Heart,
  AlertTriangle,
  Plus,
} from "lucide-react";
import Logout from "../logout";

const PatientManagement = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [editModal, setEditModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contact_number: "",
    gender: "",
    dob: "",
    blood_group: "",
    address: "",
    emergency_contact: "",
    allergies: "",
    status: true,
  });

  // Fetch patients
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setLoading(true);
        const res = await fetch("http://localhost:1333/citius/getAllPatients");
        const data = await res.json();

        if (res.status === 200) {
          setPatients(data);
          toast.success(data.message || "Patients fetched successfully ✅");
        } else {
          toast.error(data.message || "Failed to fetch patients ❌");
        }
      } catch (err) {
        toast.error("Error fetching patients data ❌");
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  const filteredPatients = useMemo(() => {
    let filtered = patients;
    if (searchTerm) {
      filtered = filtered.filter(
        (patient) =>
          patient.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          patient.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          patient.contact_number?.includes(searchTerm) ||
          patient.user_id?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (statusFilter !== "all") {
      const isActive = statusFilter === "active";
      filtered = filtered.filter((patient) => patient.status === isActive);
    }
    return filtered;
  }, [patients, searchTerm, statusFilter]);

  const handleAdd = () => {
    setIsEdit(false);
    setFormData({
      name: "",
      email: "",
      contact_number: "",
      gender: "",
      dob: "",
      blood_group: "",
      address: "",
      emergency_contact: "",
      allergies: "",
      status: true,
    });
    setSelectedPatient(null);
    setEditModal(true);
  };

  const handleEdit = (patient) => {
    setIsEdit(true);
    setSelectedPatient(patient);
    setFormData({
      name: patient.name || "",
      email: patient.email || "",
      contact_number: patient.contact_number || "",
      gender: patient.profile?.gender || "",
      dob: patient.profile?.dob
        ? new Date(patient.profile.dob).toISOString().split("T")[0]
        : "",
      blood_group: patient.profile?.blood_group || "",
      address: patient.profile?.address || "",
      emergency_contact: patient.profile?.emergency_contact || "",
      allergies: patient.profile?.allergies?.join(", ") || "",
      status: patient.status,
    });
    setEditModal(true);
  };

  const handleSave = async () => {
    try {
      if (isEdit) {
        const updateData = {
          user_id: selectedPatient.user_id,
          name: formData.name,
          email: formData.email,
          contact_number: formData.contact_number,
          status: formData.status,
          profile: {
            gender: formData.gender,
            dob: formData.dob,
            blood_group: formData.blood_group,
            address: formData.address,
            emergency_contact: formData.emergency_contact,
            allergies: formData.allergies
              .split(",")
              .map((a) => a.trim())
              .filter((a) => a),
          },
        };

        const res = await fetch("http://localhost:1333/citius/updatePatient", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updateData),
        });

        const data = await res.json();
        if (res.status === 200) {
          setPatients((prev) =>
            prev.map((p) =>
              p.user_id === selectedPatient.user_id ? data.data : p
            )
          );
          toast.success(data.message || "Patient updated ✅");
          setEditModal(false);
        } else {
          toast.error(data.message || "Error updating patient ❌");
        }
      } else {
        const newPatient = {
          ...formData,
          role: "Patient",
          password: "123456",
          allergies: formData.allergies
            .split(",")
            .map((a) => a.trim())
            .filter((a) => a),
        };

        const res = await fetch("http://localhost:1333/citius/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newPatient),
        });

        const data = await res.json();

        if (res.status === 200) {
          toast.success(data.message);
          setPatients((prev) => [...prev, newPatient]);
          setEditModal(false);
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      toast.error("Internal server error");
    }
  };

  const handleDelete = (patient) => {
    setSelectedPatient(patient);
    setDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      const res = await fetch("http://localhost:1333/citius/deletePatient", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_id: selectedPatient.user_id }),
      });

      const data = await res.json();

      if (res.status === 200) {
        const updated = patients.filter(
          (p) => p.user_id !== selectedPatient.user_id
        );
        setPatients(updated);

        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Internal server error");
    } finally {
      setDeleteModal(false);
    }
  };

  const getStatusBadge = (status) => (
    <Badge color={status ? "success" : "danger"}>
      {status ? "Active" : "Inactive"}
    </Badge>
  );

  // Define columns for DataTable
  const columns = [
    {
      name: "Name",
      selector: (row) => row.name,
      sortable: true,
      cell: (row) => (
        <div>
          <div className="fw-bold">{row.name || "N/A"}</div>
          <small className="text-muted">
            <Mail size={12} /> {row.email || "N/A"}
          </small>
        </div>
      ),
    },
    {
      name: "Contact",
      selector: (row) => row.contact_number,
      cell: (row) => (
        <div>
          {row.contact_number || "N/A"}
          {row.profile?.emergency_contact && (
            <small className="text-muted d-block">
              <AlertTriangle size={12} /> {row.profile.emergency_contact}
            </small>
          )}
        </div>
      ),
    },
    {
      name: "Gender",
      selector: (row) => row.profile?.gender,
      cell: (row) => (
        <Badge color="light" className="text-dark">
          {row.profile?.gender || "N/A"}
        </Badge>
      ),
    },
    {
      name: "Blood Group",
      selector: (row) => row.profile?.blood_group,
      cell: (row) => (
        <span>
          <Heart size={14} className="text-danger me-1" />
          {row.profile?.blood_group || "N/A"}
        </span>
      ),
    },
    {
      name: "Status",
      selector: (row) => row.status,
      cell: (row) => getStatusBadge(row.status),
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="d-flex gap-2">
          <Button
            size="sm"
            color="primary"
            outline
            onClick={() => handleEdit(row)}
          >
            <Edit3 size={14} />
          </Button>
          <Button
            size="sm"
            color="danger"
            outline
            onClick={() => handleDelete(row)}
          >
            <Trash2 size={14} />
          </Button>
        </div>
      ),
    },
  ];

  if (loading) {
    return (
      <Container
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "400px" }}
      >
        <Spinner color="primary" size="lg" />
      </Container>
    );
  }

  return (
    <>
      <Logout />
      <Container fluid className="py-4">
        <Row className="mb-3">
          <Col>
            <Button color="success" onClick={handleAdd}>
              <Plus size={16} className="me-2" />
              Add Patient
            </Button>
          </Col>
        </Row>

        <Row>
          <Col>
            <Card>
              <CardHeader className="d-flex justify-content-between">
                <h4 className="mb-0">
                  <Users className="me-2" /> Patient Management
                </h4>
                <Badge color="info" pill>
                  {filteredPatients.length} Patients
                </Badge>
              </CardHeader>
              <CardBody>
                <Row className="mb-3">
                  <Col md={6}>
                    <InputGroup>
                      <InputGroupText>
                        <Search size={16} />
                      </InputGroupText>
                      <Input
                        type="text"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </InputGroup>
                  </Col>
                  <Col md={3}>
                    <InputGroup>
                      <InputGroupText>
                        <Filter size={16} />
                      </InputGroupText>
                      <Input
                        type="select"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                      >
                        <option value="all">All Status</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </Input>
                    </InputGroup>
                  </Col>
                </Row>

                <DataTable
                  columns={columns}
                  data={filteredPatients}
                  pagination
                  highlightOnHover
                  responsive
                  striped
                  noDataComponent="No patients found"
                />
              </CardBody>
            </Card>
          </Col>
        </Row>

        {/* ================= ADD / EDIT MODAL ================= */}
        <Modal isOpen={editModal} toggle={() => setEditModal(false)} size="lg">
          <ModalHeader toggle={() => setEditModal(false)}>
            {isEdit ? (
              <>
                <Edit3 size={20} className="me-2" /> Edit Patient:{" "}
                {selectedPatient?.name}
              </>
            ) : (
              <>
                <Plus size={20} className="me-2" /> Add New Patient
              </>
            )}
          </ModalHeader>

          <ModalBody>
            <Row>
              {/* Full Name */}
              <Col md={6}>
                <FormGroup>
                  <Label for="name">Full Name</Label>
                  <InputGroup>
                    <InputGroupText>
                      <User size={16} />
                    </InputGroupText>
                    <Input
                      type="text"
                      id="name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                    />
                  </InputGroup>
                </FormGroup>
              </Col>

              {/* Email */}
              <Col md={6}>
                <FormGroup>
                  <Label for="email">Email</Label>
                  <InputGroup>
                    <InputGroupText>
                      <Mail size={16} />
                    </InputGroupText>
                    <Input
                      type="email"
                      id="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                    />
                  </InputGroup>
                </FormGroup>
              </Col>
            </Row>

            <Row>
              {/* Contact Number */}
              <Col md={6}>
                <FormGroup>
                  <Label for="contact_number">Contact Number</Label>
                  <InputGroup>
                    <InputGroupText>
                      <Phone size={16} />
                    </InputGroupText>
                    <Input
                      type="text"
                      id="contact_number"
                      value={formData.contact_number}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          contact_number: e.target.value,
                        })
                      }
                    />
                  </InputGroup>
                </FormGroup>
              </Col>

              {/* Status */}
              <Col md={6}>
                <FormGroup>
                  <Label for="status">Status</Label>
                  <InputGroup>
                    <InputGroupText>
                      <UserCheck size={16} />
                    </InputGroupText>
                    <Input
                      type="select"
                      id="status"
                      value={formData.status}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          status: e.target.value === "true",
                        })
                      }
                    >
                      <option value="true">Active</option>
                      <option value="false">Inactive</option>
                    </Input>
                  </InputGroup>
                </FormGroup>
              </Col>
            </Row>

            <Row>
              {/* Gender */}
              <Col md={6}>
                <FormGroup>
                  <Label for="gender">Gender</Label>
                  <InputGroup>
                    <InputGroupText>⚧</InputGroupText>
                    <Input
                      type="select"
                      id="gender"
                      value={formData.gender}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          gender: e.target.value,
                        })
                      }
                    >
                      <option value="">Select</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </Input>
                  </InputGroup>
                </FormGroup>
              </Col>

              {/* DOB with Flatpickr */}
              <Col md={6}>
                <FormGroup>
                  <Label for="dob">Date of Birth</Label>
                  <InputGroup>
                    <InputGroupText>
                      <Calendar size={16} />
                    </InputGroupText>
                    <Flatpickr
                      className="form-control"
                      id="dob"
                      placeholder="Select DOB"
                      value={formData.dob}
                      options={{
                        dateFormat: "Y-m-d",
                        maxDate: "today",
                      }}
                      onChange={(date) =>
                        setFormData({
                          ...formData,
                          dob: date[0],
                        })
                      }
                    />
                  </InputGroup>
                </FormGroup>
              </Col>
            </Row>

            <Row>
              {/* Address */}
              <Col md={6}>
                <FormGroup>
                  <Label for="address">Address</Label>
                  <InputGroup>
                    <InputGroupText>
                      <MapPin size={16} />
                    </InputGroupText>
                    <Input
                      type="text"
                      id="address"
                      value={formData.address}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          address: e.target.value,
                        })
                      }
                    />
                  </InputGroup>
                </FormGroup>
              </Col>

              {/* Blood Group */}
              <Col md={6}>
                <FormGroup>
                  <Label for="blood_group">Blood Group</Label>
                  <InputGroup>
                    <InputGroupText>
                      <Heart size={16} />
                    </InputGroupText>
                    <Input
                      type="text"
                      id="blood_group"
                      value={formData.blood_group}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          blood_group: e.target.value,
                        })
                      }
                    />
                  </InputGroup>
                </FormGroup>
              </Col>
            </Row>

            <Row>
              {/* Emergency Contact */}
              <Col md={6}>
                <FormGroup>
                  <Label for="emergency_contact">Emergency Contact</Label>
                  <InputGroup>
                    <InputGroupText>
                      <AlertTriangle size={16} />
                    </InputGroupText>
                    <Input
                      type="text"
                      id="emergency_contact"
                      value={formData.emergency_contact}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          emergency_contact: e.target.value,
                        })
                      }
                    />
                  </InputGroup>
                </FormGroup>
              </Col>

              {/* Allergies */}
              <Col md={6}>
                <FormGroup>
                  <Label for="allergies">Allergies (comma-separated)</Label>
                  <InputGroup>
                    <InputGroupText>
                      <AlertTriangle size={16} />
                    </InputGroupText>
                    <Input
                      type="text"
                      id="allergies"
                      value={formData.allergies}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          allergies: e.target.value,
                        })
                      }
                    />
                  </InputGroup>
                </FormGroup>
              </Col>
            </Row>
          </ModalBody>

          <ModalFooter>
            <Button color="secondary" onClick={() => setEditModal(false)}>
              Cancel
            </Button>
            <Button color="success" onClick={handleSave}>
              {isEdit ? "Save Changes" : "Register Patient"}
            </Button>
          </ModalFooter>
        </Modal>

        {/* Delete Modal */}
        <Modal isOpen={deleteModal} toggle={() => setDeleteModal(false)}>
          <ModalHeader
            toggle={() => setDeleteModal(false)}
            className="text-danger"
          >
            <Trash2 /> Confirm Delete
          </ModalHeader>
          <ModalBody>
            <h5>Are you sure you want to delete this patient?</h5>
            <p>
              <strong>{selectedPatient?.name}</strong> (ID:{" "}
              {selectedPatient?.user_id})
            </p>
            <Alert color="warning">This action cannot be undone.</Alert>
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={() => setDeleteModal(false)}>
              Cancel
            </Button>
            <Button color="danger" onClick={handleDeleteConfirm}>
              Delete Patient
            </Button>
          </ModalFooter>
        </Modal>
      </Container>
    </>
  );
};

export default PatientManagement;
