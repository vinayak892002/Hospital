import React, { useState, useEffect } from "react";
import Select from "react-select";
import toast from "react-hot-toast";
import { Row, Col, Form, Button, Table, Spinner } from "react-bootstrap";
import { FileText, UploadCloud, AlertCircle, CheckCircle } from "lucide-react";

const LabReports = () => {
  const [reports, setReports] = useState([]);
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [editingReport, setEditingReport] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [formData, setFormData] = useState({
    test_name: "",
    result_summary: "",
    report_file: null
  });

  useEffect(() => {
    fetchReports();
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const response = await fetch("http://localhost:1333/citius/reports/patients");
      const data = await response.json();
      if (response.status === 200) {
        const options = (data.users || []).map(patient => ({
          value: patient._id,
          label: `${patient.name} (${patient.email})`
        }));
        setPatients(options);
      } else {
        toast.error(data.message || "Failed to fetch patients");
      }
    } catch {
      toast.error("Failed to fetch patients");
    }
  };

  const fetchReports = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("http://localhost:1333/citius/reports");
      const data = await response.json();
      if (response.status === 200) {
        setReports(data.reports);
      } else {
        setError(data.message || "Failed to fetch reports");
      }
    } catch {
      setError("Internal server error");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
  };

  const handlePatientChange = (selectedOption) => {
    setSelectedPatient(selectedOption);
  };

  // If editing, populate the form with existing data
  const handleEdit = (report) => {
    setEditingReport(report);
    setFormData({
      test_name: report.test_name,
      result_summary: report.result_summary,
      report_file: null // you may not prefill file input
    });
    setSelectedPatient(
      patients.find(p => p.value === report.patient_id)
    );
    setSuccess("");
    setError("");
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this report?")) {
      try {
        const response = await fetch(
          `http://localhost:1333/citius/reports/${id}`,
          { method: "DELETE" }
        );
        const data = await response.json();
        if (response.status === 200) {
          toast.success("Report deleted");
          fetchReports();
        } else {
          toast.error(data.message || "Delete failed");
        }
      } catch {
        toast.error("Internal server error");
      }
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    setUploading(true);
    setError("");
    if (!selectedPatient) {
      setError("Please select a patient.");
      setUploading(false);
      return;
    }
    const uploadData = new FormData();
    uploadData.append("test_name", formData.test_name);
    uploadData.append("result_summary", formData.result_summary);
    uploadData.append("patient_id", selectedPatient.value);
    if (formData.report_file) uploadData.append("report_file", formData.report_file);

    let url = "http://localhost:1333/citius/reports";
    let method = "POST";

    if (editingReport) {
      url = `http://localhost:1333/citius/reports/${editingReport._id}`;
      method = "PUT";
    }

    try {
      const response = await fetch(url, {
        method,
        body: uploadData
      });
      const data = await response.json();
      if (response.status === 200) {
        toast.success(
          editingReport
            ? "Report updated successfully"
            : data.message || "Report uploaded"
        );
        setSuccess(
          editingReport
            ? "Report updated successfully"
            : "Report uploaded successfully"
        );
        fetchReports();
        setFormData({ test_name: "", result_summary: "", report_file: null });
        setSelectedPatient(null);
        setEditingReport(null);
      } else {
        setError(data.message || (editingReport ? "Update failed" : "Upload failed"));
      }
    } catch {
      setError("Internal server error");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light p-3">
      <div className="w-100" style={{ maxWidth: "1200px" }}>
        <Row className="shadow-lg rounded-2xl overflow-hidden">
          {/* Left Side - Lab Reports List */}
          <Col md={7} className="p-5 bg-white">
            <div className="text-center mb-4">
              <h3 className="fw-bold text-primary mb-2">
                <FileText size={32} className="me-2" />
                Lab Reports
              </h3>
              <p className="text-muted">View all your lab reports here</p>
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
            {loading ? (
              <Spinner animation="border" className="mt-4" />
            ) : (
              <Table bordered hover responsive className="mt-3">
                <thead>
                  <tr>
                    <th>Test Name</th>
                    <th>Result Summary</th>
                    <th>Uploaded By</th>
                    <th>Date</th>
                    <th>Report File</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.map(report => (
                    <tr key={report._id || report.report_id}>
                      <td>{report.test_name}</td>
                      <td>{report.result_summary}</td>
                      <td>{report.created_by}</td>
                      <td>{new Date(report.created_at).toLocaleString()}</td>
                      <td>
                        <a
                          href={`http://localhost:1333/${report.report_file}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-sm btn-primary"
                        >
                          View/File
                        </a>
                      </td>
                      <td>
                        <Button
                          size="sm"
                          variant="warning"
                          className="me-2"
                          onClick={() => handleEdit(report)}
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => handleDelete(report._id || report.report_id)}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </Col>
          {/* Right Side - Upload/Edit Form */}
          <Col
            md={5}
            className="text-white d-flex flex-column justify-content-center p-5"
            style={{
              background: "linear-gradient(135deg, #2563eb 0%, #9333ea 100%)",
            }}
          >
            <div className="mb-4 text-center">
              <UploadCloud size={40} className="mb-3" />
              <h4 className="fw-bold mb-2 text-white">
                {editingReport ? "Edit Lab Report" : "Upload New Lab Report"}
              </h4>
              <p className="lead mb-0 opacity-75">
                Only lab technicians can {editingReport ? "edit" : "upload"} reports
              </p>
            </div>
            <Form onSubmit={handleUpload}>
              <Form.Group className="mb-3">
                <Form.Label>Search & Select Patient *</Form.Label>
                <Select
                  options={patients}
                  value={selectedPatient}
                  onChange={handlePatientChange}
                  placeholder="Type to search..."
                  isClearable
                  isSearchable
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Test Name *</Form.Label>
                <Form.Control
                  type="text"
                  name="test_name"
                  placeholder="e.g. CBC"
                  value={formData.test_name}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Result Summary *</Form.Label>
                <Form.Control
                  type="text"
                  name="result_summary"
                  placeholder="Enter summary"
                  value={formData.result_summary}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Report File (PDF/Image) {editingReport ? "(leave empty to keep existing)" : "*"}</Form.Label>
                <Form.Control
                  type="file"
                  name="report_file"
                  accept="application/pdf,image/*"
                  onChange={handleInputChange}
                  // not required during edit
                  required={!editingReport}
                />
              </Form.Group>
              <Button
                type="submit"
                className="w-100"
                disabled={uploading}
                variant="light"
              >
                {uploading
                  ? (editingReport ? "Updating..." : "Uploading...")
                  : (editingReport ? "Update Report" : "Upload Report")}
              </Button>
              {editingReport && (
                <Button
                  type="button"
                  variant="secondary"
                  className="w-100 mt-2"
                  onClick={() => {
                    setEditingReport(null);
                    setFormData({ test_name: "", result_summary: "", report_file: null });
                    setSelectedPatient(null);
                  }}
                >
                  Cancel Edit
                </Button>
              )}
            </Form>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default LabReports;
