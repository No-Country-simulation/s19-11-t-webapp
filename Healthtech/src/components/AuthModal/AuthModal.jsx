import { useState } from "react";
import PropTypes from "prop-types";
import { Modal, Button, Form, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import useStore from "../../useStore"; // Import Zustand store

const API_BASE_URL = "http://localhost:8000/api"; // Update this URL as needed

function AuthModal({ show, handleClose, mode, onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const setUser = useStore((state) => state.setUser); // Zustand action for setting user

  const handleLogin = async () => {
    try {
      console.log("Starting login with email:", email, "password:", password); // Debug inputs
      const loginResponse = await axios.post(
        `${API_BASE_URL}/auth/login/`,
        {
          email,
          password,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      const { user } = loginResponse.data;
      console.log("Login response data:", user); // Debug response data

      if (!user.user_type) {
        throw new Error("User role not found.");
      }

      setUser(user); // Store user in Zustand
      onLogin(user, navigate); // Pass user to parent onLogin
      handleClose(); // Close the modal
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
  mode: PropTypes.oneOf(["login", "register"]).isRequired,
  onLogin: PropTypes.func.isRequired,
};

export default AuthModal;
