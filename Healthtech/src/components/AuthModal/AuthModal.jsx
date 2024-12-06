import { useState } from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom"; // Import useNavigate

function AuthModal({ show, handleClose, mode, onLogin }) {
  const navigate = useNavigate();
  const isLogin = mode === "login";

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    if (!email) {
      setError("Email is required."); // Validation for empty email
      return;
    }

    handleClose(); // Close the modal

    // Navigate based on email domain
    if (email.endsWith("@doctor.com")) {
      navigate("/doctor-dashboard");
    } else {
      navigate("/dashboard");
    }

    onLogin(); // Trigger login state change in App
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title className="text-center w-100 text-danger fw-bold">
          {isLogin ? "Log In" : "Register"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form.Group controlId="email" className="mb-3">
            <Form.Control
              type="email"
              placeholder="E-mail"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError(""); // Clear error on input
              }}
            />
          </Form.Group>
          <Form.Group controlId="password" className="mb-3">
            <Form.Control
              type="password"
              placeholder="Password"
            />
          </Form.Group>
          <Button
            variant="primary"
            className="w-100"
            onClick={handleLogin}
          >
            {isLogin ? "Log In" : "Sign Up"}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default AuthModal;
