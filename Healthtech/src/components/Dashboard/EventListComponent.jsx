import { ListGroup } from "react-bootstrap";
import PropTypes from "prop-types";
import "./style/eventList.css"; 

const EventList = ({ title, events, onViewAll }) => {
  return (
    <div className="event-list">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h5 className="text-dark fw-bold">{title}</h5>
        <button className="btn btn-link text-primary p-0" onClick={onViewAll}>
          View All
        </button>
      </div>
      <ListGroup>
        {events.map((event, index) => (
          <ListGroup.Item
            key={index}
            className="d-flex align-items-center justify-content-between p-3 rounded shadow-sm mb-2"
          >
            <div className="d-flex align-items-center">
              <div
                className="event-icon d-flex justify-content-center align-items-center me-3"
                style={{ backgroundColor: event.iconColor }}
              >
                <span className="text-white fw-bold">{event.iconText}</span>
              </div>
              <div>
                <p className="mb-1 text-dark">{event.title}</p>
                <p className="mb-0 text-muted small">
                  {event.date} | {event.time}
                </p>
              </div>
            </div>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
};

EventList.propTypes = {
  title: PropTypes.string.isRequired,
  events: PropTypes.arrayOf(
    PropTypes.shape({
      iconColor: PropTypes.string.isRequired,
      iconText: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      date: PropTypes.string.isRequired,
      time: PropTypes.string.isRequired,
    })
  ).isRequired,
  onViewAll: PropTypes.func.isRequired,
};

export default EventList;
