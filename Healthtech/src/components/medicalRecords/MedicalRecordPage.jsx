import { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Dropdown,
  Button,
  Modal,
  Form,
} from "react-bootstrap";
import { useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import axios from "axios";
import VideoChat from "../Videochat";

const MedicalRecordsPage = ({
  patientId = "paciente_001",
  doctorId = "medico_001",
}) => {
  // State management
  const [medicalHistory, setMedicalHistory] = useState(null);
  const [selectedConsultation, setSelectedConsultation] = useState(null);
  const [showNewConsultationModal, setShowNewConsultationModal] =
    useState(false);
  const location = useLocation();
  const [patientDetails] = useState({
    patientId: location.state?.patientId || "paciente desconocido",
    patientFirstName: location.state?.patientFirstName || "Patient",
    patientLastName: location.state?.patientLastName || "Name",
  });

  // New consultation form state
  const [newConsultation, setNewConsultation] = useState({
    motivoConsulta: "",
    diagnostico: "",
    tratamiento: "",
    observaciones: "",
    examenes: [{ examenId: "" }],
    eventosClinicos: [
      {
        tipoEvento: "",
        descripcion: "",
        fecha: "",
      },
    ],
  });

  // Fetch medical history on component mount
  useEffect(() => {
    const fetchMedicalHistory = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3005/medical-history/${patientId}`
        );
        setMedicalHistory(response.data);

        // Automatically select the most recent consultation
        if (response.data.consultas && response.data.consultas.length > 0) {
          setSelectedConsultation(response.data.consultas[0]);
        }
      } catch (error) {
        console.error("Error fetching medical history:", error);
      }
    };

    fetchMedicalHistory();
  }, [patientId]);

  // Handler for adding new consultation
  const handleAddConsultation = async (e) => {
    e.preventDefault();
    try {
      const consultationData = {
        pacienteId: patientId,
        consultas: [
          {
            idConsulta: `CONS-${Date.now()}`, // Generate unique ID
            fechaConsulta: new Date().toISOString(),
            motivoConsulta: newConsultation.motivoConsulta,
            diagnostico: newConsultation.diagnostico,
            tratamiento: newConsultation.tratamiento || "", // Provide empty string if undefined
            observaciones: newConsultation.observaciones || "", // Provide empty string if undefined
            medicoId: doctorId,
            examenes: newConsultation.examenes
              .filter((exam) => exam.examenId) // Remove empty exams
              .map((exam) => ({
                examenId: exam.examenId,
              })),
          },
        ],
        eventosClinicos: newConsultation.eventosClinicos
          .filter(
            (evento) => evento.tipoEvento && evento.descripcion && evento.fecha
          ) // Validate event
          .map((evento) => ({
            tipoEvento: evento.tipoEvento,
            descripcion: evento.descripcion,
            fecha: new Date(evento.fecha).toISOString(),
          })),
      };

      const response = await axios.post(
        "http://localhost:3005/medical-history",
        consultationData
      );

      // Update local state
      setMedicalHistory(response.data);
      setSelectedConsultation(response.data.consultas[0]);

      // Close modal and reset form
      setShowNewConsultationModal(false);
      setNewConsultation({
        motivoConsulta: "",
        diagnostico: "",
        tratamiento: "",
        observaciones: "",
        examenes: [{ examenId: "" }],
        eventosClinicos: [
          {
            tipoEvento: "",
            descripcion: "",
            fecha: "",
          },
        ],
      });
    } catch (error) {
      console.error("Error adding consultation:", error);
    }
  };

  // Render consultation dropdown
  const renderConsultationDropdown = () => {
    if (!medicalHistory || !medicalHistory.consultas) return null;

    return (
      <Dropdown>
        <Dropdown.Toggle variant="primary">
          Seleccionar Consulta
        </Dropdown.Toggle>
        <Dropdown.Menu>
          {medicalHistory.consultas.map((consulta, index) => (
            <Dropdown.Item
              key={consulta.idConsulta}
              onClick={() => setSelectedConsultation(consulta)}
            >
              Consulta {index + 1} -{" "}
              {new Date(consulta.fechaConsulta).toLocaleDateString()}
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>
    );
  };

  // Render selected consultation details
  const renderConsultationDetails = () => {
    if (!selectedConsultation) return <p>Seleccione una consulta</p>;

    return (
      <Card>
        <Card.Header>Detalles de Consulta</Card.Header>
        <Card.Body>
          <p>
            <strong>Fecha:</strong>{" "}
            {new Date(selectedConsultation.fechaConsulta).toLocaleDateString()}
          </p>
          <p>
            <strong>Motivo:</strong> {selectedConsultation.motivoConsulta}
          </p>
          <p>
            <strong>Diagnóstico:</strong> {selectedConsultation.diagnostico}
          </p>
          <p>
            <strong>Tratamiento:</strong> {selectedConsultation.tratamiento}
          </p>
          <p>
            <strong>Observaciones:</strong> {selectedConsultation.observaciones}
          </p>

          {/* Examenes */}
          <h5>Exámenes</h5>
          {selectedConsultation.examenes &&
            selectedConsultation.examenes.map((examen, index) => (
              <p key={index}>Examen ID: {examen.examenId}</p>
            ))}
        </Card.Body>
      </Card>
    );
  };

  // Render historia general
  const renderHistoriaGeneral = () => {
    if (!medicalHistory || !medicalHistory.historiaGeneral)
      return <p>No hay historia general disponible</p>;

    return (
      <Card>
        <Card.Header>Historia General</Card.Header>
        <Card.Body>
          <p>
            <strong>Fecha de Creación:</strong>{" "}
            {new Date(
              medicalHistory.historiaGeneral.fechaCreacion
            ).toLocaleDateString()}
          </p>
          <p>
            <strong>Notas:</strong>{" "}
            {medicalHistory.historiaGeneral.notasGenerales}
          </p>
        </Card.Body>
      </Card>
    );
  };

  // Render clinical events
  const renderEventosClinicos = () => {
    if (
      !medicalHistory ||
      !medicalHistory.eventosClinicos ||
      medicalHistory.eventosClinicos.length === 0
    ) {
      return <p>No hay eventos clínicos</p>;
    }

    return (
      <Card>
        <Card.Header>Eventos Clínicos</Card.Header>
        <Card.Body>
          {medicalHistory.eventosClinicos.map((evento, index) => (
            <div key={index}>
              <p>
                <strong>Tipo de Evento:</strong> {evento.tipoEvento}
              </p>
              <p>
                <strong>Descripción:</strong> {evento.descripcion}
              </p>
              <p>
                <strong>Fecha:</strong>{" "}
                {new Date(evento.fecha).toLocaleDateString()}
              </p>
              <hr />
            </div>
          ))}
        </Card.Body>
      </Card>
    );
  };

  // Render new consultation modal
  const renderNewConsultationModal = () => {
    return (
      <Modal
        show={showNewConsultationModal}
        onHide={() => setShowNewConsultationModal(false)}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Nueva Consulta</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <VideoChat />
          <Form onSubmit={handleAddConsultation}>
            <Form.Group>
              <Form.Label>Motivo de Consulta</Form.Label>
              <Form.Control
                type="text"
                value={newConsultation.motivoConsulta}
                onChange={(e) =>
                  setNewConsultation({
                    ...newConsultation,
                    motivoConsulta: e.target.value,
                  })
                }
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Diagnóstico</Form.Label>
              <Form.Control
                type="text"
                value={newConsultation.diagnostico}
                onChange={(e) =>
                  setNewConsultation({
                    ...newConsultation,
                    diagnostico: e.target.value,
                  })
                }
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Tratamiento</Form.Label>
              <Form.Control
                type="text"
                value={newConsultation.tratamiento}
                onChange={(e) =>
                  setNewConsultation({
                    ...newConsultation,
                    tratamiento: e.target.value,
                  })
                }
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Observaciones</Form.Label>
              <Form.Control
                type="text"
                value={newConsultation.observaciones}
                onChange={(e) =>
                  setNewConsultation({
                    ...newConsultation,
                    observaciones: e.target.value,
                  })
                }
              />
            </Form.Group>

            {/* Dynamic Exams */}
            <Form.Group>
              <Form.Label>Exámenes</Form.Label>
              {newConsultation.examenes.map((examen, index) => (
                <Form.Control
                  key={index}
                  type="text"
                  placeholder="ID de Examen"
                  value={examen.examenId}
                  onChange={(e) => {
                    const newExamenes = [...newConsultation.examenes];
                    newExamenes[index].examenId = e.target.value;
                    setNewConsultation({
                      ...newConsultation,
                      examenes: newExamenes,
                    });
                  }}
                />
              ))}
              <Button
                variant="secondary"
                onClick={() =>
                  setNewConsultation({
                    ...newConsultation,
                    examenes: [...newConsultation.examenes, { examenId: "" }],
                  })
                }
              >
                Añadir Examen
              </Button>
            </Form.Group>

            {/* Dynamic Clinical Events */}
            <Form.Group>
              <Form.Label>Eventos Clínicos</Form.Label>
              {newConsultation.eventosClinicos.map((evento, index) => (
                <div key={index}>
                  <Form.Control
                    type="text"
                    placeholder="Tipo de Evento"
                    value={evento.tipoEvento}
                    onChange={(e) => {
                      const newEventos = [...newConsultation.eventosClinicos];
                      newEventos[index].tipoEvento = e.target.value;
                      setNewConsultation({
                        ...newConsultation,
                        eventosClinicos: newEventos,
                      });
                    }}
                  />
                  <Form.Control
                    type="text"
                    placeholder="Descripción"
                    value={evento.descripcion}
                    onChange={(e) => {
                      const newEventos = [...newConsultation.eventosClinicos];
                      newEventos[index].descripcion = e.target.value;
                      setNewConsultation({
                        ...newConsultation,
                        eventosClinicos: newEventos,
                      });
                    }}
                  />
                  <Form.Control
                    type="date"
                    value={evento.fecha}
                    onChange={(e) => {
                      const newEventos = [...newConsultation.eventosClinicos];
                      newEventos[index].fecha = e.target.value;
                      setNewConsultation({
                        ...newConsultation,
                        eventosClinicos: newEventos,
                      });
                    }}
                  />
                </div>
              ))}
              <Button
                variant="secondary"
                onClick={() =>
                  setNewConsultation({
                    ...newConsultation,
                    eventosClinicos: [
                      ...newConsultation.eventosClinicos,
                      {
                        tipoEvento: "",
                        descripcion: "",
                        fecha: "",
                      },
                    ],
                  })
                }
              >
                Añadir Evento Clínico
              </Button>
            </Form.Group>

            <Button type="submit" variant="primary">
              Guardar Consulta
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    );
  };

  return (
    <Container>
      <Row className="mb-3">
        <Col>
          Paciente:{" "}
          {`${patientDetails.patientFirstName} ${patientDetails.patientLastName}`}
        </Col>
      </Row>

      <Row className="mb-3">
        <Col>
          {renderConsultationDropdown()}
          <Button
            variant="success"
            onClick={() => setShowNewConsultationModal(true)}
            className="ml-2"
          >
            Nueva Consulta
          </Button>
        </Col>
      </Row>

      <Row>
        <Col md={6}>{renderConsultationDetails()}</Col>
        <Col md={6}>
          {renderHistoriaGeneral()}
          {renderEventosClinicos()}
        </Col>
      </Row>

      {renderNewConsultationModal()}
    </Container>
  );
};

// PropTypes for type checking
MedicalRecordsPage.propTypes = {
  patientId: PropTypes.string,
  doctorId: PropTypes.string,
};

export default MedicalRecordsPage;
