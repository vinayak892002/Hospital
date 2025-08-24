import React, { useState, useEffect } from "react";
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
import { Button } from "react-bootstrap";

const ViewReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getReports = async () => {
      try {
        const res = await fetch("http://localhost:1333/citius/getReports");
        const data = await res.json();
        if (res.status === 200) {
          setReports(data.data);
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
  }, []);

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
