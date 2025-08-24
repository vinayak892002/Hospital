import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  InputGroup,
  Alert,
} from "react-bootstrap";
import {
  User,
  Mail,
  Lock,
  Phone,
  Calendar,
  MapPin,
  Shield,
  Stethoscope,
  Users,
  FlaskConical,
  Pill,
  UserCheck,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

const RegistrationPage = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [updated, setUpdated] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
    contact_number: "",
    gender: "",
    dob: "",
    blood_group: "",
    address: "",
    emergency_contact: "",
    allergies: "",
    department: "",
    qualification: "",
    availability: {
      Monday: "",
      Tuesday: "",
      Wednesday: "",
      Thursday: "",
      Friday: "",
      Saturday: "",
      Sunday: "",
    },
  });

  const roles = [
    { value: "Admin", label: "Admin", icon: <UserCheck size={20} /> },
    { value: "Doctor", label: "Doctor", icon: <Stethoscope size={20} /> },
    { value: "Receptionist", label: "Receptionist", icon: <Users size={20} /> },
    { value: "Patient", label: "Patient", icon: <User size={20} /> },
    { value: "Pharmacist", label: "Pharmacist", icon: <Pill size={20} /> },
    {
      value: "LabTech",
      label: "Lab Technician",
      icon: <FlaskConical size={20} />,
    },
  ];

  const departments = [
    {
      value: "Cardiology",
      description: "Heart and cardiovascular system care",
    },
    { value: "Neurology", description: "Brain and nervous system disorders" },
    { value: "Orthopedics", description: "Bone, joint, and muscle treatment" },
    {
      value: "Pediatrics",
      description: "Medical care for children and infants",
    },
    { value: "Dermatology", description: "Skin, hair, and nail conditions" },
    {
      value: "Psychiatry",
      description: "Mental health and behavioral disorders",
    },
    { value: "Oncology", description: "Cancer diagnosis and treatment" },
    { value: "Radiology", description: "Medical imaging and diagnostics" },
    { value: "Emergency Medicine", description: "Urgent and critical care" },
    {
      value: "Internal Medicine",
      description: "Adult disease prevention and treatment",
    },
  ];

  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("availability_")) {
      const day = name.split("_")[1];
      setFormData((prev) => ({
        ...prev,
        availability: {
          ...prev.availability,
          [day]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const validateStep1 = () => {
    const { name, email, password, confirmPassword, role, contact_number } =
      formData;

    if (
      !name ||
      !email ||
      !password ||
      !confirmPassword ||
      !role ||
      !contact_number
    ) {
      setError("Please fill in all required fields");
      return false;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return false;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return false;
    }

    return true;
  };

  const validateStep2 = () => {
    const { gender, dob, address, emergency_contact } = formData;

    if (!gender || !dob || !address || !emergency_contact) {
      setError("Please fill in all required fields");
      return false;
    }

    if (formData.role === "Doctor") {
      if (!formData.department || !formData.qualification) {
        setError("Please fill in department and qualification for Doctor role");
        return false;
      }
    }

    return true;
  };

  const nextStep = () => {
    setError("");
    if (validateStep1()) {
      setCurrentStep(2);
    }
  };

  const prevStep = () => {
    setCurrentStep(1);
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (validateStep2()) {
      setUpdated(1);
    }
  };

  useEffect(() => {
    if (updated === 1) {
      handleRegistration();
      setUpdated(0);
    }
  }, [updated]);

  const handleRegistration = async () => {
    try {
      // const apiUrl = `${process.env.REACT_APP_API_URL}/register`;

      const registrationData = {
        ...formData,
        allergies: formData.allergies
          ? formData.allergies.split(",").map((item) => item.trim())
          : [],
      };

      if (formData.role !== "Doctor") {
        delete registrationData.department;
        delete registrationData.qualification;
        delete registrationData.availability;
      }

      delete registrationData.confirmPassword;

      const response = await fetch(`http://localhost:1333/citius/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(registrationData),
      });

      const responseData = await response.json();

      if (response.status === 200) {
        toast.success(responseData.message );
        setTimeout(() => {
          navigate("/login"); 
        }, 2000);
      } else {
        toast.error(responseData.message );
        setTimeout(() => {
          navigate("/register"); 
        }, 2000);
      }
    } catch (error) {
      toast.error("Internal server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light p-3">
      <Container fluid>
        <Row className="justify-content-center">
          <Col xl={10} lg={12}>
            <Card className="shadow-lg border-0 overflow-hidden">
              <Row className="g-0">
                {/* Left side - Company info */}
                <Col
                  md={6}
                  className="bg-primary text-white d-flex flex-column justify-content-center p-5"
                  style={{
                    background:
                      "linear-gradient(135deg, #2563eb 0%, #9333ea 100%)",
                  }}
                >
                  <div className="text-center">
                    <div className="mb-4">
                      <Shield size={80} className="text-white" />
                    </div>
                    <h2 className="mb-4 fw-bold text-white">
                      HealthCare Management
                    </h2>
                    <p className="lead mb-5 opacity-75">
                      Join our comprehensive healthcare management system
                    </p>
                    <div className="text-start">
                      <div className="d-flex align-items-center mb-3">
                        <Stethoscope size={24} className="me-3" />
                        <span className="fs-6">Advanced Medical Care</span>
                      </div>
                      <div className="d-flex align-items-center mb-3">
                        <Users size={24} className="me-3" />
                        <span className="fs-6">Expert Healthcare Team</span>
                      </div>
                      <div className="d-flex align-items-center mb-3">
                        <Shield size={24} className="me-3" />
                        <span className="fs-6">Secure & Reliable Platform</span>
                      </div>
                    </div>
                  </div>
                </Col>

                {/* Right side - Registration form */}
                <Col md={6}>
                  <div className="p-5">
                    <div className="text-center mb-4">
                      <h3 className="fw-bold text-primary mb-2">
                        Create Account
                      </h3>
                      <p className="text-muted">Step {currentStep} of 2</p>
                      <div className="d-flex justify-content-center mt-3">
                        <div className="d-flex">
                          <div
                            className={`rounded-circle me-2 ${
                              currentStep >= 1 ? "bg-primary" : "bg-secondary"
                            }`}
                            style={{ width: "12px", height: "12px" }}
                          ></div>
                          <div
                            className={`rounded-circle ${
                              currentStep >= 2 ? "bg-primary" : "bg-secondary"
                            }`}
                            style={{ width: "12px", height: "12px" }}
                          ></div>
                        </div>
                      </div>
                    </div>

                    {error && (
                      <Alert
                        variant="danger"
                        className="d-flex align-items-center"
                      >
                        <AlertCircle size={20} className="me-2" />
                        {error}
                      </Alert>
                    )}
                    {success && (
                      <Alert
                        variant="success"
                        className="d-flex align-items-center"
                      >
                        <CheckCircle size={20} className="me-2" />
                        {success}
                      </Alert>
                    )}

                    <Form
                      onSubmit={
                        currentStep === 2
                          ? handleSubmit
                          : (e) => e.preventDefault()
                      }
                    >
                      {currentStep === 1 && (
                        <>
                          <Form.Group className="mb-3">
                            <Form.Label>Full Name *</Form.Label>
                            <InputGroup>
                              <InputGroup.Text>
                                <User size={18} />
                              </InputGroup.Text>
                              <Form.Control
                                type="text"
                                name="name"
                                placeholder="Enter your full name"
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                              />
                            </InputGroup>
                          </Form.Group>

                          <Form.Group className="mb-3">
                            <Form.Label>Email Address *</Form.Label>
                            <InputGroup>
                              <InputGroup.Text>
                                <Mail size={18} />
                              </InputGroup.Text>
                              <Form.Control
                                type="email"
                                name="email"
                                placeholder="Enter your email"
                                value={formData.email}
                                onChange={handleInputChange}
                                required
                              />
                            </InputGroup>
                          </Form.Group>

                          <Row>
                            <Col md={6}>
                              <Form.Group className="mb-3">
                                <Form.Label>Password *</Form.Label>
                                <InputGroup>
                                  <InputGroup.Text>
                                    <Lock size={18} />
                                  </InputGroup.Text>
                                  <Form.Control
                                    type="password"
                                    name="password"
                                    placeholder="Enter password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    required
                                  />
                                </InputGroup>
                              </Form.Group>
                            </Col>
                            <Col md={6}>
                              <Form.Group className="mb-3">
                                <Form.Label>Confirm Password *</Form.Label>
                                <InputGroup>
                                  <InputGroup.Text>
                                    <Lock size={18} />
                                  </InputGroup.Text>
                                  <Form.Control
                                    type="password"
                                    name="confirmPassword"
                                    placeholder="Confirm password"
                                    value={formData.confirmPassword}
                                    onChange={handleInputChange}
                                    required
                                  />
                                </InputGroup>
                              </Form.Group>
                            </Col>
                          </Row>

                          <Form.Group className="mb-3">
                            <Form.Label>Role *</Form.Label>
                            <Form.Select
                              name="role"
                              value={formData.role}
                              onChange={handleInputChange}
                              required
                            >
                              <option value="">Select your role</option>
                              {roles.map((role) => (
                                <option key={role.value} value={role.value}>
                                  {role.label}
                                </option>
                              ))}
                            </Form.Select>
                          </Form.Group>

                          <Form.Group className="mb-3">
                            <Form.Label>Contact Number *</Form.Label>
                            <InputGroup>
                              <InputGroup.Text>
                                <Phone size={18} />
                              </InputGroup.Text>
                              <Form.Control
                                type="tel"
                                name="contact_number"
                                placeholder="Enter your contact number"
                                value={formData.contact_number}
                                onChange={handleInputChange}
                                required
                              />
                            </InputGroup>
                          </Form.Group>

                          <Button
                            variant="primary"
                            size="lg"
                            className="w-100 mt-3"
                            onClick={nextStep}
                          >
                            Next Step
                          </Button>
                        </>
                      )}

                      {currentStep === 2 && (
                        <>
                          <Row>
                            <Col md={6}>
                              <Form.Group className="mb-3">
                                <Form.Label>Gender *</Form.Label>
                                <Form.Select
                                  name="gender"
                                  value={formData.gender}
                                  onChange={handleInputChange}
                                  required
                                >
                                  <option value="">Select gender</option>
                                  <option value="Male">Male</option>
                                  <option value="Female">Female</option>
                                  <option value="Other">Other</option>
                                </Form.Select>
                              </Form.Group>
                            </Col>
                            <Col md={6}>
                              <Form.Group className="mb-3">
                                <Form.Label>Date of Birth *</Form.Label>
                                <InputGroup>
                                  <InputGroup.Text>
                                    <Calendar size={18} />
                                  </InputGroup.Text>
                                  <Form.Control
                                    type="date"
                                    name="dob"
                                    value={formData.dob}
                                    onChange={handleInputChange}
                                    required
                                  />
                                </InputGroup>
                              </Form.Group>
                            </Col>
                          </Row>

                          <Row>
                            <Col md={6}>
                              <Form.Group className="mb-3">
                                <Form.Label>Blood Group</Form.Label>
                                <Form.Select
                                  name="blood_group"
                                  value={formData.blood_group}
                                  onChange={handleInputChange}
                                >
                                  <option value="">Select blood group</option>
                                  {bloodGroups.map((group) => (
                                    <option key={group} value={group}>
                                      {group}
                                    </option>
                                  ))}
                                </Form.Select>
                              </Form.Group>
                            </Col>
                            <Col md={6}>
                              <Form.Group className="mb-3">
                                <Form.Label>Emergency Contact *</Form.Label>
                                <InputGroup>
                                  <InputGroup.Text>
                                    <Phone size={18} />
                                  </InputGroup.Text>
                                  <Form.Control
                                    type="tel"
                                    name="emergency_contact"
                                    placeholder="Emergency contact number"
                                    value={formData.emergency_contact}
                                    onChange={handleInputChange}
                                    required
                                  />
                                </InputGroup>
                              </Form.Group>
                            </Col>
                          </Row>

                          <Form.Group className="mb-3">
                            <Form.Label>Address *</Form.Label>
                            <InputGroup>
                              <InputGroup.Text>
                                <MapPin size={18} />
                              </InputGroup.Text>
                              <Form.Control
                                as="textarea"
                                rows={3}
                                name="address"
                                placeholder="Enter your complete address"
                                value={formData.address}
                                onChange={handleInputChange}
                                required
                              />
                            </InputGroup>
                          </Form.Group>

                          {formData.role !== "Doctor" && (
                            <Form.Group className="mb-3">
                              <Form.Label>Allergies</Form.Label>
                              <Form.Control
                                as="textarea"
                                rows={2}
                                name="allergies"
                                placeholder="List any allergies (comma separated)"
                                value={formData.allergies}
                                onChange={handleInputChange}
                              />
                            </Form.Group>
                          )}

                          {formData.role === "Doctor" && (
                            <>
                              <Form.Group className="mb-3">
                                <Form.Label>Department *</Form.Label>
                                <Form.Select
                                  name="department"
                                  value={formData.department}
                                  onChange={handleInputChange}
                                  required
                                >
                                  <option value="">Select department</option>
                                  {departments.map((dept) => (
                                    <option key={dept.value} value={dept.value}>
                                      {dept.value} - {dept.description}
                                    </option>
                                  ))}
                                </Form.Select>
                              </Form.Group>

                              <Form.Group className="mb-3">
                                <Form.Label>Qualification *</Form.Label>
                                <Form.Control
                                  type="text"
                                  name="qualification"
                                  placeholder="e.g., MBBS, MD, MS"
                                  value={formData.qualification}
                                  onChange={handleInputChange}
                                  required
                                />
                              </Form.Group>

                              <Form.Group className="mb-3">
                                <Form.Label>Weekly Availability</Form.Label>
                                <Row>
                                  {Object.keys(formData.availability).map(
                                    (day) => (
                                      <Col md={6} key={day} className="mb-2">
                                        <Form.Label className="small">
                                          {day}
                                        </Form.Label>
                                        <Form.Control
                                          type="text"
                                          name={`availability_${day}`}
                                          placeholder="e.g., 9:00-17:00"
                                          value={formData.availability[day]}
                                          onChange={handleInputChange}
                                          size="sm"
                                        />
                                      </Col>
                                    )
                                  )}
                                </Row>
                              </Form.Group>
                            </>
                          )}

                          <div className="d-flex justify-content-between mt-4">
                            <Button
                              variant="outline-secondary"
                              onClick={prevStep}
                            >
                              Previous
                            </Button>
                            <Button
                              variant="primary"
                              type="submit"
                              disabled={loading}
                              size="lg"
                            >
                              {loading ? "Registering..." : "Register"}
                            </Button>
                          </div>
                        </>
                      )}
                    </Form>
                  </div>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default RegistrationPage;
