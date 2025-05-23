export function generateGoogleCalendarLink({ title, description, location, startDateTime, endDateTime }) {
  const baseUrl = "https://www.google.com/calendar/render?action=TEMPLATE";
  const text = `&text=${encodeURIComponent(title)}`;
  const dates = `&dates=${formatDate(startDateTime)}/${formatDate(endDateTime)}`;
  const details = `&details=${encodeURIComponent(description)}`;
  const loc = `&location=${encodeURIComponent(location)}`;

  return `${baseUrl}${text}${dates}${details}${loc}`;
}

function formatDate(dateString) {
  const date = new Date(dateString);
  if (!dateString || isNaN(date.getTime())) {
    console.error("Invalid date passed to formatDate:", dateString);
    return "";
  }

  return date.toISOString().replace(/[-:]|\.\d{3}/g, "");
}