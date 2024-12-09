import { Row, Col, Card } from "react-bootstrap";
import PropTypes from "prop-types";

const ClinicalEvents = ({ eventos }) => {
  return (
    <Row>
      <Col>
        <Card className="mb-3">
          <Card.Header>Clinical Events</Card.Header>
          <Card.Body>
            {eventos.map((evento, index) => (
              <div key={index} className="mb-2">
                <p>
                  <strong>{evento.tipoEvento}</strong> -{" "}
                  {new Date(evento.fecha).toLocaleDateString()}
                  <br />
                  {evento.descripcion}
                </p>
              </div>
            ))}
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

ClinicalEvents.propTypes = {
  eventos: PropTypes.arrayOf(
    PropTypes.shape({
      tipoEvento: PropTypes.string.isRequired,
      descripcion: PropTypes.string,
      fecha: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default ClinicalEvents;
