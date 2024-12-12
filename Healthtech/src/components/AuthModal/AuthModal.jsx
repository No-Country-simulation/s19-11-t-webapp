import { useState } from "react";
import PropTypes from "prop-types";
import { Modal, Button, Form, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function AuthModal({ show, handleClose, mode, onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // const handleLogin = async () => {
    
  //   try {
  //     const response = await axios.post("http://localhost:8000/api/auth/login/", {
  //       email,
  //       password,
  //     });
  //     console.log("Login response:", response.data);

  //     onLogin(response.data.user, navigate); 
  //     handleClose(); 
  //   } catch (error) {
  //     if (error.response) {
  //       console.error("Server error:", error.response.data);
  //       setError(error.response.data?.message || "Invalid email or password. Please try again.");
  //     } else if (error.request) {
  //       console.error("No response from server:", error.request);
  //       setError("No response from server. Please try again later.");
  //     } else {
  //       console.error("Login error:", error.message);
  //       setError("An error occurred. Please try again.");
  //     }
  //   }
  // };

  const handleLogin = async () => {
    try {
      console.log("Starting login with email:", email, "password:", password); // Log inputs
      const response = await axios.post("http://localhost:8000/api/auth/login/", {
        email,
        password,
      });
      console.log("Login response data:", response.data); // Log server response
  
      onLogin(response.data.user, navigate); // Call onLogin
      console.log("onLogin called with user:", response.data.user); // Log onLogin input
      handleClose(); // Close modal
    } catch (error) {
      console.error("Login error:", error.response?.data || error.message);
      setError(error.response?.data?.message || "An error occurred. Please try again.");
    }
  };
  
  

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{mode === "login" ? "Log In" : "Register"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form.Group className="mb-3">
            <Form.Control
              type="email"
              placeholder="E-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Control
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>
          <Button variant="primary" onClick={handleLogin} className="w-100">
            {mode === "login" ? "Log In" : "Sign Up"}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

AuthModal.propTypes = {
  show: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  mode: PropTypes.string.isRequired,
  onLogin: PropTypes.func.isRequired,
};

export default AuthModal;
