import { useState, useEffect } from "react";
import { Form, Button, Alert, Container, Row, Col } from "react-bootstrap";
import axios from "axios";
import "./style/createAppointment.css";
import PropTypes from "prop-types";
import useStore from "../../store/authStore";

function CreateAppointment({ onClose, user }) {
  const [formData, setFormData] = useState({
    id_medico: "",
    id_paciente: user.id,
    fecha: "",
    hora_inicio: "",
    hora_fin: "",
    tipo: "",
  });

  console.log("recibo user", user);
  const [doctors, setDoctors] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Fetch list of doctors
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/medicos/");
        setDoctors(response.data);
        console.log("doctors", response.data);
      } catch (error) {
        console.error("Error fetching doctors:", error);
        setError("Failed to load doctors. Please try again.");
      }
    };

    fetchDoctors();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(`Field: ${name}, Value: ${value}`);
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const response = await axios.post("http://localhost:3000/api/citas", formData);
      console.log("devuelve", response.data);
      setSuccess("Appointment created successfully with ID: " + response.data.data.id);
      setFormData({
        id_medico: "",
        id_paciente: user.id,
        fecha: "",
        hora_inicio: "",
        hora_fin: "",
        tipo: "",
      });
    } catch (error) {
      setError("Error creating the appointment: " + error.response?.data?.message || error.message);
    }
  };

  const loggedPatient = useStore((state) => state.loggedPatient);

  const handleChangeUpdate = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Automatically set the patient ID
  useEffect(() => {
    if (loggedPatient?.id) {
      setFormData((prev) => ({ ...prev, id_paciente: loggedPatient.id }));
    }
  }, [loggedPatient]);

  return (
    <Container>
      <Row className="justify-content-center">
        <Col md={8}>
          <h2 className="text-center my-4">Create Appointment</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Doctor</Form.Label>
              <Form.Select name="id_medico" value={formData.id_medico} onChange={handleChange} required>
                <option value="">Select a doctor</option>

                {doctors.map((doctor) => (
                  <option key={doctor.id} value={doctor.id_medico}>
                    {doctor.usuario.first_name} {doctor.usuario.last_name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            {/* <Form.Group className="mb-3" style={{ display: "block" }}>
              <Form.Label>Patient ID</Form.Label>
              <Form.Control type="text" name="id_paciente" value={formData.id_paciente} onChange={handleChange} placeholder="Enter the patient ID" />
            </Form.Group> */}
            <input type="hidden" name="PatientID" value={formData.PatientID} />
            <Form.Group className="mb-3">
              <Form.Label>Date</Form.Label>
              <Form.Control type="date" name="fecha" value={formData.fecha} onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Start Time</Form.Label>
              <Form.Control type="time" name="hora_inicio" value={formData.hora_inicio} onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>End Time</Form.Label>
              <Form.Control type="time" name="hora_fin" value={formData.hora_fin} onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Type</Form.Label>
              <Form.Select name="tipo" value={formData.tipo.toLowerCase()} onChange={handleChange} required>
                <option value="">Select appointment type</option>
                <option value="presencial">Presencial</option>
                <option value="virtual">Virtual</option>
              </Form.Select>
            </Form.Group>

            <div className="d-flex justify-content-between">
              <Button type="submit" variant="primary">
                Create Appointment
              </Button>
              <Button variant="secondary" onClick={onClose}>
                Back
              </Button>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

CreateAppointment.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default CreateAppointment;
