import { useEffect, useState } from "react";
import { Container, Row, Col, Card, ListGroup, Button } from "react-bootstrap";
import { fetchDoctors, fetchPatients } from "../../api_services/api"; 
import "./style/doctorDashboard.css";
import Calendar from "./calendarComponent";
import MedicalRecordsButton from "../medicalRecords/MedicalRecordsButton";

function DoctorDashboard({ userInfo }) {
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const doctorsData = await fetchDoctors();
        const patientsData = await fetchPatients();
        setDoctors(doctorsData);
        setPatients(patientsData.slice(0, 8)); 
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return <p>Loading dashboard...</p>;
  }

  const column1Patients = patients.slice(0, 8);
  const column2Patients = patients.slice(8, 15);

  return (
    <div className="dashboard-container">
      <Container fluid>
        <Row>

          <Col md={2} className="sidebar d-flex flex-column">
            <Button variant="link" className="sidebar-icon">
              <i className="bi bi-grid"></i>
            </Button>
            <Button variant="link" className="sidebar-icon">
              <i className="bi bi-calendar"></i>
            </Button>
            <Button variant="link" className="sidebar-icon">
              <i className="bi bi-chat"></i>
            </Button>
            <Button variant="link" className="sidebar-icon">
              <i className="bi bi-gear"></i>
            </Button>
            <Button variant="link" className="sidebar-icon">
              <i className="bi bi-box-arrow-right"></i>
            </Button>
          </Col>


          <Col md={10} className="main-content">

            <Row className="top-bar align-items-center mb-4">
              <Col>
                <div className="search-bar">
                  <input
                    type="text"
                    className="form-control search-input"
                    placeholder="Search"
                  />
                </div>
              </Col>
              <Col className="text-end d-flex justify-content-end align-items-center">
                <i className="bi bi-bell me-3"></i>
                <div className="user-profile d-flex align-items-center">
                  <img
                      src={userInfo?.image || "https://via.placeholder.com/40"}
                    alt="User"
                    className="rounded-circle"
                  />
                  <span className="ms-2">`Dr. {userInfo ? userInfo.firstName : 'none'}`</span>
                </div>
              </Col>
            </Row>

            <h3 className="text-black">Good Morning <span className="text-danger">`Dr. {userInfo ? userInfo.firstName + ' ' + userInfo.lastName : 'none'}`</span></h3>


            <Row className="greeting-section">
              <Col md={7}>
                <Card className="greeting-card">
                  <Card.Body className="d-flex align-items-center flex-column justify-content-center">
                    <div className="greeting-text">
                      <p>Visits for Today</p>
                    </div>
                    <div className="greeting-stats">
                      <h1>{doctors.reduce((sum, doc) => sum + doc.visitsToday, 0)}</h1>
                    </div>
                    <div>
                    <MedicalRecordsButton/>
                    </div>
                  </Card.Body>
                </Card>

            <Row className="patient-list-section mt-4">
              <Col md={12}>
                <Card>
                  <Card.Body>
                    <h5>Patient List</h5>
                    <Row>
                      <Col md={6}>
                      <ListGroup>
                        {column1Patients.map((patient) => (
                          <ListGroup.Item
                            key={patient.id}
                            className="d-flex align-items-center justify-content-between"
                          >
                            <div className="d-flex align-items-center gap-3">
                              <span className={`circle-icon bg-${patient.bgColorClass}`}>
                                {patient.name.split(" ")[0][0] + patient.name.split(" ")[1][0]}
                              </span>
                              <div>
                                <p className="mb-0">{patient.name}</p>
                                <p className="mb-0 text-muted small">{patient.motive}</p>
                              </div>
                            </div>
                            <span className={`time-container ms-auto schedule-time txt-${patient.bgColorClass} bg-light-${patient.bgColorClass}`}>{patient.schedule}</span>
                          </ListGroup.Item>
                        ))}
                      </ListGroup>
                      </Col>


                      <Col md={6}>
                      <ListGroup>
                        {column2Patients.map((patient) => (
                          <ListGroup.Item
                            key={patient.id}
                            className="d-flex align-items-center justify-content-between"
                          >
                            <div className="d-flex align-items-center gap-3">
                              <span className={`circle-icon bg-${patient.bgColorClass}`}>
                                {patient.name.split(" ")[0][0] + patient.name.split(" ")[1][0]}
                              </span>
                              <div>
                                <p className="mb-0">{patient.name}</p>
                                <p className="mb-0 text-muted small">{patient.motive}</p>
                              </div>
                            </div>
                            <span className={`time-container ms-auto schedule-time txt-${patient.bgColorClass} bg-light-${patient.bgColorClass}`}>{patient.schedule}</span>
                          </ListGroup.Item>
                        ))}
                      </ListGroup>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
              </Col>
              <Col md={5}>
                <Card className="calendar-section">
                  <Card.Body>
                    <Calendar/>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default DoctorDashboard;
