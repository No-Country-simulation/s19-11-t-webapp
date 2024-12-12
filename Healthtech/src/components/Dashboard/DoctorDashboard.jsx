import { useEffect, useState } from "react";
import { Container, Row, Col, Card, ListGroup, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import axios from "axios";
import dayjs from "dayjs";
import { fetchDoctors } from "../../api_services/api";
import useStore from "../../useStore"; // Import Zustand store
import "./style/doctorDashboard.css";
import Calendar from "./calendarComponent";
import MedicalRecordsButton from "../medicalRecords/MedicalRecordsButton";

function DoctorDashboard({ user }) {
  const [doctors, setDoctors] = useState([]);
  const [citas, setCitas] = useState([]);
  const [loading, setLoading] = useState(true);
  const clearUser = useStore((state) => state.clearUser); // Zustand action to clear user
  const navigate = useNavigate(); // Initialize navigate function

  const handleLogout = () => {
    clearUser();
    window.location.href = "/"; // Redirect to the home page after logout
  };

  const getAppointments = async (medicoId, estado, sort, order) => {
    try {
      const apiUrl = "http://localhost:3000/api/citas";
      const fecha = dayjs().format("YYYY-MM-DD"); // Current date
      const params = {
        medicoId,
        fecha,
        estado,
        sort,
        order,
      };

      const response = await axios.get(apiUrl, { params });
      console.log("citas obtenidas:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching appointments:", error);
      return [];
    }
  };
  const handlePatientClick = (patient) => {
    // Navigate to medical records page with patient details
    navigate("/medical-records", {
      state: {
        patientId: patient.id,
        patientFirstName: patient.first_name,
        patientLastName: patient.last_name,
      },
    });
  };
  useEffect(() => {
    const loadData = async () => {
      try {
        const doctorsData = await fetchDoctors();
        setDoctors(doctorsData);

        const citasData = await getAppointments(
          user.user_id,
          "agendada",
          "fecha,hora_inicio",
          "asc"
        );
        setCitas(citasData);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user.id]);

  if (loading) {
    return <p>Loading dashboard...</p>;
  }

  const mitad = Math.ceil(citas.length / 2);
  const column1Patients = citas.slice(0, mitad);
  const column2Patients = citas.slice(mitad);

  return (
    <div className="dashboard-container">
      <Container fluid>
        <Row>
          <Col md={1} className="sidebar d-flex flex-column">
            <Button variant="link" className="sidebar-icon">
              <i className="bi bi-house-door"></i>
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
            <Button variant="link" className="sidebar-icon" onClick={handleLogout}>
              <i className="bi bi-box-arrow-right"></i>
            </Button>
          </Col>

          <Col md={10} className="main-content">
            <Row className="top-bar align-items-center mb-4">
              <Col>
                <div className="search-bar">
                  <input type="text" className="form-control search-input" placeholder="Search" />
                </div>
              </Col>
              <Col className="text-end d-flex justify-content-end align-items-center">
                <i className="bi bi-bell me-3"></i>
                <div className="user-profile d-flex align-items-center">
                  <img src={user.image || "https://via.placeholder.com/40"} alt="User" className="rounded-circle" />
                  <span className="ms-2">Dr. {user.first_name}</span>
                </div>
              </Col>
            </Row>

            <h3 className="text-black">
              Good Morning <span className="text-danger">Dr. {`${user.first_name} ${user.last_name}`}</span>
            </h3>

            <Row className="greeting-section">
              <Col md={7}>
                <Card className="greeting-card">
                  <Card.Body className="d-flex align-items-center flex-column justify-content-center">
                    <div className="greeting-text">
                      <p>Visits for Today</p>
                    </div>
                    <div className="greeting-stats">
                      <h1>{citas.length}</h1>
                    </div>
                    <div>
                      <MedicalRecordsButton />
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
                              {column1Patients.length > 0 ? (
                                column1Patients.map((cita, index) => (
                                  <ListGroup.Item key={index} className="d-flex align-items-center justify-content-between">
                                    <div className="d-flex align-items-center gap-3">
                                      <span className="circle-icon bg-info">{cita.paciente.initials}</span>
                                      <div>
                                        <p className="mb-0">
                                          {cita.paciente.first_name} {cita.paciente.last_name}
                                        </p>
                                        <p className="mb-0 text-muted small">{cita.detalle}</p>
                                      </div>
                                    </div>
                                    <span className={`time-container ms-auto schedule-time txt-info bg-light-info`}>
                                      {dayjs(`2024-01-01T${cita.hora_inicio}`, "HH:mm:ss").format("h:mm A")}
                                    </span>
                                  </ListGroup.Item>
                                ))
                              ) : (
                                <p>No upcoming appointments.</p>
                              )}
                            </ListGroup>
                          </Col>
                          <Col md={6}>
                            <ListGroup>
                              {column2Patients.length > 0 ? (
                                column2Patients.map((cita, index) => (
                                  <ListGroup.Item key={index} className="d-flex align-items-center justify-content-between">
                                    <div className="d-flex align-items-center gap-3">
                                      <span className="circle-icon bg-primary">{cita.paciente.initials}</span>
                                      <div>
                                        <p className="mb-0">
                                          {cita.paciente.first_name} {cita.paciente.last_name}
                                        </p>
                                        <p className="mb-0 text-muted small">{cita.detalle}</p>
                                      </div>
                                    </div>
                                    <span className={`time-container ms-auto schedule-time txt-primary bg-light-primary`}>
                                      {dayjs(`2024-01-01T${cita.hora_inicio}`, "HH:mm:ss").format("h:mm A")}
                                    </span>
                                  </ListGroup.Item>
                                ))
                              ) : (
                                <p>No upcoming appointments.</p>
                              )}
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
                    <Calendar />
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

DoctorDashboard.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.number.isRequired,
    first_name: PropTypes.string.isRequired,
    last_name: PropTypes.string.isRequired,
    user_type: PropTypes.string.isRequired,
  }).isRequired,
};

export default DoctorDashboard;
