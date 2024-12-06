import { Container, Row, Col, Button, Card, ListGroup } from "react-bootstrap";
import "./style/patientDashboard.css";

function PatientDashboard() {
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
                    src="https://via.placeholder.com/40"
                    alt="User"
                    className="rounded-circle"
                  />
                  <span className="ms-2">Elisa</span>
                </div>
              </Col>
            </Row>
            <Row><h3>Good Morning <span className="text-danger">Elisa Monrroy</span></h3></Row>

            {/* Greeting Section */}
            <Row className="greeting-section">
              <Col md={8}>
                <Card className="greeting-card d-flex flex-row">
                  <Card.Body className="d-flex align-items-center flex-column">
                    <div className="greeting-text">
                      <p>Monday 09 December 2024</p>
                    </div>
                    <div className="greeting-stats">
                      <Card className="stats-card">
                        <Card.Body>
                          <h5>Last Appointments</h5>
                          <h2>10</h2>
                        </Card.Body>
                      </Card>
                    </div>
                  </Card.Body>
                  <Card.Body className="image-container">
                    <img src="./src/assets/img/patientDashboard/patient.png" alt="" className="overflow-image"/>
                  </Card.Body>
                </Card>
                <Card>
     {/* Appointment Reminder */}
     <Col md={12} className="appointment-reminder-section mt-4">
                <Card>
                  <Card.Body>
                    <Row>
                      <Col md={12}>
                        <h5>Appointment Reminder</h5>
                        <h3 className="text-danger">Today 15:00 PM</h3>
                        <Button variant="danger">Cancel appointment</Button>
                      </Col>
                      <Col md={12}>
                        <h5>Last Appointments</h5>
                        <ListGroup>
                          <ListGroup.Item className="d-flex align-items-center justify-content-between">
                            <div>
                              <span className="circle-icon bg-danger">DT</span> Dra. Tracy (Weekly Visit)
                            </div>
                            <span>9:15 AM</span>
                          </ListGroup.Item>
                          <ListGroup.Item className="d-flex align-items-center justify-content-between">
                            <div>
                              <span className="circle-icon bg-danger">DT</span> Dra. Tracy (Routine Checkup)
                            </div>
                            <span>9:30 AM</span>
                          </ListGroup.Item>
                          <ListGroup.Item className="d-flex align-items-center justify-content-between">
                            <div>
                              <span className="circle-icon bg-primary">DK</span> Dr. Kim (Report)
                            </div>
                            <span>9:50 AM</span>
                          </ListGroup.Item>
                          <ListGroup.Item className="d-flex align-items-center justify-content-between">
                            <div>
                              <span className="circle-icon bg-primary">DK</span> Dr. Kim (Weekly Visit)
                            </div>
                            <span>10:15 AM</span>
                          </ListGroup.Item>
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

export default PatientDashboard;
