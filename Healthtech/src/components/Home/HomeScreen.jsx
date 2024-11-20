import { Container, Row, Col, Button, Form, Card } from "react-bootstrap";
import "./style/homeScreen.css";
import services from "./utils/servicesData";

function HomeScreen() {
  return (
    <>
      {/* Hero Section */}
      <section className="hero-section py-5">
        <Container>
          <Row className="align-items-center">
            {/* Left Side: Text and Buttons */}
            <Col md={6}>
              <h1 className="hero-title">
                Providing Quality <span className="text-danger">CareNet</span> For A
                <br />
                <span className="text-primary">Brighter</span> And{" "}
                <span className="text-primary">Healthy</span> Future
              </h1>
              <p className="hero-subtitle mt-4">
                At Our Hospital, We Are Dedicated To Providing Exceptional Medical
                Care To Our Patients And Their Families. Our Experienced Team Of
                Medical Professionals, Cutting-Edge Technology, And Compassionate
                Approach Make Us A Leader In The Healthcare Industry.
              </p>
              <div className="hero-buttons mt-4">
                <Button variant="primary" className="btn-appointments me-3">
                  Appointments
                </Button>
                <Button variant="outline-danger" className="btn-watch-video">
                  <i className="bi bi-play-circle"></i> Watch Video
                </Button>
              </div>
            </Col>

            {/* Right Side: Doctor Image and 24/7 Badge */}
            <Col md={6} className="text-center position-relative">
              <div className="hero-image-wrapper">
                <img
                  src="./src/assets/img/homepage/thmb-doctor-homepage.png"
                  alt="Doctor"
                  className="img-fluid hero-doctor-image"
                />
                {/* 24/7 Badge */}
                <div className="badge-24-7">
                  <span className="badge-text">
                    24/7 <br /> Service
                  </span>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Search Bar Section */}
      <section className="search-bar-section py-4">
        <Container>
          <Row className="align-items-center bg-white shadow-sm rounded px-3 py-4">
            <Col md={3}>
              <Form.Group controlId="searchName">
                <Form.Control
                  type="text"
                  placeholder="Name"
                  className="search-input"
                />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group controlId="searchSpeciality">
                <Form.Control
                  type="text"
                  placeholder="Speciality"
                  className="search-input"
                />
              </Form.Group>
            </Col>
            <Col md={3} className="d-flex align-items-center">
              <span className="me-2">Available</span>
              <Form.Check
                type="switch"
                id="availabilitySwitch"
                className="availability-switch"
              />
            </Col>
            <Col md={3} className="text-end">
              <Button variant="primary" className="search-button">
                Search
              </Button>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Services */}
      <section className="services-section py-5">
      <Container>
        <div className="text-center mb-5">
          <h2 className="section-title text-primary">Services we provide</h2>
          <p className="section-subtitle">
            Lorem ipsum dolor sit amet consectetur adipiscing elit semper dalar elementum tempus hac tellus libero accumsan.
          </p>
        </div>
        <Row>
          {services.map((service, index) => (
            <Col md={4} className="mb-4" key={index}>
              <Card className="service-card h-100">
                <Card.Img
                  variant="top"
                  src={service.image} // Replace with actual image path
                  alt={service.title}
                  className="service-card-img"
                />
                <Card.Body>
                  <Card.Title className="text-danger">{service.title}</Card.Title>
                  <Card.Text>{service.description}</Card.Text>
                  <a href={service.link} className="learn-more-link">
                    Learn more →
                  </a>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
    </>
  );
}

export default HomeScreen;
