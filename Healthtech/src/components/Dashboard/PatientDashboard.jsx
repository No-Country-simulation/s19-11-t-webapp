import { Container, Row, Col, Button, Card, ListGroup } from "react-bootstrap";
import "./style/patientDashboard.css";
import axios from "axios";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import PropTypes from "prop-types";

function PatientDashboard({ user }) {
  const [ultimasCitas, setUltimasCitas] = useState([]);
  const [proximasCitas, setProximasCitas] = useState([]);

  // Traer citas segun filtro
  const getAppointments = async (pacienteId, estado, sort, order, limit = 4) => {
    try {
      // Endpoint del servicio
      const apiUrl = "http://localhost:3000/api/citas";

      // Filtros
      const params = {
        pacienteId: pacienteId,
        estado: estado,
        sort: sort,
        order: order,
        limit: limit,
      };
      console.log("paso params", params);

      const response = await axios.get(apiUrl, { params });

      const citas = response.data;
      console.log("Citas devueltas por el back:", citas);

      return citas;
    } catch (error) {
      console.error("Error al obtener las últimas citas realizadas:", error);
      return [];
    }
  };

  // Cancelar una cita
  const cancelAppointment = async (citaId) => {
    try {
      console.log("Va a cancelar cita", citaId);
      const apiUrl = `http://localhost:3000/api/citas/${citaId}`;
      const response = await axios.patch(apiUrl, {
        estado: "cancelada",
      });

      alert("Appointment canceled successfully!"); 
      return response.data;
    } catch (error) {
      console.error("Error al cancelar la cita:", error);
      alert("Failed to cancel appointment. Please try again."); 
      return null;
    }
  };

  useEffect(() => {
    if (user) {
      // Obtener las últimas citas realizadas
      getAppointments(user.id, "realizada", "fecha", "desc").then(setUltimasCitas);

      // Obtener las próximas citas
      getAppointments(user.id, "pendiente", "fecha", "asc").then(setProximasCitas);
    }
  }, [user]);

  return (
    <div className="dashboard-container">
      <Container fluid>
        <Row>
          {/* Sidebar */}
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

          {/* Main Content */}
          <Col md={10} className="main-content">
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
                  <img   src={"https://via.placeholder.com/40"} alt="User" className="rounded-circle" />
                  <span className="ms-2">{user ? user.first_name : 'none' }</span>
                </div>
              </Col>
            </Row>
            <Row>
              <h3>
                Good Morning <span className="text-danger">{user ? user.first_name + ' '  + user.last_name : null}</span>
              </h3>
            </Row>

            {/* Greeting Section */}
            <Row className="greeting-section">
              <Col md={8}>
                <Card className="greeting-card d-flex flex-row">
                  <Card.Body className="d-flex align-items-center flex-column">
                    <div className="greeting-text">
                      <h4>Monday 09 December 2024</h4>
                    </div>
                    <div className="greeting-stats">
                      <Card className="stats-card">
                        <Card.Body>
                          <Col md={12}>
                            <h5>Appointment Reminder</h5>
                            {proximasCitas.length > 0 ? (
                              <>
                                <h4 className="text-danger">{proximasCitas.length > 0 && dayjs(proximasCitas[0].fecha).format("MMMM D, YYYY")}</h4>
                                <h4 className="text-danger">{dayjs(`2024-01-01T${proximasCitas[0].hora_inicio}`, "HH:mm:ss").format("h:mm A")}</h4>
                                <Button
                                  variant="danger"
                                  onClick={async () => {
                                    const wasCanceled = await cancelAppointment(proximasCitas[0].id_cita);
                                    if (wasCanceled) {
                                      // Actualiza la lista de próximas citas
                                      const updatedCitas = await getAppointments(1, "agendada", "fecha,hora_inicio", "asc");
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
                      <Row></Row>
                    </div>
                  </Card.Body>
                  <Card.Body className="image-container">
                    <img src="./src/assets/img/patientDashboard/patient.png" alt="" className="overflow-image" />
                  </Card.Body>
                </Card>
                <Card>
                  {/* Appointment Reminder */}
                  <Col md={12} className="appointment-reminder-section mt-4">
                    <Card>
                      <Card.Body>
                        <Row className="appointment-section mt-4">
                          {/* Últimas citas */}
                          <Col md={6}>
                            <h5>Last Appointments</h5>
                            <ListGroup>
                              {ultimasCitas.length > 0 ? (
                                ultimasCitas.map((cita, index) => (
                                  <ListGroup.Item key={index} className="d-flex align-items-center justify-content-between">
                                    <div>
                                      <span className="circle-icon bg-danger">{cita.medico.initials}</span>
                                      <span>
                                        {" "}
                                        {cita.medico.first_name} {cita.medico.last_name}
                                      </span>
                                    </div>
                                    <span>{dayjs(cita.fecha).format("MMMM D, YYYY")}</span>
                                    <span>{dayjs(`2024-01-01T${cita.hora_inicio}`, "HH:mm:ss").format("h:mm A")}</span>
                                  </ListGroup.Item>
                                ))
                              ) : (
                                <p>No recent appointments.</p>
                              )}
                            </ListGroup>
                          </Col>

                          {/* Próximas citas */}
                          <Col md={6}>
                            <h5>Next Appointments</h5>
                            <ListGroup>
                              {proximasCitas.length > 0 ? (
                                proximasCitas.map((cita, index) => (
                                  <ListGroup.Item key={index} className="d-flex align-items-center justify-content-between">
                                    <div>
                                      <span className="circle-icon bg-primary">{cita.medico.initials}</span>
                                      <span>
                                        {" "}
                                        {cita.medico.first_name}
                                        {cita.medico.last_name}
                                      </span>
                                    </div>
                                    <span>{dayjs(cita.fecha).format("MMMM D, YYYY")}</span>
                                    <span>{dayjs(`2024-01-01T${cita.hora_inicio}`, "HH:mm:ss").format("h:mm A")}</span>
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
                </Card>
              </Col>
              <Col md={4}>
                <Card className="help-section h-100">
                  <Card.Body>
                    <h5>How we can help you?</h5>
                    <Button variant="primary" className="mb-3 w-100">
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
