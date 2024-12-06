import { Navbar, Nav, Button, Container } from 'react-bootstrap';
import './styles/navbar.css'

function CustomNavbar() {
  return (
    <Navbar bg="light" expand="lg" className="shadow-sm">
      <Container>
        {/* Logo */}
        <Navbar.Brand href="#">
          <img
            src="./src/assets/img/navbar/CareNetprop1.png"
            alt="CareNet"
            height="40"
          />
        </Navbar.Brand>

        {/* Toggler for mobile view */}
        <Navbar.Toggle aria-controls="navbar-nav" />

        {/* Navbar links */}
        <Navbar.Collapse id="navbar-nav">
          <Nav className="mx-auto">
            <Nav.Link href="#" className="text-dark fw-bold">
              Home
            </Nav.Link>
            <Nav.Link href="#" className="text-dark fw-bold">
              Service
            </Nav.Link>
            <Nav.Link href="#" className="text-dark fw-bold">
              Contact Us
            </Nav.Link>
            <Nav.Link href="#" className="text-dark fw-bold">
              Help
            </Nav.Link>
            <Nav.Link href="#" className="text-dark fw-bold">
              Blog
            </Nav.Link>
          </Nav>

          {/* Buttons */}
          <div className="d-flex align-items-center">
            <Nav.Link href="#" className="text-primary fw-bold me-3">
              Sign Up
            </Nav.Link>
            <Button variant="primary" className="fw-bold btn-login">
              Log In
            </Button>
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default CustomNavbar;