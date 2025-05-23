import { Link } from "react-router-dom";
import { generateGoogleCalendarLink } from "../Utils/googleCalendar";

export default function EventCard({ id, heading, description, location, date, img, isAuthenticated }) {
  const dateStr = typeof date === "string" ? date : date?.full;

  const parsedDate = new Date(dateStr);
  if (!dateStr || isNaN(parsedDate)) {
    console.warn(`Invalid date for event ID ${id}:`, date);
    return null;
  }

  const calendarLink = generateGoogleCalendarLink({
    title: heading,
    description,
    location,
    startDateTime: dateStr,
    endDateTime: getOneHourLater(dateStr),
  });

  const formattedDate = formatReadableDate(dateStr);

  return (
    <div className="event-card">
      <img src={img} alt={heading} />
      <h3>{heading}</h3>
      <p>{location}</p>
      <p><strong>Date:</strong> {formattedDate}</p>

      <a href={calendarLink} target="_blank" rel="noopener noreferrer">
        <button className="calendar-button">
          Add to Google Calendar
        </button>
      </a>

      {isAuthenticated && (
        <Link to={`/edit-event/${id}`}>
          <button className="edit-button">Edit</button>
        </Link>
      )}
    </div>
  );
}

function getOneHourLater(dateStr) {
  const start = new Date(dateStr);
  if (isNaN(start)) return "";
  const end = new Date(start.getTime() + 60 * 60 * 1000);
  return end.toISOString();
}

function formatReadableDate(dateStr) {
  const date = new Date(dateStr);
  if (isNaN(date)) return "Invalid date";
  return date.toLocaleString(undefined, {
    weekday: "short",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}
