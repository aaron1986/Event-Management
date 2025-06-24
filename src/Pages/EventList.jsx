import { useEffect, useState } from "react";
import EventCard from "../Components/EventCard";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db, auth } from "../Utils/firebase";

export default function EventList({ isAuthenticated, user}) {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      const querySnapshot = await getDocs(collection(db, "events"));
      const eventsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setEvents(eventsData);
      setFilteredEvents(eventsData);
      setLoading(false);
    };

    const fetchUserRole = async () => {
      const user = auth.currentUser;
      if (!user) return;

      try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          setUserRole(userDoc.data().role);
        }
      } catch (err) {
        console.error("Error fetching user role:", err);
      }
    };

    fetchEvents();
    fetchUserRole();
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

  if (loading) return <p role="status" aria-live="polite">Loading events.</p>;

  return (
    <div className="event-list-wrapper">
      <h1>Event Lists</h1>

    <label htmlFor="event-search" className="sr-only">
  Search events
</label>
<input
  id="event-search"
  type="text"
  placeholder="Search events by date, title, location or description..."
  value={searchTerm}
  onChange={handleSearch}
  className="search-input"
/>

      <div className="event-list">
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event) => (
        <EventCard
        key={event.id}
        {...event}
        isAuthenticated={isAuthenticated}
        user={user}
        />
          ))
        ) : (
          <p>No events found matching your search.</p>
        )}
      </div>
    </div>
  );
}
