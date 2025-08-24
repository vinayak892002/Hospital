import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import Select from "react-select";
import {
  Card,
  CardBody,
  Row,
  Col,
  InputGroup,
  Input,
  Button,
} from "reactstrap";
import { FileText, User, Clipboard, Upload } from "lucide-react";
import DataTable from "react-data-table-component";

const ManageReports = () => {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [testName, setTestName] = useState("");
  const [summary, setSummary] = useState("");
  const [file, setFile] = useState(null);
  const [reports, setReports] = useState([]);
  const [updating, setUpdating] = useState(0);

  // Fetch patients
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const res = await fetch("http://localhost:1333/citius/getPatients");
        const data = await res.json();

        const options = data.map((p) => ({
          value: p.user_id,
          label: p.name,
        }));
        setPatients(options);
      } catch (err) {
        console.error("Error fetching patients:", err);
      }
    };

    fetchPatients();
  }, []);

  // Fetch existing reports
  useEffect(() => {
    const getReports = async () => {
      try {
        const res = await fetch("http://localhost:1333/citius/getReports", {});

        const data = await res.json();
        if (res.status === 200) {
          setReports(data.data);
        }
      } catch (error) {
        return { status: 500, data: { message: "Internal server error" } };
      }
    };
    getReports();
  }, []);

  const addReport = async () => {
    if (!selectedPatient || !testName || !summary || !file) {
      toast.error("Please fill in all fields and upload a file");
      setUpdating(0);
      return;
    }

    try {
      const payload = {
        patient_id: selectedPatient.value,
        test_name: testName,
        result_summary: summary,
        created_by: "admin",
        report_file: file.name,
      };

      const res = await fetch("http://localhost:1333/citius/addReport", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.status === 200) {
        setReports((prev) => [...prev, data.data]);

        toast.success("Lab report added successfully!");

        // Reset form
        setSelectedPatient(null);
        setTestName("");
        setSummary("");
        setFile(null);
      } else {
        toast.error(data.message || "Failed to add report");
      }
    } catch (error) {
      console.error("Error adding report:", error);
      toast.error("Internal server error");
    } finally {
      setUpdating(0);
    }
  };

  // Trigger addReport when updating === 1
  useEffect(() => {
    if (updating === 1) {
      addReport();
    }
  }, [updating]);

  // Table columns
  const columns = [
    {
      name: "Patient",
      selector: (row) => row.patient_name,
      sortable: true,
    },
    { name: "Test Name", selector: (row) => row.test_name, sortable: true },
    { name: "Summary", selector: (row) => row.result_summary },
    { name: "Report File", selector: (row) => row.report_file },
    {
      name: "Created At",
      selector: (row) =>
        new Date(row.created_at).toLocaleDateString("en-GB") || "",
    },
  ];

  return (
    <Card
      className="shadow p-4"
      style={{ backgroundColor: "white", borderRadius: "12px" }}
    >
      <CardBody>
        <div className="d-flex align-items-center mb-4">
          <FileText size={32} className="text-primary me-3" />
          <div>
            <h3>Add Report</h3>
            <p className="text-muted mb-0">
              Manage patient reports ({reports.length} reports)
            </p>
          </div>
        </div>
        <div className="mb-3">
          <Row className="gy-3">
            {/* Patient Select */}
            <Col md={6}>
              <InputGroup>
                <span className="input-group-text">
                  <User size={18} />
                </span>
                <Select
                  options={patients}
                  placeholder="Select Patient"
                  value={selectedPatient}
                  onChange={(opt) => setSelectedPatient(opt)}
                  className="flex-grow-1"
                />
              </InputGroup>
            </Col>

            {/* Test Name */}
            <Col md={6}>
              <InputGroup>
                <span className="input-group-text">
                  <FileText size={18} />
                </span>
                <Input
                  type="text"
                  placeholder="Enter Test Name"
                  value={testName}
                  onChange={(e) => setTestName(e.target.value)}
                />
              </InputGroup>
            </Col>

            {/* Report Summary */}
            <Col md={6}>
              <InputGroup>
                <span className="input-group-text">
                  <Clipboard size={18} />
                </span>
                <Input
                  type="text"
                  placeholder="Enter Report Summary"
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                />
              </InputGroup>
            </Col>

            {/* File Upload */}
            <Col md={6}>
              <InputGroup>
                <span className="input-group-text">
                  <Upload size={18} />
                </span>
                <Input
                  type="file"
                  onChange={(e) => setFile(e.target.files[0])}
                />
              </InputGroup>
            </Col>

            {/* Button */}
            <Col md={12} className="text-end mt-3">
              <Button color="primary" onClick={() => setUpdating(1)}>
                Add Report
              </Button>
            </Col>
          </Row>
        </div>

        <DataTable
          columns={columns}
          data={reports}
          noDataComponent="No reports available"
          pagination
          highlightOnHover
          responsive
          striped
        />
      </CardBody>
    </Card>
  );
};

export default ManageReports;
