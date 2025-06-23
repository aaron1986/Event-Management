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
  startDateTime,
  endDateTime,
}) {
  const [signupCount, setSignupCount] = useState(0);
  const [hasSignedUp, setHasSignedUp] = useState(false);

  const fallbackStart = typeof date === "string" ? date : date?.full;
  const start = new Date(startDateTime || fallbackStart);
  const end = new Date(endDateTime || getOneHourLater(start));

  useEffect(() => {
    const fetchSignupInfo = async () => {
      try {
        const signupRef = collection(db, "signups");
        const signupQuery = query(signupRef, where("eventId", "==", id));
        const snap = await getDocs(signupQuery);
        setSignupCount(snap.size);

        if (user) {
          const userSignupQuery = query(
            signupRef,
            where("eventId", "==", id),
            where("userId", "==", user.uid)
          );
          const userSnap = await getDocs(userSignupQuery);
          setHasSignedUp(!userSnap.empty);
        }
      } catch (error) {
        console.error("Error fetching signup info:", error);
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
    } catch (error) {
      console.error("Error signing up:", error);
    }
  };

  if (!start || isNaN(start)) return null;

  const calendarLink = generateGoogleCalendarLink({
    title: heading,
    description,
    location,
    startDateTime: start.toISOString(),
    endDateTime: end.toISOString(),
  });

  return (
    <section className="event-card" role="region" aria-labelledby={`event-title-${id}`}>
      <img
        src={img}
        alt={`Promotional image for ${heading}`}
        className="event-image"
      />
      <div className="card-content">
        <h2 id={`event-title-${id}`} tabIndex="0">{heading}</h2>

        <div>
          <strong>Description:</strong>
          <div aria-label="Event description">{description}</div>
        </div>

        <p>
          <strong>Location:</strong>{" "}
          <span aria-label="Event location">{location}</span>
        </p>

        <p>
          <strong>Date:</strong>{" "}
          <span aria-label="Event date">
            {start.toLocaleString()} – {end.toLocaleString()}
          </span>
        </p>

        <div className="button-group" role="group" aria-label={`Actions for ${heading}`}>
          <a
            href={calendarLink}
            target="_blank"
            rel="noopener noreferrer"
            className="calendar-link"
            aria-label={`Add ${heading} to Google Calendar`}
          >
            Add to Google Calendar
          </a>

          <p aria-label="Number of signups">
            <strong>{signupCount}</strong> people signed up
          </p>

          {isAuthenticated && (
            <>
              <button
                className="signup-button"
                onClick={handleSignup}
                disabled={hasSignedUp}
                aria-disabled={hasSignedUp}
                aria-label={
                  hasSignedUp
                    ? `You are already signed up for ${heading}`
                    : `Sign up for ${heading}`
                }
              >
                {hasSignedUp ? "Already Signed Up" : "Sign Up"}
              </button>

              {user?.role === "staff" && (
                <Link to={`/edit-event/${id}`} aria-label={`Edit ${heading} event`}>
                  <button className="edit-button" type="button">
                    Edit
                  </button>
                </Link>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
}

function getOneHourLater(date) {
  const parsedDate = new Date(date);
  if (isNaN(parsedDate)) return new Date();
  return new Date(parsedDate.getTime() + 60 * 60 * 1000);
}
