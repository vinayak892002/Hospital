import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
import { FileText, User, Clipboard, Upload, Edit, Trash2 } from "lucide-react";
import DataTable from "react-data-table-component";

const ManageReports = () => {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [testName, setTestName] = useState("");
  const [summary, setSummary] = useState("");
  const [file, setFile] = useState(null);
  const [reports, setReports] = useState([]);
  const [editing, setEditing] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const hmsToken = localStorage.getItem("hmsToken");
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));

    if (userInfo.role !== "LabTech") {
      navigate("/login");
    }
  }, []);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const res = await fetch("http://localhost:1333/citius/getPatients");
        const data = await res.json();
        const options = data.map((p) => ({ value: p.user_id, label: p.name }));
        setPatients(options);
      } catch (err) {
        console.error(err);
      }
    };
    fetchPatients();
  }, []);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await fetch("http://localhost:1333/citius/getReports");
        const data = await res.json();
        if (res.status === 200) setReports(data.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchReports();
  }, []);

  const saveReport = async () => {
    if (!selectedPatient || !testName || !summary) {
      toast.error("Please fill all fields");
      return;
    }

    const payload = {
      patient_id: selectedPatient.value,
      test_name: testName,
      result_summary: summary,
      report_file: file?.name || (editing ? editing.report_file : null),
      created_by: "LabTech",
    };

    try {
      let res, data;
      if (editing) {
        res = await fetch(
          `http://localhost:1333/citius/updateReport/${editing.report_id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          }
        );
        data = await res.json();
        if (res.status === 200) {
          setReports((prev) =>
            prev.map((r) => (r.report_id === editing.report_id ? data.data : r))
          );
          toast.success("Report updated successfully!");
        } else {
          toast.error(data.message || "Failed to update report");
        }
      } else {
        res = await fetch("http://localhost:1333/citius/addReport", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        data = await res.json();
        if (res.status === 200) {
          setReports((prev) => [...prev, data.data]);
          toast.success("Report added successfully!");
        } else {
          toast.error(data.message || "Failed to add report");
        }
      }

      setSelectedPatient(null);
      setTestName("");
      setSummary("");
      setFile(null);
      setEditing(null);
    } catch (err) {
      console.error(err);
      toast.error("Internal server error");
    }
  };

  const handleEdit = (report) => {
    setSelectedPatient({
      value: report.patient_id,
      label: report.patient_name,
    });
    setTestName(report.test_name);
    setSummary(report.result_summary);
    setFile(null);
    setEditing(report);
  };

  const handleDelete = async (report) => {
    if (!window.confirm("Are you sure you want to delete this report?")) return;
    try {
      const res = await fetch(
        `http://localhost:1333/citius/deleteReport/${report.report_id}`,
        { method: "DELETE" }
      );
      const data = await res.json();
      if (res.status === 200) {
        setReports((prev) =>
          prev.filter((r) => r.report_id !== report.report_id)
        );
        toast.success("Report deleted successfully!");
      } else {
        toast.error(data.message || "Failed to delete report");
      }
    } catch (err) {
      console.error(err);
      toast.error("Internal server error");
    }
  };

  const columns = [
    { name: "Patient", selector: (row) => row.patient_name, sortable: true },
    { name: "Test Name", selector: (row) => row.test_name, sortable: true },
    { name: "Summary", selector: (row) => row.result_summary },
    { name: "Report File", selector: (row) => row.report_file },
    {
      name: "Created At",
      selector: (row) =>
        new Date(row.created_at).toLocaleDateString("en-GB") || "",
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="d-flex gap-2">
          <Edit
            size={20}
            className="text-warning cursor-pointer"
            onClick={() => handleEdit(row)}
          />
          <Trash2
            size={20}
            className="text-danger cursor-pointer"
            onClick={() => handleDelete(row)}
          />
        </div>
      ),
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
            <h3>{editing ? "Edit Report" : "Add Report"}</h3>
            <p className="text-muted mb-0">
              Manage patient reports ({reports.length} reports)
            </p>
          </div>
        </div>

        <Row className="gy-3 mb-3">
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
          <Col md={6}>
            <InputGroup>
              <span className="input-group-text">
                <Upload size={18} />
              </span>
              <Input type="file" onChange={(e) => setFile(e.target.files[0])} />
            </InputGroup>
          </Col>
          <Col md={12} className="text-end mt-3">
            <Button color="primary" onClick={saveReport}>
              {editing ? "Update Report" : "Add Report"}
            </Button>
          </Col>
        </Row>

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
