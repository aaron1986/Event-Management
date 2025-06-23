import { useState } from "react";
import { db } from "../Utils/firebase";
import { collection, addDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function CreateEvent() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
  heading: "",
  location: "",
  description: "",
  img: "",
  startDateTime: "",
  endDateTime: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const dateObj = new Date(formData.date);
    const newEvent = {
  heading: formData.heading,
  location: formData.location,
  description: formData.description,
  img: formData.img,
  date: {
    full: new Date(formData.startDateTime).toISOString(),
    year: new Date(formData.startDateTime).getFullYear(),
    month: new Date(formData.startDateTime).toLocaleString("default", { month: "long" }),
  },
  startDateTime: new Date(formData.startDateTime).toISOString(),
  endDateTime: new Date(formData.endDateTime).toISOString(),
};

await addDoc(collection(db, "events"), {
  ...newEvent,
  id: Date.now(),
});
    navigate("/");
  };

  return (
    <main role="main">
      <h2>Create Event</h2>
      <form onSubmit={handleSubmit}>
        <input name="heading" placeholder="Heading" onChange={handleChange} required />
        <input name="location" placeholder="Location" onChange={handleChange} required />
        <textarea name="description" placeholder="Description" onChange={handleChange} required />
        <input name="img" placeholder="Image URL" onChange={handleChange} required />
        <input type="datetime-local" name="startDateTime" onChange={handleChange} required />
        <input type="datetime-local" name="endDateTime" onChange={handleChange} required />

        <button type="submit">Create Event</button>
      </form>
    </main>
  );
}
