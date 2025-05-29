import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { generateGoogleCalendarLink } from "../Utils/googleCalendar";
import { db } from "../Utils/firebase";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";

export default function EventCard({
  id,
  heading,
  description,
  location,
  date,
  img,
  isAuthenticated,
  user,
}) {
  const [signupCount, setSignupCount] = useState(0);
  const [hasSignedUp, setHasSignedUp] = useState(false);

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

  useEffect(() => {
    const fetchSignupInfo = async () => {
      try {
        const q = query(collection(db, "signups"), where("eventId", "==", id));
        const snap = await getDocs(q);
        setSignupCount(snap.size);

        if (user) {
          const userQ = query(
            collection(db, "signups"),
            where("eventId", "==", id),
            where("userId", "==", user.uid)
          );
          const userSnap = await getDocs(userQ);
          setHasSignedUp(!userSnap.empty);
        }
      } catch (err) {
        console.error("Error fetching signup info:", err);
      }
    };

    fetchSignupInfo();
  }, [id, user]);

  const handleSignup = async () => {
    if (!user) {
      alert("Please log in to sign up for this event.");
      return;
    }

    if (hasSignedUp) {
      alert("You’ve already signed up for this event.");
      return;
    }

    try {
      await addDoc(collection(db, "signups"), {
        eventId: id,
        userId: user.uid,
        timestamp: new Date().toISOString(),
      });
      setHasSignedUp(true);
      setSignupCount((prev) => prev + 1);
    } catch (err) {
      console.error("Error signing up:", err);
    }
  };

  return (
    <div className="event-card">
      <img src={img} alt={heading} />
      <h3>{heading}</h3>
      <p>{location}</p>
      <p><strong>Date:</strong> {formattedDate}</p>

      <a href={calendarLink} target="_blank" rel="noopener noreferrer">
        <button className="calendar-button">Add to Google Calendar</button>
      </a>

      <p><strong>{signupCount}</strong> people signed up</p>

      {isAuthenticated && (
        <>
          <button
            className="calendar-button"
            onClick={handleSignup}
            disabled={hasSignedUp}
          >
            {hasSignedUp ? "Already Signed Up" : "Sign Up"}
          </button>

          {user?.role === "staff" && (
            <Link to={`/edit-event/${id}`}>
              <button className="edit-button">Edit</button>
            </Link>
          )}
        </>
      )}
    </div>
  );
}

// Helpers
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
    minute: "2-digit",
  });
}
