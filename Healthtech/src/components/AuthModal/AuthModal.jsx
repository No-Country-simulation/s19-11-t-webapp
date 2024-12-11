import { useState } from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE_URL = "https://dummyjson.com";

function AuthModal({ show, handleClose, mode, onLogin }) {
  const isLogin = mode === "login";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate(); 

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Both email and password are required.");
      return;
    }
  
    try {
      const loginResponse = await axios.post(
        `${API_BASE_URL}/auth/login`,
        {
          username: email,
          password: password,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
  
      const { accessToken } = loginResponse.data;
  

      const userResponse = await axios.get(`${API_BASE_URL}/user/me`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
  
      const user = userResponse.data;
  
      if (!user.role) {
        throw new Error("User role not found.");
      }
  
      onLogin(user, navigate); 
      handleClose();
    } catch (error) {
      setError("Invalid email or password. Please try again.");
      console.error("Login error:", error);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{isLogin ? "Log In" : "Register"}</Modal.Title>
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
            {isLogin ? "Log In" : "Sign Up"}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default AuthModal;
