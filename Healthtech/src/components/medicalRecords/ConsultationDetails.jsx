import { Row, Col, Card } from "react-bootstrap";
import PropTypes from "prop-types";

const ConsultationDetails = ({ consulta }) => {
  return (
    <Row>
      <Col>
        <Card className="mb-3">
          <Card.Header>Consultation Details</Card.Header>
          <Card.Body>
            <p>
              <strong>Date:</strong>{" "}
              {new Date(consulta.fechaConsulta).toLocaleDateString()}
            </p>
            <p>
              <strong>Reason:</strong> {consulta.motivoConsulta}
            </p>
            <p>
              <strong>Diagnosis:</strong> {consulta.diagnostico}
            </p>
            <p>
              <strong>Treatment:</strong> {consulta.tratamiento}
            </p>
            <p>
              <strong>Observations:</strong> {consulta.observaciones}
            </p>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

ConsultationDetails.propTypes = {
  consulta: PropTypes.shape({
    fechaConsulta: PropTypes.string.isRequired,
    motivoConsulta: PropTypes.string,
    diagnostico: PropTypes.string,
    tratamiento: PropTypes.string,
    observaciones: PropTypes.string,
  }).isRequired,
};

export default ConsultationDetails;
