import { Container, Row, Col, Button, Card, ListGroup } from "react-bootstrap";
import "./style/patientDashboard.css";
import axios from "axios";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import CreateAppointment from "./CreateAppointment";

function PatientDashboard({ user }) {
  const [ultimasCitas, setUltimasCitas] = useState([]);
  const [proximasCitas, setProximasCitas] = useState([]);
  const [showCrearCita, setShowCrearCita] = useState(false);

  console.log("Patient Dashboard user:", user);

  // Fetch appointments based on filters
  const getAppointments = async (pacienteId, estado, sort, order, limit = 4) => {
    try {
      const apiUrl = "http://localhost:3000/api/citas";

      const params = {
        pacienteId,
        estado,
        sort,
        order,
        limit,
      };

      const response = await axios.get(apiUrl, { params });
      console.log("citas obtenidas:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching appointments:", error);
      return [];
    }
  };

  // Cancel an appointment
  const cancelAppointment = async (citaId) => {
    try {
      const apiUrl = `http://localhost:3000/api/citas/${citaId}`;
      const response = await axios.patch(apiUrl, { estado: "cancelada" });

      alert("Appointment canceled successfully!");
      return response.data;
    } catch (error) {
      console.error("Error canceling appointment:", error);
      alert("Failed to cancel appointment. Please try again.");
      return null;
    }
  };

  useEffect(() => {
    if (user) {
      getAppointments(user.id, "realizada", "fecha", "desc").then(setUltimasCitas);
      getAppointments(user.id, "agendada", "fecha", "asc").then(setProximasCitas);
    }
  }, [user]);

  if (showCrearCita) {
    // Render CrearCita component when the state is true
    return <CreateAppointment onClose={() => setShowCrearCita(false)} />;
  }

  return (
    <div className="dashboard-container">
      <Container fluid className="container-dashboard" style={{ maxWidth: "90%", padding: "0 1rem", margin: "0 auto" }}>
        <Row>
          {/* Sidebar */}
          <Col md={1} className="sidebar d-flex flex-column">
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

          {/* Main Content */}
          <Col md={11} className="main-content">
            {/* Top Bar */}
            <Row className="top-bar align-items-center mb-4">
              <Col>
                <div className="search-bar">
                  <input type="text" className="form-control search-input" placeholder="Search" />
                </div>
              </Col>
              <Col className="text-end d-flex justify-content-end align-items-center">
                <i className="bi bi-bell me-3"></i>
                <div className="user-profile d-flex align-items-center">
                  {user?.image ? (
                    <img src={user?.image || "https://via.placeholder.com/40"} alt="User" className="rounded-circle" />
                  ) : (
                    <span className="circle-icon bg-primary">
                      {user.first_name[0]}
                      {user.last_name[0]}
                    </span>
                  )}
                  <span className="ms-2">{user ? user.first_name : "Guest"}</span>
                </div>
              </Col>
            </Row>
            <Row>
              <h3>
                Good Morning <span className="text-danger">{`${user?.first_name || ""} ${user?.last_name || ""}`}</span>
              </h3>
            </Row>

            {/* Greeting Section */}
            <Row className="greeting-section">
              <Col md={9}>
                <Card className="greeting-card d-flex flex-row">
                  <Card.Body className="d-flex align-items-center flex-column">
                    <div className="greeting-text">
                      <h4>{dayjs().format("dddd DD MMMM YYYY")}</h4>
                    </div>
                    <div className="greeting-stats">
                      <Card className="stats-card">
                        <Card.Body>
                          <Col md={12}>
                            <h4 className="text-danger">Appointment Reminder</h4>
                            {proximasCitas.length > 0 ? (
                              <>
                                <h4>
                                  {proximasCitas[0].medico.first_name} {proximasCitas[0].medico.last_name}
                                </h4>
                                <h5>{dayjs(proximasCitas[0].fecha).format("MMMM D, YYYY")}</h5>
                                <h5>{dayjs(`2024-01-01T${proximasCitas[0].hora_inicio}`, "HH:mm:ss").format("h:mm A")}</h5>
                                <Button
                                  variant="danger"
                                  onClick={async () => {
                                    const wasCanceled = await cancelAppointment(proximasCitas[0].id_cita);
                                    if (wasCanceled) {
                                      const updatedCitas = await getAppointments(user.id, "pendiente", "fecha,hora_inicio", "asc");
                                      setProximasCitas(updatedCitas);
                                    }
                                  }}
                                >
                                  Cancel appointment
                                </Button>
                              </>
                            ) : (
                              <p>No upcoming appointments.</p>
                            )}
                          </Col>
                        </Card.Body>
                      </Card>
                    </div>
                  </Card.Body>
                  <Card.Body className="image-container">
                    <img src="./src/assets/img/patientDashboard/patient.png" alt="" className="overflow-image" />
                  </Card.Body>
                </Card>

                {/* Appointment List Section */}
                <Card className="appointment-list-section mt-4">
                  <Card.Body>
                    <Row className="appointment-section">
                      <Col md={6}>
                        <h5>Last Appointments</h5>
                        <ListGroup>
                          {ultimasCitas.length > 0 ? (
                            ultimasCitas.map((cita, index) => (
                              <ListGroup.Item key={index} className="d-flex align-items-center justify-content-between">
                                <div className="d-flex align-items-center gap-3">
                                  <span className="circle-icon bg-info">{cita.medico.initials}</span>
                                  <div>
                                    <p className="mb-0">
                                      {cita.medico.first_name} {cita.medico.last_name}
                                    </p>
                                  </div>
                                </div>
                                <div className="d-flex gap-3">
                                  <span className="small">{dayjs(cita.fecha).format("MMMM D, YYYY")}</span>
                                  <span className={`time-container ms-auto schedule-time txt-info bg-light-info`}>
                                    {dayjs(`2024-01-01T${cita.hora_inicio}`, "HH:mm:ss").format("h:mm A")}
                                  </span>
                                </div>
                              </ListGroup.Item>
                            ))
                          ) : (
                            <p>No recent appointments.</p>
                          )}
                        </ListGroup>
                      </Col>

                      <Col md={6}>
                        <h5>Next Appointments</h5>
                        <ListGroup>
                          {proximasCitas.length > 0 ? (
                            proximasCitas.map((cita, index) => (
                              <ListGroup.Item key={index} className="d-flex align-items-center justify-content-between">
                                <div className="d-flex align-items-center gap-3">
                                  <span className="circle-icon bg-primary">{cita.medico.initials}</span>
                                  <div>
                                    <p className="mb-0">
                                      {cita.medico.first_name} {cita.medico.last_name}
                                    </p>
                                  </div>
                                </div>
                                <div className="d-flex gap-3">
                                  <span className="small">{dayjs(cita.fecha).format("MMMM D, YYYY")}</span>
                                  <span className={`time-container ms-auto schedule-time txt-primary bg-light-primary`}>
                                    {dayjs(`2024-01-01T${cita.hora_inicio}`, "HH:mm:ss").format("h:mm A")}
                                  </span>
                                </div>
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
              <Col md={3}>
                <Card className="help-section h-100">
                  <Card.Body>
                    <h5>How we can help you?</h5>
                    <Button variant="primary" className="mb-3 w-100" onClick={() => setShowCrearCita(true)}>
                      Book new appointment
                    </Button>
                    <Button variant="outline-primary" className="mb-3 w-100">
                      Support
                    </Button>
                    <Button variant="outline-primary" className="w-100">
                      FAQ
                    </Button>
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

PatientDashboard.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.number.isRequired,
    first_name: PropTypes.string.isRequired,
    last_name: PropTypes.string.isRequired,
    user_type: PropTypes.string.isRequired,
  }).isRequired,
};

export default PatientDashboard;
