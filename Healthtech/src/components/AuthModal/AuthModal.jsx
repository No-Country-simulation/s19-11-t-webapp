import { useState } from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import useStore from "../../useStore";  // Importa la tienda Zustand
import PropTypes from "prop-types";

const API_BASE_URL = "http://localhost:8000/api";  // Actualiza esta URL según sea necesario

function AuthModal({ show, handleClose, mode, onLogin }) {
  const isLogin = mode === "login";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate(); 
  const setUser = useStore((state) => state.setUser);  // Obtén la función setUser de la tienda Zustand

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Both email and password are required.");
      return;
    }
  
    try {
      const loginResponse = await axios.post(
        `${API_BASE_URL}/auth/login/`,
        {
          email: email,
          password: password,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
  
      const { user } = loginResponse.data;

      // Verificar si el usuario tiene un rol
      if (!user.user_type) {
        throw new Error("User role not found.");
      }

      // Almacenar la información del usuario en Zustand
      setUser(user);
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

AuthModal.propTypes = {
  show: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  mode: PropTypes.oneOf(["login", "register"]).isRequired,
  onLogin: PropTypes.func.isRequired,
};

export default AuthModal;