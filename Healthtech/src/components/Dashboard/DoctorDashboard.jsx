import { useEffect, useState } from "react";
import { Container, Row, Col, Card, ListGroup, Button } from "react-bootstrap";
import { fetchPatients, fetchDoctors } from "../../api_services/api";
import "./style/doctorDashboard.css";
import Calendar from "./calendarComponent";
import MedicalRecordsButton from "../medicalRecords/MedicalRecordsButton";
import axios from "axios";
import dayjs from "dayjs";

function DoctorDashboard({ userInfo }) {
  console.log("userInfo", userInfo);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [citas, setCitas] = useState([]);

  const medicoId = userInfo.id ? userInfo.id : 1;

  // Traer citas segun filtro
  const getAppointments = async (medicoId, estado, sort, order) => {
    try {
      // Endpoint del servicio
      const apiUrl = "http://localhost:3000/api/citas";

      // const fecha = new Date();
      const fecha = "2024-12-12";

      console.log("paso fecha:", fecha);
      // Filtros
      const params = {
        medicoId: medicoId,
        fecha: fecha,
        estado: estado,
        sort: sort,
        order: order,
      };

      const response = await axios.get(apiUrl, { params });

      const citas = response.data;
      console.log("Citas devueltas por el back:", citas);

      return citas;
    } catch (error) {
      console.error("Error al obtener las últimas citas realizadas:", error);
      return [];
    }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const doctorsData = await fetchDoctors();
        setDoctors(doctorsData);

        let citas = await getAppointments(medicoId, "agendada", "fecha,hora_inicio", "asc");
        setCitas(citas);
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

  const mitad = citas.length / 2;
  const column1Patients = citas.slice(0, mitad);
  const column2Patients = citas.slice(mitad, 15);

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
                  <input type="text" className="form-control search-input" placeholder="Search" />
                </div>
              </Col>
              <Col className="text-end d-flex justify-content-end align-items-center">
                <i className="bi bi-bell me-3"></i>
                <div className="user-profile d-flex align-items-center">
                  <img src={userInfo?.image || "https://via.placeholder.com/40"} alt="User" className="rounded-circle" />
                  <span className="ms-2">`Dr. {userInfo ? userInfo.firstName : "none"}`</span>
                </div>
              </Col>
            </Row>

            <h3 className="text-black">
              Good Morning <span className="text-danger">`Dr. {userInfo ? userInfo.firstName + " " + userInfo.lastName : "none"}`</span>
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

export default DoctorDashboard;
