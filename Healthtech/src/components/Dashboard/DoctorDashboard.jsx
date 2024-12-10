import { Container, Row, Col, Card, ListGroup, Button } from "react-bootstrap";
import "./style/doctorDashboard.css";

function DoctorDashboard() {
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
                  <span className="ms-2">Dr. Kim</span>
                </div>
              </Col>
            </Row>

            {/* Greeting Section */}
            <Row className="greeting-section">
              <Col md={8}>
                <Card className="greeting-card">
                  <Card.Body className="d-flex align-items-center">
                    <div className="greeting-text">
                      <h3>Good Morning <span className="text-danger">Dr. Kim!</span></h3>
                      <p>Visits for Today 09 December 2024</p>
                    </div>
                    <div className="greeting-stats ms-auto">
                      <h1>104</h1>
                      <div className="stats-box d-flex">
                        <Card className="stats-card me-2">
                          <Card.Body>
                            <h5>New Patients</h5>
                            <h2>40</h2>
                            <span className="text-success">51% ↑</span>
                          </Card.Body>
                        </Card>
                        <Card className="stats-card">
                          <Card.Body>
                            <h5>Old Patients</h5>
                            <h2>64</h2>
                            <span className="text-danger">20% ↓</span>
                          </Card.Body>
                        </Card>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={4}>
                <Card className="calendar-section">
                  <Card.Body>
                    <h5>Calendar</h5>
                    <p>September 2022</p>
                    {/* Placeholder for calendar */}
                    <div className="calendar-placeholder">[Calendar Placeholder]</div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            {/* Patient List and Consultation */}
            <Row className="patient-list-section mt-4">
              <Col md={8}>
                <Card>
                  <Card.Body>
                    <Row>
                      <Col md={6}>
                        <h5>Patient List</h5>
                        <ListGroup>
                          <ListGroup.Item className="d-flex align-items-center justify-content-between">
                            <div>
                              <span className="circle-icon bg-danger">SM</span> Stacy Mitchell (Weekly Visit)
                            </div>
                            <span className="ms-auto time-badge bg-dan">9:15 AM</span>
                          </ListGroup.Item>
                          <ListGroup.Item className="d-flex align-items-center justify-content-between">
                            <div>
                              <span className="circle-icon bg-primary">AD</span> Amy Dunham (Routine Checkup)
                            </div>
                            <span className="ms-auto time-badge bg-prim">9:30 AM</span>
                          </ListGroup.Item>
                          <ListGroup.Item className="d-flex align-items-center justify-content-between">
                            <div>
                              <span className="circle-icon bg-info">DJ</span> Demi Joan (Report)
                            </div>
                            <span className="ms-auto time-badge bg-inf">9:50 AM</span>
                          </ListGroup.Item>
                          <ListGroup.Item className="d-flex align-items-center justify-content-between">
                            <div>
                              <span className="circle-icon bg-success">SM</span> Susan Myers (Weekly Visit)
                            </div>
                            <span className="ms-auto time-badge bg-succ">10:15 AM</span>
                          </ListGroup.Item>
                        </ListGroup>
                      </Col>
                      <Col md={6}>
                        <h5>Consultation</h5>
                        <Card className="consultation-card">
                          <Card.Body>
                            <h6>Susan Myers</h6>
                            <p>Female - 28 Years 3 Months</p>
                            <div className="consultation-details">
                              <p><strong>Symptoms:</strong> Fever, Cough, Heart Burn</p>
                              <p><strong>Last Checked:</strong> Dr. Everly on 21 July 2024</p>
                              <p><strong>Observation:</strong> High fever and cough at normal hemoglobin levels.</p>
                              <p><strong>Prescription:</strong> Paracetamol - 2 times a day, Dizopam - Day and Night before meal</p>
                            </div>
                          </Card.Body>
                        </Card>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={4}>
                <Card className="upcoming-section">
                  <Card.Body>
                    <h5>Upcoming</h5>
                    <ListGroup>
                      <ListGroup.Item className="d-flex justify-content-between align-items-center">
                        <span>Monthly doctor's meet</span>
                        <span>4:00 PM</span>
                      </ListGroup.Item>
                      <ListGroup.Item className="d-flex justify-content-between align-items-center">
                        <span>Weekly doctor's meet</span>
                        <span>5:00 PM</span>
                      </ListGroup.Item>
                    </ListGroup>
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
