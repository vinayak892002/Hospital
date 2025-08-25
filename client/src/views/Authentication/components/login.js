import React, { useState, useEffect } from "react";

import toast from "react-hot-toast";
import { Row, Col, Form, Button, InputGroup } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import {
  Shield,
  Stethoscope,
  Users,
  Mail,
  Lock,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [updating, setUpdating] = useState(null);

  const navigate = useNavigate();
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    if (updating === 1) {
      handleLogin();
    }
  }, [updating]);

  const handleLogin = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("http://localhost:1333/citius/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.status === 200) {
        const { token, user } = data;

        localStorage.setItem("hmsToken", token);

        localStorage.setItem("userInfo", JSON.stringify(user));
        toast.success(data.message);
        navigate("/landingPage");
      } else {
        toast.error(data.message);
        setTimeout(() => {
          navigate("/login");
        }, 1000);
      }
    } catch (error) {
      toast.error("Internal server error");
    } finally {
      setLoading(false);
      setUpdating(null);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light p-3">
      <div className="w-100" style={{ maxWidth: "1200px" }}>
        <Row className="shadow-lg rounded-2xl overflow-hidden">
          {/* Left Side - Login Form */}
          <Col md={6} className="p-5 bg-white">
            <div className="text-center mb-4">
              <h3 className="fw-bold text-primary mb-2">Welcome Back</h3>
              <p className="text-muted">Sign in to your healthcare account</p>
            </div>

            {error && (
              <div className="d-flex align-items-center bg-danger bg-opacity-10 border border-danger text-danger px-3 py-2 rounded mb-3">
                <AlertCircle size={20} className="me-2" /> {error}
              </div>
            )}
            {success && (
              <div className="d-flex align-items-center bg-success bg-opacity-10 border border-success text-success px-3 py-2 rounded mb-3">
                <CheckCircle size={20} className="me-2" /> {success}
              </div>
            )}

            <Form>
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

              <Form.Group className="mb-3">
                <Form.Label>Password *</Form.Label>
                <InputGroup>
                  <InputGroup.Text>
                    <Lock size={18} />
                  </InputGroup.Text>
                  <Form.Control
                    type="password"
                    name="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                  />
                </InputGroup>
              </Form.Group>

              <div className="d-flex justify-content-between align-items-center mb-3">
                <Form.Check type="checkbox" label="Remember me" />
                <a href="#" className="text-primary">
                  Forgot Password?
                </a>
              </div>

              <Button
                className="w-100 mb-3"
                disabled={loading}
                variant="primary"
                onClick={() => setUpdating(1)}
              >
                {loading ? "Signing In..." : "Sign In"}
              </Button>

              <div className="text-center">
                <p className="text-muted">
                  Don't have an account?{" "}
                  <span
                    onClick={() => navigate("/register")}
                    className="text-primary"
                    style={{ cursor: "pointer" }}
                  >
                    Register here
                  </span>
                </p>
              </div>
            </Form>
          </Col>

          <Col
            md={6}
            className="text-white d-flex flex-column justify-content-center p-5"
            style={{
              background: "linear-gradient(135deg,  #2563eb 0%, #9333ea 100%)",
            }}
          >
            <div className="text-center">
              <Shield size={80} className="mb-4" />
              <h2 className="fw-bold mb-3 text-white">HealthCare Management</h2>
              <p className="lead mb-4 opacity-75">
                Access your comprehensive healthcare management system
              </p>
              <div className="text-start">
                <div className="d-flex align-items-center mb-2">
                  <Stethoscope size={24} className="me-2" /> Advanced Medical
                  Care
                </div>
                <div className="d-flex align-items-center mb-2">
                  <Users size={24} className="me-2" /> Expert Healthcare Team
                </div>
                <div className="d-flex align-items-center">
                  <Shield size={24} className="me-2" /> Secure & Reliable
                  Platform
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};
export default Login;
