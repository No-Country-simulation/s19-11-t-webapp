
import { Navbar, Nav, Button, Container } from "react-bootstrap";
import PropTypes from 'prop-types';
import { useNavigate } from "react-router-dom";
import "./styles/navbar.css";

function CustomNavbar({ isLoggedIn, handleLogout, onShowModal }) {
  const navigate = useNavigate(); 

  const logoutAndNavigate = () => {
    handleLogout(navigate); 
  };
  return (
    <Navbar bg="light" expand="lg" className="shadow-sm">
      <Container>
        {/* Logo */}
        <Navbar.Brand href="/">
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
            <Nav.Link href="/" className="text-dark fw-bold-nav">
              Home
            </Nav.Link>
            <Nav.Link href="#" className="text-dark fw-bold-nav">
              Service
            </Nav.Link>
            <Nav.Link href="#" className="text-dark fw-bold-nav">
              Contact Us
            </Nav.Link>
            <Nav.Link href="#" className="text-dark fw-bold-nav">
              Help
            </Nav.Link>
            <Nav.Link href="#" className="text-dark fw-bold-nav">
              Blog
            </Nav.Link>
          </Nav>

          {/* Conditional Buttons */}
          <div className="d-flex align-items-center">
            {!isLoggedIn ? (
              <>

                <Nav.Link
                  href="#"
                  className="text-primary fw-bold me-3"
                  onClick={() => onShowModal("signup")} 
                >
                  Sign Up
                </Nav.Link>
                <Button
                  variant="primary"
                  className="fw-bold btn-login"
                  onClick={() => onShowModal("login")} 
                >
                  Log In
                </Button>
              </>
            ) : (
              <Button
                variant="danger"
                className="fw-bold-btn"
                onClick={logoutAndNavigate}
              >
                Logout
              </Button>
            )}
          </div>

        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}


CustomNavbar.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired, 
  handleLogout: PropTypes.func.isRequired, 
  onShowModal: PropTypes.func.isRequired, 
};

export default CustomNavbar;
