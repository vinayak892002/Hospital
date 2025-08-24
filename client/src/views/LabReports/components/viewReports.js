import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  CardHeader,
  CardBody,
  Spinner,
  Alert,
} from "reactstrap";
import DataTable from "react-data-table-component";

const ViewReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const getReports = async () => {
      try {
        const hmsToken = localStorage.getItem("hmsToken");
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));

        if (!hmsToken || !userInfo) {
          navigate("/login");
          return;
        }

        const tokenPayload = JSON.parse(atob(hmsToken.split(".")[1]));
        const role = tokenPayload.role;
        const userId = userInfo.user_id;

        const res = await fetch("http://localhost:1333/citius/getReports");
        const data = await res.json();

        if (res.status === 200) {
          let filteredReports = data.data;

          if (role === "patient") {
            filteredReports = filteredReports.filter(
              (report) => report.patient_id === userId
            );
          }

          setReports(filteredReports);
        } else {
          setError("Failed to fetch reports");
        }
      } catch (err) {
        setError("Internal server error");
      } finally {
        setLoading(false);
      }
    };

    getReports();
  }, [navigate]);

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
  ];

  return (
    <Container className="mt-4">
      <Row>
        <Col>
          <Card>
            <CardHeader className="d-flex justify-content-between align-items-center">
              <h5>Lab Reports</h5>
            </CardHeader>
            <CardBody>
              {loading && <Spinner color="primary" />}
              {error && <Alert color="danger">{error}</Alert>}
              {!loading && !error && (
                <DataTable
                  columns={columns}
                  data={reports}
                  pagination
                  highlightOnHover
                  striped
                  responsive
                />
              )}
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ViewReports;
