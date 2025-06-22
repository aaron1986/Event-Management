import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { db } from "../Utils/firebase";
import { collection, query, where, getDocs, updateDoc, doc } from "firebase/firestore";

export default function EditEvent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(null);
  const [docId, setDocId] = useState(null); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      const q = query(collection(db, "events"), where("id", "==", Number(id)));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const docSnap = querySnapshot.docs[0];
        setDocId(docSnap.id);
        const data = docSnap.data();

        let formattedDate = "";
        if (data.date) {
          const dateObj = new Date(data.date);
          if (!isNaN(dateObj)) {
            formattedDate = dateObj.toISOString().split("T")[0];
          }
        }

        setFormData({...data, startDateTime: data.startDateTime?.slice(0, 16), endDateTime: data.endDateTime?.slice(0, 16),
          });
      }
      setLoading(false);
    };

    fetchEvent();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

const handleSave = async () => {
  if (!docId) return;

  const start = new Date(formData.startDateTime);
  const end = new Date(formData.endDateTime);

  if (isNaN(start) || isNaN(end)) {
    alert("Please enter valid start and end dates.");
    return;
  }

  const eventRef = doc(db, "events", docId);

  const updatedData = {
    ...formData,
    startDateTime: start.toISOString(),
    endDateTime: end.toISOString(),
    date: start.toISOString(), 
  };

  await updateDoc(eventRef, updatedData);
  navigate("/");
};


  if (loading) return <p>Loading...</p>;
  if (!formData) return <p>Event not found.</p>;

  return (
    <div className="edit-event-container">
      <h2>Edit Event</h2>
<label>
  Heading:
  <input name="heading" value={formData?.heading || ''} onChange={handleChange} />
</label>

<label>
  Location:
  <input name="location" value={formData?.location || ''} onChange={handleChange} />
</label>

<label>
  Description:
  <textarea name="description" value={formData?.description || ''} onChange={handleChange} />
</label>

<label>
  Image URL:
  <input name="img" value={formData?.img || ''} onChange={handleChange} />
</label>

<label>
  Start:
  <input
    type="datetime-local"
    name="startDateTime"
    value={formData?.startDateTime || ''}
    onChange={handleChange}
  />
</label>

<label>
  End:
  <input
    type="datetime-local"
    name="endDateTime"
    value={formData?.endDateTime || ''}
    onChange={handleChange}
  />
</label>


      <div className="button-group">
        <button 
          onClick={handleSave} 
          className="save-button" 
          aria-label="Save updated event"
        >
          Save
        </button>
      </div>
    </div>
  );
}
