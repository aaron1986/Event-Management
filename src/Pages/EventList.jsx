import { useEffect, useState } from "react";
import EventCard from "../Components/EventCard";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../Utils/firebase";

export default function EventList({ isAuthenticated }) {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchEvents = async () => {
      const querySnapshot = await getDocs(collection(db, "events"));
      const eventsData = querySnapshot.docs.map(doc => doc.data());
      setEvents(eventsData);
      setFilteredEvents(eventsData);
      setLoading(false);
    };
    fetchEvents();
  }, []);

  const handleSearch = (e) => {
  const term = e.target.value.toLowerCase();
  setSearchTerm(term);

  const filtered = events.filter(event => {
    const heading = event.heading?.toLowerCase() || "";
    const location = event.location?.toLowerCase() || "";
    const description = event.description?.toLowerCase() || "";

    const dateStr = typeof event.date === "string" ? event.date : event.date?.full;
    const dateObj = new Date(dateStr);
    const readableDate = isNaN(dateObj)
      ? ""
      : dateObj.toLocaleString(undefined, {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit"
        }).toLowerCase();

    return (
      heading.includes(term) ||
      location.includes(term) ||
      description.includes(term) ||
      readableDate.includes(term)
    );
  });

  setFilteredEvents(filtered);
};

  if (loading) return <p>Loading events...</p>;

  return (
    <div className="event-list-wrapper">
      <h1>Event Lists</h1>

      {/* Search Input */}
      <input
        type="text"
        placeholder="Search events by date, title, location or description..."
        value={searchTerm}
        onChange={handleSearch}
        className="search-input"
      />

      {/* Filtered Results */}
      <div className="event-list">
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event) => (
            <EventCard
              key={event.id}
              {...event}
              isAuthenticated={isAuthenticated}
            />
          ))
        ) : (
          <p>No events found matching your search.</p>
        )}
      </div>
    </div>
  );
}
