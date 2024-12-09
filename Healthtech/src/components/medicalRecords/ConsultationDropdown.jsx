import { Row, Col, Dropdown } from "react-bootstrap";
import PropTypes from "prop-types";

const ConsultationDropdown = ({
  consultas,
  selectedConsulta,
  onSelectConsulta,
}) => {
  return (
    <Row className="mb-3">
      <Col>
        <Dropdown>
          <Dropdown.Toggle variant="secondary">
            {selectedConsulta
              ? `Consultation on ${new Date(
                  selectedConsulta.fechaConsulta
                ).toLocaleDateString()}`
              : "Select Consultation"}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            {consultas.map((consulta) => (
              <Dropdown.Item
                key={consulta.idConsulta}
                onClick={() => onSelectConsulta(consulta)}
              >
                {new Date(consulta.fechaConsulta).toLocaleDateString()}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
      </Col>
    </Row>
  );
};

ConsultationDropdown.propTypes = {
  consultas: PropTypes.arrayOf(
    PropTypes.shape({
      idConsulta: PropTypes.string.isRequired,
      fechaConsulta: PropTypes.string.isRequired,
    })
  ).isRequired,
  selectedConsulta: PropTypes.object,
  onSelectConsulta: PropTypes.func.isRequired,
};

export default ConsultationDropdown;
