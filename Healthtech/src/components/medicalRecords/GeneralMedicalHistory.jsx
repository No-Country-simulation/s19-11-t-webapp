import { Row, Col, Card } from "react-bootstrap";
import PropTypes from "prop-types";

const GeneralMedicalHistory = ({ historiaGeneral }) => {
  return (
    <Row>
      <Col>
        <Card className="mb-3">
          <Card.Header>General Medical History</Card.Header>
          <Card.Body>
            <p>
              <strong>Created On:</strong>{" "}
              {new Date(historiaGeneral.fechaCreacion).toLocaleDateString()}
            </p>
            <p>
              <strong>General Notes:</strong> {historiaGeneral.notasGenerales}
            </p>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

GeneralMedicalHistory.propTypes = {
  historiaGeneral: PropTypes.shape({
    fechaCreacion: PropTypes.string.isRequired,
    notasGenerales: PropTypes.string,
  }).isRequired,
};

export default GeneralMedicalHistory;
