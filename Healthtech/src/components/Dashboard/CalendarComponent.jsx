import { useState } from "react";
import { Card } from "react-bootstrap";
import "./style/calendar.css";
import EventList from "./EventListComponent";

const Calendar = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const events = [8, 14, 21]; 

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((prevYear) => prevYear - 1);
    } else {
      setCurrentMonth((prevMonth) => prevMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((prevYear) => prevYear + 1);
    } else {
      setCurrentMonth((prevMonth) => prevMonth + 1);
    }
  };

  const calendarDays = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push(null); 
  }
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push(i);
  }


  const upcomingEvents = [
    {
      iconText: "M",
      iconColor: "#1E90FF",
      title: "Monthly doctor's meet",
      date: "8 December, 2024",
      time: "04:00 PM",
    },
  ];

  const canceledEvents = [
    {
      iconText: "M",
      iconColor: "#FF6347",
      title: "Weekly doctor's meet",
      date: "8 December, 2024",
      time: "05:00 PM",
    },
  ];

  const allEvents = [
    {
      iconText: "M",
      iconColor: "#00CED1",
      title: "Monthly doctor's meet",
      date: "8 December, 2024",
      time: "07:00 PM",
    },
    {
      iconText: "W",
      iconColor: "#00CED1",
      title: "Weekly doctor's meet",
      date: "10 December, 2024",
      time: "10:00 AM",
    },
  ];

  const handleViewAll = (category) => {
    console.log(`View All for ${category}`);
  };

 
  

  return (
    <Card className="calendar-card">
      <Card.Body>
        <div className="calendarButtons__container mb-3">
          
          <h6 className="calendar-header">
            {new Date(currentYear, currentMonth).toLocaleString("default", {
              month: "long",
            })}{" "}
            {currentYear}
          </h6>
          <div>
          <button onClick={handlePrevMonth} className="calendar-nav">
            &lt;
          </button>
          <button onClick={handleNextMonth} className="calendar-nav">
            &gt;
          </button>
          </div>
        </div>

        <table className="calendar-table">
          <thead>
            <tr>
              {daysOfWeek.map((day) => (
                <th key={day}>{day}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: Math.ceil(calendarDays.length / 7) }).map(
              (_, weekIndex) => (
                <tr key={weekIndex}>
                  {calendarDays
                    .slice(weekIndex * 7, weekIndex * 7 + 7)
                    .map((day, index) => (
                      <td
                        key={index}
                        className={`${
                          day && events.includes(day) ? "event-day" : ""
                        }`}
                      >
                        {day || ""}
                      </td>
                    ))}
                </tr>
              )
            )}
          </tbody>
        </table>

        {/* Event Lists */}
        <div className="event-lists mt-4">
          <EventList
            title="Upcoming"
            events={upcomingEvents}
            onViewAll={() => handleViewAll("Upcoming")}
          />
          <EventList
            title="Canceled"
            events={canceledEvents}
            onViewAll={() => handleViewAll("Canceled")}
          />
          <EventList
            title="All"
            events={allEvents}
            onViewAll={() => handleViewAll("All")}
          />
        </div>
      </Card.Body>
    </Card>
  );
};

export default Calendar;
