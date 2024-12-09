import { Row, Col, Card, Form, Button } from "react-bootstrap";
import { useState } from "react";
import PropTypes from "prop-types";

const NewConsultationForm = ({ onAddConsultation }) => {
  const [newConsulta, setNewConsulta] = useState({
    fechaConsulta: new Date().toISOString(),
    motivoConsulta: "",
    diagnostico: "",
    tratamiento: "",
    observaciones: "",
  });

  const [newEventoClinico, setNewEventoClinico] = useState({
    tipoEvento: "",
    descripcion: "",
    fecha: new Date().toISOString(),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddConsultation(newConsulta, newEventoClinico);

    // Reset form
    setNewConsulta({
      fechaConsulta: new Date().toISOString(),
      motivoConsulta: "",
      diagnostico: "",
      tratamiento: "",
      observaciones: "",
    });

    setNewEventoClinico({
      tipoEvento: "",
      descripcion: "",
      fecha: new Date().toISOString(),
    });
  };

  return (
    <Row>
      <Col>
        <Card>
          <Card.Header>Add New Consultation</Card.Header>
          <Card.Body>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Consultation Date</Form.Label>
                <Form.Control
                  type="date"
                  value={
                    new Date(newConsulta.fechaConsulta)
                      .toISOString()
                      .split("T")[0]
                  }
                  onChange={(e) =>
                    setNewConsulta({
                      ...newConsulta,
                      fechaConsulta: new Date(e.target.value).toISOString(),
                    })
                  }
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Reason for Consultation</Form.Label>
                <Form.Control
                  type="text"
                  value={newConsulta.motivoConsulta}
                  onChange={(e) =>
                    setNewConsulta({
                      ...newConsulta,
                      motivoConsulta: e.target.value,
                    })
                  }
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Diagnosis</Form.Label>
                <Form.Control
                  type="text"
                  value={newConsulta.diagnostico}
                  onChange={(e) =>
                    setNewConsulta({
                      ...newConsulta,
                      diagnostico: e.target.value,
                    })
                  }
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Treatment</Form.Label>
                <Form.Control
                  type="text"
                  value={newConsulta.tratamiento}
                  onChange={(e) =>
                    setNewConsulta({
                      ...newConsulta,
                      tratamiento: e.target.value,
                    })
                  }
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Observations</Form.Label>
                <Form.Control
                  as="textarea"
                  value={newConsulta.observaciones}
                  onChange={(e) =>
                    setNewConsulta({
                      ...newConsulta,
                      observaciones: e.target.value,
                    })
                  }
                />
              </Form.Group>

              {/* Clinical Event Form */}
              <Form.Group className="mb-3">
                <Form.Label>Clinical Event Type</Form.Label>
                <Form.Control
                  type="text"
                  value={newEventoClinico.tipoEvento}
                  onChange={(e) =>
                    setNewEventoClinico({
                      ...newEventoClinico,
                      tipoEvento: e.target.value,
                    })
                  }
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Clinical Event Description</Form.Label>
                <Form.Control
                  as="textarea"
                  value={newEventoClinico.descripcion}
                  onChange={(e) =>
                    setNewEventoClinico({
                      ...newEventoClinico,
                      descripcion: e.target.value,
                    })
                  }
                />
              </Form.Group>

              <Button variant="primary" type="submit">
                Add Consultation
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

NewConsultationForm.propTypes = {
  onAddConsultation: PropTypes.func.isRequired,
};

export default NewConsultationForm;
