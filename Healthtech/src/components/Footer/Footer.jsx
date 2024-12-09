import { Container, Row, Col } from "react-bootstrap";
import "./style/footer.css";

function Footer() {
  return (
    <footer className="footer-section py-5">
      <Container>
        <Row className="align-items-center">
          {/* Logo and Copyright */}
          <Col md={3} className="mb-4 mb-md-0">
            <div className="footer-logo">
              <img
                src="logo-url.png" // Replace with your logo's URL
                alt="CareNet Logo"
                height="40"
              />
              <h5 className="mt-2 text-white">CareNet</h5>
              <p className="text-white small mb-0">
                Copyright © 2022 BRIX Templates
              </p>
              <p className="text-white small">All Rights Reserved</p>
            </div>
          </Col>

          {/* Links Section */}
          <Col md={6}>
            <Row>
              <Col md={4}>
                <h6 className="footer-title">Product</h6>
                <ul className="list-unstyled">
                  <li><a href="#">Features</a></li>
                  <li><a href="#">Pricing</a></li>
                  <li><a href="#">Case Studies</a></li>
                  <li><a href="#">Reviews</a></li>
                  <li><a href="#">Updates</a></li>
                </ul>
              </Col>
              <Col md={4}>
                <h6 className="footer-title">Company</h6>
                <ul className="list-unstyled">
                  <li><a href="#">About</a></li>
                  <li><a href="#">Contact Us</a></li>
                  <li><a href="#">Careers</a></li>
                  <li><a href="#">Culture</a></li>
                  <li><a href="#">Blog</a></li>
                </ul>
              </Col>
              <Col md={4}>
                <h6 className="footer-title">Support</h6>
                <ul className="list-unstyled">
                  <li><a href="#">Getting Started</a></li>
                  <li><a href="#">Help Center</a></li>
                  <li><a href="#">Server Status</a></li>
                  <li><a href="#">Report a Bug</a></li>
                  <li><a href="#">Chat Support</a></li>
                </ul>
              </Col>
            </Row>
          </Col>

          {/* Social Media Links */}
          <Col md={3} className="text-md-end">
            <h6 className="footer-title text-white">Follow Us</h6>
            <div className="social-icons d-flex flex-column align-items-md-end">
              <a href="#" className="social-icon instagram"></a>
              <a href="#" className="social-icon twitter"></a>
              <a href="#" className="social-icon facebook"></a>
              <a href="#" className="social-icon youtube"></a>
              <a href="#" className="social-icon linkedin"></a>
            </div>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}

export default Footer;