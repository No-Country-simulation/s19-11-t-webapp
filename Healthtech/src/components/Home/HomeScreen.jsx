import { Container, Row, Col, Card } from "react-bootstrap";
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
                Providing Quality <span className="text-danger">CareNet</span>{" "}
                For A
                <br />
                <span className="text-primary">Brighter</span> And{" "}
                <span className="text-primary">Healthy</span> Future
              </h1>
              <p className="hero-subtitle mt-4">
                At Our Hospital, We Are Dedicated To Providing Exceptional
                Medical Care To Our Patients And Their Families. Our Experienced
                Team Of Medical Professionals, Cutting-Edge Technology, And
                Compassionate Approach Make Us A Leader In The Healthcare
                Industry.
              </p>
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

      {/* Services */}
      <section className="services-section py-5">
        <Container>
          <div className="text-center mb-5">
            <h2 className="section-title text-primary">Services we provide</h2>
            <p className="section-subtitle">
              Lorem ipsum dolor sit amet consectetur adipiscing elit semper
              dalar elementum tempus hac tellus libero accumsan.
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
                    <Card.Title className="text-danger">
                      {service.title}
                    </Card.Title>
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
